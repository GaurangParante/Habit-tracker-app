import React, {useCallback, useMemo, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import TodoItem from '@/components/TodoItem';
import {RootStackParamList} from '@/types/navigation';
import {Todo} from '@/types/models';
import {todoService} from '@/services/todoService';
import {todosRepository} from '@/database/repositories/todosRepository';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {uiSliceActions} from '@/store/slices/uiSlice';
import {palette} from '@/theme/palette';

const filterTabs = [
  {label: 'Today', value: 'active'},
  {label: 'Upcoming', value: 'all'},
  {label: 'Overdue', value: 'overdue'},
  {label: 'Done', value: 'completed'},
] as const;

const TodoScreen = () => {
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.ui.todoFilter);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todaysTodos, setTodaysTodos] = useState<Todo[]>([]);
  const [overdueTodos, setOverdueTodos] = useState<Todo[]>([]);
  const [upcomingTodos, setUpcomingTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const isDark = theme.dark;

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
    return {pending, done: completedTodos.length};
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
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text
            style={[
              styles.title,
              {color: isDark ? palette.text : palette.lightText},
            ]}>
            Tasks
          </Text>
          <Text
            style={[
              styles.subtitle,
              {color: isDark ? '#C7BBAA' : palette.lightTextMuted},
            ]}>
            {summary.pending} pending · {summary.done} done
          </Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => stackNavigation.navigate('TodoForm', {})}>
          <MaterialDesignIcons name="plus" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {filterTabs.map(tab => {
          const active = tab.value === filter;
          return (
            <Pressable
              key={tab.value}
              style={[styles.filterTab, active ? styles.filterTabActive : null]}
              onPress={() =>
                dispatch(uiSliceActions.setTodoFilter(tab.value as any))
              }>
              <Text
                style={[
                  styles.filterText,
                  active ? styles.filterTextActive : null,
                ]}>
                {tab.label}
                {tab.value === 'active' && active
                  ? ` (${todaysTodos.length})`
                  : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredTodos.length ? (
        <View style={styles.list}>
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={todoId => stackNavigation.navigate('TodoForm', {todoId})}
              onDelete={handleDelete}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyWrap}>
          <MaterialDesignIcons
            name="clipboard-text-outline"
            size={52}
            color="#CDB8A3"
          />
          <Text style={styles.emptyTitle}>
            No tasks for {currentTitle.toLowerCase()}
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 96,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#161922',
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    borderRadius: 999,
  },
  filterTabActive: {
    backgroundColor: palette.primary,
  },
  filterText: {
    color: '#B9BCC8',
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  list: {
    gap: 10,
  },
  emptyWrap: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: '#CDB8A3',
    fontSize: 18,
  },
});

export default TodoScreen;
