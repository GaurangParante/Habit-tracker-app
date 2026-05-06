import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation';

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
      <Text variant="displaySmall">Habit Tracker</Text>
      <Text style={styles.subtitle}>
        Offline-first progress, all on your device.
      </Text>
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
  subtitle: {
    marginTop: 12,
    opacity: 0.72,
    textAlign: 'center',
  },
});

export default SplashScreen;
