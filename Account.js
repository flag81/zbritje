import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from './useStore';
import Toast from 'react-native-root-toast';
import * as Device from 'expo-device';

const Account = () => {
  const [oldEmail, setOldEmail] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const { admin , myUserName, url} = useStore();
  

  useEffect(() => {
    // call getUserEmail and set the email from the response
    getUserEmail(admin);
  }, []);

  const showToast = (message) => {
    //setFavoritesData((prevProducts) => [...prevProducts, item]);

    let toast = Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: false,
      animation: true,
      hideOnPress: true,
      delay: 0
  
  });
    
  };


  //write code to read the user input and update the email state

      


  async function getUserEmail(userId) {

    console.log('getUserEmail with userid :', userId);

    try
    {

      const resp = await fetch(`${url}/getUserEmail?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();
    //console.log('getUserEmail:', data);

    if(data.length == 0)
    {
      showToast(`Nuk ka te dhena per kete user`);
      return;
    }
    else if(data.length > 0)
    {

      console.log('email ID:', data[0].email);
      //setSelectedId(data[0].notificationLevel.toString());
      //setExtraData(extraData + 1);
      setOldEmail(data[0].email);
      return;         
    }  
  

    }
    catch(e)
    {
      console.log("Error:", e);

    }

    //return data;

  }


  async function updateUserEmail(userEmail) {

    //console.log("addFav:" + userId + "-" + productId);
  

    const data = new URLSearchParams();
    data.append('userId', admin);
    data.append('userEmail', userEmail);

    console.log("data updateUserNotificationLevel:" + data);


    try{
      const resp = await fetch(`${url}/updateUserEmail`,  {
      method: 'PUT',
      
      body: JSON.stringify({
        userId: admin,
        userEmail: userEmail
      }),
      headers: {"Content-Type": "application/json"}
    });

    
    showToast(`Emaili juaj u ndryshua me sukses.`);
    setOldEmail(userEmail);

    }
    catch(e)
    {
      console.log(e);
      showToast(`Deshtoi ruajtja e emailit.`);
    }

  }

  

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!validateEmail(email)) {
      setIsValid(false);
      Alert.alert('Email jo valid', 'Ju lutem shenoni nje email ne format sakt.');
      return;
    }
    setIsValid(true);
    updateUserEmail(email);


  };

  return (
    <View style={styles.container}>

      
      <View style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 20}}>
      <Text>Telefoni: {Device.deviceName}</Text>
    </View>

      <View style={{ fontSize: 15, fontWeight: 'bold',  marginBottom: 20, }} >
        <Text style={{ fontSize: 15}}>
          Email: {oldEmail ? oldEmail : 'Ju lutem shenoni emailin tuaj'}
        </Text>
      </View>  
          


          

      <TextInput
        style={[styles.input, !isValid && styles.error]}
        placeholder="Sheno email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={30} // Set the character limit here
      />

<TouchableOpacity onPress={handleSave}>
  <View style={{ borderWidth: 1, borderColor: 'blue', borderRadius: 10, padding: 20, alignItems: 'center', marginBottom: 20 }}>
    <Text style={{ textAlign: 'center' }}>Ruaj shenimet</Text>
  </View>
</TouchableOpacity>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor:'white', 
    borderRadius: 10
  

 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  error: {
    borderColor: 'red',
  },
});

export default Account;
