import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { collection, query, where, getDoc, getDocs, setDoc, updateDoc, deleteDoc, doc, Timestamp, documentId, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.39:3000";

const ACCOUNTS_API = `${API_BASE}/accounts`;
const TOKEN_KEY = "token";

const STORAGE_KEY = "user";

const initialState = {
  isLogin: false,

  userId: null,
  username: null, //in account
  creationIdList: [], //in account
  creationList: [],

  currentBookId: null, //in account
  currentBook: null,
  currentChapterNum: null, //in account
  chaptersOfCurrentBook: [],

  selectedCreation: null,
  chaptersOfSelectedCreation: [],

  fieldToUpdate: null,
  chapterToUpdate: null,

  newCreation: {},
  newCreationChapter: {},

  libraryBookIdList: [], //in account
  libraryBookList: [],

  notificationList: [], //in account

  user: null,

  uploading: false,
  loading: false,
  error: null,
}

const creationTemplate = {
  bookId: 0,
  cover: "",
  title: "",
  author: "",
  progressStatus: "",
  type: "",
  series: "",
  bookNum: "",
  description: "",
  genreList: [],
  language: "",
  translator: "",
  publishDate: "",
  lastUpdateDate: "",
  readCount: 0,
};

const creationChapterTemplate = {
  bookId: "",
  chapterId: "",
  chapterNum: "",
  chapterTitle: "",
  chapterContent: "",
  publishDate: "",
  lastUpdateDate: "",
};

//----------------------------------------------------------------------------------------//

// 🔹 Đăng ký tài khoản
export const registerUser = createAsyncThunk(
  "account/registerUser",
  async (
    { email, username, password, repeatPassword },
    { rejectWithValue }
  ) => {
    try {
      if (!email || !username || !password || !repeatPassword)
        return rejectWithValue("Vui lòng nhập đầy đủ thông tin!");
      if (password !== repeatPassword)
        return rejectWithValue("Mật khẩu nhập lại không khớp!");

      const res = await fetch(`${ACCOUNTS_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: username }),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data?.error || "Đăng ký thất bại!");
      }

      // BE trả { message, uid } -> chỉ thông báo và chuyển sang tab Đăng nhập
      Alert.alert("Thành công", "Đăng ký thành công, hãy đăng nhập!");
      return { uid: data.uid, email, username };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Đăng nhập
export const loginUser = createAsyncThunk(
  "account/loginUser",
  async ({ email, password, onSuccess }, { rejectWithValue }) => {
    try {
      if (!email || !password)
        return rejectWithValue("Vui lòng nhập đầy đủ thông tin!");

      const res = await fetch(`${ACCOUNTS_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data?.error || "Đăng nhập thất bại!");
      }

      const { token, user, userId } = data;

      await AsyncStorage.multiSet([
        [STORAGE_KEY, JSON.stringify(user)],
        [TOKEN_KEY, token],
      ]);

      Alert.alert(
        "Thành công",
        `Xin chào ${user?.name || user?.username || ""}!`
      );

      // Gọi callback điều hướng nếu có
      if (typeof onSuccess === "function") {
        onSuccess();
      }

      return { user, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------------------------------------------
// 🔥 LOGIN GOOGLE → FIREBASE → BACKEND
// ------------------------------------------------------
export const loginGoogle = createAsyncThunk(
  "account/loginGoogle",
  async ({ uid, email, name, photoURL, onSuccess }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${ACCOUNTS_API}/loginGoogle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email, name, photoURL }),
      });

      const data = await res.json();
      if (!res.ok)
        return rejectWithValue(data.error || "Đăng nhập Google thất bại!");

      // Lưu user Google + token vào máy
      await AsyncStorage.multiSet([
        [
          STORAGE_KEY,
          JSON.stringify({ uid, email, name, photoURL, provider: "google" }),
        ],
        [TOKEN_KEY, data.token],
      ]);

      Alert.alert("Xin chào!", `${name}`);

      if (typeof onSuccess === "function") onSuccess();

      return { uid, email, name, photoURL, provider: "google" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Load user khi mở lại app
export const loadUserFromStorage = createAsyncThunk(
  "account/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      } else {
        return null;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Cập nhật thông tin user (VD: avatar, username)
export const updateUserInfo = createAsyncThunk(
  "account/updateUserInfo",
  async (updatedData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentUser = state.account.user;
      
      if (!currentUser) {
        return rejectWithValue("Không tìm thấy người dùng!");
      }

      // Lấy token từ AsyncStorage để gọi API
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      // Gọi API backend để cập nhật thông tin
      try {
        const res = await fetch(`${ACCOUNTS_API}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        const data = await res.json();
        
        if (!res.ok) {
          // Nếu API không tồn tại hoặc lỗi, vẫn cập nhật local
          console.log("API update failed, updating local only:", data?.error || "API not available");
        } else {
          // API thành công, sử dụng data từ API
          const newUser = { ...currentUser, ...data.user || updatedData };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          Alert.alert("Thành công", "Cập nhật thông tin thành công!");
          return newUser;
        }
      } catch (apiError) {
        // Nếu API không khả dụng, chỉ cập nhật local
        console.log("API not available, updating local only:", apiError.message);
      }

      // Cập nhật local storage và Redux state
      const newUser = { ...currentUser, ...updatedData };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      return newUser;
    } catch (error) {
      console.error("Update user info error:", error);
      return rejectWithValue(error.message || "Không thể cập nhật thông tin!");
    }
  }
);

// 🔹 Quên mật khẩu (giả lập)
export const forgotPassword = createAsyncThunk(
  "account/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedUser) return rejectWithValue("Không tìm thấy tài khoản!");
      const user = JSON.parse(storedUser);

      if (user.email === email) {
        Alert.alert("Thành công", `Mật khẩu của bạn là: ${user.password}`);
        return true;
      } else {
        return rejectWithValue("Email không khớp với tài khoản đã đăng ký!");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//----------------------------------------------------------------------------------------//

export const TEMP_fetchTestAccount = createAsyncThunk(
  "account/TEMP_fetchTestAccount",
  async (_, { rejectWithValue }) => {
    // No parameters needed
    try {
      const docRef = doc(db, "Users", "testAccount"); // Hardcoded ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const accountData = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        console.log("Test account fetched successfully");
        return accountData;
      } else {
        throw new Error("Test account not found");
      }
    } catch (error) {
      console.error("Error fetching test account:", error);
      return rejectWithValue(error.message);
    }
  }
);

//----------------------------------------------------------------------------------------//
// CREATION CRUD FUNCTION
// CREATE
export const uploadNewCreationToFirestore = createAsyncThunk(
  "account/uploadNewCreationToFirestore",
  async ({ newCreation, newCreationChapter }, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, "Books", newCreation.bookId), newCreation);
      await setDoc(doc(db, "Chapters", newCreationChapter.chapterId), newCreationChapter);

      // await updateDoc(doc(db, "Users", userId), {
      //   CreationIdList: arrayUnion(newCreation.bookId)
      // });

      console.log("Book and Chapter uploaded successfully!");

      return {
        bookId: newCreation.bookId,
        chapterId: newCreationChapter.chapterId,
      };
    } catch (error) {
      console.error("Error uploading data to Firestore:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const uploadNewChapter = createAsyncThunk(
  "account/uploadNewChapter",
  async ({ newCreationChapter }, { rejectWithValue }) => {
    try {
      await setDoc(
        doc(db, "Chapters", newCreationChapter.chapterId),
        newCreationChapter
      );

      console.log("Chapter uploaded successfully!");
      return { chapterId: newCreationChapter.chapterId };
    } catch (error) {
      console.error("Error uploading data to Firestore:", error);
      return rejectWithValue(error.message);
    }
  }
);

// READ
export const fetchAccountCreations = createAsyncThunk(
  "books/fetchAccountCreations",
  async (bookIdList, { rejectWithValue }) => {
    try {
      if (!Array.isArray(bookIdList) || bookIdList.length === 0) {
        throw new Error("Invalid book IDs array");
      }

      if (bookIdList == null) {
        throw new Error("Book IDs array is null");
      }

      console.log(`Fetching ${bookIdList} books in batch...`);

      const books = [];

      // Process in smaller batches to avoid overwhelming Firestore
      const batchSize = 10;
      for (let i = 0; i < bookIdList.length; i += batchSize) {
        const batch = bookIdList.slice(i, i + batchSize);

        const batchPromises = batch.map(async (bookId) => {
          const docRef = doc(db, "Books", bookId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Format dates
            if (data.publishDate?.toDate) {
              const d = data.publishDate.toDate();
              data.publishDate = `${d.getDate()}/${d.getMonth() + 1
                }/${d.getFullYear()}`;
            }
            if (data.lastUpdateDate?.toDate) {
              const d = data.lastUpdateDate.toDate();
              data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1
                }/${d.getFullYear()}`;
            }

            return { id: docSnap.id, ...data };
          }
          return null;
        });

        const batchResults = await Promise.all(batchPromises);
        books.push(...batchResults.filter((book) => book !== null));
      }

      console.log(`Successfully fetched ${books.length} books`);
      return books;
    } catch (error) {
      console.error("Error fetching books by IDs:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const fetchCreationById = createAsyncThunk(
  "account/fetchCreationById",
  async (bookId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "Books"), where("bookId", "==", bookId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("fetchCreationById success");

        const data = querySnapshot.docs[0].data();
        if (data.publishDate?.toDate) {
          const d = data.publishDate.toDate();
          data.publishDate = `${d.getDate()}/${d.getMonth() + 1
            }/${d.getFullYear()}`;
        }
        if (data.lastUpdateDate?.toDate) {
          const d = data.lastUpdateDate.toDate();
          data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1
            }/${d.getFullYear()}`;
        }

        return data;
      } else {
        console.log("No book found with that bookId");
        return null;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchChaptersOfSelectedCreation = createAsyncThunk(
  "account/fetchChaptersOfSelectedCreation",
  async (bookId) => {
    console.log("fetchChaptersOfSelectedCreation called with bookId:", bookId);
    try {
      if (bookId == null) {
        throw new Error("Book IDs array is null");
      }
      const collectionRef = collection(db, "Chapters");
      const q = query(collectionRef, where("bookId", "==", bookId));
      const snapshot = await getDocs(q);
      const chapters = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.lastUpdateDate?.toDate) {
          const d = data.lastUpdateDate.toDate();
          data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1
            }/${d.getFullYear()}`;
        }
        if (data.createdDate?.toDate) {
          const d = data.createdDate.toDate();
          data.createdDate = `${d.getDate()}/${d.getMonth() + 1
            }/${d.getFullYear()}`;
        }
        return { id: doc.id, ...data };
      });
      console.log("chapters fetched:", chapters.length);
      return chapters;
    } catch (err) {
      console.error("fetchChaptersOfSelectedCreation failed:", err);
      throw err;
    }
  }
);

