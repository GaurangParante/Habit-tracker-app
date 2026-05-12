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
import {palette} from '@/theme/palette';

const TodoScreen = () => {
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.ui.todoFilter);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todaysTodos, setTodaysTodos] = useState<Todo[]>([]);
  const [overdueTodos, setOverdueTodos] = useState<Todo[]>([]);
  const [upcomingTodos, setUpcomingTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    const sections = await todoService.getTodoSections();
    setTodos(sections.allTodos);
    setTodaysTodos(sections.todaysTodos);
    setOverdueTodos(sections.overdueTodos);
    setUpcomingTodos(sections.upcomingTodos);
    setCompletedTodos(sections.completedTodos);
  }, []);

  useRefreshOnFocus(loadTodos);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todaysTodos;
      case 'completed':
        return completedTodos;
      case 'all':
        return upcomingTodos;
      default:
        return overdueTodos;
    }
  }, [completedTodos, filter, overdueTodos, todaysTodos, upcomingTodos]);

  const summary = useMemo(() => {
    const pending = todos.filter(todo => !todo.completed).length;
    return {
      pending,
      done: completedTodos.length,
    };
  }, [completedTodos.length, todos]);

  const currentTitle = useMemo(() => {
    switch (filter) {
      case 'active':
        return `Today (${todaysTodos.length})`;
      case 'all':
        return 'Upcoming';
      case 'completed':
        return 'Done';
      default:
        return 'Overdue';
    }
  }, [filter, todaysTodos.length]);

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
        'Delete task',
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
        <Text variant="headlineLarge" style={{fontWeight: '800'}}>
          Tasks
        </Text>
        <Text style={{color: '#C9BFB1'}}>
          {summary.pending} pending - {summary.done} done
        </Text>
        <SegmentedButtons
          value={filter}
          onValueChange={value =>
            dispatch(uiSliceActions.setTodoFilter(value as typeof filter))
          }
          buttons={[
            {label: 'Today', value: 'active'},
            {label: 'Upcoming', value: 'all'},
            {label: 'Overdue', value: 'overdue'},
            {label: 'Done', value: 'completed'},
          ]}
        />
        <SectionCard title={currentTitle}>
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
                title={`No tasks for ${currentTitle.toLowerCase()}`}
                description="Add a task to keep momentum moving."
              />
            )}
          </View>
        </SectionCard>
      </ScreenContainer>
      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 20,
          backgroundColor: palette.primary,
        }}
        onPress={() => stackNavigation.navigate('TodoForm', {})}
      />
    </>
  );
};

export default TodoScreen;
