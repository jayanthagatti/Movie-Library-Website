// src/AppRoutes.jsx
// All routes live here — safely INSIDE <BrowserRouter>
// so useLocation / useNavigate work without errors
 
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
 
// import Navbar          from './components/Navbar';
// import HomeScreen      from './pages/HomeScreen';
// import MovieDetailPage from './pages/MovieDetailPage';
// import LoginPage       from './pages/LoginPage';
// import AccountPage     from './pages/AccountPage';
 
// export default function AppRoutes() {
//   const location = useLocation();
//   const navigate  = useNavigate();
//   const filtered  = useSelector(s => s.movies.filtered);
 
//   // Hide navbar on the login page
//   const hideNav = location.pathname === '/login';
 
//   return (
//     <>
//       {!hideNav && <Navbar />}
 
//       <Routes>
 
//         {/* 1. Home — Carousel + Currently Watching */}
//         <Route path="/" element={<HomeScreen />} />
 
//         {/* 2. Individual Movie Detail Page */}
//         <Route path="/movie/:imdbID" element={<MovieDetailPage />} />
 
//         {/* 3. Login / Sign Up */}
//         <Route path="/login" element={<LoginPage />} />
 
//         {/* 4. Account Settings */}
//         <Route path="/account" element={<AccountPage />} />
 
//         {/* 5. Browse — full searchable movie grid */}
//         <Route path="/browse" element={
//           <div style={{
//             background: '#f4f5f7', minHeight: '100vh',
//             padding: '28px 32px',
//             fontFamily: 'Segoe UI, system-ui, sans-serif'
//           }}>
//             <h1 style={{ color: '#1a1a2e', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
//               🎬 All Movies — {filtered.length} results
//             </h1>
 
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
//               gap: 16,
//             }}>
//               {filtered.map(movie => (
//                 <div
//                   key={movie.imdbID}
//                   onClick={() => navigate(`/movie/${movie.imdbID}`)}
//                   style={{
//                     background: '#fff',
//                     borderRadius: 10,
//                     overflow: 'hidden',
//                     cursor: 'pointer',
//                     border: '1.5px solid #e8e8e8',
//                     transition: 'transform 0.2s, box-shadow 0.2s',
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.transform = 'translateY(-4px)';
//                     e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.transform = 'none';
//                     e.currentTarget.style.boxShadow = 'none';
//                   }}
//                 >
//                   <img
//                     src={movie.Poster !== 'N/A' ? movie.Poster : ''}
//                     alt={movie.Title}
//                     style={{
//                       width: '100%', height: 220,
//                       objectFit: 'cover', display: 'block',
//                       background: '#eee'
//                     }}
//                     onError={e => { e.target.style.display = 'none'; }}
//                   />
//                   <div style={{ padding: '10px 12px' }}>
//                     <p style={{
//                       color: '#1a1a2e', fontSize: 13, fontWeight: 700,
//                       margin: '0 0 4px', whiteSpace: 'nowrap',
//                       overflow: 'hidden', textOverflow: 'ellipsis'
//                     }}>
//                       {movie.Title}
//                     </p>
//                     <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
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


// src/AppRoutes.jsx

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar          from './components/Navbar';
import HomeScreen      from './pages/HomeScreen';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage       from './pages/LoginPage';
import AccountPage     from './pages/AccountPage';

// ── Protected Route ──────────────────────────────────────────────
// If user is NOT logged in → redirect to /login
// If user IS logged in → show the page normally
function ProtectedRoute({ children }) {
  const user = useSelector(s => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  const location = useLocation();
  const navigate  = useNavigate();
  const filtered  = useSelector(s => s.movies.filtered);
  const user      = useSelector(s => s.auth.user);

  // Hide navbar on login page
  const hideNav = location.pathname === '/login';

  return (
    <>
      {!hideNav && <Navbar />}

      <Routes>

        {/* ── Login / Sign Up — always accessible ── */}
        <Route path="/login" element={
          // If already logged in → go straight to home
          user ? <Navigate to="/" replace /> : <LoginPage />
        } />

        {/* ── Home — requires login ── */}
        <Route path="/" element={
          <ProtectedRoute><HomeScreen /></ProtectedRoute>
        } />

        {/* ── Movie Detail — requires login ── */}
        <Route path="/movie/:imdbID" element={
          <ProtectedRoute><MovieDetailPage /></ProtectedRoute>
        } />

        {/* ── Account Settings — requires login ── */}
        <Route path="/account" element={
          <ProtectedRoute><AccountPage /></ProtectedRoute>
        } />

        {/* ── Browse — requires login ── */}
        <Route path="/browse" element={
          <ProtectedRoute>
            <div style={{
              background: '#f4f5f7', minHeight: '100vh',
              padding: '28px 32px',
              fontFamily: 'Segoe UI, system-ui, sans-serif'
            }}>
              <h1 style={{ color: '#1a1a2e', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
                🎬 All Movies — {filtered.length} results
              </h1>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
              }}>
                {filtered.map(movie => (
                  <div
                    key={movie.imdbID}
                    onClick={() => navigate(`/movie/${movie.imdbID}`)}
                    style={{
                      background: '#fff',
                      borderRadius: 10,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1.5px solid #e8e8e8',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : ''}
                      alt={movie.Title}
                      style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', background: '#eee' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ color: '#1a1a2e', fontSize: 13, fontWeight: 700, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.Title}
                      </p>
                      <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
                        {movie.Year} · ⭐ {movie.imdbRating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProtectedRoute>
        } />

      </Routes>
    </>
  );
}