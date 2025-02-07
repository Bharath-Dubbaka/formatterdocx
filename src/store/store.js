import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quotaReducer from "./slices/quotaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quota: quotaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
