import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {
  List,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {themeSliceActions} from '@/store/slices/themeSlice';
import {settingsService} from '@/services/settingsService';
import {databaseService} from '@/database/database';
import {palette} from '@/theme/palette';

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
      <Text variant="headlineLarge" style={styles.title}>
        Settings
      </Text>
      <Text style={styles.subtitle}>Manage your app</Text>
      <SectionCard title="Account">
        <View
          style={[
            styles.accountCard,
            {backgroundColor: theme.colors.surfaceVariant},
          ]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text variant="titleLarge">User</Text>
        </View>
      </SectionCard>
      <SectionCard title="Appearance">
        <View
          style={[
            styles.settingRow,
            {backgroundColor: theme.colors.surfaceVariant},
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
      <SectionCard title="Data">
        <TouchableRipple
          borderless
          style={styles.resetCard}
          onPress={() =>
            Alert.alert(
              'Reset all data',
              'Delete all habits, tasks, and progress on this device?',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: async () => {
                    await databaseService.resetAppData();
                  },
                },
              ],
            )
          }>
          <View style={styles.resetInner}>
            <View style={styles.resetIcon}>
              <MaterialDesignIcons
                name="delete-outline"
                size={22}
                color={palette.danger}
              />
            </View>
            <View style={{flex: 1}}>
              <Text variant="titleMedium" style={{color: palette.danger}}>
                Reset All Data
              </Text>
              <Text style={styles.settingHint}>
                Delete all habits, tasks, and progress
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </SectionCard>
      <SectionCard title="App">
        <List.Item
          title="Habit Momentum"
          description="Version 1.0 - Build momentum every day."
          left={() => (
            <View style={styles.appIcon}>
              <MaterialDesignIcons
                name="flash-outline"
                size={20}
                color={palette.primary}
              />
            </View>
          )}
        />
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
  accountCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primaryDark,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
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
  resetCard: {
    borderRadius: 18,
    backgroundColor: '#211417',
  },
  resetInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  resetIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32171C',
  },
  appIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primaryTint,
  },
});

export default SettingsScreen;
