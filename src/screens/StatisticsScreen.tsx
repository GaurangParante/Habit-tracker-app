import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import StatTile from '@/components/StatTile';
import {BottomTabParamList, RootStackParamList} from '@/types/navigation';
import {habitService} from '@/services/habitService';
import {achievementsRepository} from '@/database/repositories/achievementsRepository';
import {Achievement, HabitStats} from '@/types/models';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {palette} from '@/theme/palette';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Statistics'>,
  NativeStackScreenProps<RootStackParamList>
>;

const StatisticsScreen = ({navigation}: Props) => {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadStatistics = useCallback(async () => {
    const [statsSnapshot, achievementSnapshot] = await Promise.all([
      habitService.getStats(),
      achievementsRepository.getAll(),
    ]);
    setStats(statsSnapshot);
    setAchievements(achievementSnapshot);
  }, []);

  useRefreshOnFocus(loadStatistics);

  const weeklyBars = useMemo(
    () => [
      {day: 'Wed', value: 0.1},
      {day: 'Thu', value: 0.18},
      {day: 'Fri', value: 0.22},
      {day: 'Sat', value: 0.1},
      {day: 'Sun', value: 0.16},
      {day: 'Mon', value: 0.24},
      {day: 'Tue', value: Math.max((stats?.completionRate ?? 0) / 100, 0.08)},
    ],
    [stats?.completionRate],
  );

  return (
    <ScreenContainer>
      <Text variant="headlineLarge" style={styles.title}>
        Statistics
      </Text>
      <Text style={styles.subtitle}>Your productivity insights</Text>
      <SectionCard title="Overview">
        <View style={styles.tiles}>
          <StatTile
            label="Current Streak"
            value={`${stats?.activeStreak ?? 0}`}
            icon="fire"
            accent={palette.primary}
          />
          <StatTile
            label="Best Streak"
            value={`${stats?.bestStreak ?? 0}`}
            icon="medal-outline"
            accent={palette.warning}
          />
          <StatTile
            label="Completion Rate"
            value={`${stats?.completionRate ?? 0}%`}
            icon="target"
            accent={palette.purple}
          />
          <StatTile
            label="Tasks Done"
            value={`${stats?.completedTodos ?? 0}`}
            icon="check-circle-outline"
            accent={palette.primary}
          />
        </View>
      </SectionCard>

      <SectionCard title="Weekly Activity">
        <View style={styles.chartRow}>
          {weeklyBars.map(bar => (
            <View key={bar.day} style={styles.chartItem}>
              <View style={styles.barTrack}>
                <View
                  style={[styles.barFill, {height: `${bar.value * 100}%`}]}
                />
              </View>
              <Text style={styles.chartLabel}>{bar.day}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Achievement Progress">
        {achievements.slice(0, 4).map(item => (
          <Text key={item.id} style={styles.achievementLine}>
            {item.unlocked ? 'Unlocked' : 'Locked'} - {item.title}
          </Text>
        ))}
        <Button onPress={() => navigation.navigate('Achievements')}>
          Open Achievements
        </Button>
      </SectionCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
  },
  subtitle: {
    color: '#C9BFB1',
    marginTop: -10,
  },
  tiles: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 180,
    gap: 10,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  barTrack: {
    width: '100%',
    height: 140,
    backgroundColor: palette.surfaceMuted,
    borderRadius: 14,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: palette.primary,
    borderRadius: 14,
  },
  chartLabel: {
    color: palette.textMuted,
  },
  achievementLine: {
    color: palette.textMuted,
  },
});

export default StatisticsScreen;
