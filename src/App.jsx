
// src/App.js — ADD TEMPORARILY, REMOVE AFTER SEEDING
import { seedMovies } from './seedMovies';

// // src/App.jsx
// import { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllMovies } from './store/moviesSlice';
// import { loadUserData } from './store/userDataSlice';
// import { listenToAuth } from './store/authSlice';

// import Navbar          from './components/Navbar';
// import HomeScreen      from './pages/HomeScreen';
// import MovieDetailPage from './pages/MovieDetailPage';
// import LoginPage       from './pages/LoginPage';
// import AccountPage     from './pages/AccountPage';

// export default function App() {
//   const dispatch = useDispatch();
//   const { status, error } = useSelector(s => s.movies);
//   const user = useSelector(s => s.auth.user);

//   useEffect(() => { dispatch(listenToAuth()); },  [dispatch]);
//   useEffect(() => { dispatch(fetchAllMovies()); }, [dispatch]);
//   useEffect(() => {
//     if (user?.uid) dispatch(loadUserData(user.uid));
//   }, [user, dispatch]);

//   if (status === 'loading') {
//     return (
//       <div style={{ textAlign:'center', padding:'80px 20px', background:'#f4f5f7', minHeight:'100vh' }}>
//         <div style={{ fontSize:52, marginBottom:16 }}>🎬</div>
//         <h2 style={{ color:'#1a1a2e' }}>Loading movies...</h2>
//         <p style={{ color:'#888' }}>Fetching from OMDB API</p>
//       </div>
//     );
//   }

//   if (status === 'failed') {
//     return (
//       <div style={{ textAlign:'center', padding:'80px 20px', background:'#f4f5f7', minHeight:'100vh' }}>
//         <h2 style={{ color:'#e63946' }}>Something went wrong</h2>
//         <p style={{ color:'#888' }}>{error}</p>
//         <button onClick={() => dispatch(fetchAllMovies())}
//           style={{ padding:'10px 24px', background:'#e63946', color:'#fff', border:'none', borderRadius:7, fontWeight:600, cursor:'pointer' }}>
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// function AppContent() {
//   const location = useLocation();
//   const navigate  = useNavigate();
//   const filtered  = useSelector(s => s.movies.filtered);
//   const hideNav   = location.pathname === '/login';

//   return (
//     <>
//       {/* Navbar hidden on login page */}
//       {!hideNav && <Navbar />}

//       <Routes>
//         {/* 1. Home — Carousel + Currently Watching */}
//         <Route path="/"              element={<HomeScreen />} />

//         {/* 2. Individual Movie Detail Page */}
//         <Route path="/movie/:imdbID" element={<MovieDetailPage />} />

//         {/* 3. Login / Sign Up */}
//         <Route path="/login"         element={<LoginPage />} />

//         {/* 4. Account Settings */}
//         <Route path="/account"       element={<AccountPage />} />

//         {/* 5. Browse — full searchable/filterable movie grid */}
//         <Route path="/browse" element={
//           <div style={{ background:'#f4f5f7', minHeight:'100vh', padding:'28px 32px' }}>
//             <h1 style={{ color:'#1a1a2e', fontSize:22, fontWeight:700, marginBottom:20 }}>
//               🎬 All Movies — {filtered.length} results
//             </h1>
//             <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:16 }}>
//               {filtered.map(movie => (
//                 <div key={movie.imdbID}
//                   onClick={() => navigate(`/movie/${movie.imdbID}`)}
//                   style={{ background:'#fff', borderRadius:10, overflow:'hidden', cursor:'pointer', border:'1.5px solid #e8e8e8' }}
//                   onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'; }}
//                   onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
//                 >
//                   <img src={movie.Poster !== 'N/A' ? movie.Poster : ''} alt={movie.Title}
//                     style={{ width:'100%', height:220, objectFit:'cover', display:'block', background:'#eee' }} />
//                   <div style={{ padding:'10px 12px' }}>
//                     <p style={{ color:'#1a1a2e', fontSize:13, fontWeight:700, margin:'0 0 4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
//                       {movie.Title}
//                     </p>
//                     <p style={{ color:'#aaa', fontSize:12, margin:0 }}>
//                       {movie.Year} · ⭐ {movie.imdbRating}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         } />
//       </Routes>
//     </>
//   );
// }



