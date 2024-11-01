import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';

export const showToast = (message) => {
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




export async function getLocalExpoToken(key) {
    const result = await SecureStore.getItemAsync('expoPushToken');
  
    return result;
    //console.log("result token------:",result);
  };

 export async function setLocalExpoToken(key, value) {
    await SecureStore.setItemAsync(key, value);
  }


export async function getLocalUsername(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      //alert("🔐 Here's your value 🔐 \n" + result);
      return result;
    } else {
      //alert('No values stored under that key.');
      return false;
    }
  };


export function isValidExpoPushToken(token) {
    return token?.startsWith('ExponentPushToken[') && token?.endsWith(']');
  }




export async function updateExpoPushNotificationToken(url , userId, token) {

    console.log("updateExpoPushNotificationToken sent----------------------------",userId,token);

   

    try
    {
      const resp = await fetch(`${url}/updateExpoPushNotificationToken?userId=${userId}&expoPushToken=${token}`,  {
        method: 'PUT',    
        body: JSON.stringify({
          userId: userId,
          expoPushToken: token
        }),   
        headers: {"Content-Type": "application/json"}
      });

      console.log("updateExpoPushNotificationToken added token succesfully----------------------------");
        
    }
    catch(e)
    {
      console.log("updateExpoPushNotificationToken  ERROR:", e);
    }

  };