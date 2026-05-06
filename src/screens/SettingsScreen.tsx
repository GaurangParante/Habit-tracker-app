import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Switch, Text, useTheme} from 'react-native-paper';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {themeSliceActions} from '@/store/slices/themeSlice';
import {settingsService} from '@/services/settingsService';

const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(state => state.theme.mode);
  const theme = useTheme();

  const handleToggleTheme = async () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    dispatch(themeSliceActions.setTheme(nextMode));
    await settingsService.setThemePreference(nextMode);
  };

  return (
    <ScreenContainer>
      <Text variant="headlineMedium">Settings</Text>
      <SectionCard
        title="Dark Mode"
        subtitle="Choose a calmer look for late-night tracking.">
        <View
          style={[
            styles.settingRow,
            {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}>
          <View style={styles.settingCopy}>
            <Text variant="titleMedium">Enable dark mode</Text>
            <Text style={styles.settingHint}>
              Your preference is saved only on this device.
            </Text>
          </View>
          <Switch value={mode === 'dark'} onValueChange={handleToggleTheme} />
        </View>
      </SectionCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingCopy: {
    flex: 1,
  },
  settingHint: {
    marginTop: 4,
    opacity: 0.72,
  },
});

export default SettingsScreen;
