import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {FAB, Text} from 'react-native-paper';
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

const HabitListScreen = () => {
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [habits, setHabits] = useState<HabitWithTodayLog[]>([]);

  const loadHabits = useCallback(async () => {
    const items = await habitService.getTodayHabits();
    setHabits(items);
  }, []);

  useRefreshOnFocus(loadHabits);

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
        <Text variant="headlineMedium">Habits</Text>
        <SectionCard
          title="Track Today"
          subtitle="Every toggle is saved straight into SQLite.">
          {habits.length ? (
            habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
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
        style={{position: 'absolute', right: 16, bottom: 20}}
        onPress={() => stackNavigation.navigate('HabitForm', {})}
      />
    </>
  );
};

export default HabitListScreen;
