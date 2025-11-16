import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
  apiKey: "AIzaSyD_ZfgoF8Fg6Dx-TBg4K9fzs4pOIyr4suI",
  authDomain: "expense-tracker-1a89b.firebaseapp.com",
  projectId: "expense-tracker-1a89b",
  storageBucket: "expense-tracker-1a89b.firebasestorage.app",
  messagingSenderId: "265614286602",
  appId: "1:265614286602:web:f0943e2e91b5aebc8ce4f3"
 
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app); 
export default app;