import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/bookSlice';
import accountReducer from './slices/accountSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    books: booksReducer,
    account: accountReducer,
    notification: notificationReducer
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