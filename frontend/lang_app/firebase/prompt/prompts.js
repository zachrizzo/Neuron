import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

export function updatePrompt(id, userData) {
  return updateDoc(doc(db, "prompts", id), userData, { merge: true });
}

export function createPrompt(userData) {
  return addDoc(doc(db, "prompts"), userData);
}

export function getAllPrompts(setPrompts) {
  onSnapshot(query(collection(db, "prompts")), (snapshot) => {
    const prompts = [];
    snapshot.forEach((doc) => {
      prompts.push({ id: doc.id, ...doc.data() });
    });

    setPrompts(prompts);
  });
}
