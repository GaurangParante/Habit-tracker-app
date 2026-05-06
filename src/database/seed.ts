import {Achievement, Habit, Todo} from '@/types/models';
import {toLocalDateKey, toLocalTimestamp} from '@/utils/date';
import {ACHIEVEMENT_IDS} from '@/utils/constants';

const now = toLocalTimestamp();
const today = toLocalDateKey();

export const seedHabits: Habit[] = [
  {id: 'habit_walk', name: 'Morning walk', frequency: 'daily', created_at: now},
  {
    id: 'habit_read',
    name: 'Read 20 pages',
    frequency: 'daily',
    created_at: now,
  },
  {
    id: 'habit_review',
    name: 'Weekly reflection',
    frequency: 'weekly',
    created_at: now,
  },
];

export const seedTodos: Todo[] = [
  {
    id: 'todo_groceries',
    title: 'Buy groceries',
    priority: 'medium',
    due_date: today,
    completed: 0,
    created_at: now,
  },
  {
    id: 'todo_journal',
    title: 'Write journal entry',
    priority: 'low',
    due_date: today,
    completed: 0,
    created_at: now,
  },
];

export const seedAchievements: Achievement[] = [
  {
    id: ACHIEVEMENT_IDS.STREAK_3,
    title: '3-day streak',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.STREAK_7,
    title: '7-day streak',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.COMPLETIONS_30,
    title: '30 completions',
    unlocked: 0,
    unlocked_at: null,
  },
];
