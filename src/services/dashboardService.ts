import {achievementService} from './achievementService';
import {achievementsRepository} from '@/database/repositories/achievementsRepository';
import {habitService} from './habitService';
import {todoService} from './todoService';
import {DashboardSnapshot} from '@/types/models';
import {motivationalQuotes} from '@/utils/content';

export const dashboardService = {
  async load(): Promise<DashboardSnapshot> {
    await achievementService.recalculateFromDatabase();
    const [todayHabits, stats, achievements, todoSections] = await Promise.all([
      habitService.getTodayHabits(),
      habitService.getStats(),
      achievementsRepository.getAll(),
      todoService.getTodoSections(),
    ]);

    return {
      todayHabits,
      stats,
      achievements: achievements.slice(0, 6),
      todaysTodos: todoSections.todaysTodos,
      overdueTodos: todoSections.overdueTodos,
      quote: motivationalQuotes[todayHabits.length % motivationalQuotes.length],
    };
  },
};
