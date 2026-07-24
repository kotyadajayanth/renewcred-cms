import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { contentApi } from './contentApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [contentApi.reducerPath]: contentApi.reducer
  },
  middleware: (getDefault) => getDefault().concat(contentApi.middleware)
});
