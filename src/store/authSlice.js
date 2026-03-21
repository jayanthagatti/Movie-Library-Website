// ─────────────────────────────────────────────────────────────────
// File: src/store/authSlice.js
// Merged: original (signUp/logIn + Firestore profile) +
//         updated (loginUser/signupUser + updateProfile)
// ─────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// ── Sign Up ──────────────────────────────────────────────────────
// Creates Firebase Auth user + saves profile to Firestore
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Save display name to Firebase Auth profile
      await updateProfile(cred.user, { displayName });

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        displayName,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      return { uid: cred.user.uid, email, displayName };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Log In ───────────────────────────────────────────────────────
// Signs in and updates lastLogin timestamp in Firestore
export const logIn = createAsyncThunk(
  'auth/logIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Update last login time in Firestore
      await updateDoc(doc(db, 'users', cred.user.uid), {
        lastLogin: serverTimestamp(),
      });

      return {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Log Out ──────────────────────────────────────────────────────
export const logOut = createAsyncThunk('auth/logOut', async () => {
  await signOut(auth);
});

// ── Restore session on page reload ──────────────────────────────
export const listenToAuth = createAsyncThunk(
  'auth/listen',
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }));
        } else {
          dispatch(clearUser());
        }
        resolve();
      });
    });
  }
);

// ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,      // { uid, email, displayName }
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setUser(state, action)  { state.user = action.payload; },
    clearUser(state)        { state.user = null; },
  },
  extraReducers: (builder) => {
    builder
      // signUp
      .addCase(signUp.pending,   s => { s.status = 'loading';   s.error = null; })
      .addCase(signUp.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(signUp.rejected,  (s, a) => { s.status = 'failed';    s.error = a.payload; })
      // logIn
      .addCase(logIn.pending,   s => { s.status = 'loading';   s.error = null; })
      .addCase(logIn.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(logIn.rejected,  (s, a) => { s.status = 'failed';    s.error = a.payload; })
      // logOut
      .addCase(logOut.fulfilled, s => { s.user = null; s.status = 'idle'; });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
