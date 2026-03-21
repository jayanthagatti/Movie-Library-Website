// // src/firebase.js
// // Paste YOUR config here from Firebase console
// import { initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';


// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBO7th4hIH4-av_sATsCiULWXQBPgbGc6w",
//   authDomain: "ciniscope-6e128.firebaseapp.com",
//   projectId: "ciniscope-6e128",
//   storageBucket: "ciniscope-6e128.firebasestorage.app",
//   messagingSenderId: "1094995692927",
//   appId: "1:1094995692927:web:7b37c5bafd7baebeb95e4a"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);



// export const db = getFirestore(app);    // Firestore database
// export const auth = getAuth(app);       // Authentication



// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBO7th4hIH4-av_sATsCiULWXQBPgbGc6w",
  authDomain: "ciniscope-6e128.firebaseapp.com",
  projectId: "ciniscope-6e128",
  storageBucket: "ciniscope-6e128.firebasestorage.app",
  messagingSenderId: "1094995692927",
  appId: "1:1094995692927:web:7b37c5bafd7baebeb95e4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);    // Firestore database
export const auth = getAuth(app);       // Authentication

// Enable offline persistence so app works without internet
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Happens when multiple tabs are open
    console.warn('Offline persistence failed: close other tabs and reload');
  } else if (err.code === 'unimplemented') {
    // Browser does not support IndexedDB
    console.warn('Offline persistence not supported in this browser');
  }
});