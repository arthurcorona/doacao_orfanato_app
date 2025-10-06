import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC1YmX8fs0EVWOMiFnSCCea_UCzY5kEuLY",
  authDomain: "rede-alsa.firebaseapp.com",
  projectId: "rede-alsa",
  storageBucket: "rede-alsa.firebasestorage.app",
  messagingSenderId: "973466018358",
  appId: "1:973466018358:web:3df15cf7e09041e475ae97",
  measurementId: "G-0J8N0NFR6W"
};

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