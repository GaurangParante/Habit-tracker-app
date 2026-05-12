import React from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
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
  const isDark = theme.dark;

  const handleToggleTheme = async () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    dispatch(themeSliceActions.setTheme(nextMode));
    await settingsService.setThemePreference(nextMode);
  };

  return (
    <ScreenContainer>
      <Text
        variant="headlineLarge"
        style={[
          styles.title,
          {color: isDark ? theme.colors.onSurface : '#111111'},
        ]}>
        Settings
      </Text>
      <Text style={[styles.subtitle, {color: isDark ? '#C9BFB1' : '#BDB4A8'}]}>
        Manage your app
      </Text>
      <SectionCard title="Account">
        <View
          style={[
            styles.accountCard,
            {
              backgroundColor: isDark
                ? theme.colors.surfaceVariant
                : palette.lightSurfaceSoft,
            },
          ]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text
            variant="titleLarge"
            style={{color: isDark ? theme.colors.onSurface : '#111111'}}>
            User
          </Text>
        </View>
      </SectionCard>
      <SectionCard title="Appearance">
        <Pressable
          style={[
            styles.settingRow,
            {
              backgroundColor: isDark
                ? theme.colors.surfaceVariant
                : palette.lightSurfaceSoft,
            },
          ]}
          onPress={handleToggleTheme}>
          <View style={styles.settingIcon}>
            <MaterialDesignIcons
              name={
                mode === 'dark' ? 'moon-waning-crescent' : 'white-balance-sunny'
              }
              size={20}
              color={palette.primary}
            />
          </View>
          <View style={styles.settingCopy}>
            <Text
              variant="titleMedium"
              style={{color: isDark ? theme.colors.onSurface : '#111111'}}>
              Dark mode
            </Text>
            <Text
              style={[
                styles.settingHint,
                {color: isDark ? theme.colors.onSurfaceVariant : '#4E5562'},
              ]}>
              Toggle the app between dark and light themes.
            </Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={handleToggleTheme}
            color={palette.primary}
          />
        </Pressable>
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
            <View style={styles.flexOne}>
              <Text variant="titleMedium" style={styles.resetTitle}>
                Reset All Data
              </Text>
              <Text style={[styles.settingHint, styles.resetHint]}>
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
          titleStyle={{color: isDark ? theme.colors.onSurface : '#111111'}}
          descriptionStyle={{
            color: isDark ? theme.colors.onSurfaceVariant : '#4E5562',
          }}
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
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: palette.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCopy: {
    flex: 1,
  },
  settingHint: {
    marginTop: 4,
    lineHeight: 20,
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
  flexOne: {
    flex: 1,
  },
  resetTitle: {
    color: palette.danger,
  },
  resetHint: {
    color: '#BAAEB3',
  },
});

export default SettingsScreen;
