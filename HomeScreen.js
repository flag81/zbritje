/*

this file is the main file for the home screen, it contains the main logic for the home screen
it contains a search component that searches for products by name and displays the results in a list. 
it contains a filters for items on sale ans favorites selected by the user
it contains filters for  categories and subcategories
it contaisn a flashlist component that displays the products in a masonry layout
it contains a bottomsheet component that displays the product details when a product is clicked
the users can add products to their favorites by clicking the star icon on the product
the users can remove products from their favorites by clicking the star icon on the product
the users can click on product to view the product details in a bottomsheet
the api endpoints are located in the ./server/server.js file on the node server with express

*/


import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import BottomSheet ,{BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Banner from './Banner';
import { MasonryFlashList, useFlatListBenchmark } from "@shopify/flash-list";
import ProductCategories from './ProductCategories';
import EmojiPicker from "./EmojiPicker";
import * as Device from 'expo-device';
import useStore from './useStore';
//import {*} from './apiUtils';
import {updateExpoPushNotificationToken, getPercentageChange}  from './apiUtils';
import React, { useState, useEffect , useRef, useCallback } from 'react';
import { View,Text, TouchableOpacity,Image, ImageBackground, StyleSheet,SafeAreaView,RefreshControl,Dimensions,
   ActivityIndicator, KeyboardAvoidingView, Platform


} from 'react-native';


import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {QueryClient, useInfiniteQuery, useQuery} from '@tanstack/react-query'
// debounce the sendQuery function

import * as SecureStore from 'expo-secure-store';
import UserNamePicker from './UserNamePicker'; // 
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Toast from 'react-native-root-toast';
import StoreFilter from './StoreFilter';
import SearchComponent from './SearchComponent';
import { textSpanContainsPosition } from 'typescript';




//import useFetchData from './useFetchData';

const queryClient = new QueryClient();



const HomeScreen = () => {

  //console.log("EEEEEEEEEEENNNNNNNNNNNNNTTTTTTTTTTTTTTTEEEEEEEEEEEEERRRRRRRRRRRRRR11111111111111111");

  const renderCount = useRef(0);

  // Log render count
  useEffect(() => {
    renderCount.current += 1;
    console.log(`HomeScreen component has rendered ${renderCount.current} times`);
  });


  const [allProducts, setAllProducts] = useState([]);
  const [listLength, setListLength] = useState(0);

  const [authToken, setAuthToken] = useState();

  const [originalData, setOriginalData] = useState([]);
  const [originalDataBackup, setOriginalDataBackup] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredDataFinal, setFilteredFinal] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  const [saleProductsData, setSaleProductsData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const sheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(true);
  const [productSheet, setProductSheet] = useState();
  const [extraData, setExtraData] = useState(0);
  const [prefetchedProductsData, setPrefetchedProductsData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [storedUserName, setStoredUserName] = useState("");
  const [showUserNamePicker, setShowUserNamePicker] = useState(false);



  const { myUserName, setMyUserName, storeId, onSale, categoryId, 
    subCategoryId, isFavorite, searchText ,setSearchText, admin,  setAdmin , url, 
    myUserId, setMyUserId, expoToken, setExpoToken, localStoreExpoToken, serverError, setServerError,
    setStoreId, setOnSale, setCategoryId, setSubCategoryId, setIsFavorite, categoryName, storeName
  
  
  } = useStore();

    

const [isConditionMet, setIsConditionMet] = useState(false);

async function setLocalUsername(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const storeToken = async (token) => {
  await SecureStore.setItemAsync('userToken', token);
};


const getLocalToken = async () => {
  const result = await SecureStore.getItemAsync('expoPushToken');

  return result;
  //console.log("result token------:",result);
};




async function getLocalUsername(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    //alert("🔐 Here's your value 🔐 \n" + result);
    return result;
  } else {
    //alert('No values stored under that key.');
    return false;
  }
};


 //console.log("myUserId:::::::::",myUserId);


  const handleBottomSheet = (data, item) => {

    console.log("---",data);
    setIsVisible(data);
    setCurrentItem(item);
  
  };


  //const url = 'http://192.168.1.6:8801';
  //const url = 'http://10.12.13.197:8800';
  //const url = 'https://nodejs-production-18ad6.up.railway.app';
  //const admin = 1 ;

  
  const onRefresh = React.useCallback(() => {
      setRefreshing(true);      
      setSelectedData([]);
      setOriginalData([]);
      setCategories([]);
      setSubCategories([]);
      setFilteredProducts([]); 
      setSaleData([]);     
      //getFavorites(admin);

      //getData(admin,1);
      getCategories(admin);
      //getSubCategories(admin);
      //filterSaleData();
      setTimeout(() => {
      setRefreshing(false);

    }, 1000);
  }, []);


  // write code to use useInfiniteQuery from @tanstack/react-query to fetch the data from the server with paggination and infinite scroll 
  // the data should be fetched in pages of 10 items per page, the data should be fetched from the server using the getData function

  const prefetchGetData = async (admin) => {
    // The results of this query will be cached like a normal query
    await queryClient.prefetchQuery({
      queryKey: ['getData'],
      queryFn() {return getData(admin,1)},
    })
  }


  const prefetchGetFavorites = async (admin) => {
    // The results of this query will be cached like a normal query
    await queryClient.prefetchQuery({
      queryKey: ['getFavorites'],
      queryFn: getFavorites(admin),
    })
  }



  const prefetchGetCategories = async (admin) => {
    // The results of this query will be cached like a normal query
    await queryClient.prefetchQuery({
      queryKey: ['getCategories'],
      queryFn: getCategories(admin),
    })
  }


  const requestUserPermission = async() => {

    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }



  useEffect(() => {


   const returnData =  applyStoreFilters();

   setFilteredProducts(returnData); //onendreached and it fires, to prevent 

   if(categoryId == 0)
    {

      setSearchText('');

    }

  }, [storeId, onSale, categoryId, subCategoryId, isFavorite]);




  useEffect(() => {

    console.log("filteredProducts changed>>>>>:",filteredProducts?.length)
    setListLength(filteredProducts?.length);

  }, [filteredProducts]);







  useEffect(() => {

    console.log("originalData changed>>>>>:",originalData?.length)
    setListLength(filteredProducts?.length);

  }, [originalData]);

  function isValidExpoPushToken(token) {
    return token?.startsWith('ExponentPushToken[') && token?.endsWith(']');
  }

  // WRITE A FUNCTION TO UPDATE THE EXPO TOKEN IN THE DB BY USERID





useEffect(() => {


  console.log("myUserName changed:",myUserName);

 //check if myUserName is not empty , null or undefined then fetch the user data by username

 if (myUserName && myUserName.trim() !== '') {

  getUserDataByUsername(myUserName)

  // check if the returned data is not null then set the userId and expoPushToken to the store

  .then((data) => {

      if(data)
      {

        console.log("User ID from db:", data?.datauserId);
        console.log("expoPushToken db", data?.expoPushToken);
        setAdmin(data?.userId);
        setMyUserId(data?.userId);
      }
      else
      {

        console.log("User not found in the db:", data);
        // clear al the local storage and the store data
        

        if(serverError === 'Network request failed')
          {    
            console.log("Network request failed:", serverError);
          }
          else{

            setShowUserNamePicker(true);
          }    
        
       


      }



 
 
 
   
   if(!isValidExpoPushToken(data?.expoPushToken))
   {
 
     //get local expoPushToken and compare it with the one from the server
 
       getLocalToken().then((result) => {
         console.log("getLocalToken token:",result);
         //setAuthToken(result);
 
         
         if(isValidExpoPushToken(result))
         {
           setExpoToken(result);
           console.log("setExpoToken to store called with:", result);
           //console.log("useStore expoToken set:",expoPushToken);
 
               //UPDATE THE EXPO TOKEN IN THE DB WITH USERID
 
               console.log("updating expoToken in DB:",url, data?.userId, result);
 
 
               if(data?.userId && result)
                {


                    updateExpoPushNotificationToken(url, data?.userId, result)
                    .then((data) => {
                      console.log("updateExpoPushNotificationToken added token succesfully");
                    })
                    .catch((e) => {
                      console.log("updateExpoPushNotificationToken ERROR:", e);
                    });
                }
                else
                {
                  console.log("updateExpoPushNotificationToken ERROR: userId or token not valid");

                }


 
     
             //setExpoToken(expoPushToken);
             //console.log("updating expoToken in DB:",userId, expoPushToken);
             //updateExpoPushNotificationToken(userId, expoPushToken);
 
         } 
 
 
       //setExpoToken(expoPushToken);
       //console.log("useStore expoToken set:",expoPushToken);
 
     })
 
   }
   else
   {
 
   }
 
 })
 .catch(error => {
   console.error('Failed to fetch user data for myUserName change:', error);
 });


 }

}, [myUserName]);

  async function getUserDataByUsername(username) {
    try {
  
      console.log("getUserDataByUsername with username:",username);




      console.log("getUserDataByUsername url:", `${url}/getUserId?userName=${username}`);

  
      // Replace 'API_ENDPOINT' with the actual endpoint URL for checking usernames
      const response = await fetch(`${url}/getUserId?userName=${username}`,

        {

          method: 'GET',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
            Connection: 'keep-alive',
            "Cache-Control": "no-cache"
            
        }
      }


      );

     

      console.log("getUserDataByUsername response:",response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      console.log("found userid ---", data) 
      
      // Assuming the API returns an array and the first object contains the userId if found
      if (data?.length > 0 && data[0]?.userId) {
        console.log("getUserDataByUsername userId and expoPushToken from Db:", data[0]?.userId, data[0]?.expoPushToken)  ;
       // console.log("getUserDataByUsername expoPushToken from DB:",data[0]?.expoPushToken);
  
        //expoPushToken
        // HOW TO parse to string data[0].userId VALUE
  
        //setUserId(data[0].userId);
        //await setLocalUserId("userId", data[0].userId.toString());
  
        //console.log("setLocalUserId init:",data[0].userId);

        const userData = {userId: data[0]?.userId, expoPushToken: data[0]?.expoPushToken};
  
        return userData; // Return the found userId
      } else {
        console.log("userId not found");
        return null; // Username does not exist

      }
    } catch (error) {
      console.error('Error getUserDataByUsername:', error);

      if(error.message === 'Network request failed')
      {
        showToast('Kishte nje problem me lidhjen me serverin.');
        setServerError('Network request failed');
      }

      return null;
    }
  }



  const loadInitaialData = () => {
   



    const localToken = getLocalToken().then((result) => {
      console.log("result from local token:",result);
      //setAuthToken(result);

    });



    // if localToken from securestorage is null the setLocalToken with the token from the server

    if(!localToken)
    {
      storeToken(expoToken);
      console.log("localToken not found , it is set:", localToken);
    }





    const userName =  getLocalUsername('username').then((result) => {
      console.log("get local username by key username key:--------:",result);
      //setShowUserNamePicker(true);

      //result = false;






      if(!result)
      {
        console.log("storage username not found:", result);
        //poup login modal 
        setShowUserNamePicker(true);
        //setLocalUsername('setShowUserNamePicker ');

        console

      }
      else{
        setMyUserName(result);    
        console.log("result found getLocalUsername , setting setMyUserName:", result);  
      }
    });



    setSelectedData([]);
    //setOriginalData([]);
    setCategories([]);
    //setSubCategories([]);
    setFilteredProducts([]);
    setSaleData([]); 

    prefetchGetCategories(admin);
    //getSubCategories(admin);
    setIsVisible(false);
    //getProductOnSale(admin);
    //prefetchProducts(admin);
       
    console.log("*************************************************************************************************")
    //filterSaleData();

  ;}



  async function handleAuth(){
    try {
      const token = await auth();
      console.log('Authenticatin handleAuth:>>>>>>>>>>>');
      //setAuthToken(token);

      
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  
  useEffect(() => {


    //setAuthToken(token);
    // handle promise rejection
    

    //console.log("token:",token);
   
      loadInitaialData();
 

  }, []);


   async function auth()  {

    console.log("auth() with myUserName:",myUserName);
    console.log("Auth url:",`${url}/auth`);

    const resp = await fetch(`${url}/auth`,  {
      method: 'POST',       
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username: myUserName  })
    });


     // Check if the response is ok (status in the range 200-299)
  if (!resp.ok) {
    throw new Error(`Server responded with status ${resp.status}`);
  }

  // Ensure the content type of the response is application/json
  const contentType = resp.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new TypeError("Oops, we haven't got JSON!");
  }


  
    const data = await resp.json();

    //console.log("auth data:",data.token);

    setAuthToken(data.token);
    setIsConditionMet(true);

    return data.token;

  };


  useEffect(() => {
    //console.log("saleData changed>>>>>:",saleData)
    //handleFilterSale();
  }, [saleData]);



  useEffect(() => {
    //console.log("favoritesData:",favoritesData)
    const favoritesOnSale = filterSaleData();
    setExtraData(extraData + 1);

  }, [favoritesData, saleData]);


  const [uniqueId, setUniqueId] = useState('');


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





  const handleAddProduct = (item) => {
    setFavoritesData((prevProducts) => [...prevProducts, item]);
    
  };


  const handleRemoveFavorites= (item) => {
    setFavoritesData((prevFavorites) =>
      prevFavorites.filter((product) => product?.productId !== item?.productId)
    );
    
  };






  const handleMainFilters = (favoritesFilter, onSaleFilter) => {

    if(favoritesFilter)
    {

      console.log("favoritesFilter----:",favoritesFilter);
      setFilteredProducts(favoritesData); 

    }
    else if (onSaleFilter)
    {

      console.log("onSaleFilter----:",onSaleFilter);
      console.log("saleData>>>>>>>>>>:",saleData);
      //filterSaleData();
      setFilteredProducts(saleData); 

    }
    else
    {
      setFilteredProducts(originalData);
    }

  }









  
//write function to filter the to match the sale data with the favorites data
  const filterSaleData = () => {

    const filteredSaleData = saleData?.filter(item => favoritesData?.some(obj => obj?.productId === item?.productId));
    console.log("filteredFavoritesDataOnSale",filteredSaleData);
    //setFilteredProducts(filteredSaleData);

  }


  const handleFilters = (categoryFilters, subFilters) => {
    // Handle the data received from the child component

      console.log("categoryFilters:",categoryFilters); 
      console.log("subFilters:",subFilters); 

        
      const filteredData = categoryFilters?.length > 0
      ? originalData?.filter(item => categoryFilters.includes(item?.categoryId))
      : originalData;


      console.log("filteredData:",filteredData);

      const filteredSubData = subFilters.length > 0
      ? filteredData.filter(item => subFilters.includes(item?.subCategoryId))
      : filteredData;

      console.log("filteredSubData:",filteredSubData);

      const finalProductList = sortProducts(filteredSubData, favoritesData);

      console.log("finalProductList:",finalProductList);
      setFilteredProducts(finalProductList);

  };





  function applyStoreFilters() {
    
    //write code here

    console.log("Store filters changed to storeId:",storeId);
    console.log("Store filters changed to onSale:",onSale);

    let filteredProducts = allProducts?.filter(product => {
        return (subCategoryId === 0 || product?.subCategoryId == subCategoryId) &&
            (categoryId === 0 || product?.categoryId == categoryId) &&
            (storeId === 0 || product?.storeId === storeId) &&
            (!isFavorite || product?.isFavorite) &&
            (!onSale || product?.onSale);
    });
    return filteredProducts;
}





// sort the products based on the favorite products moved on top of the array
  const sortProducts = (firstArray, secondArray) => {

    const sortedProductsArray = firstArray?.sort((a, b) => {
      const aIsMatch = secondArray?.some(obj => obj.productId === a.productId);
      const bIsMatch = secondArray?.some(obj => obj.productId === b.productId);
    
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;

    });

    return sortedProductsArray;

  }



  async function addFavorite(userId, productId, productName) {

    console.log("addFavorite function:",userId, productId, productName);
  
    const data = new URLSearchParams();
    data.append('userId', userId);
    data.append('productId', productId);





    console.log("data:" + data);

    try{
      const resp = await fetch(`${url}/addFavorite`,  {
      method: 'POST',
      
      body: JSON.stringify({
        userId: userId,
        productId: productId
      }),
      headers: {"Content-Type": "application/json"}
    });

    showToast(`Produkti ${productName} u shtua ne te preferuarat tuaja.`);

    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function removeFavorite(userId, productId, productName) {

    //const queryParams = new URLSearchParams({ userId: userId, productId:productId });
    console.log("removeFavorite function:", userId, productId, productName);
    try
    {
        const resp = await fetch(`${url}/removeFavorite/${userId}/${productId}`,
    
        {
          method: 'DELETE',
          headers: {"Content-Type": "application/json"}
      
        }
      
        );


        const data = await resp.json();
        //console.log(data);

        showToast(`Produkti ${productName} u largua nga te preferuarat tuaja.`);

        }
          catch(e)
        {
          //console.log(e);

        }


  }




  function addIsFavoriteKey(allProducts, favorites) {
    //write code here

    let newProducts = allProducts?.map(product => {
        let isFavorite = favorites?.some(favorite => favorite?.productId === product?.productId);
        let isOnSale = new Date() >= new Date(product?.saleStartDate) && new Date() <= new Date(product?.saleEndDate);
        return {...product, isFavorite, isOnSale};
    });
    return newProducts;
}
/*


  const {data, isLoading, refetch, hasNextPage, fetchNextPage, allPages } =

useInfiniteQuery({
    queryKey: ["getData"],
    queryFn: getData,
    getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    }
  });

*/



// how to trigger useinfinitequery 
// how to trigger useinfinitequery






//const userId = user?.id


const params = { admin:myUserId, storeId:storeId };



//console.log("params:",params);

//console.log("isConditionMet:",isConditionMet);


useEffect(() => {

  console.log("isConditionMet changed:",isConditionMet);

}, [isConditionMet]);


useEffect(() => {

  console.log("searchText changed:",searchText);

}, [searchText]);


useEffect(() => {

  console.log("storeId changed:",storeId);

}, [storeId]);



useEffect(() => {

  console.log("categoryId changed:",categoryId);


}, [categoryId]);

useEffect(() => {

  console.log("onSale changed:",onSale);

}, [onSale]);




const { data: user } = useQuery({
  queryKey: ['auth'],
  queryFn: auth,
});



function refreshFilters() {

  console.log("refreshFilters called");

  showToast('Duke rifreskuar...');

  setStoreId(0);
  setCategoryId(0);
  setIsFavorite(false);
  setOnSale(false);
  setSearchText('');

  

  


}


function useCustomInfiniteQuery(params) {

console.log("useCustomInfiniteQuery called with:",params);

  const {
    data,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    allPages
  } = useInfiniteQuery(
    

    {
    queryKey: ['getData', params.admin ,storeId, categoryId, searchText, isConditionMet, onSale, isFavorite],
    queryFn: ({ pageParam = 1 }) => {
      console.log('useCustomInfiniteQuery called getData with:', { admin: params.admin, pageParam, storeId, categoryId, subCategoryId, isFavorite, onSale, searchText });
      return getData(params.admin, pageParam, storeId, categoryId, subCategoryId, isFavorite, onSale, searchText);
    },
    enabled: isConditionMet && params.admin != 0 && !isLoading,


    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.length === 0) return undefined;
      return allPages.length + 1;
    },
  });

  return { data, isLoading, refetch, hasNextPage, fetchNextPage, allPages, error };
}





const { data, isLoading, refetch, hasNextPage, fetchNextPage, allPages, error } = useCustomInfiniteQuery(params);







useEffect
(() => {



  //console.log(" filtered data changed:",data?.pages?.map(page=>page).flat());
  setFilteredProducts(data?.pages?.map(page=>page).flat());
  //setOriginalData(data?.pages?.map(page=>page).flat());

  filteredProducts?.forEach(obj2 => {
    if (!allProducts?.some(obj1 => obj1?.productId === obj2?.productId)) {
      allProducts.push(obj2);
    }
  });

  console.log("allProducts:>>>>>>>>>>",allProducts.length);




}, [data]);




//console.log("dataArray:",dataArray);

  async function getData(userId,page, storeId, categoryId, subCategoryId, isFavorite, onSale, searchText) {
    try
    {

      const off = (page-1) *10 ;

      console.log("getData called with  userId and offeset:",userId, off);

      //setFilteredProducts([]);

      const resp = await fetch(`${url}/products?limit=10&userId=${userId}&offset=${page}&storeId=${storeId}&categoryId=${categoryId}&isFavorite=${isFavorite}&onSale=${onSale}&searchText=${searchText}`,  {
        method: 'GET',       
        headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${authToken}`
        }
      });







    const data = await resp.json();

    console.log(" data length and offset:",data.length, page);

    console.log(" data retured from /products api :",data);



    //console.log(data);

      setOriginalData([...data]);




      
 
    
    setOriginalDataBackup(data);

    setRefreshing(false);

    console.log("originalData in getData:",originalData.length);

    return data;
  



    }
    catch(e)
    {
      console.log(e);

    }

  }


  

  async function getCategories(userId) {

    try
    {

      const resp = await fetch(`${url}/getCategories?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();

    //console.log("categories----------------",data);
    setCategories(data);

    return data;

    }
    catch(e)
    {
      console.log(e);
    }

  }


  

  
  async function getSubCategories(userId) {

    try
    {

      const resp = await fetch(`${url}/getSubCategories?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();

    //console.log("Subcategories----------------",data);
    setSubCategories(data);

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
    //setFavoritesData(data)
    // handleFilterSale();
        
    }
    catch(e)
    {
      console.log(e);
    }

  }

  async function getFavorites(userId) {

    try
    {

      //const responses = await Promise.all([fetch(url1), fetch(url2)])

      const resp = await fetch(`${url}/getFavorites?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


    const data = await resp.json();

    //console.log("FAVO----------------------------",data);
    setFavoritesData(data)

   // handleFilterSale();
   //if favorites data is empty then 

   return data;
        
    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function prefetchProducts(userId) {

    try
    {
      const resp = await fetch(`${url}/prefetchProducts?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

      const data = await resp.json();

      //console.log("prefetchProducts data ------------------------------------------------:",data);
      //console.log(data);
      setPrefetchedProductsData(data);

    }
    catch(e)
    {
      console.log(e);
    }

  }




  async function getProductsByIds(userId, productIds) {

    try
    {
      const resp = await fetch(`${url}/getProductsByIds?userId=${userId}&ids=${productIds}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

      const data = await resp.json();
      
      //console.log("getProductsByIds data ------------------------------------------------:",data);
      //console.log(data); 
      //setPrefetchedProductsData(data);
      setFilteredProducts(data);

    }
    catch(e)
    {
      console.log(e);
    }

  }



  async function getProductOnSale(userId) {

    try
    {

      const resp = await fetch(`${url}/getProductOnSale?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

      const data = await resp.json();

      //console.log("saleData fetch ------------------------------------------------:",data);
      //console.log(data);
      setSaleData(data)

    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function getProductOnSaleByTag(userId) {

    try
    {

      const resp = await fetch(`${url}/getProductOnSaleByTag?tag=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

      const data = await resp.json();

      console.log("getProductOnSaleByTag fetch ------------------------------------------------:",data);
      //console.log(data);
      setSaleData(data)

    }
    catch(e)
    {
      console.log(e);
    }

  }



  const [isModalVisible, setIsModalVisible] = useState(false);
  // ...rest of the code remains same

  const onModalOpen = (item) => {
    // setProductData([]);

    console.log("onModalOpen called with item array:",item);
    setProductData([item]);
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };








const [selectedItem, setSelectedItem] = useState(null);
const [suggestionsList, setSuggestionsList] = useState(null)

useEffect(() => {
  console.log("selectedItem changed-------:", selectedItem)
}, [selectedItem]);


useEffect(() => {
  console.log("suggestionList changed-------:", suggestionsList)
}, [suggestionsList]);





useEffect(() => {
  console.log("searchText changed-------:", searchText)
}, [searchText]);

useEffect(() => {
  //console.log("prefetchedProductsData changed-------:", prefetchedProductsData)
}, [prefetchedProductsData]);

useEffect(() => {
  //console.log("filteredProducts changed-------:", filteredProducts)
}, [filteredProducts]);



const getSuggestions = (q) => {
  const filterToken = q.toLowerCase()
  console.log('getSuggestions', q)
  if (typeof q !== 'string' || q.length < 3) {
    setSuggestionsList(null)
    return
  }
  //setLoading(true)
  //const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  const items = prefetchedProductsData;

  console.log("prefetchedProductsData::::::::::",prefetchedProductsData);




  const suggestions = prefetchedProductsData
    .filter(item => item.title.toLowerCase().includes(filterToken))
    .map(item => ({
      id: item.id,
      title: item.title,
    }))
  setSuggestionsList(suggestions)
  //setLoading(false)
  }



  const onSelectItemSearch = (productId) => {
    console.log("productId:",productId);
    // write the code to extract the id from suggestionsList array into an new array of ids

  


      if(productId)
      {
        const productSearchById = getProductsByIds(admin, productId);
      }
  
    //console.log("productListSearch:",productListSearch);
  
  }







const onSubmitSearch = (searchText) => {
  console.log("onSubmitSearch searchText:",searchText);
  // write the code to extract the id from suggestionsList array into an new array of ids

  //
  if(searchText?.length >  2) setSearchText(searchText);


  //console.log("searchText length:",searchText.length);

    if(suggestionsList)
    {

    }

}



const onClearPress = useCallback(() => {
  setSuggestionsList(null);
  //setFilteredProducts(originalData);
  setSearchText('');

}, []);

//write function to update the isfavorite key in the original data array basen on product id, by setting the opposite value of the isFavorite key
// if the isfavorite key is set to true then call the fucntion addFavorite, if the isfavorite key is set to false then call the function removeFavorite 

const updateIsFavorite = (productId) => {

  console.log("productId:",productId);

  console.log("filteredProducts LENGTH BEFORE in updateFavorite:",filteredProducts.length);












  //setOriginalData(updatedData);
  //setFilteredProducts(updatedData);

  const item = filteredProducts?.find((obj) => obj?.productId === productId);

 // console.log("item in updateIsFavorite:",item);

  if(!item?.isFavorite)
  {
    addFavorite(myUserId, item?.productId, item?.productName);
  }
  else{
    removeFavorite(myUserId, item?.productId, item?.productName);
  }


  //write function to update the isfavorite key in the filteredProducts array basen on productId, by setting the opposite value of the isFavorite key
  // if the isfavorite key is set to true then call the fucntion addFavorite, if the isfavorite key is set to false then call the function removeFavorite


  


  toggleFavorite(filteredProducts, item?.productId);
  //console.log("setOriginalData:",originalData);  

  //write code to loop through the filteredProducts array and print out productId of each



  setExtraData(extraData + 1);

  console.log("filteredProducts LENGTH AFTER in updateFavorite:",filteredProducts.length);

  //console.log("updatedData1:",updatedData1);

  filteredProducts.forEach(product => {
    //console.log(product.productId);
  });


}






function toggleFavorite(filteredProducts, productId) {
  // Iterate through the filteredProducts array

  //console.log("toggleFavorite:",filteredProducts, productId );
  for (let i = 0; i < filteredProducts.length; i++) {
    // Check if the current product's id matches the productId
    if (filteredProducts[i].productId === productId) {
      // Toggle the isFavorite property
      filteredProducts[i].isFavorite = !filteredProducts[i].isFavorite;
      break; // Exit the loop once the product is found and updated
    }
  }

  setFilteredProducts(filteredProducts);

}

const [isImageLoading, setIsImageLoading ] = useState(true);


  const renderItem = ({ item }) => 
  {

      const imageUrl = {uri:item?.imageUrl};

      //console.log("imageUrl:",imageUrl);

      

      //const storeLogo = saleProductsDetails[0]; 
      const storeLogo = {uri:item?.storeLogoUrl};

      // 
 

      let oldPrice = '';
      let discountPrice = '';
      let discountPercentage = '';
      let endDate = '';
      let formattedEndDate = '';


    oldPrice = item?.oldPrice;
    discountPrice = item?.discountPrice;
    discountPercentage = getPercentageChange(item?.oldPrice, item?.discountPrice);

    endDate = item?.saleEndDate;
    const date = new Date(endDate);
    const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' });
    formattedEndDate = formatter?.format(date);






  return (
    <TouchableOpacity onPress={()=> handleBottomSheet(true, item) }>
      <View 
      style={{ padding: 5, borderColor: 'gray', 
      borderWidth:0, borderRadius:15, backgroundColor:'white', margin:5, alignSelf: 'stretch' }}>
        
        <View style={{ padding: 5, flexDirection: 'row', position: 'relative', justifyContent: 'space-between', alignItems: 'center' }}>



        <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
        <View style={{ flexDirection: 'row' , alignItems: 'center'}}>
          
        <View style={{ zIndex: 1 , width: 70, height:70, borderColor:'red',  alignSelf: 'stretch' }}><TouchableOpacity onPress={() => onModalOpen(item)}>


         <Image id="productImage" source={imageUrl} style={styles.image} />



           

            </TouchableOpacity></View>

           

  
              {item?.onSale ? <View style={{
  borderColor:'red', borderWidth: 0}}>
    
    <ImageBackground id="saleImage" source={require('./discount-red.png')} style={{justifyContent: 'center', 
    alignItems: 'center', width:40, height:40}} >



        <Text style= {styles.discountText}>-{discountPercentage}%</Text></ImageBackground></View> : null}
            
            </View>
            </View>

            <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
            

            <TouchableOpacity onPress={() => updateIsFavorite(item?.productId)}>
            <Image id="favoriteImage"
                  source={
                    item?.isFavorite ? require('./star.png') : require('./white-star.png')
                  }
                  style={styles.star} />

            <Image id="storeLogo"
                  source={storeLogo}
                  style={styles.star} />
            </TouchableOpacity>
            </View>
        
          </View>


        <View style={{ flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', height:40}}>

        <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item?.productName}</Text>


      </View>
      <View style={{  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',}}>
          {item?.onSale  ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 14, fontWeight: 'bold', textAlign: 'center', textDecorationLine: 'line-through', backgroundColor:'#ff9999' }}>{`€${oldPrice}`}</Text> : null}
          {item?.onSale  ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 14, fontWeight: 'bold', textAlign: 'center',  backgroundColor:'#9CCC65' }}>{`€${discountPrice}`}</Text> : null}
          {item?.onSale  ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 12, fontWeight: 'bold', textAlign: 'center', backgroundColor:'#BBDEFB'  }}>{formattedEndDate}</Text> : null}        
      </View>
      </View>
    </TouchableOpacity>
  )



};




return (



<SafeAreaView style={styles.container}>


<View style={{ padding: 10, flexDirection:'col'}}>




    <View >
      {/* <Banner />   style={{flex: 1}} */}
     
      <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          
          inputContainerStyle={{borderWidth:2, borderRadius:20}}
          



          //initialValue={{ id: '2' }} // or just '2'
          onSelectItem={item => {
            item && onSelectItemSearch(item.id)
          }}
          //dataSet={suggestionsList}
          useFilter={false}
          onChangeText={getSuggestions} 
          
          // change the border color to red if the search text is more that 1 character
          //onFocus={() => setBorderColor('red')}

          //maxLength={2}
       



          onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
          onClear={onClearPress}
          textInputProps={{
            placeholder: 'Kerko produkte ketu ...',
            autoCorrect: false,
            autoCapitalize: 'none',
            maxLength: 20,
            style: {
              borderRadius: 55,
              paddingLeft: 18,

            },
          }}

      />
     

    </View>




      <View >
          <StoreFilter />
      </View>





      <View >
          <ProductCategories data={categories}  subData={subCategories} onFilterChange={handleFilters} 
          refreshFilters={refreshFilters}
          onMainFilterChange={handleMainFilters}/>
      </View>







      <View style={{ flex:1, width: Dimensions.get("window").width * 0.95}}>

            <View ><Text>Numri i produkteve: {listLength}</Text></View>

            <View style={{flexDirection: 'row'}}>
              <Text>Filtrat:</Text>
              <Text>{storeId > 0 ?  <Text>  {storeName}</Text> : null}</Text>
              <Text>{categoryId > 0 ?  <Text> : {categoryName}</Text> : null}</Text>
              <Text>{onSale ?  <Text> : Ne zbritje </Text> : null}</Text>
              <Text>{isFavorite ?  <Text> : Te preferuarat</Text> : null}</Text>
              <Text>{searchText ?  <Text> : {searchText}</Text> : null}</Text>
            
            </View>



          <MasonryFlashList
            data={filteredProducts}
            numColumns={2}
            renderItem={filteredProducts?.length > 0 ? renderItem : null}
            estimatedItemSize={20}
            contentContainerStyle={{padding: 5}}
            extraData={extraData}
            showsVerticalScrollIndicator={false}
            marginBottom={60}



            onEndReached={() => {
              console.log("onEndReached");
                if(hasNextPage && !isLoading) fetchNextPage();
            }}
         
            onEndReachedThreshold={0.9} 
            
          />


      </View>

      <View>{ productData.length > 0 ?

        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose} productData={productData}>
          {/* Details Screen */}
        </EmojiPicker> : null }
      </View>


      {
        showUserNamePicker && 


        
        
        <View>
          
          <UserNamePicker isVisible={showUserNamePicker} onClose={() => setShowUserNamePicker(false)}  />
        
        
        </View>
      
      }
          
  
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
    flexWrap: 'wrap',
  },
  selectedItem: {
    backgroundColor: '#e1f1fd',
  },
  title: {
    fontSize: 20,
  },



  image: {
    resizeMode: 'cover',
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
   

  },
  discountText: {
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontWeight: 'bold' 
   
  }




});

export default HomeScreen;