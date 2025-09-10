

//firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1YmX8fs0EVWOMiFnSCCea_UCzY5kEuLY",
  authDomain: "rede-alsa.firebaseapp.com",
  projectId: "rede-alsa",
  storageBucket: "rede-alsa.firebasestorage.app",
  messagingSenderId: "973466018358",
  appId: "1:973466018358:web:3df15cf7e09041e475ae97",
  measurementId: "G-0J8N0NFR6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);