// UPDATE
export const updateCreationField = createAsyncThunk(
  "account/updateCreationField",
  async ({ bookId, fieldToUpdate, valueToUpdate }, { rejectWithValue }) => {
    try {
      console.log(bookId, fieldToUpdate, valueToUpdate);
      let updatedFields = {};
      switch (fieldToUpdate) {
        case "progressStatus":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            progressStatus: valueToUpdate,
          };
          break;
        case "title":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            title: valueToUpdate,
          };
          break;
        case "cover":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            cover: valueToUpdate,
          };
          break;
        case "genreList":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            genreList: valueToUpdate,
          };
          break;
        case "language":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            language: valueToUpdate,
          };
          break;
        case "translator":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            translator: valueToUpdate,
          };
          break;
        case "description":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            description: valueToUpdate,
          };
          break;
        case "series":
          updatedFields = {
            lastUpdateDate: Timestamp.now(),
            series: valueToUpdate[0],
            bookNum: valueToUpdate[1],
          };
          break;
        default:
          console.log("unknown fieldToUpdate");
      }

      console.log(updatedFields);
      await updateDoc(doc(db, "Books", bookId), updatedFields);

      console.log("Book updated successfully!");
      return { bookId, updatedFields };
    } catch (error) {
      console.error("Error updating book:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateChapter = createAsyncThunk(
  "account/updateChapter",
  async (
    { updatedTitle, updatedContent, chapterToUpdate },
    { rejectWithValue }
  ) => {
    try {
      let updatedFields = {
        lastUpdateDate: Timestamp.now(),
        chapterTitle: updatedTitle,
        chapterContent: updatedContent,
      };
      await updateDoc(
        doc(db, "Chapters", String(chapterToUpdate.id)),
        updatedFields
      );
      await updateDoc(doc(db, "Books", String(chapterToUpdate.bookId)), {
        lastUpdateDate: Timestamp.now(),
      });

      console.log("Book updated successfully!");
      return {};
    } catch (error) {
      console.error("Error updating book:", error);
      return rejectWithValue(error.message);
    }
  }
);

// DELETE
export const deleteBookAndChapters = createAsyncThunk(
  "account/deleteBookAndChapters",
  async (bookId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "Books", bookId));

      const chaptersQuery = query(
        collection(db, "Chapters"),
        where("bookId", "==", bookId)
      );
      const querySnapshot = await getDocs(chaptersQuery);

      for (const chapter of querySnapshot.docs) {
        await deleteDoc(doc(db, "Chapters", chapter.id));
      }

      console.log("deleteBookAndChapters success");
      return bookId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteChapter = createAsyncThunk(
  "account/deleteChapter",
  async ({ chapter }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "Chapters", chapter.id));
      console.log("Chapter deleted successfully!");
      return { chapterId: chapter.id };
    } catch (error) {
      console.error("Error deleting data to Firestore:", error);
      return rejectWithValue(error.message);
    }
  }
);

