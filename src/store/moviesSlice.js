// // src/store/moviesSlice.js


// src/store/moviesSlice.js — this is the main file that reads Firebase IDs then calls OMDB:



// File: src/store/moviesSlice.js
//
// HOW IT WORKS:
// 1st run ever  → fetch from OMDB → save to Firebase → done
// Every run after → load from Firebase → ZERO OMDB calls
// API key never expires from loading the movie list
 
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { doc, getDoc, updateDoc } from 'firebase/firestore'; // ← updateDoc added
// import { db } from '../firebase';
 
// const KEY = import.meta.env.VITE_OMDB_KEY;
 
// // ── Fetch all movies ─────────────────────────────────────────────
// export const fetchAllMovies = createAsyncThunk(
//   'movies/fetchAll',
//   async (_, { rejectWithValue, getState }) => {
 
//     // ✅ Step 1: Already loaded in Redux memory — return immediately
//     const { all } = getState().movies;
//     if (all.length > 0) {
//       console.log('Movies already in Redux — skipping fetch');
//       return all;
//     }
 
//     try {
//       const snap = await getDoc(doc(db, 'movies', 'movieList'));
//       if (!snap.exists()) return rejectWithValue('No movie list found in Firebase.');
 
//       const data = snap.data();
 
//       // ✅ Step 2: Movies already cached in Firebase — load directly
//       // This runs on EVERY page load after the first time
//       // Zero OMDB API calls used — API key never expires
//       if (data.movies && data.movies.length > 0) {
//         console.log(`✅ Loaded ${data.movies.length} movies from Firebase cache (0 OMDB calls)`);
//         return data.movies;
//       }
 
//       // ⚡ Step 3: First time only — fetch from OMDB then save to Firebase
//       // This only runs ONCE in the lifetime of your app
//       const { ids } = data;
//       console.log(`First time setup: fetching ${ids.length} movies from OMDB...`);
 
//       const results = await Promise.all(
//         ids.map(id =>
//           fetch(`https://www.omdbapi.com/?i=${id}&apikey=${KEY}`)
//             .then(r => r.json())
//             .catch(() => null)
//         )
//       );
 
//       const movies = results.filter(m => m && m.Response === 'True');
//       console.log(`Fetched ${movies.length} movies from OMDB`);
 
//       // ✅ Save movies to Firebase permanently
//       // After this runs once, Step 2 above will always be used instead
//       await updateDoc(doc(db, 'movies', 'movieList'), { movies });
//       console.log('✅ Movies saved to Firebase — OMDB will NEVER be called for the list again!');
 
//       return movies;
 
//     } catch (error) {
//       return rejectWithValue('Failed to load movies: ' + error.message);
//     }
//   }
// );
 
// // ── Fetch single movie for detail page ──────────────────────────
// // This uses 1 OMDB call per movie view — unavoidable for full details
// // But with 1000/day free limit, you can view 1000 movies per day
// export const fetchMovieById = createAsyncThunk(
//   'movies/fetchById',
//   async (imdbId, { rejectWithValue }) => {
//     try {
//       const res = await fetch(
//         `https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${KEY}`
//       );
//       const data = await res.json();
//       if (data.Response === 'False') return rejectWithValue(data.Error);
//       return data;
//     } catch {
//       return rejectWithValue('Could not load movie details.');
//     }
//   }
// );
 
// // ─────────────────────────────────────────────────────────────────
// const moviesSlice = createSlice({
//   name: 'movies',
//   initialState: {
//     all:          [],
//     filtered:     [],
//     selected:     null,
//     status:       'idle',    // for fetchAllMovies
//     detailStatus: 'idle',    // for fetchMovieById — separate so detail page works independently
//     error:        null,
//   },
//   reducers: {
//     filterMovies: (state, action) => {
//       const { query, genre, language } = action.payload;
//       let results = [...state.all];
//       if (query)
//         results = results.filter(m =>
//           m.Title.toLowerCase().includes(query.toLowerCase())
//         );
//       if (genre && genre !== 'All')
//         results = results.filter(m => m.Genre && m.Genre.includes(genre));
//       if (language && language !== 'All')
//         results = results.filter(m => m.Language && m.Language.includes(language));
//       state.filtered = results;
//     },
//     clearSelected: (state) => { state.selected = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ── fetchAllMovies ──
//       .addCase(fetchAllMovies.pending, s => {
//         s.status = 'loading';
//         s.error  = null;
//       })
//       .addCase(fetchAllMovies.fulfilled, (s, a) => {
//         s.status   = 'succeeded';
//         s.all      = a.payload;
//         s.filtered = a.payload;
//       })
//       .addCase(fetchAllMovies.rejected, (s, a) => {
//         s.status = 'failed';
//         s.error  = a.payload;
//       })
 
//       // ── fetchMovieById — uses detailStatus so it doesn't affect the main list ──
//       .addCase(fetchMovieById.pending, s => {
//         s.detailStatus = 'loading';
//         s.error        = null;
//       })
//       .addCase(fetchMovieById.fulfilled, (s, a) => {
//         s.detailStatus = 'succeeded';
//         s.selected     = a.payload;
//       })
//       .addCase(fetchMovieById.rejected, (s, a) => {
//         s.detailStatus = 'failed';
//         s.error        = a.payload;
//       });
//   },
// });
 
