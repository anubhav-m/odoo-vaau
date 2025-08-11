// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "node-notion-abe74.firebaseapp.com",
  projectId: "node-notion-abe74",
  storageBucket: "node-notion-abe74.firebasestorage.app",
  messagingSenderId: "156513858592",
  appId: "1:156513858592:web:91f39bc21d611b6a9ef845"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);