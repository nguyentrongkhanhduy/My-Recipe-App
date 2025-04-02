import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDQNTnQ8e3eojTOzoRlayzwVdblRnwzO0w",
  authDomain: "my-recipe-app-de60f.firebaseapp.com",
  projectId: "my-recipe-app-de60f",
  storageBucket: "my-recipe-app-de60f.appspot.com",
  messagingSenderId: "847672491118",
  appId: "1:847672491118:web:a5fe2c2176ec0033f7fa7f",
};

// ✅ Only initialize if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Only initialize auth once
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app); // fallback if already initialized
}

const db = getFirestore(app);

export { auth, db };