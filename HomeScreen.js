import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import debounce from "lodash/debounce";
import axios from "axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MultiSelect } from 'react-native-element-dropdown';
import BottomSheet from '@gorhom/bottom-sheet';

import { NavigationContainer } from '@react-navigation/native';

import MultiSelectComponent from './MultiSelectComponent';
import BottomSheetComponent from './BottomSheetComponent';
import Banner from './Banner';

import { MasonryFlashList } from "@shopify/flash-list";
import ProductCategories from './ProductCategories';



import React, { useState, useEffect , useRef, useMemo } from 'react';
import {
  View,
  Text,

  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,

  Dimensions


} from 'react-native';



const mystar = require('./white-star.png');
const favstar = require('./star.png');





// debounce the sendQuery function


const HomeScreen = () => {


  const [originalData, setOriginalData] = useState([]);
  const [originalDataBackup, setOriginalDataBackup] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredDataFinal, setFilteredFinal] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);

  const [isVisible, setIsVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const sheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [productSheet, setProductSheet] = useState();

  const [image, setImage] = useState(require('./white-star.png'));
  const [toggle, setToggle] = useState(false);

  const [extraData, setExtraData] = useState(0);



  //console.log("enter:",isVisible);

  const handleBottomSheet = (data, item) => {

    console.log("---",data);
    setIsVisible(data);
    setCurrentItem(item);
  
  };

  const closeProductSheet = () => {
    //parentSignal.value = 'Hello from the child';
    setProductSheet();
  };

  const url = 'http://10.12.13.197:8800';
  const admin = 1 ;


  
  const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setOriginalData([]);
      setSelectedData([]);
      setCategories([]);
      setSubCategories([]);
      getData(admin);
      getFavorites(admin);
      setTimeout(() => {
      setRefreshing(false);

    }, 1000);
  }, []);

  useEffect(() => {
        setSelectedData([]);
        setOriginalData([]);
        setCategories([]);
        setSubCategories([]);
        setFilteredProducts([]);
        setSaleData([]);
        getData(admin);
        getFavorites(admin);
        getCategories(admin);
        getSubCategories(admin);
        setIsVisible(false);
    
  }, []);


  useEffect(() => {
    //console.log("originalData>>>>>:",originalData)
    handleFilterSale();
  }, [originalData]);


  useEffect(() => {
    //console.log("favorites>>>>>:",favoritesData)
    setExtraData(extraData + 1);
  }, [favoritesData]);


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

      if(result)
      {
        handleRemoveFavorites(item)
        removeFavorite(admin, item.productId);
      }
      else{
        handleAddProduct(item)
        addFavorite(admin, item.productId);
      }



  };



  //let filteredData = []
  let categoryFilters = [];
  let subCategoryFilters = []
  




  const handleFilters = (filters) => {
    // Handle the data received from the child component
    categoryFilters = filters;
    
    //console.log("categoryFilters:",categoryFilters);
    
    //console.log("categoryFilters length:",categoryFilters.length);

    //console.log("filteredDataProducts:",filteredProducts);

    //console.log("obj.categoryId",obj.categoryId);
        
      const filteredData = categoryFilters.length > 0
      ? originalData.filter(item => categoryFilters.includes(item.categoryId))
      : originalData;

    setFilteredProducts(filteredData);

    //console.log("filteredData:",filteredData);

    //console.log("filteredData.length:",filteredData.length);

    //categoryFilters.length > 0 ? console.log("filteredData:",filteredData) : console.log("filteredData:", originalData)
      
  };


  const handleSubCategoryFilters = (filters) => {
    // Handle the data received from the child component
    subCategoryFilters = filters;
    
    console.log("SubcategoryFilters:",subCategoryFilters);
    console.log("SubcategoryFilters length:",subCategoryFilters.length);
    console.log("SubfilteredDataProducts:",filteredProducts);

        
    const filteredData = subCategoryFilters.length > 0
    ? originalData.filter(item => subCategoryFilters.includes(item.categoryId))
    : originalData;

    setFilteredProducts(filteredData);

    console.log("SUBfilteredData:",filteredData);
    console.log("SUBfilteredData.length:",filteredData.length);

    subCategoryFilters.length > 0 ? console.log("filteredData:",filteredData) : console.log("filteredData:", originalData)
      
  };


  const handleFilterSale = () => {
    // Handle the data received from the child component

    console.log("favorites data -----------:", selectedData);
        // Filter the data based on today's date
        const today = new Date().toISOString().slice(0, 10);
        console.log("today -----------:", today);
        const filtered = selectedData.filter(item => {
          const start = new Date(item.saleStartDate).toISOString().slice(0, 10);
          console.log("start -----------:", start);
          const end = new Date(item.saleEndDate).toISOString().slice(0, 10);
          console.log("today -----------:", end);
          return today >= start && today <= end;
        });
    
        setSaleData(filtered);
        console.log("filterd -----------:", filtered);
        console.log("sale data -----------:", saleData);
      
  };



  async function addFavorite(userId, productId) {

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


    }
    catch(e)
    {
      console.log(e);
    }


  }


  async function removeFavorite(userId, productId) {

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
    //setOriginalData(data)

    }
    catch(e)
    {
      //console.log(e);

    }


  }


  async function getData(userId) {

    try
    {

      const resp = await fetch(`${url}/products?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();

    //console.log(data);
    setOriginalData(data);
    setOriginalDataBackup(data);
    setFilteredProducts(data);

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

    console.log("categories----------------",data);
    setCategories(data);

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

    console.log("Subcategories----------------",data);
    setSubCategories(data);

    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function getFavorites(userId) {

    try
    {

      const resp = await fetch(`${url}/getFavorites?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


    const data = await resp.json();

    //console.log(data);
    setFavoritesData(data)
   // handleFilterSale();
        
    }
    catch(e)
    {
      console.log(e);
    }

  }

  async function getSaleFavorites(userId) {

    try
    {

      const resp = await fetch(`${url}/getSaleFavorites?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


    const data = await resp.json();

    //console.log(data);
    setSelectedData(data)

    }
    catch(e)
    {
      console.log(e);

    }

  }




  const renderItem = ({ item }) => 
  {

  const imageUrl = {uri:`${url}/images/${item.productPic}`};

  //console.log("imageUrl:",imageUrl);
  //<MultiSelectComponent data={originalData}   onFilterChange={handleFilters} refreshing={refreshing}/>

  const favoriteProduct = favoritesData.some((obj) => obj.productId === item.productId);

  const sample = favoritesData.find((favorite) => favorite.productId === item.productId) ? require('./star.png') : require('./white-star.png')
  //console.log("sample-", favoriteProduct)


  return (
    <TouchableOpacity onPress={()=> handleBottomSheet(true, item) }>
      <View 
      style={{ padding: 5, flexDirection: 'row', borderColor: 'gray', 
      borderWidth:0, borderRadius:15, backgroundColor:'white', margin:5}}>
        <TouchableOpacity onPress={() => handlePressFavorites(item)}>
        <View style={{ padding: 5, flexDirection: 'row' }}>

          <Image
                source={
                  favoriteProduct ? require('./star.png') : require('./white-star.png')
                }
                style={styles.image}  />

          <Image source={imageUrl} style={styles.image} />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.productName}</Text>
      </View>
    </TouchableOpacity>
  )

};



  return (

<SafeAreaView style={styles.container}>


<View style={{ flex: 1, padding: 10, flexDirection:'col'}}>

<View>
  <ScrollView nestedScrollEnabled={true} 
        contentContainerStyle={styles.container}
        horizontal
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
       

  <Text>Refresh...</Text>

    
  </ScrollView>

  </View>

    <View>
          <Banner />
          
    </View>

    <View style={{height: 120}}>
    <ProductCategories data={categories}  subData={subCategories} onFilterChange={handleFilters} />
    </View>



<View style={{ height: 400, width: Dimensions.get("window").width * 0.95}}>


    <MasonryFlashList
      data={filteredProducts}
      numColumns={2}
      renderItem={renderItem}
      estimatedItemSize={20}
      contentContainerStyle={{padding: 5}}
      extraData={extraData}
      showsVerticalScrollIndicator={false}
      
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
    width: 40,
    height: 40,
    marginRight: 8,
  },
});

export default HomeScreen;