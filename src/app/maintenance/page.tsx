export default function MaintenancePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(239,68,68,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Glowing pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Animated icon */}
        <div className="mx-auto w-24 h-24 mb-8 rounded-3xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.3)]">
          <svg className="w-12 h-12 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
          Under Maintenance
        </h1>

        <p className="text-xl text-white/60 font-medium mb-8 leading-relaxed">
          SkillSwap is currently undergoing scheduled maintenance. <br className="hidden sm:block" />
          We&apos;ll be back online shortly.
        </p>

        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
          <span className="text-white/70 font-mono text-sm">SYSTEM STATUS: MAINTENANCE MODE ACTIVE</span>
        </div>
      </div>
    </main>
  );
}
