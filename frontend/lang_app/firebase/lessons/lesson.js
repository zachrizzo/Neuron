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

export function getAllLessons(dispatch, setAllLessons) {
  onSnapshot(query(collection(db, "lessons")), (snapshot) => {
    const lessons = [];
    snapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() });
    });
    dispatch(setAllLessons(lessons));
  });
}

export function getLessonById(id) {
  return getDoc(doc(db, "lessons", id));
}

export function createLesson(userData) {
  return addDoc(doc(db, "lessons"), userData);
}

export function updateLesson(id, userData) {
  return setDoc(doc(db, "lessons", id), userData, { merge: true });
}
