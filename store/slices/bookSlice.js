import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const initialState = {
  booksDatabase: [],
  genreDatabase: [],

  selectedBook: null,
  chaptersOfSelectedBook: [],

  selectedChapter: null,

  searchKeyword: null,
  searchType: null,
  searchResults: [],

  bookListingTitle: null,
  booksForBookListing: [],

  loading: false,
  error: null,
}

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const snapshot = await getDocs(collection(db, "Books"));
  const books = snapshot.docs.map((doc) => {
    const data = doc.data();
    if (data.publishDate?.toDate) {
      const d = data.publishDate.toDate();
      data.publishDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    if (data.lastUpdateDate?.toDate) {
      const d = data.lastUpdateDate.toDate();
      data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    return { id: doc.id, ...data };
  });
  console.log("fetchBooks success");
  return books;
});

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'Books', bookId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return rejectWithValue('No such document!');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChaptersOfSelectedBook = createAsyncThunk(
  "books/fetchChaptersOfSelectedBook",
  async (bookId) => {
    console.log("fetchChaptersOfSelectedBook called with bookId:", bookId);
    try {
      const collectionRef = collection(db, "Chapters");
      const q = query(collectionRef, where("bookId", "==", String(bookId)));
      const snapshot = await getDocs(q);
      const chapters = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.lastUpdatedDate?.toDate) {
          const d = data.lastUpdateDated.toDate();
          data.lastUpdateDated = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }

        if (data.lastUpdateDate?.toDate) {
          const d = data.lastUpdateDate.toDate();
          data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
        if (data.createdDate?.toDate) {
          const d = data.createdDate.toDate();
          data.createdDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
        return { id: doc.id, ...data };
      });
      console.log("chapters fetched:", chapters.length);
      return chapters;
    } catch (err) {
      console.error("fetchChaptersOfSelectedBook failed:", err);
      throw err;
    }
  }
);

export const fetchBooksForBookListing = createAsyncThunk(
  "books/fetchBooksForBookListing",
  async (criteria, { rejectWithValue }) => {
    try {
      const snapshot = await getDocs(
        collection(db, "Books"),
        //limit(15)
      );
      const books = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.publishDate?.toDate) {
          const d = data.publishDate.toDate();
          data.publishDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
        if (data.lastUpdateDate?.toDate) {
          const d = data.lastUpdateDate.toDate();
          data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
        return { id: doc.id, ...data };
      });
      console.log("fetchBooksForBookListing success");
      return books;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (searchKeyword) => {
    console.log("searchBooks called with:", searchKeyword);

    try {
      const booksRef = collection(db, "Books");
      const results = [];

      const queries = [
        query(booksRef, where("title", "==", searchKeyword)),
        query(booksRef, where("author", "==", searchKeyword)),
        query(booksRef, where("series", "==", searchKeyword)),
        query(booksRef, where("genreDatabase", "array-contains", searchKeyword)),
      ];

      for (const q of queries) {
        const snapshot = await getDocs(q);
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.publishDate?.toDate) {
            const d = data.publishDate.toDate();
            data.publishDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
          }
          if (data.lastUpdateDate?.toDate) {
            const d = data.lastUpdateDate.toDate();
            data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
          }
          results.push({ id: doc.id, ...data });
        });
      }

      const uniqueResults = results.filter(
        (book, index, self) =>
          index === self.findIndex((b) => b.id === book.id)
      );

      console.log("Found books:", uniqueResults.length);
      return uniqueResults;
    } catch (err) {
      console.error("🔥 searchBooks failed:", err);
      throw err;
    }
  }
);

export const fetchGenre = createAsyncThunk("books/fetchGenre", async () => {
  const snapshot = await getDocs(collection(db, "Genre"));
  const genre = snapshot.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data };
  });
  console.log("fetchGenre success");
  return genre;
});

const booksSlice = createSlice({
  name: "books",
  initialState: initialState,
  reducers: {
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    setSelectedChapter: (state, action) => {
      state.selectedChapter = action.payload;
    },
    setBookListingTitle: (state, action) => {
      state.bookListingTitle = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.booksDatabase = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchChaptersOfSelectedBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChaptersOfSelectedBook.fulfilled, (state, action) => {
        state.loading = false;
        state.chaptersOfSelectedBook = action.payload.sort((a, b) => a.chapterNum - b.chapterNum);
      })
      .addCase(fetchChaptersOfSelectedBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch book';
      })
      .addCase(fetchBooksForBookListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksForBookListing.fulfilled, (state, action) => {
        state.loading = false;
        state.booksForBookListing = action.payload;
      })
      .addCase(fetchBooksForBookListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch book';
      })
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.booksForBookListing = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch book';
      })
      .addCase(fetchGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.genreDatabase = action.payload;
      })
      .addCase(fetchGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch genre';
      });
  }
});
export const {
  setSelectedBook,
  setSelectedChapter,
  setBookListingTitle,
  setSearchKeyword
} = booksSlice.actions;
export default booksSlice.reducer;
