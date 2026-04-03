import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setMode } from '../features/gameSlice.js';

const featureGrid = [
  { title: 'Hidden Boards', desc: 'Opponent never sees your grid.' },
  { title: 'Real-time Sync', desc: 'Server-authoritative turns.' },
  { title: 'First to 5', desc: 'Rows, cols, diags â€” race to BINGO.' },
  { title: 'Human-like AI', desc: '0.5â€“1.5s cadence, blocks your lines.' },
  { title: 'Haptics + Tones', desc: 'Every tap and win feels tactile.' },
  { title: 'Copy & Join', desc: 'Share join ID and start instantly.' }
];

export default function LandingScreen() {
  const dispatch = useDispatch();

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10 hero-shell">
      <div className="relative grid gap-10">
        <div className="space-y-6 text-center">
          <div className="hero-kicker inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-500/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-emerald-100 shadow-[0_6px_30px_rgba(16,185,129,0.25)]">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
            BingoVerse
          </div>
          <h1 className="text-4xl font-black text-white drop-shadow-[0_14px_50px_rgba(0,0,0,0.5)] sm:text-5xl">
            Ready. Set. Bingo.
          </h1>
          <div className="flex justify-center">
            <p className="max-w-2xl text-center text-sm leading-6 text-slate-200 sm:text-base">
              Build your own 5x5, keep it secret, and go head-to-head with AI or a friend. Private boards, neon glow, instant turn sync.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => dispatch(setMode('single'))}
              className="w-full sm:w-60 rounded-[32px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 px-6 py-4 text-lg font-semibold text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.35)] transition hover:-translate-y-[1px] hover:shadow-[0_26px_80px_rgba(34,211,238,0.4)]"
            >
              Single Player
            </button>
            <button
              type="button"
              onClick={() => dispatch(setMode('multi'))}
              className="w-full sm:w-60 rounded-[32px] border border-fuchsia-300/60 bg-slate-900/70 px-6 py-4 text-lg font-semibold text-white shadow-[0_18px_50px_rgba(168,85,247,0.25)] transition hover:-translate-y-[1px] hover:border-fuchsia-200/80 hover:shadow-[0_26px_70px_rgba(168,85,247,0.35)]"
            >
              Two Player
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-900 text-sm font-semibold">P1</div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-fuchsia-400 to-cyan-300 text-slate-900 text-sm font-semibold">P2</div>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-200/80">Share join ID • Lock turns • Race to BINGO</p>
          </div>
        </div>

      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {featureGrid.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-cyan-400/40 hover:shadow-[0_18px_40px_rgba(34,211,238,0.25)] transition">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-200">{item.title}</p>
            <p className="mt-2 text-xs text-slate-200/90">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
