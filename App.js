import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';



import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';

export default function App() {

  return (
    <NavigationContainer>
      <BottomTab />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  text: {
   
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});