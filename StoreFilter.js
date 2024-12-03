import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";


import useStore from './useStore';
import {showToast}  from './apiUtils';


const StoreFilter = ({ data}) => {
  const [selectedStore, setSelectedStore] = useState(0);
  const [storesData, setStoresData] = useState([]);


  //const { admin, url } = useStore();

  const { admin, url, storeId, setStoreId, setStoreName } = useStore();

  async function getAllStores(userId) {

    try
    {

      console.log("called getAllStores with userId:", userId);

      const resp = await fetch(`${url}/getAllStores?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

        const data = await resp.json();
        console.log("returned getAllStores with userId all stores:",data);
        setStoresData(data);
        return data;


    }
    catch(e)
    {
      console.log(e);
    }

  }

    useEffect(() => {
        setStoresData(getAllStores(admin));
    }, []);


    useEffect(() => {
        console.log("storesData changed", storesData);
    }, [storesData]);


  //setStoresData(getAllStores(1));

  //console.log("storesData", storesData);

  const handleStoreSelection = (storeId, storeName) => {

    console.log("handleStoreSelection", storeId, storeName);  

    setStoreId(storeId);
    setSelectedStore(storeId);
    setStoreName(storeName);
    //onStoreFilterChange();
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
      <TouchableOpacity
            key={0}
            onPress={() => handleStoreSelection(0)}
            style={[
              styles.storeButton,
              { borderColor: storeId === 0 ? '#007bff' : '#d3d3d3' },
            ]}
          >

            
            <Text>Te gjitha</Text>
          </TouchableOpacity>
        {storesData.length > 0 ? storesData.map((store) => (
          <TouchableOpacity
            key={store.storeId}
            onPress={() => handleStoreSelection(store.storeId, store.storeName)}
            style={[
              styles.storeButton,
              { borderColor: storeId === store.storeId ? '#007bff' : '#d3d3d3' },
            ]}
          >
            <Text style={styles.storeName}>{store.storeName}</Text>
          </TouchableOpacity>
        )): null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
   
  },
  storeButton: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  storeName: {
    color: '#000',
  },
});

export default StoreFilter;