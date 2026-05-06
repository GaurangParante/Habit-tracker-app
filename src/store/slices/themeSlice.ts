import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ThemeMode} from '@/types/models';

type ThemeState = {
  mode: ThemeMode;
};

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
  },
});

export const themeSliceActions = themeSlice.actions;
export default themeSlice.reducer;
