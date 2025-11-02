import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import UserSlice from "./UserSlice";
import UiSlice from "./UiSlice";

// Set up persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine all slices in case you add more in the future
const rootReducer = combineReducers({
  auth: UserSlice,
  ui: UiSlice,
});

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
