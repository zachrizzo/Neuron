import {
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { createUser, getUser } from "../users/user";
import { auth, db } from "../firebase";

export function addFineTunningConversation(collectionName, docData) {
  collectionName = collectionName ? collectionName : "fineTunningConversations";
  return addDoc(collection(db, collectionName), docData, serverTimestamp());
}
