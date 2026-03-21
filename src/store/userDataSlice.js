//src/store/userSlice.js — handles watchlist, ratings, currently watching:
// Step 3 — User data slice (watchlist, watched, ratings)
// src/store/userDataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc, setDoc, deleteDoc,
  collection, getDocs, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
 
// ── Helper: convert Firebase Timestamp to plain string ──────────
// This prevents the Redux "non-serializable value" warning
const serializeDoc = (data) => {
  const result = { ...data };
  // Convert any Timestamp fields to ISO string
  Object.keys(result).forEach(key => {
    if (result[key] && typeof result[key].toDate === 'function') {
      result[key] = result[key].toDate().toISOString();
    }
  });
  return result;
};
 
// ── Watchlist ────────────────────────────────────────────────────
export const addToWatchlist = createAsyncThunk(
  'userData/addToWatchlist',
  async ({ uid, movie }) => {
    await setDoc(doc(db, 'users', uid, 'watchlist', movie.imdbID), {
      imdbID:  movie.imdbID,
      title:   movie.Title,
      poster:  movie.Poster,
      addedAt: serverTimestamp(),
    });
    return movie;
  }
);
 
export const removeFromWatchlist = createAsyncThunk(
  'userData/removeFromWatchlist',
  async ({ uid, imdbID }) => {
    await deleteDoc(doc(db, 'users', uid, 'watchlist', imdbID));
    return imdbID;
  }
);
 
// ── Watched ──────────────────────────────────────────────────────
export const markAsWatched = createAsyncThunk(
  'userData/markAsWatched',
  async ({ uid, movie }) => {
    await setDoc(doc(db, 'users', uid, 'watched', movie.imdbID), {
      imdbID:    movie.imdbID,
      title:     movie.Title,
      watchedAt: serverTimestamp(),
    });
    return movie;
  }
);
 
// ── Ratings ──────────────────────────────────────────────────────
export const rateMovie = createAsyncThunk(
  'userData/rateMovie',
  async ({ uid, imdbID, rating }) => {
    await setDoc(doc(db, 'users', uid, 'ratings', imdbID), {
      imdbID,
      rating,
      ratedAt: serverTimestamp(),
    });
    return { imdbID, rating };
  }
);
 
// ── Load all user data on login ──────────────────────────────────
// ✅ FIXED: uses serializeDoc() to convert Timestamps → strings
export const loadUserData = createAsyncThunk(
  'userData/load',
  async (uid) => {
    const [watchlistSnap, watchedSnap, ratingsSnap] = await Promise.all([
      getDocs(collection(db, 'users', uid, 'watchlist')),
      getDocs(collection(db, 'users', uid, 'watched')),
      getDocs(collection(db, 'users', uid, 'ratings')),
    ]);
 
    return {
      // ✅ serializeDoc converts addedAt/watchedAt Timestamps to strings
      watchlist: watchlistSnap.docs.map(d => serializeDoc(d.data())),
      watched:   watchedSnap.docs.map(d => serializeDoc(d.data())),
      ratings:   ratingsSnap.docs.map(d => serializeDoc(d.data())),
    };
  }
);
 
// ─────────────────────────────────────────────────────────────────
const userDataSlice = createSlice({
  name: 'userData',
  initialState: {
    watchlist: [],
    watched:   [],
    ratings:   [],
  },
  reducers: {
    clearUserData: (state) => {
      state.watchlist = [];
      state.watched   = [];
      state.ratings   = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.watchlist = action.payload.watchlist;
        state.watched   = action.payload.watched;
        state.ratings   = action.payload.ratings;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        // ✅ Store plain movie object — no Timestamp
        const exists = state.watchlist.find(m => m.imdbID === action.payload.imdbID);
        if (!exists) state.watchlist.push(action.payload);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.watchlist = state.watchlist.filter(m => m.imdbID !== action.payload);
      })
      .addCase(markAsWatched.fulfilled, (state, action) => {
        const exists = state.watched.find(m => m.imdbID === action.payload.imdbID);
        if (!exists) state.watched.push(action.payload);
      })
      .addCase(rateMovie.fulfilled, (state, action) => {
        const { imdbID, rating } = action.payload;
        const existing = state.ratings.find(r => r.imdbID === imdbID);
        if (existing) existing.rating = rating;
        else state.ratings.push({ imdbID, rating });
      });
  },
});
 
export const { clearUserData } = userDataSlice.actions;
export default userDataSlice.reducer;