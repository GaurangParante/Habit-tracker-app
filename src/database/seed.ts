import {Achievement, Habit, Todo} from '@/types/models';
import {toLocalDateKey, toLocalTimestamp} from '@/utils/date';
import {ACHIEVEMENT_IDS} from '@/utils/constants';

const now = toLocalTimestamp();
const today = toLocalDateKey();

export const seedHabits: Habit[] = [
  {
    id: 'habit_walk',
    name: 'Morning walk',
    frequency: 'daily',
    icon: 'run-fast',
    color: '#10B981',
    created_at: now,
  },
  {
    id: 'habit_read',
    name: 'Read 20 pages',
    frequency: 'daily',
    icon: 'book-open-page-variant',
    color: '#3B82F6',
    created_at: now,
  },
  {
    id: 'habit_review',
    name: 'Weekly reflection',
    frequency: 'weekly',
    icon: 'meditation',
    color: '#8B5CF6',
    created_at: now,
  },
];

export const seedTodos: Todo[] = [
  {
    id: 'todo_groceries',
    title: 'Buy groceries',
    description: 'Protein, fruit, oats, and coffee beans.',
    priority: 'medium',
    due_date: today,
    completed: 0,
    created_at: now,
  },
  {
    id: 'todo_journal',
    title: 'Write journal entry',
    description: 'Capture what created momentum today.',
    priority: 'low',
    due_date: today,
    completed: 0,
    created_at: now,
  },
];

export const seedAchievements: Achievement[] = [
  {
    id: ACHIEVEMENT_IDS.STARTED,
    title: 'Getting Started',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.STREAK_3,
    title: 'One Week Strong',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.STREAK_7,
    title: 'Weekly Warrior',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.STREAK_30,
    title: 'Monthly Master',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.STREAK_100,
    title: 'Unstoppable',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.TODOS_50,
    title: 'Task Starter',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.TODOS_100,
    title: 'Getting Things Done',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.PERFECT_WEEK,
    title: 'Perfect Discipline',
    unlocked: 0,
    unlocked_at: null,
  },
  {
    id: ACHIEVEMENT_IDS.COMPLETIONS_30,
    title: '30 Habit Wins',
    unlocked: 0,
    unlocked_at: null,
  },
];
