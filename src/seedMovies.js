// src/seedMovies.js
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const MOVIE_IDS = [
  // Top rated / classics
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0071562', // The Godfather Part II
  'tt0468569', // The Dark Knight
  'tt0050083', // 12 Angry Men
  'tt0108052', // Schindler's List
  'tt0167260', // LOTR: Return of the King
  'tt0110912', // Pulp Fiction
  'tt0137523', // Fight Club
  'tt0109830', // Forrest Gump
  // Sci-fi / Action
  'tt1375666', // Inception
  'tt0080684', // The Empire Strikes Back
  'tt0133093', // The Matrix
  'tt0816692', // Interstellar
  'tt0482571', // The Prestige
  'tt0088763', // Back to the Future
  'tt0082971', // Raiders of the Lost Ark
  'tt1345836', // The Dark Knight Rises
  'tt0372784', // Batman Begins
  'tt4154796', // Avengers: Endgame
  // Crime / Thriller
  'tt0099685', // Goodfellas
  'tt0114369', // Se7en
  'tt0102926', // The Silence of the Lambs
  'tt0209144', // Memento
  'tt0364569', // Oldboy
  'tt0114814', // The Usual Suspects
  'tt0361748', // Inglourious Basterds
  'tt0407887', // The Departed
  'tt0105236', // Reservoir Dogs
  'tt0208092', // Snatch
  // Drama
  'tt0120815', // Saving Private Ryan
  'tt0253474', // The Pianist
  'tt0073486', // One Flew Over the Cuckoo's Nest
  'tt0317248', // City of God
  'tt0118799', // Life is Beautiful
  'tt2024544', // 12 Years a Slave
  'tt0338013', // Eternal Sunshine
  'tt2582802', // Whiplash
  'tt1675434', // The Intouchables
  'tt0119217', // Good Will Hunting
  'tt0112573', // Braveheart
  'tt0120586', // American History X
  'tt0169547', // American Beauty
  'tt0407304', // Million Dollar Baby
  'tt0180093', // Requiem for a Dream
  'tt1832382', // A Separation
  // Animation
  'tt0910570', // WALL-E
  'tt0435761', // Toy Story 3
  'tt0245429', // Spirited Away
  'tt2096673', // Inside Out
  'tt0317705', // The Incredibles
  'tt0382932', // Ratatouille
  'tt0266543', // Finding Nemo
  'tt1049413', // Up
  'tt0892769', // How to Train Your Dragon
  'tt4633694', // Spider-Man: Into the Spider-Verse
  // World Cinema
  'tt0047478', // Seven Samurai
  'tt0042876', // Rashomon
  'tt0040522', // Bicycle Thieves
  'tt0022100', // M
  'tt0056058', // Harakiri
  'tt0059578', // For a Few Dollars More
  'tt0095327', // Grave of the Fireflies
  'tt0986264', // Taare Zameen Par
  // Horror / Suspense
  'tt0081505', // The Shining
  'tt0078748', // Alien
  'tt0167404', // The Sixth Sense
  'tt1130884', // Shutter Island
  'tt0054215', // Psycho
  // Comedy
  'tt0071853', // Monty Python and the Holy Grail
  'tt0053291', // Some Like It Hot
  'tt0264464', // Catch Me If You Can
  // Recent hits
  'tt6751668', // Parasite
  'tt7286456', // Joker
  'tt1745960', // Top Gun: Maverick
  'tt9362722', // Spider-Man: No Way Home
  'tt3783958', // La La Land
  'tt1160419', // Dune (2021)
  'tt2119532', // Hacksaw Ridge
  'tt1950186', // Ford v Ferrari
  'tt1065073', // Hell or High Water
  'tt3315342', // Logan
  'tt2278388', // The Grand Budapest Hotel
  'tt1291584', // Warrior
  'tt0172495', // Gladiator
  'tt0325980', // Pirates of the Caribbean
  'tt0110413', // Léon: The Professional
  'tt0120737', // LOTR: Fellowship of the Ring
  'tt0167261', // LOTR: The Two Towers
  'tt0053125', // North by Northwest
  'tt0034583', // Casablanca
  'tt0057012', // Dr. Strangelove
  'tt0078788', // Apocalypse Now
  'tt0015864', // The Gold Rush
  'tt1853728', // Django Unchained
  'tt2975590', // Batman v Superman
  'tt0910970', // WALL-E (corrected)
  'tt0079470', // Life of Brian
  'tt0093058', // Full Metal Jacket
  'tt0070735', // The Sting
  'tt0062622', // 2001: A Space Odyssey
];

export async function seedMovies() {
  try {
    // This saves ONLY the IDs — no movie data stored in Firebase
    await setDoc(doc(db, 'movies', 'movieList'), {
      ids: MOVIE_IDS
    });
    console.log('✅ 100 movie IDs successfully saved to Firebase Firestore!');
    alert('Done! 100 movie IDs saved to Firebase.');
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    alert('Error: ' + error.message);
  }
}