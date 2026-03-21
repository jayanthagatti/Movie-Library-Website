// ─────────────────────────────────────────────────────────────────
// File: src/pages/LoginPage.jsx
// Login + Sign Up with Firebase Auth via Redux authSlice
// ─────────────────────────────────────────────────────────────────

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { logIn, signUp } from '../store/authSlice';
// import '../styles/LoginPage.css';

// export default function LoginPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { status, error } = useSelector(s => s.auth);

//   const [isLogin, setIsLogin]   = useState(true); // toggle login/signup
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [name,     setName]     = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let result;
//     if (isLogin) {
//       result = await dispatch(logIn({ email, password }));
//     } else {
//       result = await dispatch(signUp({ email, password, displayName: name }));
//     }
//     // If login/signup succeeded, go to home
//     if (result.meta.requestStatus === 'fulfilled') {
//       navigate('/');
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">

//         {/* Logo */}
//         <div className="login-card__logo">🎬 <span>Movie Library Website</span></div>

//         {/* Tab switcher */}
//         <div className="login-card__tabs">
//           <button
//             className={`login-tab ${isLogin ? 'login-tab--active' : ''}`}
//             onClick={() => setIsLogin(true)}
//           >
//             Log In
//           </button>
//           <button
//             className={`login-tab ${!isLogin ? 'login-tab--active' : ''}`}
//             onClick={() => setIsLogin(false)}
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Error message */}
//         {error && <div className="login-error">{error}</div>}

//         {/* Form */}
//         <form className="login-form" onSubmit={handleSubmit}>

//           {/* Name — only for sign up */}
//           {!isLogin && (
//             <div className="login-field">
//               <label>Full Name</label>
//               <input
//                 type="text"
//                 placeholder="John Doe"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <div className="login-field">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="you@email.com"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="login-field">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="login-submit"
//             disabled={status === 'loading'}
//           >
//             {status === 'loading'
//               ? 'Please wait...'
//               : isLogin ? 'Log In' : 'Create Account'}
//           </button>

//         </form>

//         <p className="login-switch">
//           {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//           <span onClick={() => setIsLogin(v => !v)}>
//             {isLogin ? 'Sign Up' : 'Log In'}
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }


// File: src/pages/LoginPage.jsx
 
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn, signUp } from '../store/authSlice';
import '../styles/LoginPage.css';
 
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(s => s.auth);
 
  const [isLogin,  setIsLogin]  = useState(true);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
 
    if (isLogin) {
      result = await dispatch(logIn({ email, password }));
    } else {
      result = await dispatch(signUp({ email, password, displayName: name }));
    }
 
    // ✅ After login OR signup → always go to Home Screen
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };
 
  return (
    <div className="login-page">
      <div className="login-card">
 
        <div className="login-card__logo">🎬 <span>CineScope</span></div>
 
        <div className="login-card__tabs">
          <button
            className={`login-tab ${isLogin ? 'login-tab--active' : ''}`}
            onClick={() => setIsLogin(true)}
          >Log In</button>
          <button
            className={`login-tab ${!isLogin ? 'login-tab--active' : ''}`}
            onClick={() => setIsLogin(false)}
          >Sign Up</button>
        </div>
 
        {error && <div className="login-error">{error}</div>}
 
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="login-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
 
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
 
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
 
          <button
            type="submit"
            className="login-submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>
 
        <p className="login-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(v => !v)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
 
      </div>
    </div>
  );
}