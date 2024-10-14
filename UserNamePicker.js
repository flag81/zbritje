import { Modal, View, Text, TextInput, Pressable, StyleSheet, Button, Alert, Input } from 'react-native';
import React, { useState, useEffect , useCallback } from 'react';
import { Storage } from 'expo-storage';


import * as SecureStore from 'expo-secure-store';
import useStore from './useStore';


export default function UserNamePicker({ isVisible, onClose }) {

    const [userName, setUserName] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const { myUserName, setMyUserName, url, setUserId , expoToken} = useStore();
    
  //const url = 'http://10.12.13.197:8800';

  useEffect(() => {



    console.log("expoToken changed:",expoToken);

  }, [expoToken]);



  async function setLocalUsername(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function setLocalExpoToken(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function setLocalUserId(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getLocalUsername(key) {
    let result = await SecureStore.getItemAsync(key);

    if (result)
      return result;
    else
      return null;

  }


  useEffect(() => {
   
    //handleFilterSale();
    setVisible(true);


  }, []);


    function onSubmit() {
        Alert.alert(userName);              
    }

    function onCloseModal() {
        //setIsVisible(false);
        onClose();                      
    }



    async function addUser(userName, token) {
        try
        {

          console.log("addUser with token",token);
          const resp = await fetch(`${url}/addUser?userName=${userName}&expoPushToken=${token}`,  {
            method: 'POST',      
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userName: userName,
                expoPushToken: token
              }),

          });
    

            //const data = await resp;    
            console.log("addUser function response:",resp.json());

            //on success, show message and close modal
            setUserMessage(" Username i juaj u ruajt me sukses.");
            setLocalUsername("username", userName);
            setMyUserName(userName);

            //setLocalExpoToken("expoToken",expoToken);
            //diable save button and textinput
            //setUserName("");
            //setSaveButtonDisabled(true);
            setShowForm(false);


        }
        catch(e)
        {
          console.log(e);
        }
    
      }

// write a function getUserId to call api to return the userId  with given username,
// if username exists, then return the userId



async function getUserId(username) {
  try {

    console.log("getUserId with username",username);

    // Replace 'API_ENDPOINT' with the actual endpoint URL for checking usernames
    const response = await fetch(`${url}/getUserId?userName=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    console.log("found userid ---", data[0]?.userId) 
    
    // Assuming the API returns an array and the first object contains the userId if found
    if (data.length > 0 && data[0].userId) {
      console.log("found userId::::", data[0]?.userId)  ;


      // HOW TO parse to string data[0].userId VALUE






      setUserId(data[0].userId);
      await setLocalUserId("userId", data[0].userId.toString());

      console.log("setLocalUserId init:",data[0].userId);

      return data[0].userId; // Return the found userId
    } else {
      console.log("userId not found");
      return null; // Username does not exist
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}



    async function checkIfUserNameExists(userName) {
        try
        {

          console.log("checkIfUserNameExists with username",userName);

          const resp = await fetch(`${url}/checkIfUserNameExists?userName=${userName}`,  {
            method: 'GET',       
            headers: {"Content-Type": "application/json"}
          });
    
            const data = await resp.json();  
            console.log("checkIfUserNameExists data",data);  
            console.log("checkIfUserNameExists length",data.length);

            if (data.length == 0) {
                //const found = data[0].found;
                console.log("Not found username:");
                // You can now use the 'found' variable as needed

                await addUser(userName, expoToken);

                console.log("calling addUser with tokennnnnnn",userName,expoToken);

                await getUserId(userName);
      
            } else {
              //Alert.alert("Username jo-valid", "Username eshte i zene, zgjidhni nje tjeter.");
              const found = data[0].found;
              console.log("found taken userId:",found);
              setUserId(found);
              setUserMessage("Username eshte i zene, zgjidhni nje tjeter.");       
          }       
  
        }
        catch(e)
        {
          console.log(e);
        }
    
      }

    

    const validateUserName = () => {
        const isValidLength = userName.length >= 4 && userName.length <= 10;
        const isAlphanumeric = /^[0-9a-zA-Z]+$/.test(userName);
    
        if (isValidLength && isAlphanumeric) {
            checkIfUserNameExists(userName); // Assuming onSubmit handles the valid userName

            //console.log("Username valid");
        } else {
          //Alert.alert("Username jo-valid", "Username duhet te jete me gjates 4-10 karaktere dhe alphanumerik.");
          setUserMessage("Username jo-valid, Username duhet te jete me gjates 4-10 karaktere dhe alphanumerik.");
        }
      };
    

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} >
      <View style={styles2.modalContent}>
        <View style={styles2.titleContainer}>
          <Text style={styles2.title}>Zgjidh emrin e perdoruesit</Text>
          <Pressable onPress={onCloseModal}>
          <Text style={styles2.title}>Mbyll X</Text>
          </Pressable>
        </View>


        <View style={{padding: 5,  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}> 
                <Text>{userMessage}</Text>
        </View>        

        {showForm && 
            <View id="userForm" style={{padding: 10,  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}> 

                    
                    <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '50%', padding: 5 }}
                    
                    onChangeText={setUserName}
                    value={userName}
                    placeholder=""
                    /> 
                    <Button title="Save" onPress={validateUserName}  />      
        
            </View>
        }

      </View>
    </Modal>
  );

  

}

const styles2 = StyleSheet.create({
    modalContent: {
      height: '25%',
      width: '100%',
      backgroundColor: 'white',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },
    titleContainer: {
      height: '16%',
      backgroundColor: '#464C55',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: '#fff',
      fontSize: 16,
    },
  });