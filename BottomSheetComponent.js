import React, { useState, useEffect } from 'react';
import { BottomSheet, Button, ListItem   } from '@rneui/themed';
import { StyleSheet, ActivityIndicator, View, Text , Image} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';



const BottomSheetComponent = ({isVisible, handleBottomSheet, currentItem}) => {

//const [isVisible, setIsVisible] = useState(false);
//const productName = currentItem.productName

let myid = 0;
let productName = '';
const BASE_URI = 'http://10.12.13.197:8800/images/';


try {

    console.log("current-str",typeof currentItem);
    currentItem = JSON.parse(currentItem);
    console.log("id", currentItem["id"])

    const id = currentItem["id"];
    productName = currentItem["productName"];
    productPic = currentItem["productPic"];
    myid = id

} catch (e) {
    //return false;
    
}


const list = [
  { title: productName ,
    image: BASE_URI 

},
  {
    title: 'Mbyll',
    containerStyle: { backgroundColor: 'red' },
    titleStyle: { color: 'white' },
    onPress: () => handleBottomSheet() ,
  },
];





useEffect(() => {

    //setSelected([]);
    //sendFilteredCategories();

    //console.log(currentItem)

  }, [isVisible]);




//console.log(">",isVisible);


return (
  <SafeAreaProvider>

    <BottomSheet modalProps={{}} isVisible={isVisible}>

    <View style={{ width: '100%',  flexDirection: 'row', backgroundColor: 'white'}}>
    <Image style={{height: 100, width: 100}}
            source={{ uri:BASE_URI + productPic}}
            
          />
          <Text>{productName}</Text>
    
  </View>
       
      {
      list.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={l.containerStyle}
          onPress={l.onPress}
        >
          <ListItem.Content>
          <Image
            source={{ uri:l.image }}
            
          />
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>


          </ListItem.Content>
        </ListItem>
      ))}

<View >

  </View>
    </BottomSheet>
  </SafeAreaProvider>
);
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 50,
    },
    listContainer: {
      flex: 1,
    },
    listTitle: {
      fontSize: 28,
      textAlign: 'center',
      marginBottom: 10,
    },
  
    item: {
      flexDirection: 'row',
      backgroundColor: '#f9c2ff',
      padding: 5,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    selectedItem: {
      backgroundColor: '#e1f1fd',
    },
    title: {
      fontSize: 20,
    },
    image: {
      width: 40,
      height: 40,
      marginRight: 8,
    },
  });

export default BottomSheetComponent;