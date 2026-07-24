import { createSlice } from '@reduxjs/toolkit';

// auth is the one thing that genuinely needs to be global - almost every admin
// screen and every API call needs to know "are we logged in" and "what's the token".
// everything else (form fields, which modal is open, which tab is active) stays as
// local component state, it doesn't need to be shared across the app.
const initialState = {
  token: null,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('renewcred_token', action.payload.token);
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('renewcred_token');
      }
    },
    restoreToken(state, action) {
      state.token = action.payload;
    }
  }
});

export const { setCredentials, logout, restoreToken } = authSlice.actions;
export default authSlice.reducer;
