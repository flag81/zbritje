import {create} from 'zustand';



const useStore = create((set) => ({
  count: 0,
  myUserName: '',
  url : 'http://10.12.13.197:8800',
  admin: 1,
  setMyUserName: (userData) => set((state) => ({ myUserName: userData })),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;