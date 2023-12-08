// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs4gHJiXvNH_kRGNaqcNpcovIqi62bSxc",
  authDomain: "lang-learning-app-gpt.firebaseapp.com",
  projectId: "lang-learning-app-gpt",
  storageBucket: "lang-learning-app-gpt.appspot.com",
  messagingSenderId: "799051261667",
  appId: "1:799051261667:web:94bd1c6937cc81359507d6",
  measurementId: "G-B3671L4GCN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = initializeFirestore(app, {
  // persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  persistence: indexedDBLocalPersistence,
});
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, storage, auth };
