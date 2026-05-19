import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "paperclip-dev-8e944",
  appId: "1:833864778311:web:c09d926a80096425aa2762",
  storageBucket: "paperclip-dev-8e944.firebasestorage.app",
  apiKey: "AIzaSyCXtg5m4Fnv9XnUrq6Bhg1yxTahPez4eoY",
  authDomain: "paperclip-dev-8e944.firebaseapp.com",
  messagingSenderId: "833864778311",
  measurementId: "G-CV5GVENWY9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
