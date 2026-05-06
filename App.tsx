import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Provider as ReduxProvider} from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import {store} from './src/store';
import {databaseService} from './src/database/database';
import {themeSliceActions} from './src/store/slices/themeSlice';
import {settingsService} from './src/services/settingsService';

const App = (): React.JSX.Element => {
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      await databaseService.initialize();
      const storedTheme = await settingsService.getThemePreference();
      const dark = storedTheme === 'dark';
      setIsDarkMode(dark);
      store.dispatch(themeSliceActions.setTheme(dark ? 'dark' : 'light'));
      setIsReady(true);
    };

    bootstrap();
  }, []);

  const navigationTheme = useMemo(
    () =>
      isDarkMode
        ? {
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              background: '#0D1117',
              card: '#161B22',
              border: '#283341',
              primary: '#7BD389',
              text: '#F0F6FC',
            },
          }
        : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: '#F4F7F1',
              card: '#FFFFFF',
              border: '#D4DECF',
              primary: '#2F6B3C',
              text: '#17301E',
            },
          },
    [isDarkMode],
  );

  const paperTheme = useMemo(
    () =>
      isDarkMode
        ? {
            ...MD3DarkTheme,
            colors: {
              ...MD3DarkTheme.colors,
              primary: '#7BD389',
              secondary: '#A2E3C4',
              background: '#0D1117',
              surface: '#161B22',
              surfaceVariant: '#21262D',
            },
          }
        : {
            ...MD3LightTheme,
            colors: {
              ...MD3LightTheme.colors,
              primary: '#2F6B3C',
              secondary: '#6E9F76',
              background: '#F4F7F1',
              surface: '#FFFFFF',
              surfaceVariant: '#E7EFE3',
            },
          },
    [isDarkMode],
  );

  const paperSettings = useMemo(
    () => ({
      icon: (props: React.ComponentProps<typeof MaterialDesignIcons>) => (
        <MaterialDesignIcons {...props} />
      ),
    }),
    [],
  );

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const theme = store.getState().theme.mode;
      setIsDarkMode(theme === 'dark');
    });

    return unsubscribe;
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <PaperProvider theme={paperTheme} settings={paperSettings}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: paperTheme.colors.background,
              }}>
              <ActivityIndicator
                size="large"
                color={paperTheme.colors.primary}
              />
            </View>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PaperProvider theme={paperTheme} settings={paperSettings}>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator />
            </NavigationContainer>
          </PaperProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
