import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {BottomTabParamList} from '@/types/navigation';
import DashboardScreen from '@/screens/DashboardScreen';
import HabitListScreen from '@/screens/HabitListScreen';
import TodoScreen from '@/screens/TodoScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import {palette} from '@/theme/palette';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({color, size, focused}) => {
          const iconName =
            route.name === 'Dashboard'
              ? focused
                ? 'view-grid'
                : 'view-grid-outline'
              : route.name === 'Habits'
              ? focused
                ? 'flag-checkered'
                : 'flag-checkered'
              : route.name === 'Todos'
              ? focused
                ? 'format-list-checks'
                : 'format-list-checks'
              : route.name === 'Statistics'
              ? focused
                ? 'chart-box'
                : 'chart-box-outline'
              : focused
              ? 'cog'
              : 'cog-outline';

          return (
            <MaterialDesignIcons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Habits" component={HabitListScreen} />
      <Tab.Screen name="Todos" component={TodoScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
