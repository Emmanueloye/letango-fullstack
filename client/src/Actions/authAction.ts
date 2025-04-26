import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  verifyMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerMessage: (state, action) => {
      state.message = action.payload;
    },
    updateVerificationMsg: (state, action) => {
      state.verifyMessage = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
