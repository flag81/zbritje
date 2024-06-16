import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Active from './Active';
import Pending from './Pending';

import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
const TopNavigator = createMaterialTopTabNavigator();
export default function TopNav() {
  return (
    <TopNavigator.Navigator
      screenOptions={{
        tabBarStyle: styles.containerStyle,
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#f5f5f5',
      }}
    >
      <TopNavigator.Screen
        options={{
          tabBarIndicatorStyle: [
            styles.indicator,
            {
              marginLeft: 10,
            },
          ],
        }}
        name="active"
        component={Active}
      />
      <TopNavigator.Screen name="pending" component={Pending} />

    </TopNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
  
  },
  indicator: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: -1,
    bottom: '15%',
    height: '70%',
  },
  containerStyle: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: 'black',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 8,
  },
});