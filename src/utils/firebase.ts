// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAU4W36ipv4g9gBnp5vLxdEH8bSsR2K4e0",
  authDomain: "instagram-clone-3618e.firebaseapp.com",
  projectId: "instagram-clone-3618e",
  storageBucket: "instagram-clone-3618e.appspot.com",
  messagingSenderId: "1018923326452",
  appId: "1:1018923326452:web:13053b84b72a3e054277a1",
  measurementId: "G-ZH0PKWZLYT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
