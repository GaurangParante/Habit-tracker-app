import {settingsRepository} from '@/database/repositories/settingsRepository';
import {SETTINGS_KEYS} from '@/utils/constants';
import {ThemeMode} from '@/types/models';

export const settingsService = {
  async getThemePreference(): Promise<ThemeMode> {
    const setting = await settingsRepository.get(SETTINGS_KEYS.THEME);
    return setting?.value === 'dark' ? 'dark' : 'light';
  },

  async setThemePreference(mode: ThemeMode) {
    await settingsRepository.set(SETTINGS_KEYS.THEME, mode);
  },
};
