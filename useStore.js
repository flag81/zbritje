import {create} from 'zustand';



const useStore = create((set) => ({
  count: 0,
  myUserName: '',
  url : 'http://10.12.13.197:8800',
  admin: 1,
  subCategoryId: 0,
  categoryId: 0,
  storeId: 0,
  isFavorite: false,
  onSale: false,
  setMyUserName: (userData) => set((state) => ({ myUserName: userData })),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setSubCategoryId: (subCategoryId) => set(() => ({ subCategoryId: subCategoryId })),
  setCategoryId: (categoryId) => set(() => ({ categoryId: categoryId })),
  setStoreId: (storeId) => set(() => ({ storeId: storeId })),
  setIsFavorite: (isFavorite) => set(() => ({ isFavorite: isFavorite })),
  setOnSale: (onSale) => set(() => ({ onSale: onSale })),

}));

export default useStore;





