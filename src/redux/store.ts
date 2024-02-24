import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authorityReducer from "./reducers/authority";
import loggedinReducer from "./reducers/loggedin";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

// const authorityPersistConfig = {
//   key: "authority",
//   storage,
// };

// const loggedInPersistConfig = {
//   key: "loggedIn",
//   storage,
// };

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authority", "loggedIn"],
};

const rootReducer = combineReducers({
  authority: authorityReducer,
  loggedIn: loggedinReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export interface RootState {
  authority: {
    authority: number;
  };
  loggedIn: {
    loggedIn: boolean;
  };
}

export const persistor = persistStore(store);
export default store;
