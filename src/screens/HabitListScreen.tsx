import React, {useCallback, useMemo, useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import EmptyState from '@/components/EmptyState';
import HabitItem from '@/components/HabitItem';
import {RootStackParamList} from '@/types/navigation';
import {HabitWithTodayLog} from '@/types/models';
import {habitService} from '@/services/habitService';
import {habitsRepository} from '@/database/repositories/habitsRepository';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {toLocalDateKey} from '@/utils/date';
import {palette} from '@/theme/palette';

const HabitListScreen = () => {
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const [habits, setHabits] = useState<HabitWithTodayLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithTodayLog | null>(
    null,
  );
  const isDark = theme.dark;

  const loadHabits = useCallback(async () => {
    const items = await habitService.getTodayHabits();
    setHabits(items);
  }, []);

  useRefreshOnFocus(loadHabits);

  const summary = useMemo(
    () => ({
      total: habits.length,
      done: habits.filter(habit => Boolean(habit.completed)).length,
    }),
    [habits],
  );

  const handleToggle = useCallback(
    async (habit: HabitWithTodayLog) => {
      await habitService.toggleHabitCompletion(
        habit.id,
        toLocalDateKey(),
        !habit.completed,
      );
      await loadHabits();
    },
    [loadHabits],
  );

  const handleDelete = useCallback(
    (habitId: string) => {
      Alert.alert(
        'Delete habit',
        'This removes the habit and all local logs.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await habitsRepository.remove(habitId);
              await loadHabits();
            },
          },
        ],
      );
    },
    [loadHabits],
  );

  return (
    <>
      <ScreenContainer contentStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text
              style={[
                styles.title,
                {color: isDark ? palette.text : palette.lightText},
              ]}>
              Habits
            </Text>
            <Text
              style={[
                styles.subtitle,
                {color: isDark ? '#C7BBAA' : palette.lightTextMuted},
              ]}>
              {summary.total} habits · {summary.done} done today
            </Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => stackNavigation.navigate('HabitForm', {})}>
            <MaterialDesignIcons name="plus" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
        {habits.length ? (
          <View style={styles.list}>
            {habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onPress={setSelectedHabit}
                onEdit={habitId =>
                  stackNavigation.navigate('HabitForm', {habitId})
                }
                onDelete={handleDelete}
                showMenu
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No habits yet"
            description="Tap the add button to create a habit."
          />
        )}
      </ScreenContainer>
      <Modal visible={Boolean(selectedHabit)} transparent animationType="slide">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedHabit(null)}>
          {selectedHabit ? (
            <Pressable style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <View
                    style={[
                      styles.modalIcon,
                      {backgroundColor: `${selectedHabit.color}33`},
                    ]}>
                    <MaterialDesignIcons
                      name={selectedHabit.icon as any}
                      size={26}
                      color={selectedHabit.color}
                    />
                  </View>
                  <Text style={styles.modalTitle}>{selectedHabit.name}</Text>
                </View>
                <Pressable onPress={() => setSelectedHabit(null)}>
                  <MaterialDesignIcons
                    name="close-circle-outline"
                    size={28}
                    color={palette.textMuted}
                  />
                </Pressable>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metricCard}>
                  <MaterialDesignIcons
                    name="fire"
                    size={20}
                    color={palette.primary}
                  />
                  <Text style={styles.metricValue}>
                    {selectedHabit.completed ? 1 : 0}
                  </Text>
                  <Text style={styles.metricLabel}>Current</Text>
                </View>
                <View style={styles.metricCard}>
                  <MaterialDesignIcons
                    name="medal-outline"
                    size={20}
                    color={palette.warning}
                  />
                  <Text style={styles.metricValue}>1</Text>
                  <Text style={styles.metricLabel}>Best</Text>
                </View>
                <View style={styles.metricCard}>
                  <MaterialDesignIcons
                    name="trending-up"
                    size={20}
                    color={palette.purple}
                  />
                  <Text style={styles.metricValue}>
                    {selectedHabit.completed ? '100%' : '3%'}
                  </Text>
                  <Text style={styles.metricLabel}>Rate</Text>
                </View>
              </View>
              <View style={styles.calendarCard}>
                <Text style={styles.calendarHeading}>MAY 2026</Text>
                <View style={styles.weekRow}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <Text key={day} style={styles.weekLabel}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.grid}>
                  {Array.from({length: 31}, (_, index) => {
                    const day = index + 1;
                    const active = day === 12;
                    const faded = day < 12;
                    return (
                      <View
                        key={day}
                        style={[
                          styles.dayCell,
                          active
                            ? styles.dayCellActive
                            : faded
                            ? styles.dayCellPast
                            : null,
                        ]}>
                        <Text
                          style={[
                            styles.dayText,
                            active ? styles.dayTextActive : null,
                          ]}>
                          {day}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 96,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 10,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalCard: {
    backgroundColor: '#1A1D26',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#212430',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  metricValue: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    color: palette.textMuted,
    fontSize: 12,
  },
  calendarCard: {
    backgroundColor: '#212430',
    borderRadius: 18,
    padding: 16,
  },
  calendarHeading: {
    color: '#C7BBAA',
    fontWeight: '800',
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekLabel: {
    color: '#8D90A1',
    width: '13%',
    textAlign: 'center',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#191C25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellPast: {
    backgroundColor: '#3B2330',
  },
  dayCellActive: {
    backgroundColor: palette.primary,
  },
  dayText: {
    color: '#767A89',
    fontSize: 12,
    fontWeight: '700',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
});

export default HabitListScreen;
