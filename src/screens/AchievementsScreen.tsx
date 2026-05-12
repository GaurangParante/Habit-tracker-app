import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text} from 'react-native-paper';
import ScreenContainer from '@/components/ScreenContainer';
import {Achievement} from '@/types/models';
import {achievementsRepository} from '@/database/repositories/achievementsRepository';
import {useRefreshOnFocus} from '@/hooks/useRefreshOnFocus';
import {formatReadableDate} from '@/utils/date';
import {palette} from '@/theme/palette';
import {getAchievementTitle, orderAchievements} from '@/utils/achievements';

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadAchievements = useCallback(async () => {
    const items = await achievementsRepository.getAll();
    setAchievements(orderAchievements(items));
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
          <View
            key={achievement.id}
            style={[
              styles.card,
              achievement.unlocked ? styles.cardUnlocked : null,
            ]}>
            <MaterialDesignIcons
              name={achievement.unlocked ? 'shield-check' : 'lock-outline'}
              size={24}
              color={achievement.unlocked ? palette.primary : '#6F7280'}
            />
            <Text style={styles.badgeTitle}>
              {getAchievementTitle(achievement)}
            </Text>
            <Text style={styles.meta}>
              {achievement.unlocked_at
                ? `Unlocked on ${formatReadableDate(
                    achievement.unlocked_at.slice(0, 10),
                  )}`
                : 'Locked'}
            </Text>
          </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '31%',
    minHeight: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    padding: 10,
  },
  cardUnlocked: {
    backgroundColor: palette.primaryTint,
    borderColor: '#165B34',
  },
  badgeTitle: {
    color: palette.textMuted,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    color: '#6F7280',
    textAlign: 'center',
    fontSize: 11,
  },
});

export default AchievementsScreen;
