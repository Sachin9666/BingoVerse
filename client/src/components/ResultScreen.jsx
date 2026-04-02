import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { resetToLanding } from '../features/gameSlice.js';

export default function ResultScreen({ onReplay }) {
  const state = useSelector((store) => store.game);
  const dispatch = useDispatch();
  const isWin = state.result === 'win';

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
      <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/10 bg-slate-950/70 p-8 text-center shadow-inner">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/70">Game Over</p>
        <h2 className="mt-4 text-4xl font-bold text-white">{isWin ? 'You Win!' : 'You Lose'}</h2>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {isWin ? 'Fresh victory with 5 lines completed.' : 'Keep practicing - every match sharpens your strategy.'}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={onReplay} className="rounded-3xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:translate-y-[1px]">
            Replay
          </button>
          <button type="button" onClick={() => dispatch(resetToLanding())} className="rounded-3xl border border-white/10 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/5">
            Exit
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, index) => (
            <motion.span
              key={index}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 360, opacity: 0.9, rotate: 45 }}
              transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay: index * 0.12 }}
              className="absolute h-8 w-2 rounded-full"
              style={{
                left: `${(index * 5) % 100}%`,
                background: index % 2 === 0 ? 'linear-gradient(180deg,#22d3ee,#a855f7)' : 'linear-gradient(180deg,#f472b6,#38bdf8)',
                filter: 'blur(0.8px)'
              }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
