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

    return {
      completionRate,
      totalCompletions,
      activeStreak,
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
};
