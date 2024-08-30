import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const StoreFilter = ({ storesData, onStoreFilterChange }) => {
  const [selectedStore, setSelectedStore] = useState(null);

  const handleStoreSelection = (storeId) => {
    setSelectedStore(storeId);
    onStoreFilterChange(storeId);
  };

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {storesData.map((store) => (
          <TouchableOpacity
            key={store.id}
            onPress={() => handleStoreSelection(store.id)}
            style={[
              styles.storeButton,
              { borderColor: selectedStore === store.id ? '#007bff' : '#d3d3d3' },
            ]}
          >
            <Text style={styles.storeName}>{store.name}</Text>
          </TouchableOpacity>
        ))}
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