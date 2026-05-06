import {databaseService} from '@/database/database';
import {Setting} from '@/types/models';

export const settingsRepository = {
  async get(key: string) {
    const rows = await databaseService.query<Setting>(
      'SELECT * FROM Settings WHERE key = ? LIMIT 1',
      [key],
    );
    return rows[0] ?? null;
  },

  async set(key: string, value: string) {
    await databaseService.execute(
      'INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?)',
      [key, value],
    );
  },
};
