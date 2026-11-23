// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-storage.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANZDF9FTTqAFXLzXy_AqB1G2j3n6GhxYc",
  authDomain: "fsdproj-7c38c.firebaseapp.com",
  projectId: "fsdproj-7c38c",
  storageBucket: "fsdproj-7c38c.firebasestorage.app",
  messagingSenderId: "992166979326",
  appId: "1:992166979326:web:38a5d185db26db41e2a7af",
  measurementId: "G-6GEXF1777G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
