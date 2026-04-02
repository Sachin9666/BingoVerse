import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Board from './Board.jsx';
import BingoTracker from './BingoTracker.jsx';
import Notifications from './Notifications.jsx';

export default function GameScreen({ onSelectNumber, onShuffleBoard }) {
  const state = useSelector((store) => store.game);
  const isSelfTurn = state.currentTurn === 'self';

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 rounded-[32px] border border-white/5 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="surface-card rounded-3xl border border-cyan-200/15 bg-slate-950/70 p-5 text-center shadow-inner shadow-cyan-500/10 flex flex-col items-center justify-center">
          <p className="heading-accent text-[11px] uppercase tracking-[0.32em] text-cyan-200/70">Turn Indicator</p>
          <p className={`mt-2 text-2xl font-semibold ${isSelfTurn ? 'text-emerald-300' : 'text-fuchsia-300'}`}>
            {isSelfTurn ? 'Your Turn' : "Opponent's Turn"}
          </p>
          <p className="mt-1 text-xs text-slate-400">Tap only when the indicator says your turn.</p>
        </div>
        <div className="surface-card rounded-3xl border border-fuchsia-200/10 bg-slate-950/70 p-5 text-center shadow-inner shadow-fuchsia-500/10 flex flex-col items-center justify-center">
          <p className="heading-accent text-[11px] uppercase tracking-[0.32em] text-fuchsia-200/70">Last Number</p>
          <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 1.1, repeat: Infinity }} className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-500/20 via-fuchsia-400/20 to-sky-400/20 text-4xl font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.35)]">
            {state.lastNumber || '--'}
          </motion.div>
          <p className="mt-2 text-xs text-slate-400">Shared number visible to both boards.</p>
        </div>
        {state.mode === 'multi' && state.roomId && (
          <div className="surface-card sm:col-span-2 rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-inner">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="heading-accent text-[11px] uppercase tracking-[0.28em] text-slate-400">Room ID</p>
                <p className="mt-1 text-xl font-semibold text-white tracking-[0.22em]">{state.roomId}</p>
              </div>
              <button
                type="button"
                className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                onClick={() => navigator.clipboard?.writeText(state.roomId)}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="heading-accent text-xs uppercase tracking-[0.28em] text-cyan-200/70">Your Board</p>
              <p className="text-sm text-slate-300">Numbers are unique to you; opponent never sees this grid.</p>
            </div>
            {state.mode === 'single' && (
              <button
                type="button"
                onClick={onShuffleBoard}
                className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Reshuffle
              </button>
            )}
          </div>
          <Board board={state.board} selectedNumbers={state.selectedNumbers} isDisabled={!isSelfTurn || state.result || !state.gameReady} onSelectNumber={onSelectNumber} />
        </div>
        <div className="space-y-4">
          <div className="surface-card rounded-3xl border border-fuchsia-400/10 bg-slate-950/80 p-5 shadow-inner">
            <h2 className="heading-accent mb-3 text-sm uppercase tracking-[0.32em] text-fuchsia-200/80">B I N G O</h2>
            <BingoTracker score={state.scores.self} />
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-300">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-2 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">You</p>
                <p className="text-lg font-semibold text-cyan-100">{state.scores.self}/5</p>
              </div>
            </div>
          </div>
          <Notifications notifications={state.notifications.slice(-4)} />
          <div className="surface-card rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-slate-900/60 p-4 text-center text-sm text-slate-300 shadow-inner">
            <p className="font-semibold text-white">Private board mode</p>
            <p className="mt-1">We never render your opponent&rsquo;s grid. You only see moves as text + turn state.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
