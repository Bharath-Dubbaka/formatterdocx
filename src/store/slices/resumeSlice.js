import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  originalText: null,
  parsedSections: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setOriginalText: (state, action) => {
      state.originalText = action.payload;
    },
    setParsedSections: (state, action) => {
      state.parsedSections = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearResume: (state) => {
      state.originalText = null;
      state.parsedSections = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOriginalText,
  setParsedSections,
  setLoading,
  setError,
  clearResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;