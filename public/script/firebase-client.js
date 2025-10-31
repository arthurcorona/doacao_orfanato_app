import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByPdb9DKrsRFDrFAIG5ltezz6uHrIgt1Q",
  authDomain: "rede-alsa-2ff28.firebaseapp.com",
  projectId: "rede-alsa-2ff28",
  storageBucket: "rede-alsa-2ff28.firebasestorage.app",
  messagingSenderId: "359054712531",
  appId: "1:359054712531:web:a744f228359b2295723e26",
  measurementId: "G-WVWG9XYQVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { 
  db, 
  auth, 
  collection, 
  addDoc, 
  serverTimestamp 
};