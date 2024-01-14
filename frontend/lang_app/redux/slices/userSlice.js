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
    allLessons: [],
    subscriptionPackages: [],
  },

  reducers: {
    setUser: (state, action) => {
      return { ...state, user: action.payload };
    },
    setUserLanguage: (state, action) => {
      state.user.language = action.payload.language;
    },
    setUserCortexxCoins: (state, action) => {
      state.user.cortexxCoins = action.payload.cortexxCoins;
    },

    setUserHearts: (state, action) => {
      state.user.hearts = action.payload.hearts;
    },
    setUserHeartsLastRefill: (state, action) => {
      state.user.heartsLastRefill = action.payload.heartsLastRefill;
    },
    setUserNumberOfMessages: (state, action) => {
      state.user.numberOfMessages = action.payload.numberOfMessages;
    },
    setUserAutoSpeak: (state, action) => {
      state.user.autoSpeak = action.payload.autoSpeak;
    },
    setUserSubscriptionStatus: (state, action) => {
      state.user.subscriptionStatus = action.payload.subscriptionStatus;
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
    setAllLessons: (state, action) => {
      state.allLessons = action.payload;
    },
    setSubscriptionPackages: (state, action) => {
      state.subscriptionPackages = action.payload;
    },
  },
});

export const {
  setUser,
  setUserLanguage,
  setUserCortexxCoins,
  setUserHearts,
  setUserHeartsLastRefill,
  setUserNumberOfMessages,
  setUserAutoSpeak,
  setUserSubscriptionStatus,
  setThreadID,
  setMessages,
  pushSingleMessage,
  updateMessageAtIndex,
  setFineTurningMessages,
  setFineTuneRating,
  setIsCurrentChatALesson,
  setCurrentLesson,
  setAllLessons,
  setSubscriptionPackages,
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
export const selectAllLessons = (state) => state.userSlice.allLessons;
export const selectSubscriptionPackages = (state) =>
  state.userSlice.subscriptionPackages;

export default userSlice.reducer;
