export default function Notifications({ notifications }) {
  return (
    <div className="surface-card rounded-3xl border border-fuchsia-400/15 bg-slate-950/80 p-4 text-sm text-slate-200 shadow-inner shadow-fuchsia-500/5">
      <p className="heading-accent mb-3 uppercase tracking-[0.3em] text-fuchsia-200/70">Notifications</p>
      <div className="space-y-2">
        {notifications.length ? notifications.slice(-3).map((note, index) => (
          <div key={`${note}-${index}`} className="rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-slate-200 shadow-sm">
            {note}
          </div>
        )) : <p className="text-slate-500">No activity yet.</p>}
      </div>
    </div>
  );
}
