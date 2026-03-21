// // src/store/index.js
// import { configureStore } from '@reduxjs/toolkit';
// import moviesReducer from './moviesSlice';
// import authReducer from './authSlice';
// import useReducer from './authSlice';

// export const store = configureStore({
//   reducer: {
//     movies: moviesReducer,
//     auth:authReducer,
//     user:userReducer,
//   },
// });

// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer   from './moviesSlice';
import userDataReducer from './userDataSlice';
import authReducer     from './authSlice';

const store = configureStore({
  reducer: {
    movies:   moviesReducer,    // → state.movies
    userData: userDataReducer,  // → state.userData  ← this was missing
    auth:     authReducer,      // → state.auth
  },
});

export default store;