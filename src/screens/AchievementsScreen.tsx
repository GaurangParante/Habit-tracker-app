import React, {useCallback, useState} from 'react';
import {Text} from 'react-native-paper';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import {Achievement} from '@/types/models';
import {achievementsRepository} from '@/database/repositories/achievementsRepository';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {formatReadableDate} from '@/utils/date';

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadAchievements = useCallback(async () => {
    const items = await achievementsRepository.getAll();
    setAchievements(items);
  }, []);

  useRefreshOnFocus(loadAchievements);

  return (
    <ScreenContainer>
      <Text variant="headlineMedium">Achievements</Text>
      <SectionCard
        title="Your Badges"
        subtitle="All badges unlock locally from device data only.">
        {achievements.map(achievement => (
          <Text key={achievement.id}>
            {achievement.unlocked ? 'Unlocked' : 'Locked'} - {achievement.title}
            {achievement.unlocked_at
              ? ` on ${formatReadableDate(
                  achievement.unlocked_at.slice(0, 10),
                )}`
              : ''}
          </Text>
        ))}
      </SectionCard>
    </ScreenContainer>
  );
};

export default AchievementsScreen;
