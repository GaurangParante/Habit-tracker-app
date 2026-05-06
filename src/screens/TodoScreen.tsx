import React, {useCallback, useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
import {FAB, SegmentedButtons, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import EmptyState from '@/components/EmptyState';
import TodoItem from '@/components/TodoItem';
import {RootStackParamList} from '@/types/navigation';
import {Todo} from '@/types/models';
import {todoService} from '@/services/todoService';
import {todosRepository} from '@/database/repositories/todosRepository';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {uiSliceActions} from '@/store/slices/uiSlice';

const TodoScreen = () => {
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.ui.todoFilter);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todaysTodos, setTodaysTodos] = useState<Todo[]>([]);
  const [overdueTodos, setOverdueTodos] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    const sections = await todoService.getTodoSections();
    setTodos(sections.allTodos);
    setTodaysTodos(sections.todaysTodos);
    setOverdueTodos(sections.overdueTodos);
  }, []);

  useRefreshOnFocus(loadTodos);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => Boolean(todo.completed));
      default:
        return todos;
    }
  }, [filter, todos]);

  const handleToggle = useCallback(
    async (todo: Todo) => {
      await todosRepository.toggleComplete(todo.id, !todo.completed);
      await loadTodos();
    },
    [loadTodos],
  );

  const handleDelete = useCallback(
    (todoId: string) => {
      Alert.alert(
        'Delete todo',
        'This only removes the local record on this device.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await todosRepository.remove(todoId);
              await loadTodos();
            },
          },
        ],
      );
    },
    [loadTodos],
  );

  return (
    <>
      <ScreenContainer contentStyle={{paddingBottom: 96}}>
        <Text variant="headlineMedium">Todos</Text>
        <SegmentedButtons
          value={filter}
          onValueChange={value =>
            dispatch(uiSliceActions.setTodoFilter(value as typeof filter))
          }
          buttons={[
            {label: 'All', value: 'all'},
            {label: 'Active', value: 'active'},
            {label: 'Done', value: 'completed'},
          ]}
        />

        <SectionCard title="Today's Todos">
          {todaysTodos.length ? (
            todaysTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
            ))
          ) : (
            <EmptyState
              title="Nothing for today"
              description="Quick add a task with today's due date."
            />
          )}
        </SectionCard>

        <SectionCard title="Overdue Todos">
          {overdueTodos.length ? (
            overdueTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} />
            ))
          ) : (
            <EmptyState
              title="No overdue tasks"
              description="Everything important is still on track."
            />
          )}
        </SectionCard>

        <SectionCard title="All Todos">
          <View style={{gap: 8}}>
            {filteredTodos.length ? (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={todoId =>
                    stackNavigation.navigate('TodoForm', {todoId})
                  }
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState
                title="No todos match"
                description="Adjust the filter or create a new task."
              />
            )}
          </View>
        </SectionCard>
      </ScreenContainer>
      <FAB
        icon="plus"
        style={{position: 'absolute', right: 16, bottom: 20}}
        onPress={() => stackNavigation.navigate('TodoForm', {})}
      />
    </>
  );
};

export default TodoScreen;
