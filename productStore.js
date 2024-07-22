import { create } from "zustand";

const productStore = (set, get) => ({
  books: [],
  noOfAvailable: 0,
  noOfIssued: 0,
  addBook: (book) => {
    set((state) => ({
      books: [...state.books, { ...book, status: "available" }],
      noOfAvailable: state.noOfAvailable + 1,
    }));
  },
  issueBook: (id) => {
    const books = get().books;
    const updatedBooks = books?.map((book) => {
      if (book.id === id) {
        return {
          ...book,
          status: "issued",
        };
      } else {
        return book;
      }
    });
    set((state) => ({
      books: updatedBooks,
      noOfAvailable: state.noOfAvailable - 1,
      noOfIssued: state.noOfIssued + 1,
    }));
  },
  returnBook: (id) => {
    const books = get().books;
    const updatedBooks = books?.map((book) => {
      if (book.id === id) {
        return {
          ...book,
          status: "available",
        };
      } else {
        return book;
      }
    });
    set((state) => ({
      books: updatedBooks,
      noOfAvailable: state.noOfAvailable + 1,
      noOfIssued: state.noOfIssued - 1,
    }));
  },
  reset: () => {
    set({
      books: [],
      noOfAvailable: 0,
      noOfIssued: 0,
    });
  },
});

const useproductStore = create(productStore);

export default useproductStore;