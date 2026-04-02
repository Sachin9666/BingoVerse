import { motion } from 'framer-motion';
import { getCompletedLineNumbers } from '../utils/gameUtils.js';

const gridState = (number, selected, inCompletedLine) => {
  if (selected) {
    return 'bg-gradient-to-br from-cyan-400 via-emerald-300 to-cyan-200 text-slate-950 shadow-[0_0_26px_rgba(56,189,248,0.5)]';
  }
  if (inCompletedLine) {
    return 'bg-slate-900/90 text-cyan-100 border-cyan-400/30 shadow-[0_0_16px_rgba(56,189,248,0.25)]';
  }
  return 'bg-slate-900/80 text-slate-200 hover:bg-slate-800/90';
};

export default function Board({ board, selectedNumbers, isDisabled, onSelectNumber }) {
  const completedLineNumbers = getCompletedLineNumbers(board, new Set(selectedNumbers));
  return (
    <div className="grid gap-3 rounded-[32px] border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-cyan-500/5 sm:p-6">
      <div className="grid grid-cols-5 gap-3">
        {board.map((number) => {
          const selected = selectedNumbers.includes(number);
          const inCompletedLine = completedLineNumbers.has(number);
          return (
            <motion.button
              key={number}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => !isDisabled && !selected && onSelectNumber(number)}
              disabled={isDisabled || selected}
              className={`board-tile ${selected ? 'selected' : ''} aspect-square rounded-3xl border border-white/10 px-2 text-lg font-semibold transition ${gridState(number, selected, inCompletedLine)} ${isDisabled || selected ? 'opacity-80' : 'active:translate-y-[1px]'}`}
            >
              {number}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
