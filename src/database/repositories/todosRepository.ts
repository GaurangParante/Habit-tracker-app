import {
  databaseService,
  createInsertId,
  createTimestamp,
} from '@/database/database';
import {Todo, TodoPriority} from '@/types/models';
import {toLocalDateKey} from '@/utils/date';

export const todosRepository = {
  async getAll() {
    return databaseService.query<Todo>(
      `SELECT * FROM Todos
       ORDER BY completed ASC,
                due_date IS NULL ASC,
                due_date ASC,
                CASE priority
                  WHEN 'high' THEN 1
                  WHEN 'medium' THEN 2
                  ELSE 3
                END ASC,
                created_at DESC`,
    );
  },

  async getById(id: string) {
    const rows = await databaseService.query<Todo>(
      'SELECT * FROM Todos WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ?? null;
  },

  async getTodaysTodos() {
    const today = toLocalDateKey();
    return databaseService.query<Todo>(
      `SELECT * FROM Todos
       WHERE due_date = ?
       ORDER BY completed ASC,
                CASE priority
                  WHEN 'high' THEN 1
                  WHEN 'medium' THEN 2
                  ELSE 3
                END ASC,
                created_at DESC`,
      [today],
    );
  },

  async getOverdueTodos() {
    const today = toLocalDateKey();
    return databaseService.query<Todo>(
      'SELECT * FROM Todos WHERE due_date < ? AND completed = 0 ORDER BY due_date ASC',
      [today],
    );
  },

  async create(
    title: string,
    description: string | null,
    priority: TodoPriority,
    dueDate: string | null,
  ) {
    const todo: Todo = {
      id: createInsertId(),
      title,
      description,
      priority,
      due_date: dueDate,
      completed: 0,
      created_at: createTimestamp(),
    };

    await databaseService.execute(
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

    return todo;
  },

  async update(
    id: string,
    title: string,
    description: string | null,
    priority: TodoPriority,
    dueDate: string | null,
  ) {
    await databaseService.execute(
      'UPDATE Todos SET title = ?, description = ?, priority = ?, due_date = ? WHERE id = ?',
      [title, description, priority, dueDate, id],
    );
  },

  async toggleComplete(id: string, completed: boolean) {
    await databaseService.execute(
      'UPDATE Todos SET completed = ? WHERE id = ?',
      [completed ? 1 : 0, id],
    );
  },

  async remove(id: string) {
    await databaseService.execute('DELETE FROM Todos WHERE id = ?', [id]);
  },
};
