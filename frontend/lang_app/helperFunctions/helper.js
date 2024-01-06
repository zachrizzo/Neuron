import { auth } from "../firebase/firebase";
import { updateUser } from "../firebase/users/user";

export const selectLang = (lang, addToDb) => {
  // Map of language codes to full names
  const languageMap = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    English: "en",
    Spanish: "es",
    French: "fr",
    Portuguese: "pt",
  };

  // Get the corresponding language or code
  let language = languageMap[lang];

  if (addToDb && language) {
    updateUser(auth.currentUser.email, { language: language });
  }

  return language;
};

export function removePunctuation(string) {
  return string.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
}
