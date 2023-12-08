import { db, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function updateUser(email, userData) {
  return setDoc(doc(db, "user", email), userData, { merge: true });
}

export function getUser(email) {
  return getDoc(doc(db, "user", email));
}

export function createUser(email, userData) {
  return setDoc(doc(db, "user", email), userData);
}