//----------------------------------------------------------------------------------------//
// CURRENT BOOK
export const updateCurrentBookAndChapter = createAsyncThunk(
  "accounts/updateCurrentBookAndChapter",
  async ({ currentBookId, currentChapterNum }, { getState, rejectWithValue }) => {
    try {
      if (currentBookId == null) return null;

      const state = getState();

      const accountId = state.account.user.id;
      const accountRef = doc(db, "Users", accountId);

      await updateDoc(accountRef, {
        currentBookId: String(currentBookId),
        currentBookChapterNum: currentChapterNum,
      });

      console.log(`Book ${currentBookId} is now current book`);
      return String(currentBookId);
    } catch (error) {
      console.error("Error removeBookFromLibrary:", error);
      return rejectWithValue(error.message);
    }
  }
)
export const fetchCurrentBookById = createAsyncThunk(
  "account/fetchCurrentBookById",
  async (bookId, { rejectWithValue }) => {
    try {
      if (!bookId) return null;

      const docRef = doc(db, "Books", String(bookId));
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log("No book found with that bookId");
        return null;
      }

      console.log("fetchCurrentBookById success");

      const data = docSnap.data();
      data.bookId = bookId; // ✅ add this line

      if (data.publishDate?.toDate) {
        const d = data.publishDate.toDate();
        data.publishDate = `${d.getDate()}/${d.getMonth() + 1
          }/${d.getFullYear()}`;
      }
      if (data.lastUpdateDate?.toDate) {
        const d = data.lastUpdateDate.toDate();
        data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1
          }/${d.getFullYear()}`;
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchChaptersOfCurrentBook = createAsyncThunk(
  "books/fetchChaptersOfCurrentBook",
  async (bookId) => {
    if (bookId == null && bookId == undefined) return null;
    console.log("fetchChaptersOfCurrentBook called with bookId:", bookId);
    try {
      const collectionRef = collection(db, "Chapters");
      const q = query(collectionRef, where("bookId", "==", bookId));
      const snapshot = await getDocs(q);
      const chapters = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.lastUpdateDate?.toDate) {
          const d = data.lastUpdateDate.toDate();
          data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1
            }/${d.getFullYear()}`;
        }
        if (data.createdDate?.toDate) {
          const d = data.createdDate.toDate();
          data.createdDate = `${d.getDate()}/${d.getMonth() + 1
            }/${d.getFullYear()}`;
        }
        return { id: doc.id, ...data };
      });
      console.log("chapters fetched:", chapters.length);
      return chapters;
    } catch (err) {
      console.error("fetchChaptersOfCurrentBook failed:", err);
      throw err;
    }
  }
);

