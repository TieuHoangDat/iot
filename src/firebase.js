// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfZiuCDI0YsB-Y646DhnnVkCoSAZ0G-80",
  authDomain: "data-nhung.firebaseapp.com",
  databaseURL: "https://data-nhung-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "data-nhung",
  storageBucket: "data-nhung.firebasestorage.app",
  messagingSenderId: "1015170892104",
  appId: "1:1015170892104:web:39432a17dc594511a8f37d",
  measurementId: "G-57W6VDLZNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, set };
