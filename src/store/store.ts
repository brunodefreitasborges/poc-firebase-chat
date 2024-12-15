// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'
import roomsReducer from './slices/roomsSlice'
import messagesReducer from './slices/messagesSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    messages: messagesReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