// src/App.jsx
// import { useEffect } from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllMovies } from './store/moviesSlice';
// import { loadUserData } from './store/userDataSlice';
// import { listenToAuth } from './store/authSlice';
// import AppRoutes from './AppRoutes';

// export default function App() {
//   const dispatch = useDispatch();
//   const { status, error } = useSelector(s => s.movies);
//   const user = useSelector(s => s.auth.user);

//   useEffect(() => { dispatch(listenToAuth()); },  [dispatch]);
//   useEffect(() => { dispatch(fetchAllMovies()); }, [dispatch]);
//   useEffect(() => {
//     if (user?.uid) dispatch(loadUserData(user.uid));
//   }, [user, dispatch]);

//   // ── Loading ──
//   if (status === 'loading') {
//     return (
//       <div style={{
//         textAlign: 'center', padding: '80px 20px',
//         background: '#f4f5f7', minHeight: '100vh',
//         fontFamily: 'Segoe UI, system-ui, sans-serif'
//       }}>
//         <div style={{ fontSize: 52, marginBottom: 16 }}>🎬</div>
//         <h2 style={{ color: '#1a1a2e' }}>Loading movies...</h2>
//         <p style={{ color: '#888' }}>Fetching from OMDB API</p>
//       </div>
//     );
//   }

//   // ── Error ──
//   if (status === 'failed') {
//     return (
//       <div style={{
//         textAlign: 'center', padding: '80px 20px',
//         background: '#f4f5f7', minHeight: '100vh',
//         fontFamily: 'Segoe UI, system-ui, sans-serif'
//       }}>
//         <h2 style={{ color: '#e63946' }}>Something went wrong</h2>
//         <p style={{ color: '#888' }}>{error}</p>
//         <button
//           onClick={() => dispatch(fetchAllMovies())}
//           style={{
//             padding: '10px 24px', background: '#e63946',
//             color: '#fff', border: 'none', borderRadius: 7,
//             fontWeight: 600, cursor: 'pointer', fontSize: 14
//           }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // ── BrowserRouter wraps AppRoutes so hooks like
//   //    useLocation / useNavigate work inside AppRoutes ──
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }


import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMovies } from './store/moviesSlice';
import { loadUserData } from './store/userDataSlice';
import { listenToAuth } from './store/authSlice';
import AppRoutes from './AppRoutes';

export default function App() {
  const dispatch = useDispatch();
  const { status, error } = useSelector(s => s.movies);
  const user = useSelector(s => s.auth.user);

  // ── Offline detection ──
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => { dispatch(listenToAuth()); },  [dispatch]);
  useEffect(() => { dispatch(fetchAllMovies()); }, [dispatch]);
  useEffect(() => {
    if (user?.uid) dispatch(loadUserData(user.uid));
  }, [user, dispatch]);

  // ── Loading ──
  if (status === 'loading') {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        background: '#f4f5f7', minHeight: '100vh',
        fontFamily: 'Segoe UI, system-ui, sans-serif'
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎬</div>
        <h2 style={{ color: '#1a1a2e' }}>Loading movies...</h2>
        <p style={{ color: '#888' }}>Fetching from OMDB API</p>
      </div>
    );
  }

  // ── Error ──
  if (status === 'failed') {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        background: '#f4f5f7', minHeight: '100vh',
        fontFamily: 'Segoe UI, system-ui, sans-serif'
      }}>
        <h2 style={{ color: '#e63946' }}>Something went wrong</h2>
        <p style={{ color: '#888' }}>{error}</p>
        <button
          onClick={() => dispatch(fetchAllMovies())}
          style={{
            padding: '10px 24px', background: '#e63946',
            color: '#fff', border: 'none', borderRadius: 7,
            fontWeight: 600, cursor: 'pointer', fontSize: 14
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ── BrowserRouter wraps AppRoutes so hooks like
  //    useLocation / useNavigate work inside AppRoutes ──
  return (
    <BrowserRouter>
      {!isOnline && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: '#e63946', color: '#fff',
          padding: '10px 16px', textAlign: 'center',
          fontFamily: 'Segoe UI, system-ui, sans-serif',
          fontWeight: 600, fontSize: 14, zIndex: 9999
        }}>
          ⚠️ You are offline. Some features may not work.
        </div>
      )}
      <AppRoutes />
    </BrowserRouter>
  );
}