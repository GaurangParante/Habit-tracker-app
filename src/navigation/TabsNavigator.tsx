import React from 'react';
import {StyleSheet, View} from 'react-native';
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
        tabBarInactiveTintColor: '#D0D2DA',
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: '#2A2D37',
          borderTopWidth: 1,
          height: 82,
          paddingTop: 8,
          paddingBottom: 14,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -1,
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
                ? 'checkbox-marked-outline'
                : 'checkbox-marked-outline'
              : route.name === 'Statistics'
              ? focused
                ? 'chart-box'
                : 'chart-box-outline'
              : focused
              ? 'cog'
              : 'cog-outline';

          return (
            <View
              style={[
                styles.tabIconWrap,
                focused ? styles.tabIconWrapActive : null,
              ]}>
              <MaterialDesignIcons
                name={iconName as any}
                size={size}
                color={color}
              />
            </View>
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

const styles = StyleSheet.create({
  tabIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: '#153324',
  },
});

export default TabsNavigator;
