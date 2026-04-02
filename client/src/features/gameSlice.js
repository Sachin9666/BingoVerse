import { createSlice } from '@reduxjs/toolkit';
import { createBoard, getCompletedLines } from '../utils/gameUtils.js';

const initialState = {
  mode: null,
  screen: 'landing',
  darkMode: true,
  isLoading: false,
  roomId: '',
  joinInput: '',
  board: [],
  selectedNumbers: [],
  lastNumber: null,
  notifications: [],
  currentTurn: null,
  playerId: null,
  opponentId: null,
  scores: { self: 0, opponent: 0 },
  result: null,
  gameReady: false,
  aiBoard: [],
  opponentDisconnected: false,
  error: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setMode(state, action) {
      state.mode = action.payload;
      state.screen = action.payload === 'single' ? 'game' : 'lobby';
      state.error = null;
      state.playerId = null;
      state.opponentId = null;
      state.roomId = '';
      state.selectedNumbers = [];
      state.notifications = [];
      state.lastNumber = null;
      state.result = null;
      state.scores = { self: 0, opponent: 0 };
      state.gameReady = false;
      if (action.payload === 'single') {
        state.board = createBoard();
        state.aiBoard = createBoard();
        state.selectedNumbers = [];
        state.scores = { self: 0, opponent: 0 };
        state.currentTurn = 'self';
        state.gameReady = true;
        state.result = null;
        state.notifications = ['Game started. Your turn!'];
      }
    },
    regenerateBoard(state) {
      state.board = createBoard();
      if (state.mode === 'single') {
        state.aiBoard = createBoard();
        state.selectedNumbers = [];
        state.scores = { self: 0, opponent: 0 };
        state.currentTurn = 'self';
        state.notifications.push('Board reshuffled. Your turn!');
      }
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    setJoinInput(state, action) {
      state.joinInput = action.payload.slice(0, 8).replace(/[^0-9]/g, '');
    },
    setRoomId(state, action) {
      state.roomId = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setRoomCreated(state, action) {
      state.roomId = action.payload.roomId;
      state.playerId = action.payload.playerId;
      state.board = action.payload.board;
      state.notifications = ['Room created. Waiting for opponent...'];
      state.screen = 'lobby';
    },
    startGame(state, action) {
      const { board, playerId, opponentId, roomId, currentTurn, scores } = action.payload;
      state.board = board;
      state.playerId = playerId;
      state.opponentId = opponentId;
      state.roomId = roomId;
      state.currentTurn = currentTurn === playerId ? 'self' : 'opponent';
      state.selectedNumbers = [];
      state.scores = {
        self: scores?.[playerId] ?? 0,
        opponent: opponentId ? scores?.[opponentId] ?? 0 : 0
      };
      state.gameReady = true;
      state.result = null;
      state.notifications = ['Game started.'];
      state.screen = 'game';
    },
    setOpponentDisconnected(state) {
      state.opponentDisconnected = true;
      state.notifications.push('Opponent disconnected. Returning to lobby.');
      state.result = 'win';
      state.screen = 'result';
    },
    setSelectedNumber(state, action) {
      const { number, fromOpponent, scores, currentTurn, lineCompleted } = action.payload;
      if (!state.selectedNumbers.includes(number)) {
        state.selectedNumbers.push(number);
      }
      state.lastNumber = number;
      if (currentTurn) {
        state.currentTurn = currentTurn === state.playerId ? 'self' : 'opponent';
      } else {
        state.currentTurn = fromOpponent ? 'self' : 'opponent';
      }
      if (scores) {
        state.scores.self = scores[state.playerId] ?? state.scores.self;
        if (state.opponentId) {
          state.scores.opponent = scores[state.opponentId] ?? state.scores.opponent;
        }
      } else {
        const completedLines = getCompletedLines(state.board, new Set(state.selectedNumbers)).length;
        state.scores.self = completedLines;
      }
      if (lineCompleted?.[state.playerId]) {
        state.notifications.push('You completed a line!');
      } else if (lineCompleted?.[state.opponentId]) {
        state.notifications.push('Opponent completed a line!');
      }
      state.notifications.push(fromOpponent ? `Opponent selected: ${number}` : `You selected: ${number}`);
    },
    applyPlayerSelection(state, action) {
      const { number } = action.payload;
      if (!state.selectedNumbers.includes(number)) {
        state.selectedNumbers.push(number);
      }
      const previousScore = state.scores.self;
      state.lastNumber = number;
      state.currentTurn = 'opponent';
      const selfScore = getCompletedLines(state.board, new Set(state.selectedNumbers));
      const opponentScore = getCompletedLines(state.aiBoard, new Set(state.selectedNumbers));
      state.scores.self = selfScore;
      state.scores.opponent = opponentScore;
      if (selfScore > previousScore) {
        state.notifications.push('You completed a line!');
      }
      state.notifications.push(`You selected: ${number}`);
      if (selfScore >= 5) {
        state.result = 'win';
        state.screen = 'result';
      }
    },
    applyAIMove(state, action) {
      const { number } = action.payload;
      if (!state.selectedNumbers.includes(number)) {
        state.selectedNumbers.push(number);
      }
      const previousOpponentScore = state.scores.opponent;
      state.lastNumber = number;
      state.currentTurn = 'self';
      const selfScore = getCompletedLines(state.board, new Set(state.selectedNumbers));
      const opponentScore = getCompletedLines(state.aiBoard, new Set(state.selectedNumbers));
      state.scores.self = selfScore;
      state.scores.opponent = opponentScore;
      if (!state.result && selfScore >= 5 && selfScore >= opponentScore) {
        state.result = 'win';
        state.screen = 'result';
        state.notifications.push('Victory! You hit 5 lines!');
        return;
      }
      if (opponentScore > previousOpponentScore) {
        state.notifications.push('Opponent completed a line!');
      }
      state.notifications.push(`Opponent selected: ${number}`);
      if (opponentScore >= 5) {
        state.result = 'lose';
        state.screen = 'result';
      }
    },
    setOpponentMove(state, action) {
      state.currentTurn = 'self';
      state.lastNumber = action.payload.number;
      state.notifications.push(`Opponent selected: ${action.payload.number}`);
      const completedLines = getCompletedLines(state.board, new Set(state.selectedNumbers)).length;
      state.scores.self = completedLines;
    },
    setScores(state, action) {
      if (action.payload?.map) {
        state.scores.self = action.payload.map[state.playerId] ?? state.scores.self;
        if (state.opponentId) {
          state.scores.opponent = action.payload.map[state.opponentId] ?? state.scores.opponent;
        }
        return;
      }
      state.scores.opponent = action.payload.opponent ?? state.scores.opponent;
      state.scores.self = action.payload.self ?? state.scores.self;
    },
    setResult(state, action) {
      state.result = action.payload;
      state.screen = 'result';
      state.notifications.push(action.payload === 'win' ? 'Victory! You hit 5 lines!' : 'Defeat. Better luck next round.');
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
    resetToLanding(state) {
      Object.assign(state, initialState);
      state.screen = 'landing';
    }
  }
});

export const {
  setMode,
  setDarkMode,
  setJoinInput,
  setRoomId,
  setRoomCreated,
  startGame,
  setSelectedNumber,
  applyPlayerSelection,
  applyAIMove,
  setOpponentMove,
  setScores,
  setResult,
  setError,
  clearError,
  setOpponentDisconnected,
  regenerateBoard,
  resetState,
  resetToLanding
} = gameSlice.actions;

export default gameSlice.reducer;
