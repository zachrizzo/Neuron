import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { createUser, getUser } from "../users/user";

export function loginEmailPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      let userData = null;

      await getUser(email).then((res) => {
        console.log(res.data());
        userData = res.data();
      });

      return user, userData;
    }
  );
}
export function logout() {
  return auth.signOut();
  //remove from local storage
}

export async function createUserEmailAndPassword(email, password, userInfo) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      await createUser(userInfo); // Pass userInfo to your createUser function
      return { user, userData: userInfo }; // Return user data along with user object
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      throw error; // It's often useful to rethrow the error for handling it later
    });
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      await createUser(user.email, {
        email: user.email,
        name: user.displayName,
      });

      return user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
