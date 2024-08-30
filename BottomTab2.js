import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import Chats from './Chats';
import Settings from './Settings';
import Account from './Account';
import { AntDesign } from '@expo/vector-icons';
import FloatingActionBar from 'react-native-floating-action-bar';



export default function BottomTab() {
  //   const tabBarHeight = useBottomTabBarHeight();
  return (

<FloatingActionBar
  items={[{icon: 'taxi'}, {icon: 'subway'}, {icon: 'train'}, {icon: 'bus'}]}
  onPress={handlePress}
/>
   
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