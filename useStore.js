import { setAutoServerRegistrationEnabledAsync } from 'expo-notifications';
import {create} from 'zustand';



const useStore = create((set) => ({
  count: 0,
  myUserName: '',
  //url : 'http://10.12.13.197:8800',
  url : 'http://192.168.1.6:8801',
  //url : 'https://nodejs-production-18ad6.up.railway.app',
  admin: 1,
  subCategoryId: 0,
  categoryId: 0,
  storeId: 0,
  isFavorite: false,
  onSale: false,
  searchText: '',
  userId:0,
  myUserId:0,
  expoToken: '',
  localStoreExpoToken: '',
  setMyUserName: (userData) => set((state) => ({ myUserName: userData })),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setSubCategoryId: (subCategoryId) => set(() => ({ subCategoryId: subCategoryId })),
  setCategoryId: (categoryId) => set(() => ({ categoryId: categoryId })),
  setStoreId: (storeId) => set(() => ({ storeId: storeId })),
  setIsFavorite: (isFavorite) => set(() => ({ isFavorite: isFavorite })),
  setOnSale: (onSale) => set(() => ({ onSale: onSale })),
  setUserId: (userId) => set(() => ({ userId: userId })),
  setAdmin: (admin) => set(() => ({ admin: admin })),
  
  //write a function to set the onSearchFilterIdList with an array of productIds
  setSearchText: (searchText) => set(() => ({ searchText: searchText })),
  setExpoToken: (expoToken) => set(() => ({ expoToken: expoToken })),
  setMyUserId: (myUserId) => set(() => ({ myUserId: myUserId })),
  setLocalStoreExpoToken: (localStoreExpoToken) => set(() => ({ localStoreExpoToken: localStoreExpoToken })),

}));

export default useStore;





