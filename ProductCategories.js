import React, { useState, useEffect} from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity , StyleSheet} from "react-native";
import { COLORS , SIZES} from "./theme";

import Icon from 'react-native-vector-icons/FontAwesome'
import RangeSlider from "@jesster2k10/react-native-range-slider";


const ProductCategories = ({data, onFilterChange}) => {

    const [location, setLocation] = useState();
    const [cuisines, setCuisines] = useState(1);

    const [open, setOpen] = useState(false);
    const [creditCard, setCreditCard] = useState(false);
    const [free, setFree] = useState(false);


    const [selected, setSelected] = useState([]);


    useEffect(() => {

        //setSelected([]);
        
        sendFilteredCategories();

      }, []);
      
    useEffect(() => {

        //setSelected([]);
        console.log("New categories:-------------",data)
        sendFilteredCategories();

      }, [selected]);


    const sendFilteredCategories = () => {
        
        console.log("New selected:",selected)
        onFilterChange(selected);
      };


      const handleAddSelection = (item) => {
        setSelected((prevSelected) => [...prevSelected, item]);
        
      };
    
    
      const handleRemoveFavorites= (item) => {
        setSelected((prevFavorites) =>
          prevFavorites.filter((product) => product.productId !== item)
        );}



    return(
           

                <View style={styles1.item}>
                    <Text style={styles1.title}>KATEGORITE</Text>
                    <View style={styles1.row}>
                        <TouchableOpacity
                            onPress={() => {
                                setSelected(0)
                            }}
                            style={[styles1.category, { borderColor: cuisines === 1 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 1 ? COLORS.primary : COLORS.grey }]}>Te gjitha</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("1")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 2 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 2 ? COLORS.primary : COLORS.grey }]}>Ushqimore</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("2")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 3 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 3 ? COLORS.primary : COLORS.grey }]}>Pije</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => {
                                handleAddSelection("3")
                            }}
                            style={[styles1.category, { borderColor: cuisines === 4 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 4 ? COLORS.primary : COLORS.grey }]}>Higjiene</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(5)
                            }}
                            style={[styles1.category, { borderColor: cuisines === 5 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 5 ? COLORS.primary : COLORS.grey }]}>Fruta-Perime</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(6)
                            }}
                            style={[styles1.category, { borderColor: cuisines === 6 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 6 ? COLORS.primary : COLORS.grey }]}>Bulmet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(7)
                            }}
                            style={[styles1.category, { borderColor: cuisines === 7 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 7 ? COLORS.primary : COLORS.grey }]}>Te tjera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setCuisines(8)
                            }}
                            style={[styles1.category, { borderColor: cuisines === 8 ? COLORS.primary : COLORS.grey }]}
                        >
                            <Text style={[styles1.subtitle, { color: cuisines === 8 ? COLORS.primary : COLORS.grey }]}>Mexican</Text>
                        </TouchableOpacity>

  

                    </View>
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
        flexWrap: 'wrap',
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