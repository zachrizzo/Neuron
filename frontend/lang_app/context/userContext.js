import React, { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice"; // Import your Redux action to set user data
import { auth, db } from "../firebase/firebase"; // Import your Firebase auth and Firestore instances

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);

    // Update user's last visit time on Firestore
    const updateUserVisitTime = () => {
      updateDoc(userRef, { lastVisit: new Date().toISOString() })
        .then(() => console.log("User's last visit time updated."))
        .catch((error) =>
          console.error("Error updating user's last visit time:", error)
        );
    };

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
  }, [auth.currentUser, dispatch]);

  // User context value and provider
  const value = {
    // Any user-related functions or state you want to provide
    updateUserVisitTime,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
