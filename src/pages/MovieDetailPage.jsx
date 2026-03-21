// ─────────────────────────────────────────────────────────────────
// File: src/pages/MovieDetailPage.jsx
// Opens at: /movie/:imdbID
// Fetches full OMDB data via fetchMovieById (plot=full)
// ─────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, clearSelected } from '../store/moviesSlice';
import { addToWatchlist, removeFromWatchlist, markAsWatched } from '../store/userDataSlice';
import '../styles/MovieDetailPage.css';
 
const NO_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='445'%3E%3Crect width='300' height='445' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23aaa' font-size='16'%3ENo Poster%3C/text%3E%3C/svg%3E";
 
export default function MovieDetailPage() {
  const { imdbID } = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
 
  const { selected: movie, detailStatus: status, error } = useSelector(s => s.movies);
  const user      = useSelector(s => s.auth.user);
  const watchlist = useSelector(s => s.userData.watchlist);
  const watched   = useSelector(s => s.userData.watched);
 
  const isInWatchlist = watchlist.some(m => m.imdbID === imdbID);
  const isWatched     = watched.some(m => m.imdbID === imdbID);
 
  useEffect(() => {
    dispatch(fetchMovieById(imdbID));
    return () => dispatch(clearSelected());
  }, [imdbID, dispatch]);
 
  // ✅ handlePlay opens YouTube trailer
  const handlePlay = () => {
    const query = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };
 
  const handleWatchlist = () => {
    if (!user) return alert('Please log in first.');
    isInWatchlist
      ? dispatch(removeFromWatchlist({ uid: user.uid, imdbID: movie.imdbID }))
      : dispatch(addToWatchlist({ uid: user.uid, movie }));
  };
 
  const handleMarkWatched = () => {
    if (!user) return alert('Please log in first.');
    dispatch(markAsWatched({ uid: user.uid, movie }));
  };
 
  // ── Loading ──
  if (status === 'loading') {
    return (
      <div className="mdp-loading">
        <div className="mdp-spinner" />
        <p>Loading movie details...</p>
      </div>
    );
  }
 
  // ── Error ──
  if (status === 'failed') {
    return (
      <div className="mdp-error">
        <span>⚠️</span>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }
 
  if (!movie) return null;
 
  const rtRating   = movie.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
  const metaRating = movie.Ratings?.find(r => r.Source === 'Metacritic');
 
  return (
    <div className="mdp">
 
      {/* ── Top bar ── */}
      <div className="mdp-topbar">
        <button className="mdp-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
 
      {/* ── Hero ── */}
      <div className="mdp-hero">
 
        {/* Poster */}
        <div className="mdp-poster-wrap">
          <img
            className="mdp-poster"
            src={movie.Poster !== 'N/A' ? movie.Poster : NO_POSTER}
            alt={movie.Title}
            onError={e => { e.target.onerror = null; e.target.src = NO_POSTER; }}
          />
        </div>
 
        {/* Info */}
        <div className="mdp-info">
 
          {/* Badges */}
          <div className="mdp-badges">
            {movie.Rated && movie.Rated !== 'N/A' && (
              <span className="mdp-badge mdp-badge--rated">{movie.Rated}</span>
            )}
            {movie.Type && (
              <span className="mdp-badge mdp-badge--type">{movie.Type}</span>
            )}
            {isWatched && (
              <span className="mdp-badge mdp-badge--watched">✓ Watched</span>
            )}
          </div>
 
          {/* Title */}
          <h1 className="mdp-title">{movie.Title}</h1>
 
          {/* Meta */}
          <p className="mdp-meta">
            <span>{movie.Year}</span>
            {movie.Runtime !== 'N/A' && <><span className="mdp-sep">·</span><span>{movie.Runtime}</span></>}
            {movie.Genre   !== 'N/A' && <><span className="mdp-sep">·</span><span>{movie.Genre}</span></>}
          </p>
 
          {/* Ratings */}
          <div className="mdp-ratings">
            {movie.imdbRating !== 'N/A' && (
              <div className="mdp-rating-pill">
                <span className="mdp-rating-pill__emoji">⭐</span>
                <div>
                  <strong>{movie.imdbRating}</strong>
                  <small>IMDb</small>
                </div>
              </div>
            )}
            {rtRating && (
              <div className="mdp-rating-pill">
                <span className="mdp-rating-pill__emoji">🍅</span>
                <div>
                  <strong>{rtRating.Value}</strong>
                  <small>Rotten Tomatoes</small>
                </div>
              </div>
            )}
            {metaRating && (
              <div className="mdp-rating-pill">
                <span className="mdp-rating-pill__emoji">🎯</span>
                <div>
                  <strong>{metaRating.Value}</strong>
                  <small>Metacritic</small>
                </div>
              </div>
            )}
          </div>
 
          {/* Plot */}
          <p className="mdp-plot">{movie.Plot}</p>
 
          {/* ── Action buttons ── */}
          <div className="mdp-actions">
 
            {/* ✅ FIXED: onClick={handlePlay} added */}
            <button
              className="mdp-btn mdp-btn--play"
              onClick={handlePlay}
            >
              ▶ Play
            </button>
 
            <button
              className={`mdp-btn ${isInWatchlist ? 'mdp-btn--remove' : 'mdp-btn--watchlist'}`}
              onClick={handleWatchlist}
            >
              {isInWatchlist ? '✕ Remove from Watchlist' : '+ Add to Watchlist'}
            </button>
 
            {!isWatched && (
              <button className="mdp-btn mdp-btn--watched" onClick={handleMarkWatched}>
                ✓ Mark as Watched
              </button>
            )}
          </div>
 
        </div>
      </div>
 
      {/* ── Details Grid ── */}
      <div className="mdp-details">
        <h2 className="mdp-details__title">Movie Details</h2>
        <div className="mdp-grid">
          <DetailRow label="Director"   value={movie.Director} />
          <DetailRow label="Writer"     value={movie.Writer} />
          <DetailRow label="Cast"       value={movie.Actors} />
          <DetailRow label="Released"   value={movie.Released} />
          <DetailRow label="Language"   value={movie.Language} />
          <DetailRow label="Country"    value={movie.Country} />
          <DetailRow label="IMDb Votes" value={movie.imdbVotes} />
          <DetailRow label="Box Office" value={movie.BoxOffice} />
          {movie.Awards && movie.Awards !== 'N/A' && (
            <DetailRow label="🏆 Awards" value={movie.Awards} full />
          )}
        </div>
      </div>
 
    </div>
  );
}
 
function DetailRow({ label, value, full }) {
  if (!value || value === 'N/A') return null;
  return (
    <div className={`mdp-grid__item ${full ? 'mdp-grid__item--full' : ''}`}>
      <span className="mdp-grid__label">{label}</span>
      <span className="mdp-grid__value">{value}</span>
    </div>
  );
}