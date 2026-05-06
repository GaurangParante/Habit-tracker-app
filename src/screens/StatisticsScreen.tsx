import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
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

  return (
    <ScreenContainer>
      <Text variant="headlineMedium">Statistics</Text>
      <SectionCard title="Habit Performance">
        <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
          <StatTile
            label="Completion Rate"
            value={`${stats?.completionRate ?? 0}%`}
          />
          <StatTile
            label="Total Completions"
            value={`${stats?.totalCompletions ?? 0}`}
          />
          <StatTile
            label="Active Streak"
            value={`${stats?.activeStreak ?? 0}d`}
          />
        </View>
      </SectionCard>

      <SectionCard title="Achievements">
        {achievements.map(item => (
          <Text key={item.id}>
            {item.unlocked ? 'Unlocked' : 'Locked'}: {item.title}
          </Text>
        ))}
        <Button onPress={() => navigation.navigate('Achievements')}>
          Open Achievements
        </Button>
      </SectionCard>
    </ScreenContainer>
  );
};

export default StatisticsScreen;
