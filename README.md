# Bingo Game Project

A mobile-first, real-time multiplayer Bingo web application with AI and private board gameplay.

## Setup

### Server
```bash
cd server
npm install
npm start
```

### Client
```bash
cd client
npm install
npm run dev
```

### Environment
Copy `.env.example` to `.env` in `/server` to override `PORT` (defaults to `4000`).
Copy `/client/.env.example` to `/client/.env` and point `VITE_SERVER_URL` at your server (default `http://localhost:4000`).

## Features
- Single player vs AI with human-like delays and blocking strategy
- Real-time multiplayer (Socket.IO) with join codes (6–8 digits)
- Private board experience: only your grid is ever rendered; opponent actions arrive as text + turn states
- Accurate server-side validation: duplicate prevention, turn locking, score + win detection (5 lines)
- Mobile-first glassmorphism + neon glow UI, Framer Motion micro-interactions, animated confetti
- Sound effects, haptics, light/dark toggle, copy-to-clipboard JOIN ID, board reshuffle for solo
- Edge handling: invalid join IDs, disconnect autowin notice, last-move spotlight, BINGO tracker
