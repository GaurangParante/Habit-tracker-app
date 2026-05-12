import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabs from './TabsNavigator';
import SplashScreen from '@/screens/SplashScreen';
import {RootStackParamList} from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HabitForm"
        options={{title: 'Habit', presentation: 'modal'}}
        getComponent={() => require('@/screens/HabitFormScreen').default}
      />
      <Stack.Screen
        name="TodoForm"
        options={{title: 'Todo', presentation: 'modal'}}
        getComponent={() => require('@/screens/TodoFormScreen').default}
      />
      <Stack.Screen
        name="Achievements"
        options={{title: 'Achievements'}}
        getComponent={() => require('@/screens/AchievementsScreen').default}
      />
      <Stack.Screen
        name="Settings"
        options={{title: 'Settings', presentation: 'modal'}}
        getComponent={() => require('@/screens/SettingsScreen').default}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
