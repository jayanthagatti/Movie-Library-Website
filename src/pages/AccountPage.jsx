// ─────────────────────────────────────────────────────────────────
// File: src/pages/AccountPage.jsx
// User settings: update name, email, change password, logout
// Uses Firebase Auth directly for profile updates
// ─────────────────────────────────────────────────────────────────

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   updateProfile,
//   updateEmail,
//   updatePassword,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from 'firebase/auth';
// import { auth } from '../firebase';
// import { logOut } from '../store/authSlice';
// import '../styles/AccountPage.css';

// export default function AccountPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user     = useSelector(s => s.auth.user);

//   // Redirect to login if not logged in
//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   const [name,        setName]        = useState(user.displayName || '');
//   const [email,       setEmail]       = useState(user.email || '');
//   const [currentPass, setCurrentPass] = useState('');
//   const [newPass,     setNewPass]     = useState('');
//   const [confirmPass, setConfirmPass] = useState('');
//   const [toast,       setToast]       = useState(null);
//   const [loading,     setLoading]     = useState(false);

//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // ── Update display name ──
//   const handleUpdateName = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await updateProfile(auth.currentUser, { displayName: name });
//       showToast('Name updated successfully!');
//     } catch (err) {
//       showToast(err.message, 'error');
//     }
//     setLoading(false);
//   };

//   // ── Update email (requires re-auth) ──
//   const handleUpdateEmail = async (e) => {
//     e.preventDefault();
//     if (!currentPass) return showToast('Enter your current password to change email.', 'error');
//     setLoading(true);
//     try {
//       const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
//       await reauthenticateWithCredential(auth.currentUser, credential);
//       await updateEmail(auth.currentUser, email);
//       showToast('Email updated successfully!');
//       setCurrentPass('');
//     } catch (err) {
//       showToast(err.message, 'error');
//     }
//     setLoading(false);
//   };

//   // ── Change password (requires re-auth) ──
//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     if (newPass !== confirmPass) return showToast('New passwords do not match.', 'error');
//     if (newPass.length < 6) return showToast('Password must be at least 6 characters.', 'error');
//     if (!currentPass) return showToast('Enter your current password first.', 'error');
//     setLoading(true);
//     try {
//       const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
//       await reauthenticateWithCredential(auth.currentUser, credential);
//       await updatePassword(auth.currentUser, newPass);
//       showToast('Password changed successfully!');
//       setCurrentPass(''); setNewPass(''); setConfirmPass('');
//     } catch (err) {
//       showToast(err.message, 'error');
//     }
//     setLoading(false);
//   };

//   const handleLogout = () => {
//     dispatch(logOut());
//     navigate('/');
//   };

//   return (
//     <div className="account-page">

//       {/* Toast */}
//       {toast && (
//         <div className={`account-toast ${toast.type === 'error' ? 'account-toast--error' : ''}`}>
//           {toast.msg}
//         </div>
//       )}

//       {/* Back */}
//       <div className="account-topbar">
//         <button className="account-back-btn" onClick={() => navigate(-1)}>← Back</button>
//       </div>

//       <div className="account-wrap">

//         {/* ── Header ── */}
//         <div className="account-header">
//           <div className="account-avatar">
//             {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <h1 className="account-header__name">{user.displayName || 'User'}</h1>
//             <p className="account-header__email">{user.email}</p>
//           </div>
//         </div>

