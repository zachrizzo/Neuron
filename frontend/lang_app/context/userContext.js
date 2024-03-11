import React, { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { auth, db } from "../firebase/firebase";
import { doc, updateDoc, onSnapshot, setDoc, query } from "firebase/firestore"; // Make sure to import the necessary Firestore functions

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Define updateUserVisitTime outside useEffect to make it accessible in the context value
  const updateUserVisitTime = () => {
    if (!auth.currentUser) return; // Ensure there's a current user before attempting to update

    const userRef = doc(db, "user", auth.currentUser.email);
    setDoc(userRef, { lastVisit: new Date().toISOString() }, { merge: true })
      .then(() => console.log("User's last visit time updated."))
      .catch((error) =>
        console.error("Error updating user's last visit time:", error)
      );
  };

  useEffect(() => {
    updateUserVisitTime();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "user", auth.currentUser.email);

    // Call the update function immediately to update the visit time
    updateUserVisitTime();

    // Set up a real-time listener for the user's data
    const unsubscribe = onSnapshot(
      query(userRef),
      (docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData) {
          dispatch(setUser(userData)); // Update Redux store with the latest user data
        }
      },
      (error) => console.error("Error listening to user data changes:", error)
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  });

  // User context value and provider
  const value = {
    // Include updateUserVisitTime here so it can be used by context consumers
    updateUserVisitTime,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