// export const { filterMovies, clearSelected } = moviesSlice.actions;
// export default moviesSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'; // ← setDoc added
import { db } from '../firebase';

const KEY = import.meta.env.VITE_OMDB_KEY;

// ── Fetch all movies ─────────────────────────────────────────────
export const fetchAllMovies = createAsyncThunk(
  'movies/fetchAll',
  async (_, { rejectWithValue, getState }) => {

    // ✅ Step 1: Already loaded in Redux memory — return immediately
    const { all } = getState().movies;
    if (all.length > 0) {
      console.log('Movies already in Redux — skipping fetch');
      return all;
    }

    try {
      const snap = await getDoc(doc(db, 'movies', 'movieList'));
      if (!snap.exists()) return rejectWithValue('No movie list found in Firebase.');

      const data = snap.data();

      // ✅ Step 2: Movies already cached in Firebase — load directly
      if (data.movies && data.movies.length > 0) {
        console.log(`✅ Loaded ${data.movies.length} movies from Firebase cache (0 OMDB calls)`);
        return data.movies;
      }

      // ⚡ Step 3: First time only — fetch from OMDB then save to Firebase
      const { ids } = data;
      console.log(`First time setup: fetching ${ids.length} movies from OMDB...`);

      const results = await Promise.all(
        ids.map(id =>
          fetch(`https://www.omdbapi.com/?i=${id}&apikey=${KEY}`)
            .then(r => r.json())
            .catch(() => null)
        )
      );

      const movies = results.filter(m => m && m.Response === 'True');
      console.log(`Fetched ${movies.length} movies from OMDB`);

      // ✅ Save movies to Firebase permanently
      await updateDoc(doc(db, 'movies', 'movieList'), { movies });
      console.log('✅ Movies saved to Firebase — OMDB will NEVER be called for the list again!');

      return movies;

    } catch (error) {
      return rejectWithValue('Failed to load movies: ' + error.message);
    }
  }
);

// ── Fetch single movie for detail page ──────────────────────────
export const fetchMovieById = createAsyncThunk(
  'movies/fetchById',
  async (imdbId, { rejectWithValue, getState }) => {
    try {
      // ✅ Step 1: Check Redux memory first
      const { all } = getState().movies;
      const cached = all.find(m => m.imdbID === imdbId);
      if (cached?.Plot) {
        console.log('Movie detail already in Redux — skipping OMDB call');
        return cached;
      }

      // ✅ Step 2: Check Firestore cache
      const snap = await getDoc(doc(db, 'movieDetails', imdbId));
      if (snap.exists()) {
        console.log('Movie detail loaded from Firestore cache');
        return snap.data();
      }

      // ⚡ Step 3: Fetch from OMDB (only first time this movie is viewed)
      const res = await fetch(
        `https://www.omdbapi.com/?i=${imdbId}&plot=full&apikey=${KEY}`
      );
      const data = await res.json();
      if (data.Response === 'False') return rejectWithValue(data.Error);

      // ✅ Save to Firestore so future views use cache
      await setDoc(doc(db, 'movieDetails', imdbId), data);
      console.log("Movie detail saved to Firestore — OMDB won't be called again for this movie");

      return data;

    } catch {
      return rejectWithValue('Could not load movie details.');
    }
  }
);

// ─────────────────────────────────────────────────────────────────
const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    all:          [],
    filtered:     [],
    selected:     null,
    status:       'idle',
    detailStatus: 'idle',
    error:        null,
  },
  reducers: {
    filterMovies: (state, action) => {
      const { query, genre, language } = action.payload;
      let results = [...state.all];
      if (query)
        results = results.filter(m =>
          m.Title.toLowerCase().includes(query.toLowerCase())
        );
      if (genre && genre !== 'All')
        results = results.filter(m => m.Genre && m.Genre.includes(genre));
      if (language && language !== 'All')
        results = results.filter(m => m.Language && m.Language.includes(language));
      state.filtered = results;
    },
    clearSelected: (state) => { state.selected = null; },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchAllMovies ──
      .addCase(fetchAllMovies.pending, s => {
        s.status = 'loading';
        s.error  = null;
      })
      .addCase(fetchAllMovies.fulfilled, (s, a) => {
        s.status   = 'succeeded';
        s.all      = a.payload;
        s.filtered = a.payload;
      })
      .addCase(fetchAllMovies.rejected, (s, a) => {
        s.status = 'failed';
        s.error  = a.payload;
      })

      // ── fetchMovieById ──
      .addCase(fetchMovieById.pending, s => {
        s.detailStatus = 'loading';
        s.error        = null;
      })
      .addCase(fetchMovieById.fulfilled, (s, a) => {
        s.detailStatus = 'succeeded';
        s.selected     = a.payload;
      })
      .addCase(fetchMovieById.rejected, (s, a) => {
        s.detailStatus = 'failed';
        s.error        = a.payload;
      });
  },
});

export const { filterMovies, clearSelected } = moviesSlice.actions;
export default moviesSlice.reducer;