//         {/* ════════════════════
//             Section 1: Update Name
//         ════════════════════ */}
//         <div className="account-card">
//           <h2 className="account-card__title">👤 Update Name</h2>
//           <form onSubmit={handleUpdateName}>
//             <div className="account-field">
//               <label>Display Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 placeholder="Your name"
//                 required
//               />
//             </div>
//             <button type="submit" className="account-btn account-btn--primary" disabled={loading}>
//               Save Name
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════
//             Section 2: Update Email
//         ════════════════════ */}
//         <div className="account-card">
//           <h2 className="account-card__title">✉️ Update Email</h2>
//           <form onSubmit={handleUpdateEmail}>
//             <div className="account-field">
//               <label>New Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="new@email.com"
//                 required
//               />
//             </div>
//             <div className="account-field">
//               <label>Current Password (required)</label>
//               <input
//                 type="password"
//                 value={currentPass}
//                 onChange={e => setCurrentPass(e.target.value)}
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//             <button type="submit" className="account-btn account-btn--primary" disabled={loading}>
//               Update Email
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════
//             Section 3: Change Password
//         ════════════════════ */}
//         <div className="account-card">
//           <h2 className="account-card__title">🔒 Change Password</h2>
//           <form onSubmit={handleChangePassword}>
//             <div className="account-field">
//               <label>Current Password</label>
//               <input
//                 type="password"
//                 value={currentPass}
//                 onChange={e => setCurrentPass(e.target.value)}
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//             <div className="account-field">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 value={newPass}
//                 onChange={e => setNewPass(e.target.value)}
//                 placeholder="Min 6 characters"
//                 required
//               />
//             </div>
//             <div className="account-field">
//               <label>Confirm New Password</label>
//               <input
//                 type="password"
//                 value={confirmPass}
//                 onChange={e => setConfirmPass(e.target.value)}
//                 placeholder="Re-enter new password"
//                 required
//               />
//             </div>
//             <button type="submit" className="account-btn account-btn--primary" disabled={loading}>
//               Change Password
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════
//             Section 4: Logout
//         ════════════════════ */}
//         <div className="account-card account-card--danger">
//           <h2 className="account-card__title">🚪 Log Out</h2>
//           <p className="account-card__desc">You will be signed out of your account.</p>
//           <button className="account-btn account-btn--danger" onClick={handleLogout}>
//             Log Out
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }




// File: src/pages/AccountPage.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase';
import { logOut, setUser } from '../store/authSlice';
import '../styles/AccountPage.css';

export default function AccountPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(s => s.auth.user);

  if (!user) {
    navigate('/login');
    return null;
  }

  const [name,        setName]        = useState(user.displayName || '');
  const [email,       setEmail]       = useState(user.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [toast,       setToast]       = useState(null);
  const [loading,     setLoading]     = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Update display name ──────────────────────────────────────
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });

      // ✅ Update Redux state so Navbar + HomeScreen show new name immediately
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: name,
      }));

      showToast('Name updated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  // ── Update email ─────────────────────────────────────────────
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!currentPass) return showToast('Enter your current password.', 'error');
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, email);

      // Update Redux
      dispatch(setUser({ uid: user.uid, email, displayName: user.displayName }));

      showToast('Email updated successfully!');
      setCurrentPass('');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  // ── Change password ──────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) return showToast('Passwords do not match.', 'error');
    if (newPass.length < 6)      return showToast('Password must be 6+ characters.', 'error');
    if (!currentPass)            return showToast('Enter your current password.', 'error');
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPass);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPass);
      showToast('Password changed successfully!');
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setLoading(false);
  };

  // ── Log out ──────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/');
  };

  return (
    <div className="account-page">

      {toast && (
        <div className={`account-toast ${toast.type === 'error' ? 'account-toast--error' : ''}`}>
          {toast.msg}
        </div>
      )}

      <div className="account-topbar">
        <button className="account-back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="account-wrap">

        {/* Header */}
        <div className="account-header">
          <div className="account-avatar">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="account-header__name">{user.displayName || 'User'}</h1>
            <p className="account-header__email">{user.email}</p>
          </div>
        </div>

        {/* ── Update Name ── */}
        <div className="account-card">
          <h2 className="account-card__title">👤 Update Name</h2>
          <form onSubmit={handleUpdateName}>
            <div className="account-field">
              <label>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <button type="submit" className="account-btn account-btn--primary" disabled={loading}>
              Save Name
            </button>
          </form>
        </div>

        {/* ── Update Email ── */}
        <div className="account-card">
          <h2 className="account-card__title">✉️ Update Email</h2>
          <form onSubmit={handleUpdateEmail}>
            <div className="account-field">
              <label>New Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="new@email.com"
                required
              />
            </div>
            <div className="account-field">
              <label>Current Password (required)</label>
              <input
                type="password"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="account-btn account-btn--primary" disabled={loading}>
              Update Email
            </button>
          </form>
        </div>

        {/* ── Change Password ── */}
        <div className="account-card">
          <h2 className="account-card__title">🔒 Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="account-field">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="account-field">
              <label>New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div className="account-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>
            <button type="submit" className="account-btn account-btn--primary" disabled={loading}>
              Change Password
            </button>
          </form>
        </div>

        {/* ── Logout ── */}
        <div className="account-card account-card--danger">
          <h2 className="account-card__title">🚪 Log Out</h2>
          <p className="account-card__desc">You will be signed out of your account.</p>
          <button className="account-btn account-btn--danger" onClick={handleLogout}>
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}