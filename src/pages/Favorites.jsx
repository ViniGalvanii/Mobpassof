import { useEffect, useState } from "react";
import { getPoints } from "../services/mapService";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";

export function Favorites() {
  const { token } = useAuth();
  const [points, setPoints] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("mobpasso_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPoints() {
      try {
        const data = await getPoints(token);
        setPoints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPoints();
  }, [token]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("mobpasso_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const favoritePoints = points.filter((p) => favorites.includes(p.id));

  return (
    <div className="flex flex-col h-screen bg-[#F5F3FF]">
      <Navbar title="Favoritos" />
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-violet-600 text-sm font-medium">Carregando...</p>
            </div>
          </div>
        ) : favoritePoints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#7C3AED">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <h3 className="text-gray-800 font-bold text-lg mb-1">Sem favoritos ainda</h3>
            <p className="text-gray-500 text-sm">
              Vá ao mapa, toque em uma parada e adicione aos favoritos.
            </p>

            <div className="mt-6 w-full">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-3">Suas paradas cadastradas</p>
              {points.length === 0 ? (
                <p className="text-gray-400 text-sm text-center">Nenhuma parada cadastrada.</p>
              ) : (
                <div className="space-y-2">
                  {points.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl border border-violet-100 px-4 py-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">{p.lineNumber}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">{p.lineName}</p>
                          <p className="text-xs text-gray-400">{p.description}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleFavorite(p.id)} className="p-2 rounded-lg hover:bg-violet-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.includes(p.id) ? "#7C3AED" : "none"} stroke="#7C3AED" strokeWidth="2">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase mb-3">Paradas favoritas</p>
            <div className="space-y-2">
              {favoritePoints.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-violet-100 px-4 py-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{p.lineNumber}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{p.lineName}</p>
                      <p className="text-xs text-gray-400">{p.description}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">
                        {p.position.lat.toFixed(4)}, {p.position.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => toggleFavorite(p.id)} className="p-2 rounded-lg hover:bg-violet-50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#7C3AED">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-3">Todas as paradas</p>
              <div className="space-y-2">
                {points.filter((p) => !favorites.includes(p.id)).map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-bold text-xs">{p.lineNumber}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 leading-tight">{p.lineName}</p>
                        <p className="text-xs text-gray-400">{p.description}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleFavorite(p.id)} className="p-2 rounded-lg hover:bg-violet-50 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}