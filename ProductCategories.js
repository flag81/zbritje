import React, { useState, useEffect} from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity , StyleSheet} from "react-native";
import { COLORS , SIZES} from "./theme";




const ProductCategories = ({data, onFilterChange}) => {

    const [location, setLocation] = useState();
    const [cuisines, setCuisines] = useState(1);

    const [open, setOpen] = useState(false);
    const [creditCard, setCreditCard] = useState(false);
    const [free, setFree] = useState(false);


    const COLORS1 = { primary: '#007bff', grey: '#d3d3d3' };

    const [selected, setSelected] = useState([]);

    const [currentCategory, setCurrentCategory] = useState('0');
    const [activeBorderColor, setActiveBorderColor] = useState('grey');

    const categoryId = 0;

    const categories = data;


    useEffect(() => {

        setSelected([]);
        
        sendFilteredCategories();

        console.log("Category data:-------------",data)


      }, []);
      
    useEffect(() => {

        //setSelected([]);
        //console.log("New categories:-------------",data)
        sendFilteredCategories();

      }, [selected]);


    const sendFilteredCategories = () => {
        
        //console.log("New selected:",selected)
        onFilterChange(selected);
      };


      const handleAddSelection = (item) => {

        //console.log("selected[]:-------------",selected)
        setCurrentCategory(item);


        console.log("currentCategory:-------------",currentCategory)
    
        if (selected.length > 0 && selected.includes(item)) {
            console.log("removed:-------------",item)
            setSelected((prevFavorites) =>
            prevFavorites.filter((product) => product !== item));
        } else {
            console.log("added:-------------",item)
            setSelected((prevSelected) => Array.isArray(prevSelected) ? [...prevSelected, item] : [item]);
        }

        console.log("selected:-----------------------------------------------------------------",selected)

      };

      const renderCategoryItem = ({ item }) => 
        {
      
        const imageUrl = {uri:`${url}/images/${item.productPic}`};
      
        console.log("imageUrl:",imageUrl);
        //<MultiSelectComponent data={originalData}   onFilterChange={handleFilters} refreshing={refreshing}/>
      
        const favoriteProduct = favoritesData.some((obj) => obj.productId === item.productId);
      
        const sample = favoritesData.find((favorite) => favorite.productId === item.productId) ? require('./star.png') : require('./white-star.png')
        console.log("sample-", favoriteProduct)
      
      
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
    

    return(
           
                <View style={styles1.item}>
                    <Text style={styles1.title}>KATEGORITE</Text>




                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles1.row}>

                            <TouchableOpacity
                            onPress={() => {
                                setSelected([])
                                 
                            }}
                            
                            
                            style={[styles1.category, {borderColor: selected.length == 0 ? COLORS1.primary : COLORS1.grey}]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>Te gjitha</Text>
                        </TouchableOpacity>
                        
                            {categories.map((category) => (
                                <TouchableOpacity
                                key={category.id}
                                onPress={() => handleAddSelection(category.categoryId)}
                                style={[styles1.category, { borderColor: selected.includes(category.categoryId) ? COLORS1.primary : COLORS1.grey}]} 
                                >
                                <Text style={[styles1.subtitle]}> 
                                    {category.categoryName}
                                </Text>
                                </TouchableOpacity>
                            ))}
                            </View>
                        </ScrollView>


                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles1.row}>
                        
                        <TouchableOpacity
                            onPress={() => {
                                setSelected([])
                                 
                            }}
                            
                            
                            style={[styles1.category, {borderColor: selected.length == 0 ? COLORS1.primary : COLORS1.grey}]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>Te gjitha</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("1")
                                //currentCategory("1")
                                //setBorder(border === 'grey' ? 'red' : 'grey');
                            }}
                            style={[styles1.category, {borderColor: selected.includes("1") ? COLORS1.primary : COLORS1.grey}]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>Ushqimore</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("2")
                                
                            }}
                            style={[styles1.category, { borderColor: selected.includes("2") ? COLORS1.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 3 ? COLORS.primary : COLORS.grey }]}>Pije</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("3")
                            }}
                            style={[styles1.category, { borderColor: selected.includes("3")? COLORS1.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 4 ? COLORS.primary : COLORS.grey }]}>Fruta-Perime</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("4")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 5 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 5 ? COLORS.primary : COLORS.grey }]}>Higjiene</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("6")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 6 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 6 ? COLORS.primary : COLORS.grey }]}>Bulmet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("7")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 7 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 7 ? COLORS.primary : COLORS.grey }]}>Te tjera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("8")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 8 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 8 ? COLORS.primary : COLORS.grey }]}>Mexican</Text>
                        </TouchableOpacity>

  

                    </View>

                    </ScrollView>
                </View>
                
          

    )
}

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    item: {
        marginVertical: 10,
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