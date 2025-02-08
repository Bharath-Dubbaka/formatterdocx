import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quotaReducer from "./slices/quotaSlice";
import resumeReducer from "./slices/resumeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quota: quotaReducer,
    resume: resumeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
