import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {BottomTabParamList} from '@/types/navigation';
import DashboardScreen from '@/screens/DashboardScreen';
import HabitListScreen from '@/screens/HabitListScreen';
import TodoScreen from '@/screens/TodoScreen';
import StatisticsScreen from '@/screens/StatisticsScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        tabBarActiveTintColor: '#2F6B3C',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({color, size, focused}) => {
          const iconName =
            route.name === 'Dashboard'
              ? focused
                ? 'view-dashboard'
                : 'view-dashboard-outline'
              : route.name === 'Habits'
                ? focused
                  ? 'leaf'
                  : 'leaf-circle-outline'
                : route.name === 'Todos'
                  ? focused
                    ? 'format-list-checks'
                    : 'format-list-checks'
                  : focused
                    ? 'chart-box'
                    : 'chart-box-outline';

          return (
            <MaterialDesignIcons name={iconName} size={size} color={color} />
          );
        },
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Habits" component={HabitListScreen} />
      <Tab.Screen name="Todos" component={TodoScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
