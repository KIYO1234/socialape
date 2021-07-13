import { configureStore } from "@reduxjs/toolkit";
import screamReducer from '../features/screams/screamSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    screams: screamReducer,
    users: userReducer,
  }
})