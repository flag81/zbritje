import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import Chats from './Chats';
import Settings from './Settings';
import Account from './Account';
import Companies from './Companies';
import { AntDesign } from '@expo/vector-icons';

const BottomTabNavigator = createBottomTabNavigator();

export default function BottomTab() {
  //   const tabBarHeight = useBottomTabBarHeight();
  return (
    <BottomTabNavigator.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabContainer,
          Platform.OS === 'ios' && {
            shadowOffset: { height: -2, width: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
          },
        ],
        tabBarItemStyle: {
          marginBottom: 7,
        },
        tabBarInactiveTintColor: 'gray',
        tabBarActiveTintColor: '#0071ff',
      }}
      safeAreaInsets={{
        bottom: 0,
      }}
    >
      <BottomTabNavigator.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerTitle: 'MyHome',
          headerTransparent: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={22}
              color={focused ? '#0071ff' : 'gray'}
            />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="tags"
              size={21}
              color={focused ? '#0071ff' : 'gray'}
            />
          ),
        }}
        name="Kompanite"
        component={Companies}
      />
      <BottomTabNavigator.Screen
        name="Konfigurimet"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="setting"
              size={22}
              color={focused ? '#0071ff' : 'gray'}
            />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        name="Profili"
        component={Account}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              size={22}
              color={focused ? '#0071ff' : 'gray'}
            />
          ),
        }}
      />
    </BottomTabNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    width: '96%',
    borderRadius: 12,
    left: '2%',
    bottom: 10,
    backgroundColor: 'white',
    height: 60,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 12,
  },
});