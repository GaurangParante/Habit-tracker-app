import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Chip, IconButton, Text, useTheme} from 'react-native-paper';
import {HabitWithTodayLog} from '@/types/models';
import {palette} from '@/theme/palette';

type Props = {
  habit: HabitWithTodayLog;
  onToggle: (habit: HabitWithTodayLog) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onPress?: (habit: HabitWithTodayLog) => void;
};

const HabitItem = ({habit, onToggle, onEdit, onDelete, onPress}: Props) => {
  const theme = useTheme();

  return (
    <Pressable
      style={[
        styles.row,
        {
          backgroundColor: habit.completed
            ? palette.primaryTint
            : theme.colors.surface,
          borderColor: habit.color,
        },
      ]}
      onPress={() => (onPress ? onPress(habit) : onToggle(habit))}>
      <Pressable
        onPress={() => onToggle(habit)}
        style={[
          styles.leading,
          {
            backgroundColor: habit.completed
              ? habit.color
              : theme.colors.surfaceVariant,
          },
        ]}>
        <MaterialDesignIcons
          name={(habit.completed ? 'check' : habit.icon) as any}
          size={22}
          color={habit.completed ? '#FFFFFF' : habit.color}
        />
      </Pressable>
      <View style={styles.textWrap}>
        <Text variant="titleMedium">{habit.name}</Text>
        <Text style={styles.meta}>
          {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
        </Text>
      </View>
      {habit.completed ? (
        <Chip compact textStyle={{color: palette.primary}}>
          1
        </Chip>
      ) : null}
      {onEdit ? (
        <IconButton icon="dots-vertical" onPress={() => onEdit(habit.id)} />
      ) : null}
      {onDelete ? (
        <IconButton icon="delete-outline" onPress={() => onDelete(habit.id)} />
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  textWrap: {
    flex: 1,
  },
  leading: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    marginTop: 4,
    opacity: 0.68,
  },
});

export default memo(HabitItem);
