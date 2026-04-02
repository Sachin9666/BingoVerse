import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import LandingScreen from './components/LandingScreen.jsx';
import LobbyScreen from './components/LobbyScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { applyAIMove, applyPlayerSelection, setRoomCreated, startGame, setSelectedNumber, setResult, setError, setOpponentDisconnected, resetState, setDarkMode, clearError, regenerateBoard, setScores } from './features/gameSlice.js';
import { findBestAIMove } from './utils/gameUtils.js';
import { playAudio, vibrateTap } from './utils/soundUtils.js';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

function App() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.game);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { autoConnect: false });
    const socket = socketRef.current;

    socket.on('connect', () => {
      dispatch(clearError());
    });

    socket.on('roomCreated', (payload) => {
      dispatch(setRoomCreated(payload));
    });

    socket.on('startGame', (payload) => {
      dispatch(startGame(payload));
    });

    socket.on('numberSelected', (payload) => {
      const fromOpponent = payload.selectedBy !== socket.id;
      dispatch(setSelectedNumber({
        number: payload.number,
        fromOpponent,
        lineCompleted: payload.lineCompleted,
        scores: payload.scores,
        currentTurn: payload.currentTurn
      }));
      playAudio(fromOpponent ? 'opponent' : 'select');
    });

    socket.on('updateScore', (payload) => {
      if (payload.scores) {
        dispatch(setScores({ map: payload.scores }));
      }
    });

    socket.on('gameOver', (payload) => {
      const result = payload.winnerId === socket.id ? 'win' : 'lose';
      if (payload.scores) {
        dispatch(setScores({ map: payload.scores }));
      }
      dispatch(setResult(result));
      playAudio(result === 'win' ? 'win' : 'lose');
    });

    socket.on('roomError', ({ message }) => {
      dispatch(setError(message));
    });

    socket.on('gameError', ({ message }) => {
      dispatch(setError(message));
    });

    socket.on('opponentDisconnected', () => {
      dispatch(setOpponentDisconnected());
      playAudio('disconnect');
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const socket = socketRef.current;
  const scheduledAIMove = useRef(null);

  useEffect(() => {
    if (state.mode === 'single' && state.currentTurn === 'opponent' && !state.result && state.gameReady) {
      if (scheduledAIMove.current) {
        clearTimeout(scheduledAIMove.current);
      }
      const nextMove = findBestAIMove(state.aiBoard, state.board, new Set(state.selectedNumbers));
      scheduledAIMove.current = setTimeout(() => {
        dispatch(applyAIMove({ number: nextMove }));
        playAudio('opponent');
      }, 500 + Math.random() * 1000);
    }
    return () => {
      if (scheduledAIMove.current) {
        clearTimeout(scheduledAIMove.current);
      }
    };
  }, [dispatch, state.mode, state.currentTurn, state.gameReady, state.result, state.selectedNumbers, state.aiBoard, state.board]);

  const handleCreateRoom = () => {
    if (socket && !socket.connected) socket.connect();
    socket.emit('createRoom');
    playAudio('tap');
  };

  const handleJoinRoom = (roomId) => {
    if (!roomId) {
      dispatch(setError('Enter a valid JOIN ID.'));
      return;
    }
    if (socket && !socket.connected) socket.connect();
    socket.emit('joinRoom', { roomId });
    playAudio('tap');
  };

  const handleSelectNumber = (number) => {
    if (state.mode === 'single') {
      if (state.currentTurn !== 'self') return;
      dispatch(applyPlayerSelection({ number }));
      playAudio('tap');
      vibrateTap();
    } else if (socket && state.roomId) {
      socket.emit('selectNumber', { roomId: state.roomId, number });
      playAudio('tap');
      vibrateTap();
    }
  };

  let screen = <LandingScreen />;
  if (state.screen === 'result') {
    screen = <ResultScreen onReplay={() => dispatch(resetState())} />;
  } else if (state.screen === 'lobby') {
    screen = <LobbyScreen onCreate={handleCreateRoom} onJoin={handleJoinRoom} />;
  } else if (state.screen === 'game' || state.mode === 'single') {
    screen = <GameScreen onSelectNumber={handleSelectNumber} onShuffleBoard={() => dispatch(regenerateBoard())} />;
  }

  const themeClass = state.darkMode ? 'theme-dark' : 'theme-light';

  return (
    <div className={`${themeClass} min-h-screen`}>
      <div className="page-shell">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="pointer-events-none absolute -left-10 top-10 h-72 w-72 animate-pulse-slow rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 animate-pulse-slower rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.08),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(167,139,250,0.08),transparent_25%),linear-gradient(135deg,#030712_0%,#0a0f1f_60%,#0b1225_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
            <div className="h-40 w-[90%] animate-spin-slow rounded-full bg-gradient-to-r from-cyan-400/30 via-fuchsia-400/25 to-sky-300/20 blur-[80px]" />
          </div>
        </div>
        <div className="relative isolate px-4 py-6 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-4 shadow-[0_10px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="hero-kicker text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">BingoVerse</p>
              <h1 className="hero-heading mt-2 text-2xl font-semibold text-white drop-shadow-lg sm:text-3xl">Private-board bingo with AI and live rooms</h1>
            </div>
              <div className="flex items-center gap-3">
                {state.mode === 'single' && (
                  <button
                    type="button"
                    onClick={() => dispatch(regenerateBoard())}
                    className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    Shuffle Board
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatch(setDarkMode(!state.darkMode))}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {state.darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
            {screen}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
