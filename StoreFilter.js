import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";


import useStore from './useStore';


const StoreFilter = ({ data}) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [storesData, setStoresData] = useState([]);


  //const { admin, url } = useStore();

  const { admin, url, setStoreId } = useStore();

  async function getAllStores(userId) {

    try
    {
      const resp = await fetch(`${url}/getAllStores?userId=${userId}`,  {
        method: 'GET',       
        headers: {"Content-Type": "application/json"}
      });

        const data = await resp.json();
        console.log("all stores ----------------",data);
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

  const handleStoreSelection = (storeId) => {

    setStoreId(storeId);
    setSelectedStore(storeId);
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
              { borderColor: '#007bff' },
            ]}
          >
            
            <Text>Te gjitha</Text>
          </TouchableOpacity>
        {storesData.length > 0 ? storesData.map((store) => (
          <TouchableOpacity
            key={store.storeId}
            onPress={() => handleStoreSelection(store.storeId)}
            style={[
              styles.storeButton,
              { borderColor: selectedStore === store.storeId ? '#007bff' : '#d3d3d3' },
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
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  storeName: {
    color: '#000',
  },
});

export default StoreFilter;