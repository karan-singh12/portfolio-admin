import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  // First check global settings for theme style
  try {
    const globalSettings = localStorage.getItem('global_admin_settings');
    if (globalSettings) {
      const settings = JSON.parse(globalSettings);
      if (settings.theme?.themeStyle) {
        return settings.theme.themeStyle;
      }
    }
  } catch (error) {
    console.error('Error loading theme from global settings:', error);
  }
  
  // Fallback to localStorage theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Default to midnight_blue
  return 'midnight_blue';
};

const initialState = {
  currentTheme: getInitialTheme(),
  colorScheme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      state.colorScheme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      state.currentTheme = newTheme;
      state.colorScheme = newTheme;
      localStorage.setItem('theme', newTheme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

