import SQLite, {SQLiteDatabase, ResultSet} from 'react-native-sqlite-storage';
import {CREATE_TABLES} from './schema';
import {seedAchievements, seedHabits, seedTodos} from './seed';
import {toLocalDateKey, toLocalTimestamp} from '@/utils/date';

SQLite.enablePromise(true);

const createLocalId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

class DatabaseService {
  private db: SQLiteDatabase | null = null;

  async initialize() {
    if (this.db) {
      return this.db;
    }

    this.db = await SQLite.openDatabase({
      name: 'habit_tracker.db',
      location: 'default',
    });

    for (const statement of CREATE_TABLES) {
      await this.db.executeSql(statement);
    }

    await this.runMigrations();
    await this.seedIfNeeded();
    return this.db;
  }

  private async runMigrations() {
    const habitColumns = await this.query<{name: string}>(
      'PRAGMA table_info(Habits)',
    );
    const todoColumns = await this.query<{name: string}>(
      'PRAGMA table_info(Todos)',
    );

    const ensureColumn = async (
      columns: Array<{name: string}>,
      name: string,
      statement: string,
    ) => {
      if (!columns.some(column => column.name === name)) {
        await this.execute(statement);
      }
    };

    await ensureColumn(
      habitColumns,
      'icon',
      "ALTER TABLE Habits ADD COLUMN icon TEXT NOT NULL DEFAULT 'target'",
    );
    await ensureColumn(
      habitColumns,
      'color',
      "ALTER TABLE Habits ADD COLUMN color TEXT NOT NULL DEFAULT '#10B981'",
    );
    await ensureColumn(
      todoColumns,
      'description',
      'ALTER TABLE Todos ADD COLUMN description TEXT',
    );
  }

  private async seedIfNeeded() {
    const habitCount = await this.getScalar<number>(
      'SELECT COUNT(*) as count FROM Habits',
    );
    if (habitCount === 0) {
      for (const habit of seedHabits) {
        await this.execute(
          'INSERT INTO Habits (id, name, frequency, icon, color, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [
            habit.id,
            habit.name,
            habit.frequency,
            habit.icon,
            habit.color,
            habit.created_at,
          ],
        );
      }
    }

    const todoCount = await this.getScalar<number>(
      'SELECT COUNT(*) as count FROM Todos',
    );
    if (todoCount === 0) {
      for (const todo of seedTodos) {
        await this.execute(
          'INSERT INTO Todos (id, title, description, priority, due_date, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            todo.id,
            todo.title,
            todo.description,
            todo.priority,
            todo.due_date,
            todo.completed,
            todo.created_at,
          ],
        );
      }
    }

    const achievementCount = await this.getScalar<number>(
      'SELECT COUNT(*) as count FROM Achievements',
    );
    if (achievementCount === 0) {
      for (const achievement of seedAchievements) {
        await this.execute(
          'INSERT INTO Achievements (id, title, unlocked, unlocked_at) VALUES (?, ?, ?, ?)',
          [
            achievement.id,
            achievement.title,
            achievement.unlocked,
            achievement.unlocked_at,
          ],
        );
      }
    }

    const settingsCount = await this.getScalar<number>(
      'SELECT COUNT(*) as count FROM Settings',
    );
    if (settingsCount === 0) {
      await this.execute('INSERT INTO Settings (key, value) VALUES (?, ?)', [
        'theme',
        'dark',
      ]);
    }

    await this.ensureHabitLogsForDate(toLocalDateKey());
  }

  async query<T>(sql: string, params: Array<string | number | null> = []) {
    const db = await this.initialize();
    const [result] = await db.executeSql(sql, params);
    return this.mapRows<T>(result);
  }

  async execute(sql: string, params: Array<string | number | null> = []) {
    const db = await this.initialize();
    return db.executeSql(sql, params);
  }

  async transaction(run: (db: SQLiteDatabase) => Promise<void>) {
    const db = await this.initialize();
    await run(db);
  }

  async getScalar<T>(sql: string, params: Array<string | number | null> = []) {
    const rows = await this.query<{count: T}>(sql, params);
    return rows[0]?.count;
  }

  async ensureHabitLogsForDate(date: string) {
    await this.execute(
      `INSERT INTO HabitLogs (id, habit_id, date, completed)
       SELECT lower(hex(randomblob(16))), h.id, ?, 0
       FROM Habits h
       WHERE NOT EXISTS (
         SELECT 1
         FROM HabitLogs l
         WHERE l.habit_id = h.id AND l.date = ?
       )`,
      [date, date],
    );
  }

  async resetAppData() {
    await this.execute('DELETE FROM HabitLogs');
    await this.execute('DELETE FROM Habits');
    await this.execute('DELETE FROM Todos');
    await this.execute('DELETE FROM Achievements');
    await this.seedIfNeeded();
  }

  private mapRows<T>(result: ResultSet) {
    const rows: T[] = [];
    for (let index = 0; index < result.rows.length; index += 1) {
      rows.push(result.rows.item(index) as T);
    }
    return rows;
  }
}

export const databaseService = new DatabaseService();

export const createInsertId = () => createLocalId();
export const createTimestamp = () => toLocalTimestamp();
export const createDateKey = () => toLocalDateKey();
