import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {IconButton, Text, TouchableRipple} from 'react-native-paper';
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
import {todosRepository} from '@/database/repositories/todosRepository';
import {formatReadableDate, toLocalDateKey} from '@/utils/date';
import {palette} from '@/theme/palette';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const DashboardScreen = ({navigation}: Props) => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [taskTitle, setTaskTitle] = useState('');

  const loadDashboard = useCallback(async () => {
    const data = await dashboardService.load();
    setSnapshot(data);
  }, []);

  useRefreshOnFocus(loadDashboard);

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

  const handleQuickAdd = useCallback(async () => {
    if (!taskTitle.trim()) {
      navigation.navigate('TodoForm', {});
      return;
    }

    await todosRepository.create(
      taskTitle.trim(),
      null,
      'medium',
      toLocalDateKey(),
    );
    setTaskTitle('');
    await loadDashboard();
  }, [loadDashboard, navigation, taskTitle]);

  if (!snapshot) {
    return (
      <ScreenContainer>
        <Text>Loading momentum...</Text>
      </ScreenContainer>
    );
  }

  const todayLabel = formatReadableDate(toLocalDateKey());

  return (
    <ScreenContainer contentStyle={{paddingBottom: 110}}>
      <View style={styles.headerRow}>
        <View>
          <Text variant="headlineLarge" style={styles.greeting}>
            Good morning
          </Text>
          <Text style={styles.date}>{todayLabel}</Text>
        </View>
        <TouchableRipple
          borderless
          style={styles.avatar}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.avatarText}>U</Text>
        </TouchableRipple>
      </View>

      <Text style={styles.quote}>"{snapshot.quote}"</Text>

      <SectionCard title="Momentum">
        <View style={styles.momentumHeader}>
          <Text style={styles.momentumPill}>
            <MaterialDesignIcons
              name="fire"
              size={16}
              color={palette.primary}
            />{' '}
            {snapshot.stats.activeStreak} day streak
          </Text>
        </View>
        <View style={styles.statsRow}>
          <StatTile
            label="Habits"
            value={`${snapshot.stats.todayCompleted}/${snapshot.stats.totalHabits}`}
            icon="bullseye-arrow"
            accent={palette.primary}
          />
          <StatTile
            label="Pending"
            value={`${snapshot.stats.pendingTodos}`}
            icon="check-circle-outline"
            accent={palette.warning}
          />
          <StatTile
            label="Score"
            value={`${snapshot.stats.productivityScore}%`}
            icon="trending-up"
            accent={palette.purple}
          />
        </View>
      </SectionCard>

      <SectionCard title="Today's Habits">
        {snapshot.todayHabits.length ? (
          snapshot.todayHabits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={handleToggleHabit}
              onPress={() => navigation.navigate('Habits')}
            />
          ))
        ) : (
          <EmptyState
            title="No habits for today"
            description="Create your first habit and start the streak."
          />
        )}
      </SectionCard>

      <View>
        <Text style={styles.sectionLabel}>QUICK ADD TASK</Text>
        <View style={styles.quickAdd}>
          <IconButton
            icon="plus"
            iconColor={palette.textMuted}
            onPress={handleQuickAdd}
          />
          <TextInput
            placeholder="Quick add a task..."
            placeholderTextColor={palette.textMuted}
            value={taskTitle}
            onChangeText={setTaskTitle}
            style={styles.quickInput}
            onSubmitEditing={handleQuickAdd}
          />
        </View>
      </View>

      {snapshot.overdueTodos.length ? (
        <SectionCard title="Overdue">
          {snapshot.overdueTodos.map(todo => (
            <View key={todo.id} style={styles.overdueRow}>
              <Text variant="titleMedium">{todo.title}</Text>
              <Text style={styles.overdueMeta}>
                {formatReadableDate(todo.due_date)}
              </Text>
            </View>
          ))}
        </SectionCard>
      ) : null}

      <View>
        <Text style={styles.sectionLabel}>ACHIEVEMENTS</Text>
        <View style={styles.achievementGrid}>
          {snapshot.achievements.map(item => (
            <TouchableRipple
              key={item.id}
              style={styles.achievementCard}
              onPress={() => navigation.navigate('Achievements')}>
              <View style={styles.achievementInner}>
                <MaterialDesignIcons
                  name={item.unlocked ? 'shield-check' : 'lock-outline'}
                  size={24}
                  color={item.unlocked ? palette.primary : palette.textMuted}
                />
                <Text style={styles.achievementText}>{item.title}</Text>
              </View>
            </TouchableRipple>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontWeight: '800',
  },
  date: {
    marginTop: 4,
    color: '#C9BFB1',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primaryDark,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  quote: {
    color: palette.textMuted,
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 32,
  },
  momentumHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  momentumPill: {
    color: palette.primary,
    backgroundColor: '#12371F',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionLabel: {
    color: '#C9BFB1',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingRight: 12,
  },
  quickInput: {
    flex: 1,
    color: palette.text,
    fontSize: 18,
  },
  overdueRow: {
    borderLeftWidth: 3,
    borderLeftColor: palette.danger,
    paddingLeft: 12,
    gap: 4,
  },
  overdueMeta: {
    color: palette.warning,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    width: '31%',
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  achievementInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  achievementText: {
    color: palette.textMuted,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default DashboardScreen;
