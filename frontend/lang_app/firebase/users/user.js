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
  addDoc
} from "firebase/firestore";

export function updateUser(id, userData) {
  return setDoc(doc(db, "users", id), userData, { merge: true });
}

export function getUser(id) {
  return getDoc(doc(db, "users", id));
}

export function createUser(userData) {
  return addDoc(doc(db, "users"), userData);
}
