import {databaseService} from '@/database/database';
import {Achievement} from '@/types/models';

export const achievementsRepository = {
  async getAll() {
    return databaseService.query<Achievement>(
      'SELECT * FROM Achievements ORDER BY unlocked DESC, title ASC',
    );
  },

  async unlock(id: string, unlockedAt: string) {
    await databaseService.execute(
      'UPDATE Achievements SET unlocked = 1, unlocked_at = ? WHERE id = ?',
      [unlockedAt, id],
    );
  },
};
