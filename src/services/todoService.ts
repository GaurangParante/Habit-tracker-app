import {todosRepository} from '@/database/repositories/todosRepository';

export const todoService = {
  async getTodoSections() {
    const [todaysTodos, overdueTodos, allTodos] = await Promise.all([
      todosRepository.getTodaysTodos(),
      todosRepository.getOverdueTodos(),
      todosRepository.getAll(),
    ]);

    return {
      todaysTodos,
      overdueTodos,
      allTodos,
      upcomingTodos: allTodos.filter(
        todo =>
          Boolean(todo.due_date) &&
          !todo.completed &&
          !todaysTodos.some(item => item.id === todo.id) &&
          !overdueTodos.some(item => item.id === todo.id),
      ),
      completedTodos: allTodos.filter(todo => Boolean(todo.completed)),
    };
  },
};
