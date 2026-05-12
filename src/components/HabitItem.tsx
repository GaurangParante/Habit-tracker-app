import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
import {HabitWithTodayLog} from '@/types/models';
import {palette} from '@/theme/palette';

type Props = {
  habit: HabitWithTodayLog;
  onToggle: (habit: HabitWithTodayLog) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
  onPress?: (habit: HabitWithTodayLog) => void;
  showMenu?: boolean;
};

const HabitItem = ({
  habit,
  onToggle,
  onEdit,
  onPress,
  showMenu = false,
}: Props) => {
  const theme = useTheme();
  const isDark = theme.dark;

  return (
    <Pressable
      style={[
        styles.row,
        {
          backgroundColor: habit.completed
            ? isDark
              ? palette.primaryTint
              : '#0E4B27'
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
        <Text
          variant="titleMedium"
          style={{color: habit.completed ? '#FFFFFF' : theme.colors.onSurface}}>
          {habit.name}
        </Text>
        <Text
          style={[
            styles.meta,
            {
              color: habit.completed
                ? 'rgba(255,255,255,0.78)'
                : theme.colors.onSurfaceVariant,
            },
          ]}>
          {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
        </Text>
      </View>
      {habit.completed ? (
        <View style={styles.streakWrap}>
          <MaterialDesignIcons name="fire" size={16} color={palette.primary} />
          <Text style={styles.streakText}>1</Text>
        </View>
      ) : null}
      {showMenu && onEdit ? (
        <Pressable
          hitSlop={10}
          style={styles.menuButton}
          onPress={() => onEdit(habit.id)}>
          <MaterialDesignIcons
            name="dots-vertical"
            size={20}
            color={
              habit.completed ? 'rgba(255,255,255,0.72)' : palette.textMuted
            }
          />
        </Pressable>
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
    minHeight: 72,
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
  streakWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: palette.primary,
    fontWeight: '700',
  },
  menuButton: {
    paddingLeft: 4,
  },
});

export default memo(HabitItem);
