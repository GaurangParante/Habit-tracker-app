import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text} from 'react-native-paper';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import {Achievement} from '@/types/models';
import {achievementsRepository} from '@/database/repositories/achievementsRepository';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {formatReadableDate} from '@/utils/date';
import {palette} from '@/theme/palette';

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadAchievements = useCallback(async () => {
    const items = await achievementsRepository.getAll();
    setAchievements(items);
  }, []);

  useRefreshOnFocus(loadAchievements);

  return (
    <ScreenContainer>
      <Text variant="headlineLarge" style={styles.title}>
        Achievements
      </Text>
      <Text style={styles.subtitle}>Consistency unlocks everything</Text>
      <View style={styles.grid}>
        {achievements.map(achievement => (
          <SectionCard
            key={achievement.id}
            title={achievement.unlocked ? 'Unlocked' : 'Locked'}>
            <View style={styles.badgeBody}>
              <MaterialDesignIcons
                name={achievement.unlocked ? 'trophy-award' : 'lock-outline'}
                size={28}
                color={
                  achievement.unlocked ? palette.primary : palette.textMuted
                }
              />
              <Text variant="titleMedium">{achievement.title}</Text>
              <Text style={styles.meta}>
                {achievement.unlocked_at
                  ? `Unlocked on ${formatReadableDate(
                      achievement.unlocked_at.slice(0, 10),
                    )}`
                  : 'Keep stacking wins to unlock this badge.'}
              </Text>
            </View>
          </SectionCard>
        ))}
      </View>
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
  grid: {
    gap: 12,
  },
  badgeBody: {
    alignItems: 'center',
    gap: 10,
  },
  meta: {
    color: palette.textMuted,
    textAlign: 'center',
  },
});

export default AchievementsScreen;
