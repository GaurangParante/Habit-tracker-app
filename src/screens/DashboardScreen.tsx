import React, {useCallback, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, IconButton, Text, useTheme} from 'react-native-paper';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import EmptyState from '@/components/EmptyState';
import HabitItem from '@/components/HabitItem';
import StatTile from '@/components/StatTile';
import {dashboardService} from '@/services/dashboardService';
import {habitService} from '@/services/habitService';
import {BottomTabParamList, RootStackParamList} from '@/types/navigation';
import {DashboardSnapshot, HabitWithTodayLog} from '@/types/models';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import TodoItem from '@/components/TodoItem';
import {todosRepository} from '@/database/repositories/todosRepository';
import {formatReadableDate, toLocalDateKey} from '@/utils/date';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const DashboardScreen = ({navigation}: Props) => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const theme = useTheme();

  const loadDashboard = useCallback(async () => {
    const data = await dashboardService.load();
    setSnapshot(data);
  }, []);

  useRefreshOnFocus(loadDashboard);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="cog-outline"
          onPress={() => navigation.navigate('Settings')}
        />
      ),
    });
  }, [navigation]);

  const handleToggleHabit = useCallback(
    async (habit: HabitWithTodayLog) => {
      await habitService.toggleHabitCompletion(
        habit.id,
        toLocalDateKey(),
        !habit.completed,
      );
      await loadDashboard();
    },
    [loadDashboard],
  );

  const handleToggleTodo = useCallback(
    async (todoId: string, completed: boolean) => {
      await todosRepository.toggleComplete(todoId, completed);
      await loadDashboard();
    },
    [loadDashboard],
  );

  if (!snapshot) {
    return (
      <ScreenContainer>
        <Text>Loading dashboard...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}>
        <View>
          <Text variant="headlineMedium">Today&apos;s Focus</Text>
          <Text style={styles.subtitle}>
            {formatReadableDate(toLocalDateKey())}
          </Text>
          <Text style={styles.heroCopy}>
            Keep your streak moving with quick check-ins across habits and
            tasks.
          </Text>
        </View>
        <View style={styles.heroActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Achievements')}>
            Badges
          </Button>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.navigate('Statistics')}>
            Insights
          </Button>
        </View>
      </View>

      <SectionCard
        title="Momentum"
        subtitle="A quick pulse check from your latest local progress.">
        <View style={styles.statsRow}>
          <StatTile
            label="Completion"
            value={`${snapshot.stats.completionRate}%`}
          />
          <StatTile label="Streak" value={`${snapshot.stats.activeStreak}d`} />
          <StatTile label="Done" value={`${snapshot.stats.totalCompletions}`} />
        </View>
      </SectionCard>

      <SectionCard title="Today's Habits">
        {snapshot.todayHabits.length ? (
          snapshot.todayHabits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={handleToggleHabit}
            />
          ))
        ) : (
          <EmptyState
            title="No habits yet"
            description="Create your first habit to start tracking."
          />
        )}
      </SectionCard>

      <SectionCard title="Today's Todos">
        {snapshot.todaysTodos.length ? (
          snapshot.todaysTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={item => handleToggleTodo(item.id, !item.completed)}
            />
          ))
        ) : (
          <EmptyState
            title="Nothing due today"
            description="Your local inbox is clear for today."
          />
        )}
      </SectionCard>

      <SectionCard title="Overdue">
        {snapshot.overdueTodos.length ? (
          snapshot.overdueTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={item => handleToggleTodo(item.id, !item.completed)}
            />
          ))
        ) : (
          <EmptyState
            title="No overdue todos"
            description="You're up to date."
          />
        )}
      </SectionCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.72,
  },
  heroCopy: {
    marginTop: 10,
    opacity: 0.82,
    lineHeight: 21,
    maxWidth: 320,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
});

export default DashboardScreen;
