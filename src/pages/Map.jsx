import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint, deletePoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";

const containerStyle = { width: "100%", height: "100%" };
const MAP_STYLES = [
  { elementType:"geometry", stylers:[{color:"#f0ebff"}] },
  { featureType:"road", elementType:"geometry", stylers:[{color:"#ffffff"}] },
  { featureType:"road.arterial", elementType:"geometry", stylers:[{color:"#e8e0ff"}] },
  { featureType:"road.highway", elementType:"geometry", stylers:[{color:"#c4b5fd"}] },
  { featureType:"water", elementType:"geometry", stylers:[{color:"#a78bfa"}] },
  { featureType:"poi.park", elementType:"geometry", stylers:[{color:"#ddd6fe"}] },
];
const TOAST_COLORS = { success:"bg-emerald-500", error:"bg-red-500", warning:"bg-amber-500" };
const EMPTY_FORM = { lineNumber:"", lineName:"", description:"" };

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat:-29.1678, lng:-51.1794 });
  const [addingPoint, setAddingPoint] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [pendingCoord, setPendingCoord] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { const c={lat:pos.coords.latitude,lng:pos.coords.longitude}; setUserLocation(c); setMapCenter(c); },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    async function fetchMarkers() {
      try { const data = await getPoints(token); setMarkers(data); }
      catch (err) { showToast(err.message, "error"); }
    }
    fetchMarkers();
  }, [token]);

  const handleMapClick = (event) => {
    if (!addingPoint) return;
    setPendingCoord({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleSavePoint = async () => {
    if (!pendingCoord) return;
    if (!form.lineNumber || !form.lineName) { showToast("Preencha o número e nome da linha!", "warning"); return; }
    setLoading(true);
    try {
      const payload = { latitude:pendingCoord.lat, longitude:pendingCoord.lng, lineNumber:Number(form.lineNumber), lineName:form.lineName, description:form.description||"Parada sem descrição" };
      const saved = await postPoint(token, payload);
      setMarkers(prev => [...prev, { id:saved.id, lineNumber:saved.lineNumber, lineName:saved.lineName, description:saved.description, title:`Linha ${saved.lineNumber} — ${saved.lineName}`, position:{lat:saved.latitude,lng:saved.longitude} }]);
      setPendingCoord(null); setForm(EMPTY_FORM); setAddingPoint(false);
      showToast("Parada salva com sucesso!");
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const handleDeletePoint = async (id) => {
    try { await deletePoint(token, id); setMarkers(prev=>prev.filter(m=>m.id!==id)); setSelectedMarker(null); showToast("Parada removida."); }
    catch (err) { showToast(err.message, "error"); }
  };

  const cancelAdding = () => { setAddingPoint(false); setPendingCoord(null); setForm(EMPTY_FORM); };
  const centerOnUser = () => { if (userLocation && mapRef.current) { mapRef.current.panTo(userLocation); mapRef.current.setZoom(15); } };

  const pinIcon = (color, stroke) => ({ path:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z", fillColor:color, fillOpacity:1, strokeColor:stroke, strokeWeight:2, scale:1.6, anchor:{x:12,y:22} });

  return (
    <div className="flex flex-col h-screen bg-[#F5F3FF]">
      <Navbar title="Mapa em Tempo Real" />
      <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-violet-100 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${addingPoint?"bg-amber-400 animate-pulse":"bg-emerald-400"}`} />
          <span className="text-xs font-medium text-gray-600">
            {addingPoint ? (pendingCoord?"Preencha os dados da parada":"Toque no mapa para marcar") : `${markers.length} parada(s) cadastrada(s)`}
          </span>
        </div>
        <span className="text-xs text-violet-500 font-semibold">Tempo real</span>
      </div>

      <div className="flex-1 relative">
        {isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13} onClick={handleMapClick} onLoad={(map)=>{mapRef.current=map;}}
            options={{ styles:MAP_STYLES, disableDefaultUI:true }}>
            {userLocation && <Marker position={userLocation} title="Você está aqui" icon={pinIcon("#7C3AED","#fff")} />}
            {markers.map(m=>(
              <Marker key={m.id} position={m.position} title={m.title} onClick={()=>setSelectedMarker(m)} icon={pinIcon("#5B21B6","#EDE9FE")} />
            ))}
            {pendingCoord && <Marker position={pendingCoord} icon={pinIcon("#F59E0B","#FEF3C7")} />}
            {selectedMarker && (
              <InfoWindow position={selectedMarker.position} onCloseClick={()=>setSelectedMarker(null)}>
                <div className="p-2 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{selectedMarker.lineNumber}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-tight">{selectedMarker.lineName}</p>
                      <p className="text-xs text-gray-500">{selectedMarker.description}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2">{selectedMarker.position.lat.toFixed(5)}, {selectedMarker.position.lng.toFixed(5)}</p>
                  <button onClick={()=>handleDeletePoint(selectedMarker.id)} className="w-full text-xs text-red-500 border border-red-200 rounded-lg py-1 hover:bg-red-50 transition-colors">Remover parada</button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-violet-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-violet-600 font-medium text-sm">Carregando mapa...</p>
            </div>
          </div>
        )}
        <div className="absolute right-4 top-4 z-10">
          <button onClick={centerOnUser} className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-violet-700 hover:bg-violet-50 active:scale-95 transition-all border border-violet-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
          </button>
        </div>
      </div>

      <div className="bg-white border-t border-violet-100 px-4 pt-3 pb-20 z-10 shadow-[0_-4px_20px_rgba(109,40,217,0.08)]">
        {!addingPoint && (
          <button onClick={()=>setAddingPoint(true)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-purple-500/30 active:scale-[0.98] transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm4 8h-3v3h-2v-3H8V8h3V5h2v3h3v2z"/></svg>
            Adicionar Parada de Ônibus
          </button>
        )}
        {addingPoint && !pendingCoord && (
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <p className="text-amber-700 text-sm font-medium">Toque no mapa para posicionar a parada</p>
            </div>
            <button onClick={cancelAdding} className="w-10 h-10 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center text-red-500 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        )}
        {pendingCoord && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input type="number" placeholder="Linha nº" value={form.lineNumber} onChange={e=>setForm(f=>({...f,lineNumber:e.target.value}))}
                className="w-24 flex-shrink-0 bg-violet-50 border-2 border-violet-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-400" />
              <input type="text" placeholder="Nome da linha (ex: Vera Cruz → Centro)" value={form.lineName} onChange={e=>setForm(f=>({...f,lineName:e.target.value}))}
                className="flex-1 bg-violet-50 border-2 border-violet-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-400" />
            </div>
            <input type="text" placeholder="Descrição (ex: Estação Central)" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
              className="w-full bg-violet-50 border-2 border-violet-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-400" />
            <div className="flex gap-2 pt-1">
              <button onClick={cancelAdding} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSavePoint} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 disabled:opacity-60">{loading?"Salvando...":"Salvar Parada"}</button>
            </div>
          </div>
        )}
      </div>

      {toast && <div className={`fixed top-20 left-1/2 -translate-x-1/2 ${TOAST_COLORS[toast.type]} text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold z-50 whitespace-nowrap`}>{toast.msg}</div>}
      <BottomNav />
    </div>
  );
};
