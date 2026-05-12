import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Button, SegmentedButtons, Text, TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import {RootStackParamList} from '@/types/navigation';
import {HabitFrequency} from '@/types/models';
import {habitsRepository} from '@/database/repositories/habitsRepository';
import {habitColorOptions, habitIconOptions} from '@/utils/content';
import {palette} from '@/theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitForm'>;

const HabitFormScreen = ({navigation, route}: Props) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [icon, setIcon] = useState<(typeof habitIconOptions)[number]>('target');
  const [color, setColor] =
    useState<(typeof habitColorOptions)[number]>('#10B981');
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
        setIcon(habit.icon as (typeof habitIconOptions)[number]);
        setColor(habit.color as (typeof habitColorOptions)[number]);
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
        icon,
        color,
      );
    } else {
      await habitsRepository.create(name.trim(), frequency, icon, color);
    }

    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <Text variant="headlineMedium" style={styles.title}>
        {isEditing ? 'Edit Habit' : 'New Habit'}
      </Text>
      <TextInput
        label="Habit Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        placeholder="e.g., Morning exercise"
      />
      <View style={styles.group}>
        <Text variant="titleMedium">Icon</Text>
        <View style={styles.iconGrid}>
          {habitIconOptions.map(option => {
            const active = option === icon;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.iconOption,
                  active && {borderColor: color, backgroundColor: `${color}22`},
                ]}
                onPress={() => setIcon(option)}>
                <MaterialDesignIcons
                  name={option}
                  size={22}
                  color={active ? color : palette.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.group}>
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
      <View style={styles.group}>
        <Text variant="titleMedium">Color</Text>
        <View style={styles.colorRow}>
          {habitColorOptions.map(option => {
            const active = option === color;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.colorOption,
                  {backgroundColor: option},
                  active && styles.colorActive,
                ]}
                onPress={() => setColor(option)}
              />
            );
          })}
        </View>
      </View>
      <Button mode="contained" onPress={handleSave}>
        {isEditing ? 'Save Changes' : 'Create'}
      </Button>
      <Button onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  group: {
    gap: 10,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconOption: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});

export default HabitFormScreen;
