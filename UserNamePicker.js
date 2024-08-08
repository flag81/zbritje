import { Modal, View, Text, TextInput, Pressable, StyleSheet, Button, Alert, Input } from 'react-native';
import React, { useState, useEffect , useCallback } from 'react';



import * as SecureStore from 'expo-secure-store';
import useStore from './useStore';



export default function UserNamePicker({ isVisible, onClose }) {

    const [userName, setUserName] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const { myUserName, setMyUserName } = useStore();
    
  const url = 'http://10.12.13.197:8800';



  async function setLocalUsername(key, value) {
    await SecureStore.setItemAsync(key, value);
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



    async function addUser(userName) {
        try
        {
          const resp = await fetch(`${url}/addUser?userName=${userName}`,  {
            method: 'POST',      
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userName: userName,
              }),

          });
    



            //const data = await resp;    
            console.log("addUser:",resp.json())  ;

            //on success, show message and close modal
            setUserMessage(" Username i juaj u ruajt me sukses.");

            setLocalUsername("username", userName);

            setMyUserName(userName);

            //diable save button and textinput
            setUserName("");
            //setSaveButtonDisabled(true);
            setShowForm(false);


        }
        catch(e)
        {
          console.log(e);
        }
    
      }




    async function checkIfUserNameExists(userName) {
        try
        {
          const resp = await fetch(`${url}/checkIfUserNameExists?userName=${userName}`,  {
            method: 'GET',       
            headers: {"Content-Type": "application/json"}
          });
    
            const data = await resp.json();    
            console.log("checkIfUserNameExists",data);

            if (data.length > 0) {
                const found = data[0].found;
                console.log("Found:", found);
                // You can now use the 'found' variable as needed

                if(found == 0) {
                    //onSubmit();
                    (async() => await addUser(userName))();
                } else {
                    //Alert.alert("Username jo-valid", "Username eshte i zene, zgjidhni nje tjeter."); 
                    setUserMessage("Username eshte i zene, zgjidhni nje tjeter.");       
                }       
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