// import { configureStore } from '@reduxjs/toolkit'
// import userSlice from "./userSlice"

// export const store = configureStore({
//   reducer: {
//     user:userSlice
//   },
// })


import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'ai-website-builder',
    version: 1,
    storage,
  }
  const rootReducer = combineReducers({
    user:userSlice,
  })
  const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});
export default store;