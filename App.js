import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';


import React, { useState, useEffect } from 'react';
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

const supabaseUrl = 'https://zswcszamyxfowrkhrxhs.supabase.co';
//const supabaseKey = process.env.SUPABASE_KEY

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd2NzemFteXhmb3dya2hyeGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4OTEwMjQsImV4cCI6MjAyMDQ2NzAyNH0.Z81QBtrfsvcEqgKB44AuQvm6dmepyhJmrayEXuXfp2o';

const options = {
  auth: {
    storage:AsyncStorage,
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};
//const supabase = createClient(supabaseUrl, supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey, options);

const mystar = require('./white-star.png');
const favstar = require('./star.png');



const App = () => {



  const [originalData, setOriginalData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    setSelectedData([]);
    getData();
  }, []);



  async function getData() {
    const { data, error } = await supabase.from('products').select('id,name');
    setOriginalData(data);
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }



  const handleSelect = (item) => {
    setOriginalData((prevData) =>
      prevData.filter((data) => data.id !== item.id)
    );
    setSelectedData((prevData) => [...prevData, item]);
  };

  const handleViewProduct = (item) => {};

  const handleDeselect = (item) => {
    setSelectedData((prevData) =>
      prevData.filter((data) => data.id !== item.id)
    );
    setOriginalData((prevData) => [...prevData, item]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewProduct(item)}>
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => handleSelect(item)}>
          <Image source={mystar} style={styles.image} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle' }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSelected = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewProduct(item)}>
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => handleDeselect(item)}>
          <Image source={favstar} style={styles.image} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', verticalAlign:'middle'  }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  


  return (

    <SafeAreaView style={styles.container}>

    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'col', width: '45%' }}>
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
            Lista
          </Text>
          <FlatList
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
            data={originalData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
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
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
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
    padding: 20,
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
