//This is the entering file of the mobile app. It is the first file that is executed when the app is started. It get the push notification token from expo
//
//


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';

import React, { useState, useEffect , useRef, useMemo, useCallback } from 'react';

import useStore from './useStore';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'



import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';

import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import HomeScreen from './HomeScreen';

import { RootSiblingParent } from 'react-native-root-siblings';

import * as SecureStore from 'expo-secure-store';

async function setLocalExpoToken(key, value) {
  await SecureStore.setItemAsync(key, value);
}

//import { usePushNotifications } from './usePushNotifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Look at that notification',
    body: "I'm so proud of myself!",
  },
  trigger: null,
});




async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };


  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
 //IN ALBANIAN 
  throw new Error(errorMessage);
}



async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    
    
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;


    //console.log("x",Constants.expoConfig?.extra?.eas.projectId);  // --> undefined
    //console.log("x",Constants.easConfig.projectId);  // --> undefined
    //console.log("y",Constants?.expoConfig?.extra?.eas?.projectId);  // --> my project id
    //const projectId = Constants.expoConfig.extra.eas.projectId;
    


    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("token from Notifications.getExpoPushTokenAsync from Expo:",pushTokenString);

      setLocalExpoToken('expoPushToken', pushTokenString);

      console.log("expoPushToken set locally:",pushTokenString);

     
      return pushTokenString;

    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}



const queryClient = new QueryClient();

export default function App() {

  //const { expoPushToken, notification } = usePushNotifications();
  //const data = JSON.stringify(notification, undefined, 2);
  //console.log("expoPushToken",expoPushToken);
  //console.log("data",data); 

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  const { url, admin , setExpoToken, userId} = useStore();

  async function getExpoPushNotificationToken(userId) {

    try
    {
  
      //const responses = await Promise.all([fetch(url1), fetch(url2)])
  
      const resp = await fetch(`${url}/getExpoPushNotificationToken?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });
  
  
    const data = await resp.json();
  
    console.log("getExpoPushNotificationToken----------------------------",userId, data);
      
      //setFavoritesData(data);
      //handleFilterSale();
      //if favorites data is empty then 
  
   return data;
        
    }
    catch(e)
    {
      console.log(e);
    }
  
  }

  // write a function to set a push notification with userID and token , take in context getExpoPushNotificationToken function


async function addExpoPushNotificationToken(userId,expoPushToken) {

  console.log("addExpoPushNotificationToken sent----------------------------",userId,expoPushToken);

  try
  {
    const resp = await fetch(`${url}/addExpoPushNotificationToken?userId=${userId}&expoPushToken=${expoPushToken}`,  {
      method: 'PUT',    
      body: JSON.stringify({
        userId: admin,
        expoPushToken: expoPushToken
      }),   
      headers: {"Content-Type": "application/json"}
    });



  //const data = await resp.json();

  console.log("addExpoPushNotificationToken added token----------------------------");
    
    //setFavoritesData(data);

    //if favorites data is empty then

  //return data;

  }

  catch(e)
  {
    console.log(e);
  }

}






  useEffect(() => {

    console.log("expoPushToken from expo changed -------",expoPushToken);

    if(expoPushToken != '')
    {
         setExpoToken(expoPushToken);
         console.log("useStore expoToken set:-------",expoPushToken);

    }

   



  }, [expoPushToken]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error) => setExpoPushToken(`${error}`));

      //getExpoPushNotificationToken(1).then(data => {



    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);




  return (
<QueryClientProvider client={queryClient}>
<AutocompleteDropdownContextProvider >
<RootSiblingParent>

    <NavigationContainer>

 {/*
    <View style={{  alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  */}


      <BottomTab />
    </NavigationContainer>
    </RootSiblingParent>
    </AutocompleteDropdownContextProvider>
</QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  text: {
   
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});