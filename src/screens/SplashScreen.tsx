import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation';
import {palette} from '@/theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({navigation}: Props) => {
  const theme = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => navigation.replace('MainTabs'), 900);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>M</Text>
      </View>
      <Text variant="displaySmall" style={styles.title}>
        Habit Momentum
      </Text>
      <Text style={styles.subtitle}>Build momentum every day.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: palette.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 12,
    opacity: 0.72,
    textAlign: 'center',
  },
});

export default SplashScreen;
