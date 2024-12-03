import React, { useState, useEffect} from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity , StyleSheet, Image} from "react-native";
import { COLORS , SIZES} from "./theme";
import useStore from './useStore';
import {showToast, getStoresList }  from './apiUtils';
import { Dropdown } from 'react-native-element-dropdown';



const ProductCategories = ({data, onFilterChange, onMainFilterChange, subData, refreshFilters}) => {


    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);




    const COLORS1 = { primary: '#007bff', grey: '#d3d3d3' };

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategorie] = useState([]);

    const [allStoresList, setAllStoresList] = useState([]);


    const [currentCategory, setCurrentCategory] = useState('0');


    const [favoritesFilter, setFavoritesFilter] = useState(false);
    const [onSaleFilter, setOnSaleFilter] = useState(false);


    const categories = data;
    const subCategories = subData;

    const { admin, url, onSale, setOnSale, isFavorite, setIsFavorite, storeId, setStoreId,
        categoryId, setCategoryId, subCategoryId, selectedSubCategoriyId, setCategoryName} = useStore();



        async function fetchStoresList(url) {
          try {
            const data = await getStoresList(url);
            console.log("getStoresList from fetchStoresList:-------------", data);
            setAllStoresList(data);
            return data;
          } catch (error) {
            console.error("Error fetching stores list:", error);
          }
        }
        
        // Call the function
        
        //fetchStoresList(url);


      

    useEffect(() => {

        setSelectedCategories([]);       
        sendFilteredCategories();

        //console.log("Category data:-------------",data);
        console.log("calling fetchStoresList:-------------", url);
        fetchStoresList(url);
        
      }, []);




        useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)

        sendFilteredCategories();

      }, [selectedCategories]);

      useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)
        console.log("All stores list changed:-------------",allStoresList)

      }, [allStoresList]);


      useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)
        sendFilteredSubCategories();

      }, [selectedSubCategories]);


      useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)
        onMainFilterChange(favoritesFilter,onSaleFilter); // sales and favorites filters are applied

      }, [favoritesFilter, onSaleFilter]);


    const sendFilteredCategories = () => {
        
        //console.log("New selected:",selected)
        onFilterChange(selectedCategories, selectedSubCategories);
      };


    const sendFilteredSubCategories = () => {
        
        //console.log("New selected:",selected)
        onFilterChange(selectedCategories, selectedSubCategories);
      };  



      const handleFavoritesFilter = () => {
        

        setFavoritesFilter(!favoritesFilter);
        setIsFavorite(!isFavorite);
        //console.log("New selected:",selected)
        //onFilterChange(selectedCategories, selectedSubCategories);

            
      };  
  

      const handleOnSaleFilter = () => {

        setOnSale(!onSale);

        if(!onSale)
        {
            showToast("Produktet ne zbritje.");
        }

        //showToast("Produktet ne zbritje.");

      }; 


      const handleCategoriesFilter = (id, name) =>
      {

        console.log("selected category id and name:-------------",id, name)
            setCategoryId(id);
            setCategoryName(name);
      }



      const handleAddSelection = (item) => {

        //console.log("selected[]:-------------",selected)
        
 
        if (selectedCategories.length > 0 && selectedCategories.includes(item)) {
            console.log("removed:-------------",item);
             //set filterd  list of products
            setSelectedCategories((prevFavorites) =>
            prevFavorites.filter((product) => product !== item));
            //remove sub categories that belong to the selected category where subCategoryId is not equal to the selected category
            

            //setSelectedSubCategorie([]);
        } else {
            console.log("added:-------------",item)
            
            //set filterd  list of products
            setSelectedCategories((prevSelected) => Array.isArray(prevSelected) ? [...prevSelected, item] : [item]);
            setCurrentCategory(item);

            //remove sub categories that belong to the selected category
            

            console.log("currentCategory:-------------",currentCategory)
        }
        

        // get sub categories list from all sub categories based on selected category on the selected array
        //filter sub categories based on selected category


            //console.log("selected:-----------------------------------------------------------------",selectedCategories)
            //console.log("currentCategory:-----------------------------------------------------------------",currentCategory)
            //console.log("subCategories data:-------------",subCategories)

      };


      
      const handleSubCategoriesSelection = (item) => {

        //console.log("selected[]:-------------",selected)
        //setSubCurrentCategory(item);
        //console.log("currentSubCategory:-------------",currentSubCategory)
    

        if (selectedSubCategories.length > 0 && selectedSubCategories.includes(item)) {
            console.log("removed sub:-------------",item)
            setSelectedSubCategorie((prevFavorites) =>
            prevFavorites.filter((product) => product !== item));
        } else {
            console.log("added sub:-------------",item)
            setSelectedSubCategorie((prevSelected) => Array.isArray(prevSelected) ? [...prevSelected, item] : [item]);
        }

            //console.log("selected:-----------------------------------------------------------------",selected)

      };



      const SubCategoriesFilter = ({ subCategories, selectedCategories }) => 
        {
      

            let filteredSubData = [];

              filteredSubData = subCategories.filter((category) => selectedCategories.includes(category.categoryId));



            useEffect(() => {
                // Actions to perform when filteredSubData changes
                //console.log('filteredSubData changed:', filteredSubData);
              }, [selectedCategories]); // Dependency array includes filteredSubData to watch for changes
            

        return (
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles1.row}>

            {filteredSubData.map((category) => (
                <TouchableOpacity
                key={category.id}
                onPress={() => handleSubCategoriesSelection(category.subCategoryId)}
                style={[styles1.category, { borderColor: selectedSubCategories.includes(category.subCategoryId) ? COLORS1.primary : COLORS1.grey}]} 
                >
                <Text style={[styles1.subtitle]}> 
                    {category.subCategoryName}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </ScrollView>
        )
      
      };

    

    return(
           
            <View style={styles1.item}>




                    <View style={{ padding: 5, flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', flexWrap:'nowrap', borderBlockColor: 'red', borderWidth: 0}}>                     


                    <View style={{alignItems: 'center', width: '30%' }}>

                    <Dropdown
    

                        data={allStoresList}
                        style={[styles2.dropdown]}
                        placeholderStyle={styles2.placeholderStyle}
                        placeholder="Marketi"

                        inputSearchStyle={styles2.inputSearchStyle}

                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                                            
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                        }}

                        />

                        </View>
       
                    <TouchableOpacity onPress={() => handleOnSaleFilter()}>
                    <View style={{flexWrap: 'nowrap', flexDirection: 'col', alignItems: 'center' }}>
                        <Image id="favoriteImage"
                        source={
                            onSale ? require('./discount-fill.png') : require('./discount.png')                           
                        }
                        style={styles1.star}  />
                        <Text style={styles1.buttonText}>Ne zbritje</Text>
                        </View>
                    </TouchableOpacity>




                    <TouchableOpacity onPress={() =>  handleFavoritesFilter()}>
                    <View style={{flexWrap: 'nowrap', flexDirection: 'col', alignItems: 'center' }}>
                    <Image id="favoriteImage"
                        source={

                            isFavorite ? require('./star.png') : require('./white-star.png')
                        }
                        style={styles1.star} />
                        <Text style={styles1.buttonText}>Favoritet</Text>
                        </View>
                    </TouchableOpacity>
                    
                    

                    
                    <TouchableOpacity onPress={() =>  refreshFilters()}>
                    <View style={{ flexDirection: 'col', alignItems: 'center' }}>
                    <Image id="favoriteImage"
                        source={

                            require('./refresh.png')
                        }
                        style={styles1.star}  /> 
                        <Text style={styles1.buttonText}>Refresh</Text>
                        </View>
                    </TouchableOpacity>

              
                    </View>

{/*
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles1.row}>

                            <TouchableOpacity
                            onPress={() => {
                               // setSelectedCategories([])
                               handleCategoriesFilter(0, '');
                                 
                            }}
                            
                            style={[styles1.category, {borderColor: categoryId == 0 ? COLORS1.primary : COLORS1.grey}]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>Te gjitha</Text>
                        </TouchableOpacity>

                            {categories?.map((category) => (
                                <TouchableOpacity
                                key={category.id}
                                onPress={() => handleCategoriesFilter(category.categoryId, category.categoryName)}
                                style={[styles1.category, { borderColor: categoryId == category.categoryId ? COLORS1.primary : COLORS1.grey}]} 
                                >
                                <Text style={[styles1.subtitle]}> 
                                    {category.categoryName}
                                </Text>
                                </TouchableOpacity>
                            ))}
                            </View>
                        </ScrollView>

                      <SubCategoriesFilter subCategories={subCategories} selectedCategories={selectedCategories} />
                        */}
                </View>
                
    )
}

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    item: {
        marginVertical: 5,
    },
    title: {
        color: COLORS.title,
        fontWeight: 'bold',
        fontSize: SIZES.h3,
        marginVertical: 5,
    },
    input: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: COLORS.primary,
    },
    row: {
        flexDirection: 'row',
       
    },
    subtitle: {
 
        fontSize: 15,
        
    },
    buttonText: {
        fontSize: 12,
    },
    category: {
        margin: 3,
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
    },
    text: {
        color: COLORS.title,
        fontSize: SIZES.h4,
    },
    line: {
        backgroundColor: COLORS.lightGrey,
        height: 1,
        marginVertical: 10,
    },
    rowFilter: {
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    button: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTxt: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: SIZES.h4,
    },
    star: {
        width: 30,
        height: 30,
        marginRight: 8,
        marginTop: 8,
      },

});

const styles2 = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      width: '100%',

      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });


export default ProductCategories;