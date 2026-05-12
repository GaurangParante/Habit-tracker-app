import React, {useCallback, useMemo, useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {FAB, IconButton, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
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
  const [habits, setHabits] = useState<HabitWithTodayLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithTodayLog | null>(
    null,
  );

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
      <ScreenContainer contentStyle={{paddingBottom: 96}}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Habits
          </Text>
          <Text style={styles.subtitle}>
            {summary.total} habits - {summary.done} done today
          </Text>
        </View>
        <SectionCard title="Track Today">
          {habits.length ? (
            habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onPress={setSelectedHabit}
                onEdit={habitId =>
                  stackNavigation.navigate('HabitForm', {habitId})
                }
                onDelete={handleDelete}
              />
            ))
          ) : (
            <EmptyState
              title="No habits yet"
              description="Tap the add button to create a habit."
            />
          )}
        </SectionCard>
      </ScreenContainer>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => stackNavigation.navigate('HabitForm', {})}
      />
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
                      size={24}
                      color={selectedHabit.color}
                    />
                  </View>
                  <Text variant="headlineSmall">{selectedHabit.name}</Text>
                </View>
                <IconButton
                  icon="close"
                  onPress={() => setSelectedHabit(null)}
                />
              </View>
              <View style={styles.modalStats}>
                <SectionCard title="Current">
                  <Text variant="headlineMedium">
                    {selectedHabit.completed ? 1 : 0}
                  </Text>
                </SectionCard>
                <SectionCard title="Best">
                  <Text variant="headlineMedium">
                    {selectedHabit.completed ? 1 : 0}
                  </Text>
                </SectionCard>
                <SectionCard title="Rate">
                  <Text variant="headlineMedium">
                    {selectedHabit.completed ? '100%' : '0%'}
                  </Text>
                </SectionCard>
              </View>
              <SectionCard title="Schedule">
                <Text>
                  {selectedHabit.frequency === 'daily'
                    ? 'Daily habit'
                    : 'Weekly habit'}
                </Text>
                <Text style={styles.modalHint}>
                  Current streak and history are tracked locally in SQLite.
                </Text>
              </SectionCard>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 6,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    color: '#C9BFB1',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: palette.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    gap: 16,
    minHeight: '55%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  modalIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStats: {
    flexDirection: 'row',
    gap: 10,
  },
  modalHint: {
    marginTop: 8,
    color: palette.textMuted,
  },
});

export default HabitListScreen;
