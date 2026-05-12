import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import CalendarPicker from '@/components/CalendarPicker';
import {RootStackParamList} from '@/types/navigation';
import {TodoPriority} from '@/types/models';
import {todosRepository} from '@/database/repositories/todosRepository';
import {formatReadableDate} from '@/utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'TodoForm'>;

const TodoFormScreen = ({navigation, route}: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const isEditing = Boolean(route.params?.todoId);
  const theme = useTheme();

  useEffect(() => {
    const loadTodo = async () => {
      if (!route.params?.todoId) {
        return;
      }

      const todo = await todosRepository.getById(route.params.todoId);
      if (todo) {
        setTitle(todo.title);
        setDescription(todo.description ?? '');
        setPriority(todo.priority);
        setDueDate(todo.due_date ?? '');
      }
    };

    loadTodo();
  }, [route.params?.todoId]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a todo title.');
      return;
    }

    const normalizedDueDate = dueDate.trim() || null;
    const normalizedDescription = description.trim() || null;

    if (isEditing && route.params?.todoId) {
      await todosRepository.update(
        route.params.todoId,
        title.trim(),
        normalizedDescription,
        priority,
        normalizedDueDate,
      );
    } else {
      await todosRepository.create(
        title.trim(),
        normalizedDescription,
        priority,
        normalizedDueDate,
      );
    }

    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <Text variant="headlineMedium" style={styles.title}>
        {isEditing ? 'Edit Task' : 'New Task'}
      </Text>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        placeholder="What do you need to do?"
      />
      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        placeholder="Add details..."
        multiline
        numberOfLines={4}
      />
      <View style={styles.group}>
        <Text variant="titleMedium">Priority</Text>
        <SegmentedButtons
          value={priority}
          onValueChange={value => setPriority(value as TodoPriority)}
          buttons={[
            {label: 'Low', value: 'low'},
            {label: 'Medium', value: 'medium'},
            {label: 'High', value: 'high'},
          ]}
        />
      </View>
      <View style={styles.group}>
        <Text variant="titleMedium">Due Date</Text>
        <Pressable onPress={() => setCalendarVisible(true)}>
          <View pointerEvents="none">
            <TextInput
              label="Select due date"
              value={dueDate ? formatReadableDate(dueDate) : ''}
              placeholder="dd-mm-yyyy"
              mode="outlined"
              editable={false}
              right={<TextInput.Icon icon="calendar-month-outline" />}
            />
          </View>
        </Pressable>
        <View style={styles.dateActions}>
          <Button
            mode="contained-tonal"
            onPress={() => setCalendarVisible(true)}>
            Open Calendar
          </Button>
          {dueDate ? (
            <Button
              textColor={theme.colors.error}
              onPress={() => setDueDate('')}>
              Clear Date
            </Button>
          ) : null}
        </View>
      </View>
      <Button mode="contained" onPress={handleSave}>
        {isEditing ? 'Save Changes' : 'Create'}
      </Button>
      <Button onPress={() => navigation.goBack()}>Cancel</Button>
      <CalendarPicker
        visible={calendarVisible}
        value={dueDate || null}
        onDismiss={() => setCalendarVisible(false)}
        onConfirm={dateKey => {
          setDueDate(dateKey);
          setCalendarVisible(false);
        }}
      />
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
  dateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
});

export default TodoFormScreen;
