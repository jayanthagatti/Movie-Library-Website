// // ─────────────────────────────────────────────────────────────────
// // PART a) Carousel to show Top Movies
// // File: src/components/pages/Carousel.jsx
// // ─────────────────────────────────────────────────────────────────

// import { useState, useEffect, useRef } from "react";
// import "../styles/Carousel.css";

// // Fixed list of top movies shown to ALL users
// const TOP_MOVIES = [
//   {
//     id: 1,
//     title: "Dune: Part Two",
//     genre: "Sci-Fi • Adventure",
//     year: 2024,
//     rating: "8.8",
//     description:
//       "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
//     poster: "🏜️",
//     bgColor: "#3d1f00",
//     accent: "#e8a44a",
//   },
//   {
//     id: 2,
//     title: "Oppenheimer",
//     genre: "Biography • Drama",
//     year: 2023,
//     rating: "8.9",
//     description:
//       "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
//     poster: "☢️",
//     bgColor: "#1a1a3d",
//     accent: "#7b8cf7",
//   },
//   {
//     id: 3,
//     title: "The Batman",
//     genre: "Action • Crime",
//     year: 2022,
//     rating: "7.8",
//     description:
//       "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
//     poster: "🦇",
//     bgColor: "#001a1a",
//     accent: "#00e5e5",
//   },
//   {
//     id: 4,
//     title: "Everything Everywhere",
//     genre: "Sci-Fi • Comedy",
//     year: 2022,
//     rating: "7.9",
//     description:
//       "An aging Chinese immigrant is swept up in an adventure to prevent a powerful being from destroying the multiverse.",
//     poster: "🌌",
//     bgColor: "#3d003d",
//     accent: "#f76bf7",
//   },
//   {
//     id: 5,
//     title: "Top Gun: Maverick",
//     genre: "Action • Drama",
//     year: 2022,
//     rating: "8.2",
//     description:
//       "After thirty years of service, Pete Mitchell is still pushing the envelope as a top naval aviator.",
//     poster: "✈️",
//     bgColor: "#001f3d",
//     accent: "#4ab3e8",
//   },
// ];

// export default function Carousel({ onToggleWatching, currentlyWatching }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const timerRef = useRef(null);

//   // Auto-play: advance slide every 5 seconds
//   const startAutoPlay = () => {
//     clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % TOP_MOVIES.length);
//     }, 5000);
//   };

//   useEffect(() => {
//     startAutoPlay();
//     return () => clearInterval(timerRef.current); // cleanup on unmount
//   }, []);

//   // Go to a specific slide and reset the auto-play timer
//   const goTo = (index) => {
//     setActiveIndex((index + TOP_MOVIES.length) % TOP_MOVIES.length);
//     startAutoPlay();
//   };

//   const currentMovie = TOP_MOVIES[activeIndex];
//   const isWatching = currentlyWatching.some((m) => m.id === currentMovie.id);

//   return (
//     <div className="carousel">
//       {/* ── Slides ── */}
//       {TOP_MOVIES.map((movie, i) => (
//         <div
//           key={movie.id}
//           className={`carousel__slide ${
//             i === activeIndex
//               ? "carousel__slide--active"
//               : "carousel__slide--inactive"
//           }`}
//           style={{
//             background: `linear-gradient(135deg, #000 0%, ${movie.bgColor} 70%)`,
//           }}
//         >
//           {/* Dark overlay for text readability */}
//           <div className="carousel__overlay" />

//           <div className="carousel__content">
//             <span className="carousel__poster">{movie.poster}</span>
//             <h1
//               className="carousel__title"
//               style={{ color: movie.accent }}
//             >
//               {movie.title}
//             </h1>
//             <p className="carousel__meta">
//               ⭐ {movie.rating}&nbsp;•&nbsp;{movie.genre}&nbsp;•&nbsp;
//               {movie.year}
//             </p>
//             <p className="carousel__desc">{movie.description}</p>

//             <div className="carousel__actions">
//               {/* Play button */}
//               <button className="btn-play">▶ Play Now</button>

