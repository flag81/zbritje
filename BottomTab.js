import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import Chats from './Chats';
import Settings from './Settings';
import Account from './Account';
import Companies from './Companies';
import Brands from './Brands';
import { AntDesign } from '@expo/vector-icons';
import useStore from './useStore';
import { NavigationContainer } from '@react-navigation/native';


const BottomTabNavigator = createBottomTabNavigator();



export default function BottomTab() {
  //   const tabBarHeight = useBottomTabBarHeight();

  const { admin , myUserName, url} = useStore();

  return (
    <BottomTabNavigator.Navigator

    
      screenOptions={({ navigation }) => ({
        tabBarLabelStyle: styles.label,

        headerRight: ({ focused }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Profili')}>
            <View style={{ padding: 10 }}>
              <AntDesign
                name="user"
                size={22}
                color={focused ? '#0071ff' : 'gray'}
              />
              <Text>{myUserName}</Text>
            </View>
          </TouchableOpacity>
        ),
        


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
      })}
   
    >
      <BottomTabNavigator.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerTitle: 'Home',

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
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="tags"
              size={21}
              color={focused ? '#0071ff' : 'gray'}
            />
          ),
        }}
        name="Brendet"
        component={Brands}
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