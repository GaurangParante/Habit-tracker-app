import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {startOfDay, toLocalDateKey} from '@/utils/date';

type Props = {
  visible: boolean;
  value: string | null;
  onDismiss: () => void;
  onConfirm: (dateKey: string) => void;
};

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const getMonthMatrix = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

const CalendarPicker = ({visible, value, onDismiss, onConfirm}: Props) => {
  const theme = useTheme();
  const initialDate = value ? startOfDay(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setViewDate(value ? startOfDay(value) : new Date());
  }, [value, visible]);

  const selectedKey = value ?? null;
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        year: 'numeric',
      }).format(viewDate),
    [viewDate],
  );
  const cells = useMemo(() => getMonthMatrix(viewDate), [viewDate]);
  const todayKey = toLocalDateKey();

  const goMonth = (offset: number) => {
    setViewDate(current => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + offset);
      return next;
    });
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Select Date</Dialog.Title>
        <Dialog.Content>
          <View style={styles.headerRow}>
            <IconButton
              icon="chevron-left"
              onPress={() => goMonth(-1)}
            />
            <Text variant="titleMedium">{monthLabel}</Text>
            <IconButton
              icon="chevron-right"
              onPress={() => goMonth(1)}
            />
          </View>

          <View style={styles.weekHeader}>
            {weekDays.map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const dateKey = toLocalDateKey(date);
              const isSelected = dateKey === selectedKey;
              const isToday = dateKey === todayKey;

              return (
                <TouchableRipple
                  key={dateKey}
                  borderless
                  style={[
                    styles.dayCell,
                    isSelected
                      ? {
                          backgroundColor: theme.colors.primary,
                        }
                      : isToday
                        ? {
                            borderColor: theme.colors.primary,
                            borderWidth: 1,
                          }
                        : null,
                  ]}
                  onPress={() => onConfirm(dateKey)}>
                  <Text
                    style={[
                      styles.dayText,
                      isSelected
                        ? {color: theme.colors.onPrimary}
                        : null,
                    ]}>
                    {date.getDate()}
                  </Text>
                </TouchableRipple>
              );
            })}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    opacity: 0.65,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: '13.3%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CalendarPicker;
