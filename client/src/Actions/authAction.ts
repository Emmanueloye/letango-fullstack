import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  verifyMessage: '',
  passwordMessage: '',
  isAuth: false,
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
    passwordResetMsg: (state, action) => {
      state.passwordMessage = action.payload;
    },
    updateAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
