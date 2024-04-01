import { auth, db, storage } from "../firebase";
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
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { updateUser } from "../users/user";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";

export async function createChat(chatID, promptID, userData) {
  return setDoc(
    doc(db, "chats", chatID),
    userData,
    chatID,
    promptID,
    serverTimestamp()
  ).then(() => {
    //add to array of chats in user
    updateUser(auth.currentUser.uid, {
      chats: arrayUnion(chatID),
      prompts: arrayUnion(promptID),
    });
  });
}

export function updateChat(id, userData) {
  return updateDoc(doc(db, "chats", id), userData, { merge: true });
}

export function getAllChats(setChats) {
  onSnapshot(query(collection(db, "chats")), (snapshot) => {
    const chats = [];
    snapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    setChats(chats);
  });
}

export function getAllMessagesFromChat(chatID, setMessages) {
  return onSnapshot(doc(db, "chats", chatID), (doc) => {
    const messages = doc.data()?.messages;
    setMessages(messages);
  });
}

export function addMessageToChat(chatID, message) {
  return updateDoc(doc(db, "chats", chatID), {
    messages: arrayUnion(message),
  });
}

export async function updateSingleMessageInChat(
  chatId,
  messageIndex,
  chatQuality
) {
  const chatRef = doc(db, "chats", chatId);

  try {
    const chatSnapshot = await getDoc(chatRef);
    if (chatSnapshot.exists()) {
      let messages = chatSnapshot.data().messages;

      if (messageIndex >= 0 && messageIndex < messages.length) {
        // Update chatQuality for the specific message
        messages[messageIndex] = {
          ...messages[messageIndex],
          chatQuality: chatQuality,
        };
        await updateDoc(chatRef, { messages: messages });
      } else {
        console.log("Message index out of bounds");
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

export async function uploadAudioFile(audioFileUri, threadID) {
  const randomNum = Math.floor(Math.random() * 100000000);
  const storageRef = ref(
    storage,
    `audio/${auth.currentUser.uid}/${threadID}/` + `${randomNum}.m4a`
  );
  const metadata = { contentType: "audio/m4a" };

  try {
    // Convert URI to Blob
    const response = await fetch(audioFileUri);
    const blob = await response.blob();

    // Upload Blob
    const snapshot = await uploadBytes(storageRef, blob, metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL; // Return the download URL
  } catch (error) {
    console.error("Upload failed", error);
    return null; // Return null in case of error
  }
}
