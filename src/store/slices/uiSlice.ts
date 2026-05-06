import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type UiState = {
  todoFilter: 'all' | 'active' | 'completed';
};

const initialState: UiState = {
  todoFilter: 'all',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTodoFilter(state, action: PayloadAction<UiState['todoFilter']>) {
      state.todoFilter = action.payload;
    },
  },
});

export const uiSliceActions = uiSlice.actions;
export default uiSlice.reducer;
