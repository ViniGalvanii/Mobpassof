export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM17 11H7V6h10v5z"/></svg>
      </div>
      <div className="text-left">
        <h1 className="text-2xl font-black text-white tracking-tight leading-none drop-shadow">Mobpasso</h1>
        <p className="text-xs text-purple-200 font-medium">Transporte inteligente</p>
      </div>
    </div>
  );
}
