import React, { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { auth, db } from "../firebase/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore"; // Make sure to import the necessary Firestore functions

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Define updateUserVisitTime outside useEffect to make it accessible in the context value
  const updateUserVisitTime = () => {
    if (!auth.currentUser) return; // Ensure there's a current user before attempting to update

    const userRef = doc(db, "users", auth.currentUser.uid);
    updateDoc(userRef, { lastVisit: new Date().toISOString() })
      .then(() => console.log("User's last visit time updated."))
      .catch((error) =>
        console.error("Error updating user's last visit time:", error)
      );
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);

    // Call the update function immediately to update the visit time
    updateUserVisitTime();

    // Set up a real-time listener for the user's data
    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData) {
          dispatch(setUser(userData)); // Update Redux store with the latest user data
          console.log("User data updated from Firestore:", userData);
        }
      },
      (error) => console.error("Error listening to user data changes:", error)
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [dispatch]); // Removed auth.currentUser from the dependencies array to avoid re-running the effect unnecessarily

  // User context value and provider
  const value = {
    // Include updateUserVisitTime here so it can be used by context consumers
    updateUserVisitTime,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
