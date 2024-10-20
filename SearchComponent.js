import React, { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';

const SearchComponent = ({ products, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View>
      <TextInput
        placeholder="Search products"
        value={query}
        onChangeText={handleSearch}
      />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default SearchComponent;