//               {/* Add / Remove from Currently Watching */}
//               <button
//                 className={`btn-watching ${
//                   isWatching ? "btn-watching--active" : ""
//                 }`}
//                 onClick={() => onToggleWatching(currentMovie)}
//               >
//                 {isWatching ? "✓ Watching" : "+ Watching"}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* ── Prev / Next arrows ── */}
//       <button
//         className="carousel__arrow carousel__arrow--left"
//         onClick={() => goTo(activeIndex - 1)}
//       >
//         ‹
//       </button>
//       <button
//         className="carousel__arrow carousel__arrow--right"
//         onClick={() => goTo(activeIndex + 1)}
//       >
//         ›
//       </button>

//       {/* ── Dot indicators ── */}
//       <div className="carousel__dots">
//         {TOP_MOVIES.map((_, i) => (
//           <button
//             key={i}
//             className={`carousel__dot ${
//               i === activeIndex ? "carousel__dot--active" : ""
//             }`}
//             onClick={() => goTo(i)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }



// ─────────────────────────────────────────────────────────────────
// PART a) Carousel — uses real OMDB movies from Redux
// File: src/components/Carousel.jsx
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/Carousel.css';
 
const NO_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='445'%3E%3Crect width='300' height='445' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23aaa' font-size='16'%3ENo Poster%3C/text%3E%3C/svg%3E";
 
export default function Carousel({ onToggleWatching, currentlyWatching }) {
  const allMovies = useSelector(s => s.movies.all);
  const topMovies = allMovies.slice(0, 5);
  const navigate  = useNavigate();
 
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);
 
  const startAutoPlay = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % topMovies.length);
    }, 5000);
  };
 
  useEffect(() => {
    if (topMovies.length > 0) startAutoPlay();
    return () => clearInterval(timerRef.current);
  }, [topMovies.length]);
 
  const goTo = (index) => {
    setActiveIndex((index + topMovies.length) % topMovies.length);
    startAutoPlay();
  };
 
  if (topMovies.length === 0) return null;
 
  const currentMovie = topMovies[activeIndex];
  const isWatching   = currentlyWatching.some(m => m.imdbID === currentMovie.imdbID);
 
  return (
    <div className="carousel">
 
      {/* ── Slides ── */}
      {topMovies.map((movie, i) => (
        <div
          key={movie.imdbID}
          className={`carousel__slide ${
            i === activeIndex ? 'carousel__slide--active' : 'carousel__slide--inactive'
          }`}
        >
          {/* Real poster as full-bleed background — click to open detail */}
          <div
            className="carousel__bg"
            style={{
              backgroundImage: `url(${movie.Poster !== 'N/A' ? movie.Poster : NO_POSTER})`,
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/movie/${movie.imdbID}`)}
          />
 
          {/* Dark gradient overlay */}
          <div className="carousel__overlay" />
 
          <div className="carousel__content">
            <p className="carousel__genre">{movie.Genre}</p>
 
            {/* ── Title is clickable → navigates to detail page ── */}
            <h1
              className="carousel__title"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
            >
              {movie.Title}
            </h1>
 
            <p className="carousel__meta">
              ⭐ {movie.imdbRating}&nbsp;•&nbsp;{movie.Year}&nbsp;•&nbsp;{movie.Runtime}
            </p>
            <p className="carousel__desc">{movie.Plot}</p>
 
            <div className="carousel__actions">
              {/* Play → goes to detail page */}
              <button className="btn-play" onClick={() => {
    
                const query = encodeURIComponent(`${currentMovie.Title} ${currentMovie.Year} official trailer`);
                window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
            }}
>
            ▶ Play Now
          </button>
 
              {/* Add / Remove from Currently Watching */}
              <button
                className={`btn-watching ${isWatching ? 'btn-watching--active' : ''}`}
                onClick={() => onToggleWatching(currentMovie)}
              >
                {isWatching ? '✓ Watching' : '+ Watching'}
              </button>
            </div>
          </div>
        </div>
      ))}
 
      {/* ── Prev / Next arrows ── */}
      <button
        className="carousel__arrow carousel__arrow--left"
        onClick={() => goTo(activeIndex - 1)}
      >
        ‹
      </button>
      <button
        className="carousel__arrow carousel__arrow--right"
        onClick={() => goTo(activeIndex + 1)}
      >
        ›
      </button>
 
      {/* ── Dot indicators ── */}
      <div className="carousel__dots">
        {topMovies.map((_, i) => (
          <button
            key={i}
            className={`carousel__dot ${i === activeIndex ? 'carousel__dot--active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
 
    </div>
  );
}
 