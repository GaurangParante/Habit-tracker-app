import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {Button, SegmentedButtons, Text, TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import {RootStackParamList} from '@/types/navigation';
import {HabitFrequency} from '@/types/models';
import {habitsRepository} from '@/database/repositories/habitsRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitForm'>;

const HabitFormScreen = ({navigation, route}: Props) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const isEditing = Boolean(route.params?.habitId);

  useEffect(() => {
    const loadHabit = async () => {
      if (!route.params?.habitId) {
        return;
      }

      const habit = await habitsRepository.getById(route.params.habitId);
      if (habit) {
        setName(habit.name);
        setFrequency(habit.frequency);
      }
    };

    loadHabit();
  }, [route.params?.habitId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a habit name.');
      return;
    }

    if (isEditing && route.params?.habitId) {
      await habitsRepository.update(
        route.params.habitId,
        name.trim(),
        frequency,
      );
    } else {
      await habitsRepository.create(name.trim(), frequency);
    }

    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <Text variant="headlineMedium">
        {isEditing ? 'Edit Habit' : 'New Habit'}
      </Text>
      <TextInput
        label="Habit name"
        value={name}
        onChangeText={setName}
        mode="outlined"
      />
      <View>
        <Text variant="titleMedium">Frequency</Text>
        <SegmentedButtons
          value={frequency}
          onValueChange={value => setFrequency(value as HabitFrequency)}
          buttons={[
            {label: 'Daily', value: 'daily'},
            {label: 'Weekly', value: 'weekly'},
          ]}
        />
      </View>
      <Button mode="contained" onPress={handleSave}>
        Save Habit
      </Button>
    </ScreenContainer>
  );
};

export default HabitFormScreen;
