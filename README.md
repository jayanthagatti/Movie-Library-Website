# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Instructions
🎬 CineScope - Movie Discovery App
A full-featured movie discovery web app built with React, Redux, Firebase, and OMDB API. Browse 101 movies, filter by genre and language, view detailed movie info, manage your watchlist, and track your watch history.

🚀 Features

🔐 User Authentication (Login / Sign Up / Logout)
🎬 Browse 101 curated movies with posters and ratings
🔍 Search movies by title
🎭 Filter by Genre and Language
🎥 Detailed Movie Page (IMDb, Rotten Tomatoes, Metacritic ratings, cast, director, awards)
📋 Watchlist — add/remove movies
▶️ Currently Watching — track watch progress
👤 Account Page — update name, email, password
📶 Works Offline after first load (Firebase cache)
🔴 Offline banner shown when internet is disconnected


🛠️ Tech Stack

React + Vite — Frontend framework
Redux Toolkit — State management
Firebase Firestore — Database + offline caching
Firebase Auth — User authentication
OMDB API — Movie data (fetched once, cached permanently)
React Router — Page navigation


⚙️ Setup Instructions
✅ Requirements

Node.js (v18 or higher)
npm
Internet connection (only required for the very first run)
After the first run, the app works fully offline


1. Clone the Repository
bashgit clone https://github.com/jayanthagatti/Movie-Library-Website
cd ciniscope

2. Create React App with Vite (if starting from scratch)
If you are setting up the project from scratch, create a new React app using Vite:
bash: npm create vite@latest ciniscope -- --template react
cd ciniscope

3. Install All Dependencies
Install base dependencies
bashnpm install
Install React Router (for page navigation)
bashnpm install react-router-dom
Install Redux Toolkit and React Redux (for state management)
bashnpm install @reduxjs/toolkit react-redux
Install Firebase (for database and authentication)
bashnpm install firebase
Install all at once (alternative — run this single command)
bashnpm install react-router-dom @reduxjs/toolkit react-redux firebase

4. Create .env File
Create a file named .env in the root of the project (same folder as package.json):
VITE_OMDB_KEY=your_omdb_api_key_here
To get a free OMDB API key:

Go to https://www.omdbapi.com/apikey.aspx
Select FREE (1,000 daily limit)
Enter your email and submit
Check your email and click the activation link
Copy the key into your .env file


⚠️ The API key is only needed for the very first run. After movies are loaded once, they are permanently saved in Firebase and OMDB is never called again.


5. Firebase Setup

Go to https://firebase.google.com and create a free account
Click Add Project and create a new project
Go to Firestore Database → Create database → Start in test mode
Go to Authentication → Get started → Enable Email/Password
Go to Project Settings → Your apps → Add Web App
Copy the config and paste it into src/firebase.js:

javascriptconst firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

In Firestore, create a collection called movies with a document called movieList
Inside movieList, add a field ids as an array of IMDB IDs:

["tt0068646", "tt0111161", "tt0071562", ...]

6. Run the Project
bashnpm run dev
Open your browser and visit:
http://localhost:5173

7. First Run (Internet Required — One Time Only)
On the very first run with internet connected:

The app fetches all movies from OMDB using the IDs stored in Firebase
Movies are permanently saved to Firebase Firestore
You will see this message in the browser console:

✅ Movies saved to Firebase — OMDB will NEVER be called for the list again!
After this, the app works fully offline on all future visits — no internet needed.

📄 App Pages
Once the app is running, you can visit these pages directly in your browser:
PageURLDescriptionHomehttp://localhost:5173/Hero banner with featured movie + Currently Watching sectionBrowsehttp://localhost:5173/browseAll 101 movies with search, genre and language filtersMovie Detailhttp://localhost:5173/movie/tt0068646Full details — ratings, cast, director, awards, plotLoginhttp://localhost:5173/loginLogin with email and passwordSign Uphttp://localhost:5173/login → click Sign Up tabRegister a new accountAccounthttp://localhost:5173/accountUpdate display name, email, password and logout

💡 Replace tt0068646 in the Movie Detail URL with any valid IMDB ID to view that movie's page.


📶 Offline Support

After the first successful online load, all movie data is cached in Firebase IndexedDB
The app works completely offline from the second visit onwards
A red banner appears at the top of the screen when internet is disconnected
User login session is preserved offline