//----------------------------------------------------------------------------------------//
// LIBRARY
export const fetchLibraryBooks = createAsyncThunk(
  "books/fetchLibraryBooks",
  async (bookIdList, { rejectWithValue }) => {
    try {
      if (!Array.isArray(bookIdList) || bookIdList.length === 0) {
        throw new Error("Invalid book IDs array");
      }
      if (bookIdList == null) {
        throw new Error("Book IDs array is null");
      }
      console.log(`Fetching ${bookIdList.length} books in batch...`);

      const books = [];

      // Process in smaller batches to avoid overwhelming Firestore
      const batchSize = 10;
      for (let i = 0; i < bookIdList.length; i += batchSize) {
        const batch = bookIdList.slice(i, i + batchSize);

        const batchPromises = batch.map(async (bookId) => {
          const docRef = doc(db, "Books", bookId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Format dates
            if (data.publishDate?.toDate) {
              const d = data.publishDate.toDate();
              data.publishDate = `${d.getDate()}/${d.getMonth() + 1
                }/${d.getFullYear()}`;
            }
            if (data.lastUpdateDate?.toDate) {
              const d = data.lastUpdateDate.toDate();
              data.lastUpdateDate = `${d.getDate()}/${d.getMonth() + 1
                }/${d.getFullYear()}`;
            }

            return { id: docSnap.id, ...data };
          }
          return null;
        });

        const batchResults = await Promise.all(batchPromises);
        books.push(...batchResults.filter((book) => book !== null));
      }

      console.log(`Successfully fetched ${books.length} books`);
      return books;
    } catch (error) {
      console.error("Error fetching books by IDs:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const addBookToLibrary = createAsyncThunk(
  "books/addBookToLibrary",
  async (bookId, { getState, rejectWithValue }) => {
    try {
      if (bookId == null) return null;

      const state = getState();
      if (!state.account.isLogin) throw new Error(`You need to login`);

      const accountId = state.account.user.id;
      const accountRef = doc(db, "Users", accountId);

      await updateDoc(accountRef, {
        libraryBookIdList: arrayUnion(String(bookId)),
      });

      console.log(`Book ${bookId} added to account ${accountId}'s library`);
      return String(bookId);
    } catch (error) {
      console.error("Error addBookToLibrary:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const removeBookFromLibrary = createAsyncThunk(
  "accounts/removeBookFromLibrary",
  async (bookId, { getState, rejectWithValue }) => {
    try {
      console.log(bookId);
      if (bookId == null) return null;

      const state = getState();
      if (!state.account.isLogin) throw new Error(`You need to login`);

      const accountId = state.account.user.id;
      const accountRef = doc(db, "Users", accountId);

      await updateDoc(accountRef, {
        libraryBookIdList: arrayRemove(String(bookId)),
      });

      console.log(`Book ${bookId} removed from account ${accountId}'s library`);
      return String(bookId);
    } catch (error) {
      console.error("Error removeBookFromLibrary:", error);
      return rejectWithValue(error.message);
    }
  }
);



const getCurrentDate = () => {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};

// 🔹 Logout user
export const logoutUser = createAsyncThunk(
  "account/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, TOKEN_KEY]);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    setSelectedCreation: (state, action) => {
      state.selectedCreation = action.payload;
      console.log("setSelectedCreation success");
    },
    setCreationField_1: (state, action) => {
      state.newCreation = {
        ...state.newCreation,
        ...action.payload,
      };
      console.log("setCreationField_1 success");
    },
    setCreationField_2: (state, action) => {
      state.newCreation = {
        ...state.newCreation,
        ...action.payload,
      };
      console.log("setCreationField_2 success");
    },
    setCreationField_3: (state, action) => {
      state.newCreationChapter = {
        ...creationChapterTemplate,
      };
      state.newCreationChapter.chapterTitle = action.payload.chapterTitle;
      state.newCreationChapter.chapterContent = action.payload.chapterContent;
      console.log("setCreationField_3 success");
    },
    setChapter: (state, action) => {
      state.newCreationChapter.bookId = action.payload.bookId;
      state.newCreationChapter.chapterNum = action.payload.chapterNum;
      state.newCreationChapter.chapterTitle = action.payload.chapterTitle;
      state.newCreationChapter.chapterContent = action.payload.chapterContent;

      console.log("setChapter success");
    },
    initNewCreation: (state) => {
      const today = getCurrentDate();
      const bookId = generateId();

      state.newCreation.publishDate = today;
      state.newCreation.lastUpdateDate = today;
      state.newCreation.bookId = bookId;
      state.newCreation.progressStatus = "đang cập nhật";

      const chId = generateId();
      state.newCreationChapter.bookId = bookId;
      state.newCreationChapter.chapterId = chId;
      state.newCreationChapter.chapterNum = 1;
      state.newCreationChapter.publishDate = today;
      state.newCreationChapter.lastUpdateDate = today;

      state.creationIdList = [...state.creationIdList, bookId];

      console.log("initNewCreation success");
    },
    initNewChapter: (state, action) => {
      const today = getCurrentDate();
      state.newCreationChapter.publishDate = today;
      state.newCreationChapter.lastUpdateDate = today;

      const id = generateId();
      state.newCreationChapter.chapterId = id;

      if (state.newCreationChapter.bookId == "")
        state.newCreationChapter.bookId = action.payload.bookId;
      if (state.newCreationChapter.chapterNum == "")
        state.newCreationChapter.chapterNum = action.payload.chapterNum;

      console.log("initNewChapter success");
    },
    clearNewCreation: (state) => {
      state.newCreation = {
        ...creationTemplate,
      };
      console.log("clearNewCreation success");
    },
    clearNewCreationChapter: (state) => {
      state.newCreationChapter = {
        ...creationChapterTemplate,
      };
      console.log("clearNewCreationChapter success");
    },
    setFieldToUpdate: (state, action) => {
      state.fieldToUpdate = action.payload;
      console.log("setFieldToUpdate success");
    },
    setChapterToUpdate: (state, action) => {
      state.chapterToUpdate = action.payload;
      console.log("setChapterToUpdate success");
    },
    setCurrentBookId: (state, action) => {
      state.currentBookId = action.payload;
      console.log("setChapterToUpdate success");
    },
    setCurrentChapterNum: (state, action) => {
      state.currentChapterNum = action.payload;
      console.log("setChapterToUpdate success");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountCreations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountCreations.fulfilled, (state, action) => {
        state.loading = false;
        state.creationList = action.payload;
      })
      .addCase(fetchAccountCreations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchChaptersOfSelectedCreation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChaptersOfSelectedCreation.fulfilled, (state, action) => {
        state.loading = false;
        state.chaptersOfSelectedCreation = action.payload.sort(
          (a, b) => a.chapterNum - b.chapterNum
        );
      })
      .addCase(fetchChaptersOfSelectedCreation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchChaptersOfCurrentBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChaptersOfCurrentBook.fulfilled, (state, action) => {
        state.loading = false;
        state.chaptersOfCurrentBook = action.payload.sort(
          (a, b) => a.chapterNum - b.chapterNum
        );
      })
      .addCase(fetchChaptersOfCurrentBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCreationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreation = action.payload;
      })
      .addCase(fetchCreationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCurrentBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchCurrentBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBookAndChapters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBookAndChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreation = null;
      })
      .addCase(deleteBookAndChapters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadNewCreationToFirestore.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadNewCreationToFirestore.fulfilled, (state, action) => {
        state.uploading = false;
      })
      .addCase(uploadNewCreationToFirestore.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCreationField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCreationField.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCreationField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateChapter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadNewChapter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadNewChapter.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(uploadNewChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChapter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLibraryBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLibraryBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.libraryBookList = action.payload;
      })
      .addCase(fetchLibraryBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(TEMP_fetchTestAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(TEMP_fetchTestAccount.fulfilled, (state, action) => {
        state.loading = false;

        state.isLogin = true;

        state.user = action.payload;

        state.currentBookId = action.payload.currentBookId;
        state.currentChapterNum = action.payload.currentBookChapterNum;
        state.creationIdList = action.payload.creationIdList;
        state.libraryBookIdList = action.payload.libraryBookIdList;
        state.notificationList = action.payload.notificationList;
        state.username = action.payload.username;
      })
      .addCase(TEMP_fetchTestAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addBookToLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookToLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.libraryBookIdList = [...state.libraryBookIdList, action.payload];
      })
      .addCase(addBookToLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeBookFromLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBookFromLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.libraryBookIdList = state.libraryBookIdList.filter(
          (bookId) => bookId !== action.payload
        );
      })
      .addCase(removeBookFromLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //----------------------------------------------------------------------------------------//
      // 🔹 Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        state.user = action.payload.user;
        state.userId = action.payload.userId;

        state.currentBookId = action.payload.user.currentBookId;
        state.currentChapterNum = action.payload.user.currentBookChapterNum;
        state.creationIdList = action.payload.user.creationIdList;
        state.libraryBookIdList = action.payload.user.libraryBookIdList;
        state.notificationList = action.payload.user.notificationList;
        state.username = action.payload.user.username;
        state.isLogin = true;
      })
      // login Google
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLogin = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isLogin = false;
        state.user = null;
        state.accountId = null;
        state.username = null;
        state.creationIdList = [];
        state.creationList = [];
        state.currentBookId = null;
        state.currentBook = null;
        state.currentChapterNum = null;
        state.chaptersOfCurrentBook = [];
        state.libraryBookIdList = [];
        state.libraryBookList = [];
        state.notificationList = [];
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update User Info
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Cập nhật user trong Redux state
        state.username = action.payload?.username || state.username;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //----------------------------------------------------------------------------------------//
    ;

  },
});
export const {
  setSelectedCreation,
  setFieldToUpdate,
  setChapterToUpdate,
  setCreationField_1,
  setCreationField_2,
  setCreationField_3,
  setChapter,
  initNewCreation,
  initNewChapter,
  clearNewCreation,
  clearNewCreationChapter,
  setCurrentBookId,
  setCurrentChapterNum,
} = accountSlice.actions;
export default accountSlice.reducer;
