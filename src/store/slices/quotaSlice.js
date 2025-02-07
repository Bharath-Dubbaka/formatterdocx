import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quota: null,
  templates: [],
  loading: false,
  error: null,
};

const quotaSlice = createSlice({
  name: "quota",
  initialState,
  reducers: {
    setQuota: (state, action) => {
      state.quota = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addTemplate: (state, action) => {
      state.templates.push(action.payload);
    },
    removeTemplate: (state, action) => {
      state.templates = state.templates.filter(
        (template) => template.id !== action.payload
      );
    },
    clearQuota: (state) => {
      state.quota = null;
      state.templates = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setQuota,
  setTemplates,
  setLoading,
  setError,
  addTemplate,
  removeTemplate,
  clearQuota,
} = quotaSlice.actions;

export default quotaSlice.reducer;
