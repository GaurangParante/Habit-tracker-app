export const CREATE_TABLES = [
  `CREATE TABLE IF NOT EXISTS Habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      frequency TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'target',
      color TEXT NOT NULL DEFAULT '#10B981',
      created_at TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS HabitLogs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(habit_id, date)
    );`,
  `CREATE TABLE IF NOT EXISTS Todos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL,
      due_date TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS Achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      unlocked INTEGER NOT NULL DEFAULT 0,
      unlocked_at TEXT
    );`,
  `CREATE TABLE IF NOT EXISTS Settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );`,
];
