import {habitsRepository} from '@/database/repositories/habitsRepository';
import {databaseService} from '@/database/database';
import {HabitStats} from '@/types/models';
import {achievementService} from './achievementService';
import {shiftDateKey, toLocalDateKey} from '@/utils/date';

export const habitService = {
  async ensureDailyHabitGeneration(date = toLocalDateKey()) {
    await databaseService.ensureHabitLogsForDate(date);
  },

  async getTodayHabits(date = toLocalDateKey()) {
    await this.ensureDailyHabitGeneration(date);
    return habitsRepository.getTodayHabits(date);
  },

  async toggleHabitCompletion(
    habitId: string,
    date: string,
    completed: boolean,
  ) {
    await habitsRepository.toggleLog(habitId, date, completed);
    const stats = await this.getStats();
    await achievementService.evaluateAndUnlock(stats);
  },

  async getStats(): Promise<HabitStats> {
    const today = toLocalDateKey();
    const rows = await databaseService.query<{
      total: number;
      completed: number;
    }>(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
       FROM HabitLogs`,
    );
    const totals = rows[0] ?? {total: 0, completed: 0};
    const totalCompletions = totals.completed ?? 0;
    const completionRate = totals.total
      ? Math.round((totalCompletions / totals.total) * 100)
      : 0;

    const activeStreak = await this.getActiveStreak();
    const bestStreak = await this.getBestStreak();
    const todayRows = await databaseService.query<{count: number}>(
      `SELECT
         SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as count
       FROM HabitLogs
       WHERE date = ?`,
      [today],
    );
    const totalHabits = await databaseService.getScalar<number>(
      'SELECT COUNT(*) as count FROM Habits',
    );
    const pendingTodos = await databaseService.getScalar<number>(
      'SELECT COUNT(*) as count FROM Todos WHERE completed = 0',
    );
    const completedTodos = await databaseService.getScalar<number>(
      'SELECT COUNT(*) as count FROM Todos WHERE completed = 1',
    );
    const todayCompleted = todayRows[0]?.count ?? 0;
    const totalTodos = (pendingTodos ?? 0) + (completedTodos ?? 0);
    const habitScore = totalHabits ? todayCompleted / totalHabits : 0;
    const todoScore = totalTodos ? (completedTodos ?? 0) / totalTodos : 0;
    const productivityScore = Math.round(habitScore * 70 + todoScore * 30);

    return {
      completionRate,
      totalCompletions,
      activeStreak,
      bestStreak,
      todayCompleted,
      totalHabits: totalHabits ?? 0,
      pendingTodos: pendingTodos ?? 0,
      completedTodos: completedTodos ?? 0,
      productivityScore,
    };
  },

  async getActiveStreak() {
    const completedDates = await databaseService.query<{date: string}>(
      `SELECT date
       FROM HabitLogs
       WHERE completed = 1
       GROUP BY date
       HAVING COUNT(*) > 0
       ORDER BY date DESC`,
    );

    if (completedDates.length === 0) {
      return 0;
    }

    const dateKeys = new Set(completedDates.map(item => item.date));
    let streak = 0;
    let cursor = toLocalDateKey();

    while (dateKeys.has(cursor)) {
      streak += 1;
      cursor = shiftDateKey(cursor, -1);
    }

    return streak;
  },

  async getBestStreak() {
    const completedDates = await databaseService.query<{date: string}>(
      `SELECT DISTINCT date
       FROM HabitLogs
       WHERE completed = 1
       ORDER BY date ASC`,
    );

    if (!completedDates.length) {
      return 0;
    }

    let best = 0;
    let current = 0;
    let previous: string | null = null;

    completedDates.forEach(({date}) => {
      if (!previous) {
        current = 1;
      } else if (shiftDateKey(previous, 1) === date) {
        current += 1;
      } else {
        current = 1;
      }

      if (current > best) {
        best = current;
      }

      previous = date;
    });

    return best;
  },
};
