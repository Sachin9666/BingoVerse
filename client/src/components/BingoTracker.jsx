import { motion } from 'framer-motion';
import { formatBingoProgress } from '../utils/gameUtils.js';

export default function BingoTracker({ score }) {
  const letters = formatBingoProgress(score);
  return (
    <div className="grid grid-cols-5 gap-3">
      {letters.map((item) => (
        <motion.div
          key={item.letter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`bingo-pill rounded-3xl border px-3 py-4 text-center text-xl font-bold transition ${item.active ? 'active border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-neon' : 'border-white/10 bg-slate-900/80 text-slate-400'}`}
        >
          {item.letter}
        </motion.div>
      ))}
    </div>
  );
}
