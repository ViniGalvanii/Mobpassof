import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPoints } from "../services/mapService";

export function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [pointCount, setPointCount] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!token) return;
    // Decodifica o JWT para pegar email e id (sem biblioteca externa)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload.email || "");
    } catch (e) {}

    getPoints(token)
      .then((data) => setPointCount(data.length))
      .catch(() => {});
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = email ? email.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex flex-col h-screen bg-[#F5F3FF]">
      <Navbar title="Meu Perfil" />
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-4">

        {/* Avatar e email */}
        <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 flex-shrink-0">
            <span className="text-white font-bold text-2xl">{initials}</span>
          </div>
          <div>
            <p className="text-gray-800 font-bold text-base">{email || "Usuário"}</p>
            <span className="inline-flex items-center gap-1 mt-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#7C3AED"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Usuário Comum
            </span>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Estatísticas</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-violet-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-violet-700">{pointCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Paradas cadastradas</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-violet-700">
                {JSON.parse(localStorage.getItem("mobpasso_favorites") || "[]").length}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Favoritos</p>
            </div>
          </div>
        </div>

        {/* Sobre o app */}
        <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Sobre o App</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Aplicativo</span>
              <span className="text-sm font-semibold text-gray-800">Mobpasso</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Versão</span>
              <span className="text-sm font-semibold text-gray-800">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Desenvolvido por</span>
              <span className="text-sm font-semibold text-gray-800">Grupo Mobpasso</span>
            </div>
          </div>
        </div>

        {/* Botão sair */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 py-3.5 rounded-2xl font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Sair da conta
        </button>
      </div>
      <BottomNav />
    </div>
  );
}