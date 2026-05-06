import {
  databaseService,
  createInsertId,
  createTimestamp,
} from '@/database/database';
import {Habit, HabitLog, HabitWithTodayLog} from '@/types/models';

export const habitsRepository = {
  async getAll() {
    return databaseService.query<Habit>(
      'SELECT * FROM Habits ORDER BY created_at DESC',
    );
  },

  async getById(id: string) {
    const rows = await databaseService.query<Habit>(
      'SELECT * FROM Habits WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  },

  async getTodayHabits(date: string) {
    await databaseService.ensureHabitLogsForDate(date);
    return databaseService.query<HabitWithTodayLog>(
      `SELECT h.*, l.id as logId, l.date, l.completed
       FROM Habits h
       LEFT JOIN HabitLogs l ON l.habit_id = h.id AND l.date = ?
       ORDER BY h.created_at DESC`,
      [date],
    );
  },

  async getLogsByHabit(habitId: string) {
    return databaseService.query<HabitLog>(
      'SELECT * FROM HabitLogs WHERE habit_id = ? ORDER BY date DESC',
      [habitId],
    );
  },

  async create(name: string, frequency: Habit['frequency']) {
    const habit: Habit = {
      id: createInsertId(),
      name,
      frequency,
      created_at: createTimestamp(),
    };

    await databaseService.execute(
      'INSERT INTO Habits (id, name, frequency, created_at) VALUES (?, ?, ?, ?)',
      [habit.id, habit.name, habit.frequency, habit.created_at],
    );

    return habit;
  },

  async update(id: string, name: string, frequency: Habit['frequency']) {
    await databaseService.execute(
      'UPDATE Habits SET name = ?, frequency = ? WHERE id = ?',
      [name, frequency, id],
    );
  },

  async remove(id: string) {
    await databaseService.execute('DELETE FROM HabitLogs WHERE habit_id = ?', [
      id,
    ]);
    await databaseService.execute('DELETE FROM Habits WHERE id = ?', [id]);
  },

  async toggleLog(habitId: string, date: string, completed: boolean) {
    await databaseService.ensureHabitLogsForDate(date);
    await databaseService.execute(
      'UPDATE HabitLogs SET completed = ? WHERE habit_id = ? AND date = ?',
      [completed ? 1 : 0, habitId, date],
    );
  },
};
