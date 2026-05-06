import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Chip, IconButton, Text} from 'react-native-paper';
import {Todo} from '@/types/models';
import {formatReadableDate} from '@/utils/date';

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit?: (todoId: string) => void;
  onDelete?: (todoId: string) => void;
};

const priorityColor: Record<Todo['priority'], string> = {
  low: '#72B7B2',
  medium: '#E3A018',
  high: '#C94B4B',
};

const TodoItem = ({todo, onToggle, onEdit, onDelete}: Props) => {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text variant="titleMedium">{todo.title}</Text>
        <Text style={styles.meta}>{formatReadableDate(todo.due_date)}</Text>
      </View>
      <Chip
        compact
        style={[styles.chip, {backgroundColor: priorityColor[todo.priority]}]}
        textStyle={styles.chipText}>
        {todo.priority}
      </Chip>
      <Button
        mode={todo.completed ? 'contained' : 'contained-tonal'}
        compact
        onPress={() => onToggle(todo)}
        style={styles.actionButton}>
        {todo.completed ? 'Done' : 'Complete'}
      </Button>
      {onEdit ? (
        <IconButton icon="pencil-outline" onPress={() => onEdit(todo.id)} />
      ) : null}
      {onDelete ? (
        <IconButton icon="delete-outline" onPress={() => onDelete(todo.id)} />
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
  meta: {
    marginTop: 4,
    opacity: 0.68,
  },
  chip: {
    marginHorizontal: 8,
  },
  chipText: {
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  actionButton: {
    marginRight: 4,
  },
});

export default memo(TodoItem);
