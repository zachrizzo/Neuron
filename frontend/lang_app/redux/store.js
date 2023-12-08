import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  userSlice: userReducer,
  // Add other reducers here if you have any
});

const persistConfig = {
  key: "root",
  storage: ReactNativeAsyncStorage,
  // whitelist: ["userSlice"], // only userSlice will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk), // Explicitly adding redux-thunk
});

export const persistor = persistStore(store);
