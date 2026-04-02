import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { createBoard, getCompletedLines, createRoomId } from './gameEngine.js';

dotenv.config();

const app = express();
app.use(cors());
app.get('/', (req, res) => res.send('Bingo server is running'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;
const rooms = new Map();

function buildPlayerBoard() {
  return {
    board: createBoard(),
    selected: new Set(),
    score: 0,
    completedLines: []
  };
}

function createRoom(socket) {
  const roomId = createRoomId(rooms);
  const room = {
    id: roomId,
    hostId: socket.id,
    players: {
      [socket.id]: buildPlayerBoard()
    },
    selectedNumbers: new Set(),
    currentTurn: socket.id,
    started: false
  };
  rooms.set(roomId, room);
  socket.join(roomId);
  return room;
}

function computeRoomScores(room) {
  for (const [id, player] of Object.entries(room.players)) {
    const completedLines = getCompletedLines(player.board, room.selectedNumbers);
    player.completedLines = completedLines;
    player.score = completedLines.length;
  }
}

function emitStartGame(room) {
  const playerIds = Object.keys(room.players);
  const payloadScores = {};
  playerIds.forEach((id) => {
    payloadScores[id] = room.players[id].score;
  });
  playerIds.forEach((id) => {
    const opponentId = playerIds.find((pid) => pid !== id) || null;
    io.to(id).emit('startGame', {
      board: room.players[id].board,
      playerId: id,
      opponentId,
      roomId: room.id,
      currentTurn: room.currentTurn,
      scores: payloadScores
    });
  });
}

io.on('connection', (socket) => {
  socket.on('createRoom', () => {
    const room = createRoom(socket);
    socket.emit('roomCreated', {
      roomId: room.id,
      board: room.players[socket.id].board,
      playerId: socket.id
    });
  });

  socket.on('joinRoom', ({ roomId }) => {
    if (!roomId || typeof roomId !== 'string' || !/^[0-9]{6,8}$/.test(roomId)) {
      socket.emit('roomError', { message: 'Invalid JOIN ID. Try again.' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('roomError', { message: 'Invalid JOIN ID. Try again.' });
      return;
    }
    if (Object.keys(room.players).length >= 2) {
      socket.emit('roomError', { message: 'This room is full.' });
      return;
    }

    room.players[socket.id] = buildPlayerBoard();
    room.started = true;
    room.selectedNumbers = new Set();
    socket.join(roomId);

    const playerIds = Object.keys(room.players);
    const firstTurn = playerIds[Math.floor(Math.random() * playerIds.length)];
    room.currentTurn = firstTurn;

    emitStartGame(room);
  });

  socket.on('selectNumber', ({ roomId, number }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('gameError', { message: 'Match not found.' });
      return;
    }
    if (!room.started) {
      socket.emit('gameError', { message: 'Match has not started yet.' });
      return;
    }
    if (room.currentTurn !== socket.id) {
      socket.emit('gameError', { message: 'Not your turn.' });
      return;
    }
    if (typeof number !== 'number' || number < 1 || number > 25) {
      socket.emit('gameError', { message: 'Invalid number selected.' });
      return;
    }
    if (room.selectedNumbers.has(number)) {
      socket.emit('gameError', { message: 'Number already selected.' });
      return;
    }

    const previousScores = {};
    for (const [id, player] of Object.entries(room.players)) {
      previousScores[id] = player.completedLines.length;
    }

    room.selectedNumbers.add(number);
    computeRoomScores(room);

    const scores = {};
    const completedLines = {};
    for (const id of Object.keys(room.players)) {
      scores[id] = room.players[id].score;
      completedLines[id] = room.players[id].completedLines.length > previousScores[id];
    }

    const winner = Object.values(room.players).find((player) => player.score >= 5);
    const winnerId = winner ? Object.keys(room.players).find((id) => room.players[id] === winner) : null;
    const opponentId = Object.keys(room.players).find((id) => id !== socket.id) || socket.id;
    room.currentTurn = opponentId;

    const payload = {
      roomId,
      number,
      selectedBy: socket.id,
      currentTurn: room.currentTurn,
      scores,
      lastSelected: number,
      lineCompleted: completedLines
    };

    io.to(roomId).emit('numberSelected', payload);
    io.to(roomId).emit('updateScore', { roomId, scores });

    if (winnerId) {
      io.to(roomId).emit('gameOver', {
        winnerId,
        scores
      });
      rooms.delete(roomId);
    }
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      if (room.players[socket.id]) {
        const opponentId = Object.keys(room.players).find((id) => id !== socket.id);
        if (opponentId) {
          io.to(opponentId).emit('opponentDisconnected');
        }
        rooms.delete(roomId);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Bingo server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
    console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in server/.env.`);
    process.exit(1);
  }
  throw error;
});
