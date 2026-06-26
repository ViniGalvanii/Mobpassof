import { useNavigate, useLocation } from "react-router-dom";
const tabs = [
  {id:"map",label:"Mapa",path:"/map",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#7C3AED":"#9CA3AF"}><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>},
  {id:"favorites",label:"Favoritos",path:"/favorites",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#7C3AED":"#9CA3AF"}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>},
  {id:"profile",label:"Perfil",path:"/profile",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#7C3AED":"#9CA3AF"}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>},
];
export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 flex items-center justify-around px-4 py-2 shadow-lg z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${isActive?"bg-violet-50":"hover:bg-gray-50"}`}>
            {tab.icon(isActive)}
            <span className={`text-[10px] font-semibold ${isActive?"text-violet-700":"text-gray-400"}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
