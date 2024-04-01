import React, { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, onSnapshot, setDoc, query } from "firebase/firestore"; // Make sure to import the necessary Firestore functions

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();



  const updateUserVisitTimeAndStreak = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    const now = new Date();
    let updatedUserData = {};

    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const lastVisit = userData.lastVisit ? new Date(userData.lastVisit) : null;
      const oneDayInMs = 1000 * 60 * 60 * 24;
      let newStreak = userData.streak || 0;

      if (lastVisit) {
        const timeSinceLastVisit = now - lastVisit;
        if (timeSinceLastVisit < oneDayInMs * 2 && timeSinceLastVisit > oneDayInMs) {
          newStreak++; // Increment streak if last visit was between 24-48 hours ago
        } else if (timeSinceLastVisit >= oneDayInMs * 2) {
          newStreak = 1; // Reset streak if it has been more than 48 hours
        }
      } else {
        newStreak = 1; // Initialize streak if it's the user's first visit
      }

      updatedUserData = {
        ...userData,
        streak: newStreak,
        lastVisit: now.toISOString(),
      };

      await setDoc(userRef, updatedUserData, { merge: true });
    }

    dispatch(setUser(updatedUserData)); // Update Redux state with the new user data
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    updateUserVisitTimeAndStreak().catch(console.error);
    console.log("User visit time and streak updated");
  }, [auth.currentUser]);


  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);


    onSnapshot(
      query(userRef),
      (docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData) {
          dispatch(setUser(userData)); // Update Redux store with the latest user data
          console.log("User data updated in Redux store");
        }
      },
      (error) => console.error("Error listening to user data changes:", error)
    );


  }, []);

  // User context value and provider
  const value = {
    updateUserVisitTimeAndStreak,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
