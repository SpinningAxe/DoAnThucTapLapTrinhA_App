import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/bookSlice';
import accountReducer from './slices/accountSlice';
import notificationReducer from './slices/notificationSlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    account: accountReducer,
    notification: notificationReducer,
    reviews: reviewReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'account/updateCreationField/fulfilled',
          'account/updateChapter/fulfilled',
          'account/fetchCreationById/fulfilled'
        ],
      },
    }),
});