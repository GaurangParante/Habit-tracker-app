import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import {BottomTabParamList} from '@/types/navigation';
import {habitService} from '@/services/habitService';
import {HabitStats} from '@/types/models';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {palette} from '@/theme/palette';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Statistics'>,
  NativeStackScreenProps<any>
>;

const StatisticsScreen = (_: Props) => {
  const theme = useTheme();
  const [stats, setStats] = useState<HabitStats | null>(null);

  const isDark = theme.dark;
  const colors = {
    card: isDark ? palette.surface : palette.lightSurface,
    cardSoft: isDark ? '#1A1D26' : palette.lightSurfaceSoft,
    border: isDark ? palette.border : palette.lightBorder,
    text: isDark ? palette.text : palette.lightText,
    muted: isDark ? '#C7BBAA' : palette.lightTextMuted,
    chartBase: isDark ? '#212430' : palette.lightSurfaceMuted,
  };

  const loadStatistics = useCallback(async () => {
    const statsSnapshot = await habitService.getStats();
    setStats(statsSnapshot);
  }, []);

  useRefreshOnFocus(loadStatistics);

  const weeklyBars = useMemo(
    () => [
      {day: 'Wed', value: 0},
      {day: 'Thu', value: 0},
      {day: 'Fri', value: 0},
      {day: 'Sat', value: 0},
      {day: 'Sun', value: 0},
      {day: 'Mon', value: 0},
      {day: 'Tue', value: (stats?.completionRate ?? 0) / 100},
    ],
    [stats?.completionRate],
  );

  const trendPoints = useMemo(
    () => [13, 18, 23, 28, 3, 8].map(label => ({label: `${label}`})),
    [],
  );

  const statCards = [
    {
      icon: 'fire',
      color: palette.primary,
      value: `${stats?.activeStreak ?? 0}`,
      label: 'CURRENT STREAK',
    },
    {
      icon: 'medal-outline',
      color: palette.warning,
      value: `${stats?.bestStreak ?? 0}`,
      label: 'BEST STREAK',
    },
    {
      icon: 'target',
      color: palette.purple,
      value: `${stats?.completionRate ?? 0}%`,
      label: 'COMPLETION RATE',
    },
    {
      icon: 'check-circle-outline',
      color: palette.primary,
      value: `${stats?.completedTodos ?? 0}`,
      label: 'TASKS DONE',
    },
  ];

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Text style={[styles.title, {color: colors.text}]}>Statistics</Text>
      <Text style={[styles.subtitle, {color: colors.muted}]}>
        Your productivity insights
      </Text>

      <View style={styles.tiles}>
        {statCards.map(card => (
          <View
            key={card.label}
            style={[
              styles.tile,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <MaterialDesignIcons
              name={card.icon as any}
              size={22}
              color={card.color}
            />
            <Text style={[styles.tileValue, {color: colors.text}]}>
              {card.value}
            </Text>
            <Text style={[styles.tileLabel, {color: colors.muted}]}>
              {card.label}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.chartCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        <Text style={[styles.cardHeading, {color: colors.muted}]}>
          WEEKLY ACTIVITY
        </Text>
        <View style={styles.weeklyChart}>
          {weeklyBars.map(bar => (
            <View key={bar.day} style={styles.weekBarItem}>
              <View
                style={[
                  styles.weekBarTrack,
                  {backgroundColor: colors.chartBase},
                ]}>
                {bar.value > 0 ? (
                  <View
                    style={[
                      styles.weekBarFill,
                      {height: `${Math.max(bar.value, 0.06) * 100}%`},
                    ]}
                  />
                ) : null}
              </View>
              <Text style={[styles.axisLabel, {color: colors.muted}]}>
                {bar.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.chartCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        <Text style={[styles.cardHeading, {color: colors.muted}]}>
          30-DAY HABIT TREND
        </Text>
        <View style={styles.trendWrap}>
          <View
            style={[styles.trendLine, {backgroundColor: palette.primary}]}
          />
          <View style={styles.trendLabels}>
            {trendPoints.map(point => (
              <Text
                key={point.label}
                style={[styles.axisLabel, {color: colors.muted}]}>
                {point.label}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: -10,
    fontSize: 16,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '48.5%',
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  tileValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  tileLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  chartCard: {
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 160,
    padding: 14,
  },
  cardHeading: {
    fontSize: 12,
    letterSpacing: 0.9,
    fontWeight: '800',
    marginBottom: 18,
  },
  weeklyChart: {
    flex: 1,
    minHeight: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 4,
  },
  weekBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  weekBarTrack: {
    width: 14,
    height: 90,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekBarFill: {
    width: '100%',
    backgroundColor: palette.primary,
    borderRadius: 8,
  },
  axisLabel: {
    fontSize: 11,
  },
  trendWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: 120,
  },
  trendLine: {
    height: 2,
    borderRadius: 999,
    marginHorizontal: 2,
    marginBottom: 8,
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default StatisticsScreen;
