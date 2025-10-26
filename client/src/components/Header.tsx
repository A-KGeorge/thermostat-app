export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-600/20 via-slate-900/50 to-purple-800/20 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            🌡️
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Thermostat
            </h1>
            <p className="text-white/50 text-sm">
              Real-time Temperature Monitor
            </p>
          </div>
        </div>
        <p className="text-white/70 text-sm font-light">
          {new Date().toLocaleDateString()}
        </p>
      </div>
    </header>
  );
}
