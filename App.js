import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import debounce from "lodash/debounce";
import axios from "axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MultiSelect } from 'react-native-element-dropdown';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MultiSelectComponent from './MultiSelectComponent';
import BottomSheetComponent from './BottomSheetComponent';





import React, { useState, useEffect , useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from 'react-native';



import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';



const mystar = require('./white-star.png');
const favstar = require('./star.png');



// debounce the sendQuery function


const App = () => {


  const [originalData, setOriginalData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredDataFinal, setFilteredDataFinal] = useState([]);

  const [isVisible, setIsVisible] = useState(false)

  const sheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const [productSheet, setProductSheet] = useState();


  console.log("enter:",isVisible);

  const handleBottomSheet = (data) => {

    console.log("---",data);
    setIsVisible(data);

  };

  const closeProductSheet = () => {
    //parentSignal.value = 'Hello from the child';
    setProductSheet();
  };


  const admin = 1 ;


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setOriginalData([]);
    setSelectedData([]);
    getData(admin);
    getFavorites(admin);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setSelectedData([]);
    setOriginalData([]);
    getData(admin);
    getFavorites(admin);
    getCategories(admin);
    setIsVisible(false);
  }, []);



  const [dataFromChild, setDataFromChild] = useState(null);

  //let filteredData = []
  let categoryFilters = []
  

  const handleFilters = (filters) => {
    // Handle the data received from the child component
    categoryFilters = filters;
    console.log("selected filters:",categoryFilters)
    console.log("selected filters lngth:",categoryFilters.length)
    //console.log(data);
    filteredData = filters.length > 0 ? originalData.filter(obj => filters.includes(obj.categoryId)) : originalData ;

    setFilteredDataFinal(filteredData);
    console.log("filteredData",filteredDataFinal);

    console.log("length",filteredDataFinal.length);

    categoryFilters.length > 0 ? console.log("----",filteredData) : console.log(originalData)
      
  };



  async function addFavorite(userId, productId) {


    console.log("addFav:" + userId + "-" + productId);
  
    const data = new URLSearchParams();
    data.append('userId', userId);
    data.append('productId', productId);

    console.log("data:" + data);

    try{
    const resp = await fetch('http://10.12.13.197:8800/addFavorite',  {
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
      const resp = await fetch(`http://10.12.13.197:8800/removeFavorite/${userId}/${productId}`,
    
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

      const resp = await fetch(`http://10.12.13.197:8800/products?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


    const data = await resp.json();

    console.log(data);
    setOriginalData(data)

    }
    catch(e)
    {
      console.log(e);

    }

  }




  async function getCategories(userId) {

    try
    {

      const resp = await fetch(`http://10.12.13.197:8800/getCategories?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

    const data = await resp.json();

    //console.log(data);
    setCategories(data);

    }
    catch(e)
    {
      console.log(e);
    }

  }


  async function getFavorites(userId) {


    try
    {

      const resp = await fetch(`http://10.12.13.197:8800/getFavorites?userId=${userId}`,  {
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


  const handleSelect = (item) => {
    setOriginalData((prevData) =>
      prevData.filter((data) => data.id !== item.id)
    );
    setFilteredDataFinal((prevData) =>
    prevData.filter((data) => data.id !== item.id)
  );
    setSelectedData((prevData) => [...prevData, item]);
    console.log("item clicked")
    //sendQuery(item.id);
    addFavorite(1, item.productId);
  };

  const handleViewProduct = (item) => {};

  const handleDeselect = (item) => {
    setSelectedData((prevData) =>
      prevData.filter((data) => data.id !== item.id)
    );
    console.log("orignilal 1:",originalData)
    setOriginalData((prevData) => [...prevData, item]);
    setFilteredDataFinal((prevData) => [...prevData, item]);
    console.log("orignilal 2:",originalData)
    removeFavorite(admin, item.productId);
  };

  
  const ProductDetails = ({ item }) => 
  {

    const imageUrl = {uri:``};

  return (
    <View>

      <BottomSheet ref={sheetRef} isVisible={isVisible}>
        <Text>
          The smart  tiny and flexible bottom sheet your app craves.
        </Text>
      </BottomSheet>
    </View>
  )

};

  const renderItem = ({ item }) => 
  {

  const imageUrl = {uri:`http://10.12.13.197:8800/images/${item.productPic}`};

  
  return (
    <TouchableOpacity onPress={()=> handleBottomSheet(true) }>
      <View style={{ padding: 5, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => handleSelect(item)}>
        <View style={{ padding: 5, flexDirection: 'row' }}>
          <Image source={mystar} style={styles.image} />
          <Image source={imageUrl} style={styles.image} />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.productName}</Text>
      </View>
    </TouchableOpacity>
  )

};


  const renderSelected = ({ item }) => 
  {
  const imageUrl = {uri:`http://10.12.13.197:8800/images/${item.productPic}`};
  
  return(
    <TouchableOpacity onPress={()=> handleBottomSheet(true)  }>
      <View style={{ padding: 5, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => handleDeselect(item)}>
        <View style={{ padding: 5, flexDirection: 'row' }}>
          <Image source={favstar} style={styles.image} />
          <Image source={imageUrl} style={styles.image} />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle'  }}>{item.productName}</Text>
      </View>
    </TouchableOpacity>
  )};
  


  return (

    <SafeAreaView style={styles.container}>

<ScrollView
        contentContainerStyle={styles.container}
        horizontal
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

    <View style={{ flex: 1, padding: 20 }}>



      <MultiSelectComponent data={categories}   onFilterChange={handleFilters} refreshing={refreshing}/>

      <View style={{ flexDirection: 'row' }}>
      

        <View style={{ flexDirection: 'col', width: '45%' }}>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Lista
          </Text>
          <FlatList
            
            data={filteredDataFinal.length > 0 ? filteredDataFinal : originalData}
            renderItem={renderItem}
           
          />
        </View>

        <View style={{ flexDirection: 'col', width: '45%' }}>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Favoritet
          </Text>

          <FlatList
            data={selectedData}
            renderItem={renderSelected}
                        
          />


        </View>
        
      </View>
      <BottomSheetComponent isVisible={isVisible}  handleBottomSheet={handleBottomSheet} />
    </View>

    
  
  </ScrollView>




    </SafeAreaView>


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

export default App;
