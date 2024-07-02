import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: localStorage.getItem("darkMode") === "true"
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
      localStorage.setItem("darkMode", state.darkMode.toString());
    }
  }
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
