import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import BottomSheet ,{BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Banner from './Banner';
import { MasonryFlashList } from "@shopify/flash-list";
import ProductCategories from './ProductCategories';
import EmojiPicker from "./EmojiPicker";
import * as Device from 'expo-device';
import useStore from './useStore';
import React, { useState, useEffect , useRef, useCallback } from 'react';
import { View,Text,Button, TouchableOpacity,Image, ImageBackground, StyleSheet,SafeAreaView,ScrollView,RefreshControl,Dimensions



} from 'react-native';


import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {QueryClient, useInfiniteQuery} from '@tanstack/react-query'
// debounce the sendQuery function

import * as SecureStore from 'expo-secure-store';
import UserNamePicker from './UserNamePicker'; // 
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import Toast from 'react-native-root-toast';
import StoreFilter from './StoreFilter';

//import useFetchData from './useFetchData';





const queryClient = new QueryClient();




const HomeScreen = () => {


  const [allProducts, setAllProducts] = useState([]);
  const [listLength, setListLength] = useState(0);

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
  const [isVisible, setIsVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const sheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(true);
  const [productSheet, setProductSheet] = useState();
  const [extraData, setExtraData] = useState(0);
  const [prefetchedProductsData, setPrefetchedProductsData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [storedUserName, setStoredUserName] = useState("");
  const [showUserNamePicker, setShowUserNamePicker] = useState(false);

  const { count, increment ,myUserName, setMyUserName, storeId, onSale, categoryId, 
    subCategoryId, isFavorite, searchText ,setSearchText } = useStore();


  //const first = useFetchData();



async function setLocalUsername(key, value) {
  await SecureStore.setItemAsync(key, value);
}


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


  const handleBottomSheet = (data, item) => {

    console.log("---",data);
    setIsVisible(data);
    setCurrentItem(item);
  
  };

  const url = 'http://10.12.13.197:8800';
  const admin = 1 ;

  
  const onRefresh = React.useCallback(() => {
      setRefreshing(true);      
      setSelectedData([]);
      setOriginalData([]);
      setCategories([]);
      setSubCategories([]);
      setFilteredProducts([]); 
      setSaleData([]);     
      getFavorites(admin);
      //getData(admin,1);
      getCategories(admin);
      getSubCategories(admin);
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

  }, [storeId, onSale, categoryId, subCategoryId, isFavorite]);





  useEffect(() => {

    console.log("filteredProducts changed>>>>>:",filteredProducts?.length)
    setListLength(filteredProducts?.length);

  }, [filteredProducts]);


  const loadInitaialData = () => {
   
    const userName =  getLocalUsername('username').then((result) => {
      console.log("username:------------------------------------------------:",result);
      //setShowUserNamePicker(true);


      if(!result)
      {
        console.log("result found:", result);
        //poup login modal 
        setShowUserNamePicker(true);
        //setLocalUsername('username', 'admin');

      }
      else{
        setMyUserName(result);    
        console.log("result found setMyUserName:");  
      }
    });


    setSelectedData([]);
    setOriginalData([]);
    setCategories([]);
    setSubCategories([]);
    setFilteredProducts([]);
    setSaleData([]); 

    prefetchGetCategories(admin);
    getSubCategories(admin);
    setIsVisible(false);
    getProductOnSale(admin);
    prefetchProducts(admin);
    
   
    console.log("*************************************************************************************************")
    //filterSaleData();



  ;}


  
  useEffect(() => {

      loadInitaialData();
 

  }, []);



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
      prevFavorites.filter((product) => product.productId !== item.productId)
    );
    
  };



  const handlePressFavorites = (item) => {
    //setSelectedProduct(productId);

      const result = favoritesData.some((element) => element.productId === item.productId);
      //console.log(result)

      // updateIsFavorite(item.productId);

      if(result)
      {
        handleRemoveFavorites(item)
        removeFavorite(admin, item.productId, item.productName);
      }
      else{
        handleAddProduct(item)
        addFavorite(admin, item.productId, item.productName);
      }

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

    const filteredSaleData = saleData.filter(item => favoritesData.some(obj => obj.productId === item.productId));
    console.log("filteredFavoritesDataOnSale",filteredSaleData);
    //setFilteredProducts(filteredSaleData);

  }


  const handleFilters = (categoryFilters, subFilters) => {
    // Handle the data received from the child component

      console.log("categoryFilters:",categoryFilters); 
      console.log("subFilters:",subFilters); 

        
      const filteredData = categoryFilters?.length > 0
      ? originalData?.filter(item => categoryFilters.includes(item.categoryId))
      : originalData;


      console.log("filteredData:",filteredData);

      const filteredSubData = subFilters.length > 0
      ? filteredData.filter(item => subFilters.includes(item.subCategoryId))
      : filteredData;

      console.log("filteredSubData:",filteredSubData);

      const finalProductList = sortProducts(filteredSubData, favoritesData);

      console.log("finalProductList:",finalProductList);
      setFilteredProducts(finalProductList);

  };




  function applyStoreFilters() {
    
    //write code here

    console.log("Store filters changed to storeId:",storeId);

    let filteredProducts = allProducts?.filter(product => {
        return (subCategoryId === 0 || product.subCategoryId == subCategoryId) &&
            (categoryId === 0 || product.categoryId == categoryId) &&
            (storeId === 0 || product.storeId === storeId) &&
            (!isFavorite || product.isFavorite) &&
            (!onSale || product.onSale);
    });
    return filteredProducts;
}





// sort the products based on the favorite products moved on top of the array
  const sortProducts = (firstArray, secondArray) => {

    const sortedProductsArray = firstArray?.sort((a, b) => {
      const aIsMatch = secondArray.some(obj => obj.productId === a.productId);
      const bIsMatch = secondArray.some(obj => obj.productId === b.productId);
    
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;

    });

    return sortedProductsArray;

  }


  async function addFavorite(userId, productId, productName) {

    console.log("addFav:" + userId + "-" + productId);
  
    const data = new URLSearchParams();
    data.append('userId', userId);
    data.append('productId', productId);

    console.log("data:" + data);

    try{
      const resp = await fetch(`${url}/addFavorite`,  {
      method: 'POST',
      
      body: JSON.stringify({
        userId: admin,
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
    console.log("removeFavorite");
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

    let newProducts = allProducts.map(product => {
        let isFavorite = favorites.some(favorite => favorite.productId === product.productId);
        let isOnSale = new Date() >= new Date(product.saleStartDate) && new Date() <= new Date(product.saleEndDate);
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



const params = { admin:admin, storeId:storeId };


console.log("params:",params);

function useCustomInfiniteQuery(params) {
  const {
    data,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    allPages
  } = useInfiniteQuery({
    queryKey: ['getData', params.admin ,storeId, categoryId, searchText],
    queryFn: ({ pageParam = 1 }) => getData(params.admin, pageParam, storeId, categoryId, subCategoryId, isFavorite, onSale, searchText),
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
    if (!allProducts.some(obj1 => obj1.productId === obj2.productId)) {
      allProducts.push(obj2);
    }
  });

  console.log("allProducts:>>>>>>>>>>",allProducts.length);




}, [data]);




//console.log("dataArray:",dataArray);

  async function getData(userId,page, storeId, categoryId, subCategoryId, isFavorite, onSale, searchText) {
    try
    {

      //console.log("pageParam:",page);

      const resp = await fetch(`${url}/products?limit=10&userId=${userId}&offset=${page}&storeId=${storeId}&categoryId=${categoryId}&searchText=${searchText}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();

    //console.log(" data length------------------------------------------------:",data.length);




    //console.log(data);
    setOriginalData(...data);
    setOriginalDataBackup(data);

    setRefreshing(false);

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
    setProductData([item]);
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };


  function getPercentageChange(oldNumber, newNumber) {
    var decreaseValue = oldNumber - newNumber;
    var percentageChange = (decreaseValue / oldNumber) * 100;
    return Math.ceil(percentageChange); // Rounded up to the nearest whole number
}





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
  console.log("searchText:",searchText);
  // write the code to extract the id from suggestionsList array into an new array of ids

  //
  if(searchText?.length >  2) setSearchText(searchText);


  console.log("searchText length:",searchText.length);

  
  //console.log("suggestionsList:",suggestionsList);

    if(suggestionsList)
    {
      //const suggestionsListIds = suggestionsList.length > 0 ? suggestionsList.map(obj => obj.id) : [];
      //console.log("suggestionsListIds:",suggestionsListIds);
      //const paramsString = suggestionsListIds.join(',');
      //console.log("paramsString:",paramsString  );
      //const productListSearch = getProductsByIds(admin, paramsString);

      // copy suggestionsListIds to the onSearchFilterIdList in the store IF THE LENGTH IS GREATER THAN 0      

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

  const updatedData = originalData.map((item) => {
    if (item.productId === productId) {
      return { ...item, isFavorite: !item.isFavorite };
    }
    return item;
  });



  setOriginalData(updatedData);
  setFilteredProducts(updatedData);

  const item = updatedData.find((obj) => obj.productId === productId);

  if(item.isFavorite)
  {
    addFavorite(admin, item.productId, item.productName);
  }
  else{
    removeFavorite(admin, item.productId, item.productName);
  }

  //console.log("setOriginalData:",originalData);  

}

const LoadingPlaceholder = () => ( 
<View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
    <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
    <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
    <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
  <View style={{ alignItems: 'center', padding: 20 }}>
    <Text>Loading...</Text>
  </View>
</View>
);



  const renderItem = ({ item }) => 
  {

      const imageUrl = {uri:item?.imageUrl};
      const favoriteProduct = favoritesData.some((obj) => obj?.productId === item?.productId);
      //const isOnSale = isWithinDateRange(item.saleStartDate, item.saleEndDate);
      const onSaleProduct = saleData.some((obj) => obj?.productId === item?.productId);
      const saleProductsDetails = saleData.filter(product => product?.productId === item?.productId);
      //const storeLogo = saleProductsDetails[0]; 
      const storeLogo = {uri:`${url}/images/${item?.storeLogo}`};

      // 


      let logo = ''; 
      let oldPrice = '';
      let discountPrice = '';
      let discountPercentage = '';
      let endDate = '';
      let formattedEndDate = '';
      let storeLogoUrl = '';






    oldPrice = item?.oldPrice;
    discountPrice = item?.discountPrice;
    discountPercentage = getPercentageChange(item?.oldPrice, item?.discountPrice);

    endDate = item?.saleEndDate;
    const date = new Date(endDate);
    const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' });
    formattedEndDate = formatter.format(date);



  return (
    <TouchableOpacity onPress={()=> handleBottomSheet(true, item) }>
      <View 
      style={{ padding: 5, borderColor: 'gray', 
      borderWidth:0, borderRadius:15, backgroundColor:'white', margin:5, height:150}}>
        
        <View style={{ padding: 5, flexDirection: 'row', position: 'relative', justifyContent: 'space-between', alignItems: 'center' }}>

        <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
        <View style={{ flexDirection: 'row' , alignItems: 'center'}}>
          

          
        <View style={{ zIndex: 1 }}><TouchableOpacity onPress={() => onModalOpen(item)}>
            <Image id="productImage" source={imageUrl} style={styles.image} />

           
            </TouchableOpacity></View>

  
              {item.onSale ? <View style={{
  borderColor:'red', borderWidth: 0}}>
    
    <ImageBackground id="saleImage" source={require('./discount-red.png')} style={{justifyContent: 'center', 
    alignItems: 'center', width:35, height:35}} >

<Text style= {{textAlign: 'center', textAlignVertical: 'center' }}>-23%</Text></ImageBackground></View> : null}
            
            </View>
            </View>

            <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
            <Image id="productImage" source={storeLogo} style={styles.star} />

              <TouchableOpacity onPress={() => updateIsFavorite(item.productId)}>
            <Image id="favoriteImage"
                  source={
                    item.isFavorite ? require('./star.png') : require('./white-star.png')
                  }
                  style={styles.star} />
          </TouchableOpacity>
            </View>
        
          </View>

        <View style={{ flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}>

        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.productName}</Text>


      </View>
      <View style={{  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}>
          {item.onSale  ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle',textDecorationLine: 'line-through', backgroundColor:'#F44336' }}>{`€${oldPrice}`}</Text> : null}
          {item.onSale  ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle', backgroundColor:'#9CCC65' }}>{`€${discountPrice}`}</Text> : null}
          {item.onSale  ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'top', backgroundColor:'#BBDEFB'  }}>{formattedEndDate}</Text> : null}        
      </View>
      </View>
    </TouchableOpacity>
  )


};



return (

<SafeAreaView style={styles.container}>


<View style={{ padding: 10, flexDirection:'col'}}>
   <View>
      <Text>Emri i telefonit: {Device.deviceName}</Text>
      <Text>Username: {myUserName}</Text>
    </View>



    <View >
      {/* <Banner />   style={{flex: 1}} */}
     
      <AutocompleteDropdown
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          //initialValue={{ id: '2' }} // or just '2'
          onSelectItem={item => {
            item && onSelectItemSearch(item.id)
          }}
          dataSet={suggestionsList}
          useFilter={false}
          onChangeText={getSuggestions}
          onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
          onClear={onClearPress}
          textInputProps={{
            placeholder: 'Kerko produktet',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: {
              borderRadius: 25,
              paddingLeft: 18,
            },
          }}
          renderItem={({title,id}) => (
           
              <Text style={{  padding: 15 }}> 
                  {title}
              </Text>
           
          )}
      />
     

    </View>




      <View >
          <StoreFilter />
      </View>



      <View >
          <ProductCategories data={categories}  subData={subCategories} onFilterChange={handleFilters} onMainFilterChange={handleMainFilters}/>
      </View>


      <View style={{ flex:1, width: Dimensions.get("window").width * 0.95}}>

            <View ><Text>Numri i producteve: {listLength}</Text></View>


          <MasonryFlashList
            data={filteredProducts}
            numColumns={2}
            renderItem={renderItem}
            estimatedItemSize={20}
            contentContainerStyle={{padding: 5}}
            extraData={extraData}
            showsVerticalScrollIndicator={false}
            marginBottom={60}
            
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refetch} />
            }

            onEndReached={() => {
              console.log("onEndReached");
                if(hasNextPage && !isLoading) fetchNextPage();
            }}
         
            onEndReachedThreshold={0.9} 
            

          />


      </View>

      <View>
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose} productData={productData}>
          {/* Details Screen */}
        </EmojiPicker>
      </View>


      {
        showUserNamePicker && <View><UserNamePicker isVisible={showUserNamePicker} onClose={() => setShowUserNamePicker(false)}  /></View>
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

export default HomeScreen;