import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {HabitWithTodayLog} from '@/types/models';

type Props = {
  habit: HabitWithTodayLog;
  onToggle: (habit: HabitWithTodayLog) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
};

const HabitItem = ({habit, onToggle, onEdit, onDelete}: Props) => {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text variant="titleMedium">{habit.name}</Text>
        <Text style={styles.meta}>{habit.frequency.toUpperCase()}</Text>
      </View>
      <Button
        mode={habit.completed ? 'contained' : 'contained-tonal'}
        compact
        onPress={() => onToggle(habit)}
        style={styles.actionButton}>
        {habit.completed ? 'Done' : 'Mark Done'}
      </Button>
      {onEdit ? (
        <IconButton icon="pencil-outline" onPress={() => onEdit(habit.id)} />
      ) : null}
      {onDelete ? (
        <IconButton icon="delete-outline" onPress={() => onDelete(habit.id)} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textWrap: {
    flex: 1,
  },
  actionButton: {
    marginLeft: 8,
  },
  meta: {
    marginTop: 4,
    opacity: 0.68,
  },
});

export default memo(HabitItem);
