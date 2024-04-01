import { auth } from "../firebase/firebase";
import { updateUser } from "../firebase/users/user";

export const selectLang = (lang, addToDb) => {
  // Map of language codes to full names
  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    it: "Italian",
    English: "en",
    Spanish: "es",
    French: "fr",
    Portuguese: "pt",
    Italian: "it",
  };

  // Get the corresponding language or code
  let language = languageMap[lang];

  if (addToDb && language) {
    updateUser(auth.currentUser.uid, { language: language });
  }

  return language;
};

export function removePunctuation(string) {
  return string.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
}
