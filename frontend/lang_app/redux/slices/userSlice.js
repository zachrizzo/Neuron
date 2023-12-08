import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userSlice", // Corrected name here
  initialState: {
    user: null,
    threadID: null,
    messages: [],
    fineTurningMessages: [],
    fineTuneRating: null,
    isCurrentChatALesson: false,
    currentLesson: null,
  },

  reducers: {
    setUser: (state, action) => {
      return { ...state, user: action.payload };
    },
    setUserLanguage: (state, action) => {
      // Only update the language property
      state.user.language = action.payload.language;
    },

    setUserAutoSpeak: (state, action) => {
      // Only update the language property
      state.user.autoSpeak = action.payload.autoSpeak;
    },
    setThreadID: (state, action) => {
      state.threadID = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    pushSingleMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageAtIndex: (state, action) => {
      const { index, updatedMessage } = action.payload;
      if (index >= 0 && index < state.messages.length) {
        state.messages[index] = { ...state.messages[index], ...updatedMessage };
      }
    },
    setFineTurningMessages: (state, action) => {
      state.fineTurningMessages = action.payload;
    },
    setFineTuneRating: (state, action) => {
      state.fineTuneRating = action.payload;
    },
    setIsCurrentChatALesson: (state, action) => {
      state.isCurrentChatALesson = action.payload;
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
  },
});

export const {
  setUser,
  setUserLanguage,
  setUserAutoSpeak,
  setThreadID,
  setMessages,
  pushSingleMessage,
  updateMessageAtIndex,
  setFineTurningMessages,
  setFineTuneRating,
  setIsCurrentChatALesson,
  setCurrentLesson,
} = userSlice.actions;

export const selectUser = (state) => state.userSlice.user;
export const selectThreadID = (state) => state.userSlice.threadID;
export const selectMessages = (state) => state.userSlice.messages;
export const selectFineTurningMessages = (state) =>
  state.userSlice.fineTurningMessages;
export const selectFineTuneRating = (state) => state.userSlice.fineTuneRating;
export const selectIsCurrentChatALesson = (state) =>
  state.userSlice.isCurrentChatALesson;
export const selectCurrentLesson = (state) => state.userSlice.currentLesson;

export default userSlice.reducer;
