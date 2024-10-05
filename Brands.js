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
import StoreModal from './StoreModal';



const queryClient = new QueryClient();

const Brands = () => {

  const { admin , myUserName, url} = useStore();



    const [allBrands, setAllBrands] = useState([]);
    const [favoriteBrands, setFavoriteBrands] = useState(null);

    const [brandData, setBrandData] = useState([]);

    const [favoritesData, setFavoritesData] = useState([]);
    const [extraData, setExtraData] = useState(0);

    const [isModalVisible, setIsModalVisible] = useState(false);
    // ...rest of the code remains same
  
    const onModalOpen = (item) => {
      // setProductData([]);

      console.log("item:------------------------",item);
      setBrandData([item]);
      setIsModalVisible(true);
    };
  
    const onModalClose = () => {
      setIsModalVisible(false);
    };


    const prefetchAllStores = async (admin) => {
        // The results of this query will be cached like a normal query
        await queryClient.prefetchQuery({
        queryKey: ['getAllBrands'],
        queryFn: getAllBrands,
        })
    }

    useEffect(() => {




            setAllBrands([]);
            //setAllBrands([]);

            setFavoriteBrands([]);
            //getData(admin);
            //getAllStores(admin);
            getAllBrands(admin);
            //getUserFavoriteStores(admin);
            //getCategories(admin);
            console.log(" brands start *****************************")
            //filterSaleData();

    }, []);

  useEffect(() => {
    //console.log("favoritesData:",favoritesData)
    //const favoritesOnSale = filterSaleData();
    console.log("favorites stores changed :",favoriteBrands)
    setExtraData(extraData + 1);
    //getAllStores(admin);

  }, [favoriteBrands]);




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




  const handleAddBrand = (item) => {

    const brandObject = { userId: admin, brandId: item.brandId };

    setFavoriteBrands((prevData) => [...prevData, brandObject]);
    
  };




  const handleRemoveFavorites= (item) => {
    setFavoriteBrands((prevFavorites) =>
      prevFavorites.filter((product) => product.brandId !== item.brandsId)
    );
    
  };


  async function handleBrandFavorites2(item) {
    const result = await isBrandFavorite(admin, item.BrandId);

    console.log("cnt", result[0].cnt)


    const cnt = result[0].cnt;

    if (result) {
      if(cnt > 0 )
        {
          handleRemoveFavorites(item);
          await removeBrandFromFavorites(item.brandId, item.brandName);
          console.log("-----removing brand.....", result);

          await getAllBrands(admin);

        }
        else if(cnt == 0)
          {

            handleAddBrand(item);
            await addBrandToFavorites(item.brandId, item.brandName);
            console.log("-----adding brand.....", result);
            await getAllBrands(admin);

          }

    } else{

    }
  }


  const handleBrandFavorites = (item) => {
    //setSelectedProduct(productId);

      const result =  favoriteBrands.some((element) => element.brandId === item.brandId);
      //console.log(result)

      if(result)
      {
        handleRemoveFavorites(item);
        removeBrandFromFavorites(item.brandId, item.brandName);

        console.log("removing store.....");
      }
      else{
        handleAddBrand(item);
  
      // getAllFavoriteStores

      

        addBrandToFavorites(item.brandId, item.brandName);
        console.log("adding brand.....");
      }

  };



  async function addBrandToFavorites(storeId, storeName) {


    const userId = admin;
    //console.log("addStoreFav:" + userId + "-" + productId);
  
    const data = new URLSearchParams();
    data.append('userId', admin);
    data.append('storeId', storeId);

    console.log("data:" + data);

    try{
      const resp = await fetch(`${url}/addBrandToFavorites`,  {
      method: 'POST',
      
      body: JSON.stringify({
        userId: admin,
        storeId: storeId,
      }),
      headers: {"Content-Type": "application/json"}
    });

    showToast(`Brendi ${brandName} u shtua ne te preferuarat tuaja.`);

    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function removeBrandFromFavorites(storeId, storeName) {

    //const queryParams = new URLSearchParams({ userId: userId, productId:productId });
    const userId = admin;

    console.log("removeFavorite");
    try
    {
        const resp = await fetch(`${url}/removeBrandFromFavorites/${userId}/${storeId}`,
    
        {
          method: 'DELETE',
          headers: {"Content-Type": "application/json"}
      
        }
      
        );


        const data = await resp.json();
        //console.log(data);

        showToast(`Brendi ${brandName} u largua nga te preferuarat tuaja.`);

        }
          catch(e)
        {
          //console.log(e);

        }

  }


  async function isBrandFavorite(userId,brandId) {

    try
    {
      const resp = await fetch(`${url}/isBrandFavorite?userId=${userId}&brandId=${brandId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

        const data = await resp.json();
        console.log("is brand favorite  ----------------",data);
        setAllStores(data);
        return data;
    }
    catch(e)
    {
      console.log(e);
    }

  }




  async function getAllBrands(userId) {

    try
    {
      const resp = await fetch(`${url}/getAllBrands?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

        const data = await resp.json();
        console.log("all brands ----------------",data);
        setAllBrands(data);
        return data;
    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function getUserFavoriteBrands(userId) {

    try
    {
      const resp = await fetch(`${url}/getUserFavoriteBrands?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


        const data = await resp.json();
        console.log("fav user brands----------------",data);
        setFavoriteBrands(data);
        return data;

    }
    catch(e)
    {
      console.log(e);
    }

  }




  const renderBrandItem = ({ item }) => 
    {
  
        const imageUrl = {uri:item?.brandLogoUrl};

        const storeId = item?.brandId;
  
  
    return (
      <ScrollView >
        <View 
        style={{ padding: 5, borderColor: 'gray', 
        borderWidth:0, borderRadius:15, backgroundColor:'white', margin:5, height:150}}>
          
          <View style={{ padding: 5, flexDirection: 'row', position: 'relative', justifyContent: 'space-between', alignItems: 'center' }}>
  
          <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
          <View style={{ flexDirection: 'row' , alignItems: 'center'}}>
  
              <View style={{ zIndex: 1 }}><TouchableOpacity>
                {imageUrl ? <Image id="brandImage" source={imageUrl} style={styles.image} /> : null }
                
                  </TouchableOpacity>
              </View>
              
  
          </View>
          </View>
  
              <View style={{ flexDirection: 'col',  alignItems: 'center'}}>

                <TouchableOpacity onPress={() => handleBrandFavorites2(item)}>
                    <Image id="favoriteImage"
                            source={
                            item?.isFavorite ? require('./star.png') : require('./white-star.png')
                            }
                            style={styles.star} />
                </TouchableOpacity>
              </View>
          
            </View>
  
          <View style={{ flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}>
  
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.brandName}</Text>
   
        </View>
  
        </View>
      </ScrollView>
    )
  
  };
  


return (

<SafeAreaView style={styles.container}>

<View style={{ padding: 10, flexDirection:'col'}}>
   <View>
      <Text>Username: {myUserName}</Text>
    </View>

        <View style={{justifyContent: 'space-between', alignItems: 'center'}}>
            <Text>Zgjedheni te preferuarat e juaja</Text>
        </View>
            <View style={{ flex:1, width: Dimensions.get("window").width * 0.95}}>


                <MasonryFlashList
                    data={allBrands}
                    numColumns={2}
                    renderItem={renderBrandItem}
                    estimatedItemSize={20}
                    contentContainerStyle={{padding: 5}}
                    showsVerticalScrollIndicator={false}
                    marginBottom={60}
                    
                /> 


                <View>
                    <StoreModal isVisible={isModalVisible} onClose={onModalClose} storeDataPassed={brandData}>
                    {/* Details Screen */}
                    </StoreModal>
                </View>


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

export default Brands;