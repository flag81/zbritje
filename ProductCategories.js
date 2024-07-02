import React, { useState, useEffect} from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity , StyleSheet} from "react-native";
import { COLORS , SIZES} from "./theme";




const ProductCategories = ({data, onFilterChange, subData}) => {

    const [location, setLocation] = useState();
    const [cuisines, setCuisines] = useState(1);




    const COLORS1 = { primary: '#007bff', grey: '#d3d3d3' };

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategorie] = useState([]);

    const [currentCategory, setCurrentCategory] = useState('0');
    const [currentSubCategory, setSubCurrentCategory] = useState('0');


    const categoryId = 0;

    const categories = data;

    const subCategories = subData;


    useEffect(() => {

        setSelectedCategories([]);       
        sendFilteredCategories();

        console.log("Category data:-------------",data);
        


      }, []);


      
    useEffect(() => {

        //setSelected([]);
        console.log(" currentCategory data:-------------",currentCategory)
        //sendFilteredCategories();

        
      }, [currentCategory]);

      //let filteredSubData = [];

        useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)

        sendFilteredCategories();

       // filteredSubData = subData.filter((category) => selectedCategories.includes(category.categoryId));
        //console.log("filteredSubData:-------------",filteredSubData)
        

      }, [selectedCategories]);


      useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)
        sendFilteredSubCategories();

      }, [selectedSubCategories]);


    const sendFilteredCategories = () => {
        
        //console.log("New selected:",selected)
        onFilterChange(selectedCategories, selectedSubCategories);
      };


    const sendFilteredSubCategories = () => {
        
        //console.log("New selected:",selected)
        onFilterChange(selectedCategories, selectedSubCategories);
      };  


  

      const handleAddSelection = (item) => {

        //console.log("selected[]:-------------",selected)
        

        
    
        if (selectedCategories.length > 0 && selectedCategories.includes(item)) {
            console.log("removed:-------------",item);
             //set filterd  list of products
            setSelectedCategories((prevFavorites) =>
            prevFavorites.filter((product) => product !== item));
        } else {
            console.log("added:-------------",item)
            
            //set filterd  list of products
            setSelectedCategories((prevSelected) => Array.isArray(prevSelected) ? [...prevSelected, item] : [item]);
            setCurrentCategory(item);

            console.log("currentCategory:-------------",currentCategory)
        }
        
        // get sub categories list from all sub categories based on selected category on the selected array


        //filter sub categories based on selected category




            console.log("selected:-----------------------------------------------------------------",selectedCategories)

            console.log("currentCategory:-----------------------------------------------------------------",currentCategory)

            console.log("subCategories data:-------------",subCategories)

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

            const [subCat, setSubCat] = useState([]);

            useEffect(() => {
                // Actions to perform when filteredSubData changes
                console.log('filteredSubData changed:', filteredSubData);
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
                    <Text style={styles1.title}>KATEGORITE</Text>




                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles1.row}>

                            <TouchableOpacity
                            onPress={() => {
                                setSelectedCategories([])
                                 
                            }}
                            
                            
                            style={[styles1.category, {borderColor: selectedCategories.length == 0 ? COLORS1.primary : COLORS1.grey}]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>Te gjitha</Text>
                        </TouchableOpacity>

                            {categories.map((category) => (
                                <TouchableOpacity
                                key={category.id}
                                onPress={() => handleAddSelection(category.categoryId)}
                                style={[styles1.category, { borderColor: selectedCategories.includes(category.categoryId) ? COLORS1.primary : COLORS1.grey}]} 
                                >
                                <Text style={[styles1.subtitle]}> 
                                    {category.categoryName}
                                </Text>
                                </TouchableOpacity>
                            ))}
                            </View>
                        </ScrollView>



                      <SubCategoriesFilter subCategories={subCategories} selectedCategories={selectedCategories} />

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
        color: COLORS.grey,
        fontWeight: '700',
        fontSize: SIZES.h4,
    },
    category: {
        margin: 3,
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
        paddingHorizontal: 10,
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
    }

});


export default ProductCategories;