import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export function Navbar({ title="Mapa em Tempo Real" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <header className="bg-gradient-to-r from-violet-700 to-purple-800 text-white px-4 pt-10 pb-4 flex items-center justify-between shadow-md shadow-purple-900/40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM17 11H7V6h10v5z"/></svg>
        </div>
        <span className="font-bold text-lg tracking-tight">Mobpasso</span>
      </div>
      <h2 className="font-semibold text-sm absolute left-1/2 -translate-x-1/2 opacity-80">{title}</h2>
      <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-xl px-3 py-1.5 text-sm font-medium transition-all">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
        Sair
      </button>
    </header>
  );
}
