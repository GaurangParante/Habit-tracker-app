import {achievementsRepository} from '@/database/repositories/achievementsRepository';
import {databaseService} from '@/database/database';
import {ACHIEVEMENT_IDS} from '@/utils/constants';
import {shiftDateKey, toLocalDateKey, toLocalTimestamp} from '@/utils/date';

export const achievementService = {
  async evaluateAndUnlock(stats: {
    activeStreak: number;
    totalCompletions: number;
  }) {
    const unlockedAt = toLocalTimestamp();
    const achievements = await achievementsRepository.getAll();

    const maybeUnlock = async (id: string, shouldUnlock: boolean) => {
      const achievement = achievements.find(item => item.id === id);
      if (achievement && !achievement.unlocked && shouldUnlock) {
        await achievementsRepository.unlock(id, unlockedAt);
      }
    };

    await maybeUnlock(ACHIEVEMENT_IDS.STREAK_3, stats.activeStreak >= 3);
    await maybeUnlock(ACHIEVEMENT_IDS.STREAK_7, stats.activeStreak >= 7);
    await maybeUnlock(
      ACHIEVEMENT_IDS.COMPLETIONS_30,
      stats.totalCompletions >= 30,
    );
  },

  async recalculateFromDatabase() {
    const totalCompletions = await databaseService.getScalar<number>(
      'SELECT COUNT(*) as count FROM HabitLogs WHERE completed = 1',
    );
    const streakRows = await databaseService.query<{date: string}>(
      'SELECT DISTINCT date FROM HabitLogs WHERE completed = 1 ORDER BY date DESC',
    );

    let activeStreak = 0;
    const completedDates = new Set(streakRows.map(row => row.date));
    let cursor = toLocalDateKey();

    while (completedDates.has(cursor)) {
      activeStreak += 1;
      cursor = shiftDateKey(cursor, -1);
    }

    await this.evaluateAndUnlock({
      activeStreak,
      totalCompletions: totalCompletions ?? 0,
    });
  },
};
