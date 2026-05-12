import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Chip, IconButton, Text, useTheme} from 'react-native-paper';
import {Todo} from '@/types/models';
import {formatReadableDate} from '@/utils/date';
import {palette} from '@/theme/palette';

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
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor:
            todo.priority === 'high' ? '#211417' : theme.colors.surface,
          borderLeftColor: priorityColor[todo.priority],
          opacity: todo.completed ? 0.72 : 1,
        },
      ]}>
      <Pressable onPress={() => onToggle(todo)} style={styles.checkbox}>
        <MaterialDesignIcons
          name={
            todo.completed ? 'check-circle' : 'checkbox-blank-circle-outline'
          }
          size={24}
          color={todo.completed ? palette.primary : theme.colors.outline}
        />
      </Pressable>
      <View style={styles.textWrap}>
        <Text variant="titleMedium">{todo.title}</Text>
        {todo.description ? (
          <Text style={styles.description}>{todo.description}</Text>
        ) : null}
        <Text style={styles.meta}>{formatReadableDate(todo.due_date)}</Text>
      </View>
      <Chip
        compact
        style={[styles.chip, {backgroundColor: priorityColor[todo.priority]}]}
        textStyle={styles.chipText}>
        {todo.priority}
      </Chip>
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
    alignItems: 'flex-start',
    gap: 8,
    borderLeftWidth: 4,
    borderRadius: 18,
    padding: 14,
  },
  textWrap: {
    flex: 1,
  },
  checkbox: {
    paddingTop: 2,
  },
  description: {
    marginTop: 4,
    opacity: 0.78,
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
});

export default memo(TodoItem);
