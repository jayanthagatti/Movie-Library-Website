
// ─────────────────────────────────────────────────────────────────
// PART b) Currently Watching — real OMDB poster images
// File: src/components/CurrentlyWatching.jsx
// ─────────────────────────────────────────────────────────────────

// File: src/components/CurrentlyWatching.jsx

import { useNavigate } from 'react-router-dom';
import '../styles/CurrentlyWatching.css';
 
const NO_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='445'%3E%3Crect width='300' height='445' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23aaa' font-size='16'%3ENo Poster%3C/text%3E%3C/svg%3E";
 
function WatchingCard({ movie, onRemove }) {
  const navigate = useNavigate();
 
  // ✅ FIXED: handlePlay is INSIDE WatchingCard so it can access movie
  const handlePlay = (e) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${movie.Title} ${movie.Year} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };
 
  return (
    <div
      className="wc-card"
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
    >
      <div className="wc-card__poster-wrap">
        <img
          className="wc-card__poster"
          src={movie.Poster !== 'N/A' ? movie.Poster : NO_POSTER}
          alt={movie.Title}
          onError={e => { e.target.onerror = null; e.target.src = NO_POSTER; }}
        />
        <div className="wc-card__progress-bar">
          <div
            className="wc-card__progress-fill"
            style={{ width: `${movie.progress}%` }}
          />
        </div>
      </div>
 
      <div className="wc-card__info">
        <div className="wc-card__title">{movie.Title}</div>
        <div className="wc-card__meta">⭐ {movie.imdbRating} · {movie.Year}</div>
        <div className="wc-card__progress-text">{movie.progress}% watched</div>
 
        <div className="wc-card__actions">
          {/* ✅ FIXED: onClick points to handlePlay which is now inside this component */}
          <button
            className="wc-card__btn wc-card__btn--continue"
            onClick={handlePlay}
          >
            ▶ Continue
          </button>
 
          <button
            className="wc-card__btn wc-card__btn--remove"
            onClick={e => { e.stopPropagation(); onRemove(movie.imdbID); }}
          >
            ✕ Remove
          </button>
        </div>
      </div>
    </div>
  );
}
 
export default function CurrentlyWatching({ watchingList, onRemove }) {
  return (
    <section className="cw-section">
      <div className="cw-section__header">
        <h2 className="cw-section__title">
          ▶ Currently Watching
          {watchingList.length > 0 && (
            <span className="cw-section__badge">{watchingList.length}</span>
          )}
        </h2>
      </div>
 
      {watchingList.length === 0 ? (
        <div className="cw-empty">
          <span className="cw-empty__icon">📺</span>
          <p className="cw-empty__title">Nothing here yet</p>
          <p className="cw-empty__sub">
            Click &quot;+ Watching&quot; on any movie to add it here
          </p>
        </div>
      ) : (
        <div className="cw-row">
          {watchingList.map(movie => (
            <WatchingCard key={movie.imdbID} movie={movie} onRemove={onRemove} />
          ))}
        </div>
      )}
    </section>
  );
}