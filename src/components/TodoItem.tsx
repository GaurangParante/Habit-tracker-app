import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
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
        <View style={styles.metaRow}>
          <MaterialDesignIcons
            name="calendar-blank-outline"
            size={16}
            color={palette.textMuted}
          />
          <Text style={styles.meta}>{formatReadableDate(todo.due_date)}</Text>
        </View>
      </View>
      <View
        style={[
          styles.priorityDot,
          {backgroundColor: priorityColor[todo.priority]},
        ]}
      />
      {onEdit ? (
        <Pressable hitSlop={10} onPress={() => onEdit(todo.id)}>
          <MaterialDesignIcons
            name="pencil-outline"
            size={20}
            color={palette.textMuted}
          />
        </Pressable>
      ) : null}
      {onDelete ? (
        <Pressable hitSlop={10} onPress={() => onDelete(todo.id)}>
          <MaterialDesignIcons
            name="delete-outline"
            size={20}
            color={palette.textMuted}
          />
        </Pressable>
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
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    opacity: 0.68,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default memo(TodoItem);
