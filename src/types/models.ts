export type HabitFrequency = 'daily' | 'weekly';
export type TodoPriority = 'low' | 'medium' | 'high';
export type ThemeMode = 'light' | 'dark';

export type Habit = {
  id: string;
  name: string;
  frequency: HabitFrequency;
  icon: string;
  color: string;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  date: string;
  completed: number;
};

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  priority: TodoPriority;
  due_date: string | null;
  completed: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  unlocked: number;
  unlocked_at: string | null;
};

export type Setting = {
  key: string;
  value: string;
};

export type HabitWithTodayLog = Habit & {
  logId: string | null;
  date: string;
  completed: number;
};

export type HabitStats = {
  completionRate: number;
  totalCompletions: number;
  activeStreak: number;
  bestStreak: number;
  todayCompleted: number;
  totalHabits: number;
  pendingTodos: number;
  completedTodos: number;
  productivityScore: number;
};

export type DashboardSnapshot = {
  todayHabits: HabitWithTodayLog[];
  todaysTodos: Todo[];
  overdueTodos: Todo[];
  stats: HabitStats;
  achievements: Achievement[];
  quote: string;
};
