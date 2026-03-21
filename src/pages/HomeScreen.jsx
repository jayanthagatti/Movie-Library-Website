// // ─────────────────────────────────────────────────────────────────
// // HomeScreen.jsx — wires Part a) + Part b) together
// // File: src/componentsHomeScreen.jsx
// // ─────────────────────────────────────────────────────────────────

// import { useState } from "react";
// import Carousel from "../components/Carousel";
// import CurrentlyWatching from "../components/CurrentlyWatching";
// import "../styles/HomeScreen.css";

// export default function HomeScreen() {
//   // Currently Watching list lives here and is shared between
//   // the Carousel (to add) and the CurrentlyWatching section (to remove)
//   const [watchingList, setWatchingList] = useState([]);
//   const [toast, setToast] = useState(null);

//   // Show a brief toast notification
//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 2500);
//   };

//   // ── Called by Carousel's "+ Watching / ✓ Watching" button ──────
//   const handleToggleWatching = (movie) => {
//     const alreadyAdded = watchingList.some((m) => m.id === movie.id);

//     if (alreadyAdded) {
//       setWatchingList((prev) => prev.filter((m) => m.id !== movie.id));
//       showToast(`"${movie.title}" removed from watching`);
//     } else {
//       const progress = Math.floor(Math.random() * 60) + 5;
//       setWatchingList((prev) => [...prev, { ...movie, progress }]);
//       showToast(`"${movie.title}" added to currently watching`);
//     }
//   };

//   // ── Called by CurrentlyWatching's "✕ Remove" button ───────────
//   const handleRemoveFromWatching = (movieId) => {
//     const movie = watchingList.find((m) => m.id === movieId);
//     setWatchingList((prev) => prev.filter((m) => m.id !== movieId));
//     if (movie) showToast(`"${movie.title}" removed from watching`);
//   };

//   return (
//     <div className="home-page">
//       {/* ── Part a) Carousel ── */}
//       <Carousel
//         onToggleWatching={handleToggleWatching}
//         currentlyWatching={watchingList}
//       />

//       {/* ── Part b) Currently Watching ── */}
//       <CurrentlyWatching
//         watchingList={watchingList}
//         onRemove={handleRemoveFromWatching}
//       />

//       {/* Toast notification */}
//       {toast && <div className="toast">{toast}</div>}
//     </div>
//   );
// }


// ─────────────────────────────────────────────────────────────────
// HomeScreen.jsx — wires Carousel + CurrentlyWatching with real data
// File: src/pages/HomeScreen.jsx
// ─────────────────────────────────────────────────────────────────

// import { useState } from 'react';
// import Carousel           from '../components/Carousel';
// import CurrentlyWatching  from '../components/CurrentlyWatching';
// import '../styles/HomeScreen.css';

// export default function HomeScreen() {
//   const [watchingList, setWatchingList] = useState([]);
//   const [toast, setToast] = useState(null);

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(null), 2500);
//   };

//   // movie is a full OMDB object: { imdbID, Title, Poster, imdbRating, Year, ... }
//   const handleToggleWatching = (movie) => {
//     const alreadyAdded = watchingList.some(m => m.imdbID === movie.imdbID);
//     if (alreadyAdded) {
//       setWatchingList(prev => prev.filter(m => m.imdbID !== movie.imdbID));
//       showToast(`"${movie.Title}" removed from watching`);
//     } else {
//       const progress = Math.floor(Math.random() * 60) + 5;
//       setWatchingList(prev => [...prev, { ...movie, progress }]);
//       showToast(`"${movie.Title}" added to currently watching`);
//     }
//   };

//   const handleRemove = (imdbID) => {
//     const movie = watchingList.find(m => m.imdbID === imdbID);
//     setWatchingList(prev => prev.filter(m => m.imdbID !== imdbID));
//     if (movie) showToast(`"${movie.Title}" removed from watching`);
//   };

//   return (
//     <div className="home-page">
//       <Carousel onToggleWatching={handleToggleWatching} currentlyWatching={watchingList} />
//       <CurrentlyWatching watchingList={watchingList} onRemove={handleRemove} />
//       {toast && <div className="toast">{toast}</div>}
//     </div>
//   );
// }



// File: src/pages/HomeScreen.jsx

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Carousel          from '../components/Carousel';
import CurrentlyWatching from '../components/CurrentlyWatching';
import '../styles/HomeScreen.css';

export default function HomeScreen() {
  const user     = useSelector(s => s.auth.user);
  const navigate = useNavigate();

  const [watchingList, setWatchingList] = useState([]);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleWatching = (movie) => {
    const alreadyAdded = watchingList.some(m => m.imdbID === movie.imdbID);
    if (alreadyAdded) {
      setWatchingList(prev => prev.filter(m => m.imdbID !== movie.imdbID));
      showToast(`"${movie.Title}" removed from watching`);
    } else {
      const progress = Math.floor(Math.random() * 60) + 5;
      setWatchingList(prev => [...prev, { ...movie, progress }]);
      showToast(`"${movie.Title}" added to currently watching`);
    }
  };

  const handleRemove = (imdbID) => {
    const movie = watchingList.find(m => m.imdbID === imdbID);
    setWatchingList(prev => prev.filter(m => m.imdbID !== imdbID));
    if (movie) showToast(`"${movie.Title}" removed from watching`);
  };

  // Get first name only for greeting
  const firstName = user?.displayName
    ? user.displayName.split(' ')[0]
    : null;

  return (
    <div className="home-page">

      {/* ── Welcome banner — only shown when logged in ── */}
      {user && (
        <div className="home-welcome">
          <div className="home-welcome__left">
            <span className="home-welcome__wave">👋</span>
            <div>
              <h2 className="home-welcome__title">
                Welcome back, <span>{firstName || user.email}</span>!
              </h2>
              <p className="home-welcome__sub">Ready to watch something great?</p>
            </div>
          </div>
          <button
            className="home-welcome__edit-btn"
            onClick={() => navigate('/account')}
          >
            ✏️ Edit Name
          </button>
        </div>
      )}

      {/* ── Part a) Carousel ── */}
      <Carousel
        onToggleWatching={handleToggleWatching}
        currentlyWatching={watchingList}
      />

      {/* ── Part b) Currently Watching ── */}
      <CurrentlyWatching
        watchingList={watchingList}
        onRemove={handleRemove}
      />

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}