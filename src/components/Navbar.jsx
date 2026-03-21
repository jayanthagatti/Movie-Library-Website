// File: src/components/Navbar.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { filterMovies } from '../store/moviesSlice';
import { logOut } from '../store/authSlice';
import '../styles/Navbar.css';

const GENRES = [
  'All','Action','Adventure','Animation','Biography','Comedy',
  'Crime','Documentary','Drama','Fantasy','History','Horror',
  'Music','Mystery','Romance','Sci-Fi','Sport','Thriller','War','Western',
];
const LANGUAGES = [
  'All','English','Hindi','French','Spanish','German',
  'Japanese','Korean','Italian','Mandarin','Portuguese',
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(s => s.auth.user);

  const [query,    setQuery]    = useState('');
  const [genre,    setGenre]    = useState('All');
  const [language, setLanguage] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = () => {
    dispatch(filterMovies({ query, genre, language }));
    navigate('/browse');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleGenre = (e) => {
    const val = e.target.value;
    setGenre(val);
    dispatch(filterMovies({ query, genre: val, language }));
    navigate('/browse');
  };

  const handleLanguage = (e) => {
    const val = e.target.value;
    setLanguage(val);
    dispatch(filterMovies({ query, genre, language: val }));
    navigate('/browse');
  };

  const handleLogout = () => {
    dispatch(logOut());
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">

      {/* ── Logo ── */}
      <div className="navbar__logo" onClick={() => navigate('/')}>
        🎬 <span>CineScope</span>
      </div>

      {/* ── Search bar ── */}
      <div className="navbar__search-wrap">
        <span className="navbar__search-icon">🔍</span>
        <input
          className="navbar__search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button className="navbar__search-clear"
            onClick={() => { setQuery(''); dispatch(filterMovies({ query: '', genre, language })); }}>
            ✕
          </button>
        )}
      </div>

      {/* ── Search button ── */}
      <button className="navbar__search-btn" onClick={handleSearchSubmit}>
        Search
      </button>

      {/* ── Genre ── */}
      <select className="navbar__select" value={genre} onChange={handleGenre}>
        {GENRES.map(g => <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>)}
      </select>

      {/* ── Language ── */}
      <select className="navbar__select" value={language} onChange={handleLanguage}>
        {LANGUAGES.map(l => <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>)}
      </select>

      {/* ── Right side: user info + logout ── */}
      <div className="navbar__right">
        {user ? (
          <>
            {/* Avatar + name */}
            <div className="navbar__avatar-wrap">
              <button className="navbar__avatar" onClick={() => setMenuOpen(o => !o)}>
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </button>
              <span className="navbar__username">
                {user.displayName || user.email.split('@')[0]}
              </span>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />
                  <div className="navbar__dropdown">
                    <div className="navbar__dropdown-info">
                      <strong>{user.displayName || 'User'}</strong>
                      <small>{user.email}</small>
                    </div>
                    <hr className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item"
                      onClick={() => { navigate('/account'); setMenuOpen(false); }}>
                      ⚙️ Account Settings
                    </button>
                    <hr className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--danger"
                      onClick={handleLogout}>
                      🚪 Log Out
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ── Logout button always visible ── */}
            <button className="navbar__logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </>
        ) : (
          <button className="navbar__login-btn" onClick={() => navigate('/login')}>
            Log In
          </button>
        )}
      </div>

    </nav>
  );
}