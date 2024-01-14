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

export function getAllProducts(setProducts) {
  onSnapshot(query(collection(db, "packages")), (snapshot) => {
    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    // dispatch(setProducts(products));
    setProducts(products);
  });
}

export function getProductById(id) {
  return getDoc(doc(db, "products", id));
}

export function createProduct(userData) {
  return addDoc(doc(db, "products"), userData);
}

export function updateProduct(id, userData) {
  return setDoc(doc(db, "products", id), userData, { merge: true });
}
