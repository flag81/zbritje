import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import BottomSheet ,{BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { NavigationContainer } from '@react-navigation/native';

import BottomSheetComponent from './BottomSheetComponent';
import Banner from './Banner';

import { MasonryFlashList } from "@shopify/flash-list";
import ProductCategories from './ProductCategories';

import EmojiPicker from "./EmojiPicker";
import * as Device from 'expo-device';



import React, { useState, useEffect , useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Button,

  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions


} from 'react-native';


//import  { SQLite, SQLiteDatabase } from 'expo-sqlite';
//import { open } from '@op-engineering/op-sqlite';




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
  const [saleProductsData, setSaleProductsData] = useState([]);

  const [isVisible, setIsVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const sheetRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [productSheet, setProductSheet] = useState();
  const [extraData, setExtraData] = useState(0);

  //const [db, setDb] = useState(await SQLite.openDatabaseAsync('zbritje'));

  
  const handleBottomSheet = (data, item) => {

    console.log("---",data);
    setIsVisible(data);
    setCurrentItem(item);
  
  };

  const closeProductSheet = () => {
    //parentSignal.value = 'Hello from the child';
    setProductSheet();
  };

	const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

	const bottomSheetRef = useRef(null);

	const handleClosePress = () => bottomSheetRef.current?.close();
	const handleOpenPress = () => bottomSheetRef.current?.expand();
	const handleCollapsePress = () => bottomSheetRef.current?.collapse();
	const snapeToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);
	const renderBackdrop = useCallback(
		(props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
		[]
	);


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
      getData(admin);
      getCategories(admin);
      getSubCategories(admin);
      //filterSaleData();
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
        getFavorites(admin);
        getData(admin);
        getCategories(admin);
        getSubCategories(admin);
        
        setIsVisible(false);
        getProductOnSale(admin);

        console.log("*************************************************************************************************")
        //filterSaleData();
    
  }, []);


  useEffect(() => {
    //console.log("originalData>>>>>:",originalData)
    //handleFilterSale();
  }, [originalData]);


  useEffect(() => {
    console.log("saleData changed>>>>>:",saleData)
    //handleFilterSale();
  }, [saleData]);


  useEffect(() => {
    //console.log("favoritesData:",favoritesData)
    setExtraData(extraData + 1);


    //sort favoritesData

  }, [favoritesData, saleData]);


  const [uniqueId, setUniqueId] = useState('');




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
  //let categoryFilters = [];
  //let subCategoryFilters = [];
  //let subFilters = [];

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
  

  const handleFilters = (categoryFilters, subFilters) => {
    // Handle the data received from the child component
    //categoryFilters = filters;
    //subFilters = subCat;

      console.log("categoryFilters:",categoryFilters); 
      console.log("subFilters:",subFilters); 

        
      const filteredData = categoryFilters.length > 0
      ? originalData.filter(item => categoryFilters.includes(item.categoryId))
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




// sort the products based on the favorite products moved on top of the array
  const sortProducts = (firstArray, secondArray) => {

    const sortedProductsArray = firstArray.sort((a, b) => {
      const aIsMatch = secondArray.some(obj => obj.productId === a.productId);
      const bIsMatch = secondArray.some(obj => obj.productId === b.productId);
    
      if (aIsMatch && !bIsMatch) return -1;
      if (!aIsMatch && bIsMatch) return 1;
      return 0;

    });

    return sortedProductsArray;

  }



  const handleFilterSale = () => {
    // Handle the data received from the child component

    //console.log("favorites data -----------:", selectedData);
        // Filter the data based on today's date
        const today = new Date().toISOString().slice(0, 10);
        //console.log("today -----------:", today);
        const filtered = selectedData.filter(item => {
          const start = new Date(item.saleStartDate).toISOString().slice(0, 10);
          //console.log("start -----------:", start);
          const end = new Date(item.saleEndDate).toISOString().slice(0, 10);
         // console.log("today -----------:", end);
          return today >= start && today <= end;
        });
    
        setSaleData(filtered);
        //console.log("filterd -----------:", filtered);
        //console.log("sale data -----------:", saleData);
      
  };


  const filterSaleData = () => {
    // Handle the data received from the child component

    //console.log("favorites data -----------:", selectedData);
        // Filter the data based on today's date
        const today = new Date().toISOString().slice(0, 10);
        //console.log("today -----------:", today);
        const filteredSaleProducts = originalData.filter(item => {
          const start = new Date(item.saleStartDate).toISOString().slice(0, 10);
          //console.log("start -----------:", start);
          const end = new Date(item.saleEndDate).toISOString().slice(0, 10);
          //console.log("today -----------:", end);
          return today >= start && today <= end;
        });
    
        setSaleData(filteredSaleProducts);
        console.log("filteredSaleProducts -----------:", filteredSaleProducts);
        //console.log("sale data -----------:", saleData);
      
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
    
    const finalData = sortProducts(data, favoritesData);

    setFilteredProducts(finalData);

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

  async function getProductOnSale(userId) {

    try
    {

      const resp = await fetch(`${url}/getProductOnSale?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });


    const data = await resp.json();

    console.log("saleData fetch ------------------------------------------------:",data);
    //console.log(data);
    setSaleData(data)



    }
    catch(e)
    {
      console.log(e);

    }

  }


  function isWithinDateRange(startDate, endDate) {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start.getTime() <= today.getTime() && today.getTime() <= end.getTime();
  }


  const [isModalVisible, setIsModalVisible] = useState(false);
  // ...rest of the code remains same

  const onModalOpen = () => {
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




  const renderItem = ({ item }) => 
  {

      const imageUrl = {uri:`${url}/images/${item.productPic}`};

      const favoriteProduct = favoritesData.some((obj) => obj.productId === item.productId);

      const isOnSale = isWithinDateRange(item.saleStartDate, item.saleEndDate);

      const onSaleProduct = saleData.some((obj) => obj.productId === item.productId);

      const saleProductsDetails = saleData.filter(product => product.productId === item.productId);

      const storeLogo = saleProductsDetails[0]; 


      let logo = "";
      let storeLogoUrl ='';
      let oldPrice = '';
      let discountPrice = '';
      let discountPercentage = '';
      let endDate = '';

      let formattedEndDate = '';

    if (saleProductsDetails.length > 0)
    {
        logo = saleProductsDetails[0].storeLogo; 
        //const storeLogoUrl = {uri:`${url}/images/${logo`};
        storeLogoUrl = {uri:`${url}/images/${logo}`};
        oldPrice = saleProductsDetails[0].oldPrice;
        discountPrice = saleProductsDetails[0].discountPrice;
        discountPercentage = getPercentageChange(oldPrice, discountPrice);
        endDate = saleProductsDetails[0].saleEndDate;

        const date = new Date(endDate);
        const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' });
        formattedEndDate = formatter.format(date);

    } 
    else{
        logo = "no-logo"; 
    }







  

  //console.log("filteredProducts:",filteredProducts);
  //console.log("saleProductsDetails:-----------", logo);
  //console.log("saleData:", saleData);
  //console.log("onSaleProduct:", onSaleProduct);
  //console.log("isOnSale:",isOnSale);

  

  return (
    <TouchableOpacity onPress={()=> handleBottomSheet(true, item) }>
      <View 
      style={{ padding: 5, borderColor: 'gray', 
      borderWidth:0, borderRadius:15, backgroundColor:'white', margin:5, height:150}}>
        
        <View style={{ padding: 5, flexDirection: 'row', position: 'relative', justifyContent: 'space-between', alignItems: 'center' }}>


        <View style={{ flexDirection: 'col',  alignItems: 'center'}}>
        <View style={{ flexDirection: 'row' , alignItems: 'center'}}>

        <View style={{ zIndex: 1 }}><TouchableOpacity onPress={() => onModalOpen()}>
            <Image id="productImage" source={imageUrl} style={styles.image} />
            </TouchableOpacity></View>
            
              {onSaleProduct ? <View style={{marginLeft: -15, zIndex: 3 }}><Text style={{ fontSize: 12 , color:'black', fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle',  }}>{`-${discountPercentage}%`}</Text></View> : null}
              {onSaleProduct ? <View style={{marginLeft: -28, zIndex: 2}}><Image id="saleImage" source={require('./discount-red.png')} style={styles.icon} /></View> : null}
            
            </View>
            </View>

            <View style={{ flexDirection: 'col',  alignItems: 'center'}}>


              {saleProductsDetails.length > 0 ? <Image id="saleImage" source={storeLogoUrl} style={[styles.icon,  { }]} /> : null}
            
            </View>
          

          </View>


          <View style={{ flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}>

          



        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.productName}</Text>
          <TouchableOpacity onPress={() => handlePressFavorites(item)}>
            <Image id="favoriteImage"
                  source={
                    favoriteProduct ? require('./star.png') : require('./white-star.png')
                  }
                  style={styles.star} />
          </TouchableOpacity>

      </View>
      <View style={{  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}>
      {onSaleProduct ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle',textDecorationLine: 'line-through', backgroundColor:'#F44336' }}>{`€${oldPrice}`}</Text> : null}
      {onSaleProduct ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle', backgroundColor:'#9CCC65' }}>{`€${discountPrice}`}</Text> : null}
      {onSaleProduct ? <Text style={{ borderRadius: 7, paddingHorizontal: 5,fontSize: 15, fontWeight: 'bold', textAlign: 'center', verticalAlign:'top', backgroundColor:'#BBDEFB'  }}>{formattedEndDate}</Text> : null}
      
      </View>
      </View>
    </TouchableOpacity>
  )

};



  return (

<SafeAreaView style={styles.container}>


<View style={{ flex: 1, padding: 10, flexDirection:'col'}}>
   <View>
      <Text>{Device.manufacturer}: {Device.deviceName}</Text>
    </View>

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





      <View >
          <ProductCategories data={categories}  subData={subCategories} onFilterChange={handleFilters} onMainFilterChange={handleMainFilters}/>
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
            marginBottom={100}
            
      />


      </View>





      <View>
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* A list of emoji component will go here */}
      </EmojiPicker>
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


  }


});

export default HomeScreen;