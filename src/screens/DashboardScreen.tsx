import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import EmptyState from '@/components/EmptyState';
import HabitItem from '@/components/HabitItem';
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
  const theme = useTheme();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const isDark = theme.dark;

  const colors = {
    title: isDark ? palette.text : palette.lightText,
    date: '#C7BBAA',
    quote: isDark ? palette.textMuted : '#92897D',
    section: isDark ? '#C8BEAF' : '#CEC3B6',
    quickInput: '#F3F4F8',
    quickPlaceholder: '#8D91A0',
    achievementText: '#9B9EAA',
  };

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

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, {color: colors.title}]}>
            Good morning
          </Text>
          <Text style={[styles.date, {color: colors.date}]}>
            {formatReadableDate(toLocalDateKey())}
          </Text>
        </View>
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.avatarText}>U</Text>
        </Pressable>
      </View>

      <Text style={[styles.quote, {color: colors.quote}]}>
        "{snapshot.quote}"
      </Text>

      <View style={styles.momentumCard}>
        <View style={styles.momentumTopRow}>
          <Text style={[styles.sectionTitle, {color: colors.section}]}>
            MOMENTUM
          </Text>
          <View style={styles.streakPill}>
            <MaterialDesignIcons
              name="fire"
              size={16}
              color={palette.primary}
            />
            <Text style={styles.streakPillText}>
              {snapshot.stats.activeStreak} day streak
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialDesignIcons
              name="target"
              size={22}
              color={palette.primary}
            />
            <Text style={styles.statValue}>
              {snapshot.stats.todayCompleted}/{snapshot.stats.totalHabits}
            </Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialDesignIcons
              name="check-circle-outline"
              size={22}
              color={palette.warning}
            />
            <Text style={styles.statValue}>{snapshot.stats.pendingTodos}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialDesignIcons
              name="trending-up"
              size={22}
              color={palette.purple}
            />
            <Text style={styles.statValue}>
              {snapshot.stats.productivityScore}%
            </Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
        </View>
      </View>

      {snapshot.todayHabits.length ? (
        <View>
          <Text style={[styles.sectionTitle, {color: colors.section}]}>
            TODAY&apos;S HABITS
          </Text>
          <View style={styles.listWrap}>
            {snapshot.todayHabits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabit}
                onPress={() => navigation.navigate('Habits')}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View>
        <Text style={[styles.sectionTitle, {color: colors.section}]}>
          QUICK ADD TASK
        </Text>
        <View style={styles.quickAdd}>
          <Pressable style={styles.plusButton} onPress={handleQuickAdd}>
            <MaterialDesignIcons
              name="plus"
              size={24}
              color={colors.quickInput}
            />
          </Pressable>
          <TextInput
            placeholder="Quick add a task..."
            placeholderTextColor={colors.quickPlaceholder}
            value={taskTitle}
            onChangeText={setTaskTitle}
            style={[styles.quickInput, {color: colors.quickInput}]}
            onSubmitEditing={handleQuickAdd}
          />
        </View>
      </View>

      <View>
        <Text style={[styles.sectionTitle, {color: colors.section}]}>
          ACHIEVEMENTS
        </Text>
        <View style={styles.achievementGrid}>
          {snapshot.achievements.map(item => (
            <Pressable
              key={item.id}
              style={styles.achievementCard}
              onPress={() => navigation.navigate('Achievements')}>
              <MaterialDesignIcons
                name={item.unlocked ? 'shield-check' : 'lock-outline'}
                size={24}
                color={item.unlocked ? palette.primary : '#6F7280'}
              />
              <Text
                style={[
                  styles.achievementText,
                  {color: colors.achievementText},
                ]}>
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {!snapshot.todayHabits.length ? (
        <EmptyState
          title="No habits yet"
          description="Create a habit from the habits tab to match the dashboard."
        />
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  greeting: {
    fontSize: 25,
    fontWeight: '800',
  },
  date: {
    marginTop: 6,
    fontSize: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 16,
    marginTop: -4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 12,
  },
  momentumCard: {
    backgroundColor: '#12341F',
    borderColor: '#165B34',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  momentumTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A542C',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakPillText: {
    color: palette.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minHeight: 96,
    borderRadius: 16,
    backgroundColor: '#0F1F17',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  statValue: {
    color: palette.text,
    fontWeight: '800',
    fontSize: 18,
  },
  statLabel: {
    color: '#C4C4C6',
    fontSize: 12,
  },
  listWrap: {
    gap: 10,
  },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D29',
    borderRadius: 16,
    paddingHorizontal: 10,
    minHeight: 56,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#20222D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quickInput: {
    flex: 1,
    fontSize: 18,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    width: '31%',
    minHeight: 82,
    borderRadius: 14,
    backgroundColor: '#1A1D29',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  achievementText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DashboardScreen;
