import {todosRepository} from '@/database/repositories/todosRepository';

export const todoService = {
  async getTodoSections() {
    const [todaysTodos, overdueTodos, allTodos] = await Promise.all([
      todosRepository.getTodaysTodos(),
      todosRepository.getOverdueTodos(),
      todosRepository.getAll(),
    ]);

    return {todaysTodos, overdueTodos, allTodos};
  },
};
