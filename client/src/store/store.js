import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../features/gameSlice.js';

const store = configureStore({
  reducer: {
    game: gameReducer
  }
});

export default store;
