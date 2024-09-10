import React, { useEffect, useMemo, useState} from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import Toast from 'react-native-root-toast';
import useStore from './useStore';

export default function Settings() {


  const { admin , myUserName, url} = useStore();
  const [selectedId, setSelectedId] = useState(null);
  const [newSelectedId, setNewSelectedId] = useState(null);

  const radioButtons = [
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Nje here ne dite',
        value: 'option1',
        labelStyle: styles.label,
        containerStyle: styles.radioContainer,
    },
    {
        id: '2',
        label: 'Nje here ne jave',
        value: 'option2',
        labelStyle: styles.label,
        containerStyle: styles.radioContainer,
    },
    {
      id: '3',
      label: 'Nje here ne muaj',
      value: 'option3',
      labelStyle: styles.label,
      containerStyle: styles.radioContainer,
  },
  {
    id: '4',
    label: 'Nje here ne vit',
    value: 'option4',
    labelStyle: styles.label,
    containerStyle: styles.radioContainer,
},
{
  id: '0',
  label: 'Mos me notifiko',
  value: 'option0',
  labelStyle: styles.label,
  containerStyle: styles.radioContainer,
}
];


  useEffect(() => {
    // call getUserNotificationLevel and set the selectedId from the response
    getUserNotificationLevel(admin);
  }, []);


  useEffect(() => {

/*
        const selectedIdInt = parseInt(selectedId);

        if(selectedIdInt >= 0 && selectedId != null)
          {
            updateUserNotificationLevel(selectedId);
          }
*/

    //updateUserNotificationLevel(selectedId);
      console.log('new SelectedId:', selectedId);
    }, [selectedId]);






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

  async function getUserNotificationLevel(userId) {

    try
    {

      const resp = await fetch(`${url}/getUserNotificationLevel?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();
    console.log('getUserNotificationLevel:', data);

    if(data.length == 0)
    {
      showToast(`Nuk ka te dhena per kete user`);
      return;
    }
    else if(data.length > 0)
    {
  

      console.log('getUserNotificationLevel ID:', data[0].notificationLevel);
      setSelectedId(data[0].notificationLevel.toString());
      //setExtraData(extraData + 1);
      return;         
    }  
  

    }
    catch(e)
    {
      console.log(e);

    }

    //return data;

  }


  async function updateUserNotificationLevel(notificationId) {

    //console.log("addFav:" + userId + "-" + productId);
  

    const data = new URLSearchParams();
    data.append('userId', admin);
    data.append('notificationId', notificationId);

    console.log("data updateUserNotificationLevel:" + data);

    try{
      const resp = await fetch(`${url}/updateUserNotificationLevel`,  {
      method: 'PUT',
      
      body: JSON.stringify({
        userId: admin,
        notificationId: notificationId
      }),
      headers: {"Content-Type": "application/json"}
    });

    //setSelectedId(notificationId);
    showToast(`Preferencat tuaja u ndryshuan me sukses.`);

    }
    catch(e)
    {
      console.log(e);
    }

  }


  const handleSelectedId = (event) => {



    console.log("event:",event);
    //console.log('selectedId::::', selectedId);
    setSelectedId(event);
    //console.log(' new selectedId:::::', selectedId);
    updateUserNotificationLevel(event);
  }

  
// how to get the press event from line   onPress={()=>handleSelectedId()} 

  //write code











    return (
    <SafeAreaView style={styles.container}>

<View style={{ padding: 5, flexDirection: 'col', position: 'relative', justifyContent: 'space-between' }}>
<View>
        <Text style={{ fontSize: 15, fontWeight: 'bold'}}>
          Username: {myUserName}
        </Text>
          
      </View>
      <View>
        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'top' }}>
          Zgjidhni sa shpesh doni te pranoni notifikimet
        </Text>
          
      </View>
        <View style={{alignItems: 'flex-start'
        }}>

        
        
          <RadioGroup 
              radioButtons={radioButtons} 
              onPress={(id)=>handleSelectedId(id)}  
              selectedId={selectedId}

          />      
        </View>
      </View>
      
      </SafeAreaView>
    );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    marginTop: 50,
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioContainer: {
    marginTop: 40,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});