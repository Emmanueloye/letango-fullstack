import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('darkMode') === 'true',
};

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    updateMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const modeAction = modeSlice.actions;
export default modeSlice.reducer;
