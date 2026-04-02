import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setJoinInput, setRoomId, setError } from '../features/gameSlice.js';

export default function LobbyScreen({ onCreate, onJoin }) {
  const state = useSelector((store) => store.game);
  const dispatch = useDispatch();

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
      <div className="space-y-4">
        <div className="rounded-3xl bg-slate-950/60 p-5 shadow-inner shadow-cyan-500/5">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Create a private match</p>
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold text-cyan-100">Host</span>
          </div>
          <button type="button" onClick={onCreate} className="mt-4 w-full rounded-3xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-4 text-lg font-semibold text-slate-950 transition hover:translate-y-[1px] hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)]">
            Create Room
          </button>
          {state.roomId && (
            <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-slate-900/60 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Join ID</p>
              <p className="mt-3 text-3xl font-semibold tracking-[0.3em] text-white">{state.roomId}</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(state.roomId);
                    dispatch(setError(null));
                  }}
                  className="rounded-2xl border border-cyan-500/40 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-500/10"
                >
                  Copy code
                </button>
                <div className="flex items-center gap-2 text-xs text-cyan-100">
                  <span className="h-2 w-2 animate-ping rounded-full bg-cyan-300" />
                  Waiting for opponent...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-slate-950/60 p-5 shadow-inner shadow-fuchsia-500/5">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-fuchsia-200/70">Join a match</p>
            <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-[11px] font-semibold text-fuchsia-100">Guest</span>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={state.joinInput}
              onChange={(event) => dispatch(setJoinInput(event.target.value))}
              placeholder="Enter 6-8 digit ID"
              className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white outline-none placeholder:text-slate-500"
            />
            <button type="button" onClick={() => onJoin(state.joinInput)} className="rounded-3xl bg-gradient-to-r from-fuchsia-400 to-cyan-300 px-5 py-4 text-lg font-semibold text-slate-950 transition hover:translate-y-[1px]">
              Join Room
            </button>
          </div>
        </div>
      </div>
      {state.error && (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
          {state.error}
        </div>
      )}
    </motion.section>
  );
}
