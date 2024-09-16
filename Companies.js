import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import BottomSheet ,{BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { MasonryFlashList } from "@shopify/flash-list";
import useStore from './useStore';
import React, { useState, useEffect , useRef, useMemo, useCallback } from 'react';
import { View,Text,Button, TouchableOpacity,Image,StyleSheet,SafeAreaView,ScrollView,RefreshControl,Dimensions


} from 'react-native';



import {PermissionsAndroid} from 'react-native';
import {QueryClient} from '@tanstack/react-query'
// debounce the sendQuery function

import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-root-toast';


const queryClient = new QueryClient();

const Companies = () => {


    const [allStores, setAllStores] = useState([]);
    const [favoriteStores, setFavoriteStores] = useState(null);

    const [saleData, setSaleData] = useState([]);

    const [favoritesData, setFavoritesData] = useState([]);
    const [extraData, setExtraData] = useState(0);


    const { myUserName, setMyUserName } = useStore();


    async function getLocalUsername(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        //alert("🔐 Here's your value 🔐 \n" + result);
        return result;
    } else {
        //alert('No values stored under that key.');
        return false;
    }
    }


    const url = 'http://10.12.13.197:8800';
    const admin = 1 ;

    const prefetchAllStores = async (admin) => {
        // The results of this query will be cached like a normal query
        await queryClient.prefetchQuery({
        queryKey: ['getAllStores'],
        queryFn: getAllStores,
        })
    }




    useEffect(() => {

            setAllStores([]);
            setFavoriteStores([]);

            //getData(admin);
            getAllStores(admin);
            getUserFavoriteStores(admin);
            //getCategories(admin);


            
            console.log("*************************************************************************************************")
            //filterSaleData();

    }, []);


  useEffect(() => {
    //console.log("favoritesData:",favoritesData)
    //const favoritesOnSale = filterSaleData();
    //setExtraData(extraData + 1);

    console.log("favorites stores changed :",favoriteStores)

  }, [favoriteStores]);


  useEffect(() => {
    //console.log("favoritesData:",favoritesData)
    //const favoritesOnSale = filterSaleData();
    setExtraData(extraData + 1);

  }, [favoriteStores]);




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




  const handleAddStore = (item) => {

    const storeObject = { userId: admin, storeId: item.storeId };

    setFavoriteStores((prevData) => [...prevData, storeObject]);
    
  };




  const handleRemoveFavorites= (item) => {
    setFavoriteStores((prevFavorites) =>
      prevFavorites.filter((product) => product.storeId !== item.storeId)
    );
    
  };



  const handleStoreFavorites = (item) => {
    //setSelectedProduct(productId);

      const result =  favoriteStores.some((element) => element.storeId === item.storeId);
      //console.log(result)



      if(result)
      {
        handleRemoveFavorites(item);
        removeStoreFromFavorites(item.storeId, item.storeName);
      }
      else{
        handleAddStore(item);
        addStoreToFavorites(item.storeId, item.storeName);
      }

  };



  async function addStoreToFavorites(storeId, storeName) {


    const userId = admin;
    //console.log("addStoreFav:" + userId + "-" + productId);
  
    const data = new URLSearchParams();
    data.append('userId', admin);
    data.append('storeId', storeId);

    console.log("data:" + data);

    try{
      const resp = await fetch(`${url}/addStoreToFavorites`,  {
      method: 'POST',
      
      body: JSON.stringify({
        userId: admin,
        storeId: storeId,
      }),
      headers: {"Content-Type": "application/json"}
    });

    showToast(`Produkti ${storeName} u shtua ne te preferuarat tuaja.`);

    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function removeStoreFromFavorites(storeId, storeName) {

    //const queryParams = new URLSearchParams({ userId: userId, productId:productId });
    const userId = admin;

    console.log("removeFavorite");
    try
    {
        const resp = await fetch(`${url}/removeStoreFromFavorites/${userId}/${storeId}`,
    
        {
          method: 'DELETE',
          headers: {"Content-Type": "application/json"}
      
        }
      
        );


        const data = await resp.json();
        //console.log(data);

        showToast(`Marketi ${storeName} u largua nga te preferuarat tuaja.`);

        }
          catch(e)
        {
          //console.log(e);

        }

  }


 

  async function getAllStores(userId) {

    try
    {
      const resp = await fetch(`${url}/getAllStores?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

        const data = await resp.json();
        console.log("all stores ----------------",data);
        setAllStores(data);
        return data;

    }
    catch(e)
    {
      console.log(e);
    }

  }

  async function getUserFavoriteStores(userId) {

    try
    {
      const resp = await fetch(`${url}/getUserFavoriteStores?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


        const data = await resp.json();
        console.log("fav user stores----------------",data);
        setFavoriteStores(data);
        return data;

    }
    catch(e)
    {
      console.log(e);
    }

  }




  const renderItem = ({ item }) => 
  {


      const imageUrl = {uri:`${url}/images/${item.storeLogo}`};
      //const favoriteProduct = favoritesData.some((obj) => obj.productId === item.productId);
      
      //const favoriteStoresCount = favoriteStores.length;

      console.log("favoriteStores length:", favoriteStores.length);


      let favoriteUserStore = false;


      favoriteUserStore = favoriteStores.some((obj) => obj.storeId === item.storeId);
      console.log("favoriteStore:",favoriteUserStore, item.storeId);


      const storeId = item.storeId;


  return (
    <TouchableOpacity >
      <View 
      style={{ padding: 5, borderColor: 'gray', 
      borderWidth:0, borderRadius:15, backgroundColor:'white', margin:5, height:150}}>
        
        <View style={{ padding: 5, flexDirection: 'row', position: 'relative', justifyContent: 'space-between', alignItems: 'center' }}>

        <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
        <View style={{ flexDirection: 'row' , alignItems: 'center'}}>

            <View style={{ zIndex: 1 }}><TouchableOpacity>
                <Image id="storeImage" source={imageUrl} style={styles.image} />
                </TouchableOpacity>
            </View>
            

        </View>
        </View>

            <View style={{ flexDirection: 'col',  alignItems: 'center'}}>


              <TouchableOpacity onPress={() => handleStoreFavorites(item)}>
            <Image id="favoriteImage"
                  source={
                    favoriteUserStore ? require('./star.png') : require('./white-star.png')
                  }
                  style={styles.star} />
          </TouchableOpacity>
            </View>
        
          </View>

        <View style={{ flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}>

        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.storeName}</Text>


      </View>

      </View>
    </TouchableOpacity>
  )

};




return (

<SafeAreaView style={styles.container}>

<View style={{ padding: 10, flexDirection:'col'}}>
   <View>
      <Text>Username: {myUserName}</Text>
    </View>

      <View style={{ flex:1, width: Dimensions.get("window").width * 0.95}}>

          <MasonryFlashList
            data={allStores}
            numColumns={2}
            renderItem={renderItem}
            estimatedItemSize={20}
            contentContainerStyle={{padding: 5}}
            extraData={extraData}
            showsVerticalScrollIndicator={false}
            marginBottom={60}
            
          />


      </View>
  </View>

  </SafeAreaView>


  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
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
    width: 70,
    height: 70,
    marginRight: 5,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 5,
    marginTop: 5,
  },
  star: {
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 5,
   
  }


});

export default Companies;