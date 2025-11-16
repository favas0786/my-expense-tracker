import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <- The 'S' is removed

// --- PASTE YOUR CONFIG FROM FIREBASE HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyD_ZfgoF8Fg6Dx-TBg4K9fzs4pOIyr4suI",
  authDomain: "expense-tracker-1a89b.firebaseapp.com",
  projectId: "expense-tracker-1a89b",
  storageBucket: "expense-tracker-1a89b.firebasestorage.app",
  messagingSenderId: "265614286602",
  appId: "1:265614286602:web:f0943e2e91b5aebc8ce4f3"
 
};
// ---------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app); // We'll use this in the next step
export default app;