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

export function createUser(userData, user) {
  const uid = user.uid;
  return setDoc(doc(db, "users", uid), { ...userData, uid });
}
