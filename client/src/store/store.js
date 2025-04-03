// // import { configureStore } from '@reduxjs/toolkit';
// // import UserSlice from './UserSlice';

// // export default configureStore({
// //   reducer: {
// //     auth: UserSlice
// //   }
// // });



// // store.js
// import { configureStore } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// import UserSlice from './UserSlice';

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, UserSlice);

// const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//   },
// });

// let persistor = persistStore(store);

// export { store, persistor };


import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import UserSlice from './UserSlice';

// Set up persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all slices in case you add more in the future
const rootReducer = combineReducers({
  auth: UserSlice,
});

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
