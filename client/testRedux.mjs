import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { setMode } from './src/features/gameSlice.js';
const store = configureStore({ reducer: { game: gameReducer } });
store.dispatch(setMode('single'));
console.log(JSON.stringify(store.getState().game, null, 2));
