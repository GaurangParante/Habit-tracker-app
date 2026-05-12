import {Achievement} from '@/types/models';
import {ACHIEVEMENT_IDS} from '@/utils/constants';

const achievementOrder = [
  ACHIEVEMENT_IDS.STARTED,
  ACHIEVEMENT_IDS.STREAK_7,
  ACHIEVEMENT_IDS.STREAK_30,
  ACHIEVEMENT_IDS.STREAK_100,
  ACHIEVEMENT_IDS.TODOS_50,
  ACHIEVEMENT_IDS.TODOS_100,
  ACHIEVEMENT_IDS.STREAK_3,
  ACHIEVEMENT_IDS.COMPLETIONS_30,
  ACHIEVEMENT_IDS.PERFECT_WEEK,
];

export const getAchievementTitle = (achievement: Achievement) => {
  const titleMap: Record<string, string> = {
    [ACHIEVEMENT_IDS.STARTED]: 'Getting Started',
    [ACHIEVEMENT_IDS.STREAK_3]: '3 Day Streak',
    [ACHIEVEMENT_IDS.STREAK_7]: 'One Week Strong',
    [ACHIEVEMENT_IDS.STREAK_30]: 'Monthly Master',
    [ACHIEVEMENT_IDS.STREAK_100]: 'Unstoppable',
    [ACHIEVEMENT_IDS.TODOS_50]: 'Task Starter',
    [ACHIEVEMENT_IDS.TODOS_100]: 'Getting Things Done',
    [ACHIEVEMENT_IDS.COMPLETIONS_30]: '30 Habit Wins',
    [ACHIEVEMENT_IDS.PERFECT_WEEK]: 'Perfect Discipline',
  };

  return titleMap[achievement.id] ?? achievement.title;
};

export const orderAchievements = (achievements: Achievement[]) => {
  const orderMap = new Map<string, number>(
    achievementOrder.map((id, index) => [id, index]),
  );

  return [...achievements].sort((left, right) => {
    const leftIndex = orderMap.get(left.id) ?? 999;
    const rightIndex = orderMap.get(right.id) ?? 999;
    return leftIndex - rightIndex;
  });
};
