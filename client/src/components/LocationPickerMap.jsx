import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LocationPickerMap({ lat, lng, onChange }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapType, setMapType] = useState('road'); // 'road' or 'satellite'

  const roadLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use existing lat/lng or default to Kaliyar Sharif coordinates
    const initialLat = parseFloat(lat) || 29.9324;
    const initialLng = parseFloat(lng) || 77.9322;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Google Maps Tile Layers
    const roadLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 22,
    });

    const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps Satellite',
      maxZoom: 22,
    });

    roadLayerRef.current = roadLayer;
    satelliteLayerRef.current = satelliteLayer;

    // Load default road layer
    roadLayer.addTo(map);

    // Create marker with a distinct red/gold pin
    const pickerIcon = L.divIcon({
      html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.3));
        ">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#d32f2f" stroke="#ffffff" stroke-width="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'picker-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: pickerIcon,
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    // Trigger change when marker is dragged
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onChange(position.lat.toFixed(6), position.lng.toFixed(6));
    });

    // Move marker and trigger change when map is clicked
    map.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onChange(clickLat.toFixed(6), clickLng.toFixed(6));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onChange]);

  // Update map layer type
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (mapType === 'road') {
      if (satelliteLayerRef.current) map.removeLayer(satelliteLayerRef.current);
      if (roadLayerRef.current) roadLayerRef.current.addTo(map);
    } else {
      if (roadLayerRef.current) map.removeLayer(roadLayerRef.current);
      if (satelliteLayerRef.current) satelliteLayerRef.current.addTo(map);
    }
  }, [mapType]);

  // Center map on external coordinate changes (e.g. initial edit loading)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const currentLat = parseFloat(lat);
    const currentLng = parseFloat(lng);
    if (isNaN(currentLat) || isNaN(currentLng)) return;

    const markerLatLng = marker.getLatLng();
    if (markerLatLng.lat !== currentLat || markerLatLng.lng !== currentLng) {
      marker.setLatLng([currentLat, currentLng]);
      map.panTo([currentLat, currentLng]);
    }
  }, [lat, lng]);

  return (
    <div className="w-full h-[220px] rounded-lg overflow-hidden border border-gray-200 relative mt-2 bg-gray-50">
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
      
      {/* Map layer switcher (Google style) */}
      <button 
        type="button"
        onClick={() => setMapType(prev => prev === 'road' ? 'satellite' : 'road')}
        className="absolute top-2 left-2 z-[10] bg-white/95 hover:bg-white border border-gray-200 rounded p-1 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer select-none"
      >
        {mapType === 'road' ? (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-[url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=40&q=40')] bg-cover border border-gray-300"></div>
            <span className="text-[10px] font-bold text-gray-700">Satellite</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" className="text-emerald-700">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-gray-700">Map View</span>
          </div>
        )}
      </button>

      {/* Helper Tip HUD */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-1 rounded shadow pointer-events-none uppercase tracking-wider z-[10]">
        Click map or drag pin
      </div>
    </div>
  );
}
