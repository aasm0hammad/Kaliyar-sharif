import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap({ places, selectedPlace, onPlaceSelect, onPlaceDetailsClick }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const [mapType, setMapType] = useState('road'); // 'road' or 'satellite'

  const roadLayerRef = useRef(null);
  const satelliteLayerRef = useRef(null);

  // 1. Initialize Map Instance (Only Once)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [29.9324, 77.9322],
      zoom: 15,
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
    roadLayer.addTo(map);

    // Popup link listener
    map.on('popupopen', (e) => {
      const popup = e.popup;
      const container = popup.getElement();
      if (!container) return;

      const link = container.querySelector('.view-details-link');
      if (link) {
        L.DomEvent.on(link, 'click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          L.DomEvent.preventDefault(ev);
          const placeId = link.getAttribute('data-place-id');
          const matchedPlace = places.find(p => String(p.id) === String(placeId));
          if (matchedPlace && onPlaceDetailsClick) {
            onPlaceDetailsClick(matchedPlace);
          }
        });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [places, onPlaceDetailsClick]);

  // 2. Toggle map layers
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

  // 3. Draw numbered markers + polyline route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Clear existing polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    const validPlaces = places.filter(p => {
      const lat = parseFloat(p.lat);
      const lng = parseFloat(p.lng);
      return !isNaN(lat) && !isNaN(lng) && Number(p.show_on_route) === 1;
    });

    if (validPlaces.length === 0) return;

    // Determine color scheme for stops
    const getStopColor = (index, total) => {
      if (index === 0) return { bg: '#059669', border: '#34d399', ring: 'rgba(5,150,105,0.25)' }; // emerald start
      if (index === total - 1) return { bg: '#dc2626', border: '#f87171', ring: 'rgba(220,38,38,0.25)' }; // rose end
      return { bg: '#0f5132', border: '#6fc49d', ring: 'rgba(15,81,50,0.2)' }; // primary mid
    };

    const routeCoords = [];

    validPlaces.forEach((place, index) => {
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lng);
      routeCoords.push([lat, lng]);

      const isSelected = selectedPlace && selectedPlace.id === place.id;
      const colors = getStopColor(index, validPlaces.length);
      const size = isSelected ? 46 : 38;
      const imgUrl = place.img || '/mazarat_placeholder.png';

      // Build the custom icon HTML with circular image + number badge + pulse
      const customIcon = L.divIcon({
        html: `
          <div style="position:relative; width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center;">
            ${isSelected ? `<div style="position:absolute; inset:-6px; border-radius:50%; background:${colors.ring}; animation: pulse-ring 1.5s ease-out infinite;"></div>` : ''}
            <div style="
              width:${size}px; height:${size}px; border-radius:50%; overflow:hidden;
              border: 3px solid ${colors.border}; box-shadow: 0 3px 12px ${colors.ring};
              position:relative; background: #f3f4f6;
            ">
              <img src="${imgUrl}" alt="" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
            </div>
            <div style="
              position:absolute; top:-4px; right:-4px; z-index:10;
              width:20px; height:20px; border-radius:50%;
              background:${colors.bg}; color:#fff; font-size:10px; font-weight:800;
              display:flex; align-items:center; justify-content:center;
              border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            ">${index + 1}</div>
          </div>
        `,
        className: 'route-map-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup with stop info
      const isStart = index === 0;
      const isEnd = index === validPlaces.length - 1;
      const stopLabel = isStart ? 'Start Point' : isEnd ? 'Final Stop' : `Stop ${index + 1}`;
      const labelColor = isStart ? '#059669' : isEnd ? '#dc2626' : '#0f5132';

      const popupContent = `
        <div style="font-family:system-ui,sans-serif; padding:4px; max-width:240px; text-align:left;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <img src="${imgUrl}" alt="" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid ${colors.border};" onerror="this.style.display='none'" />
            <div>
              <span style="font-size:9px; font-weight:800; color:${labelColor}; text-transform:uppercase; letter-spacing:1px; display:block;">${stopLabel}</span>
              <h4 style="margin:2px 0 0; font-size:13px; font-weight:bold; color:#1e293b;">${place.name}</h4>
            </div>
          </div>
          <p style="margin:0 0 8px; font-size:11px; color:#64748b; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
            ${place.desc || ''}
          </p>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <span style="font-size:9px; font-weight:bold; color:#0f5132; background:#e8f5e9; padding:2px 8px; border-radius:4px;">
              ${place.time || '24 Hours'}
            </span>
            <a href="#" class="view-details-link" data-place-id="${place.id}" style="font-size:10px; font-weight:bold; color:#0f5132; text-decoration:underline;">
              View Details
            </a>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent, { offset: [0, -size / 2 + 4] });

      marker.on('click', () => {
        if (onPlaceSelect) onPlaceSelect(place);
      });

      markersRef.current[place.id] = marker;
    });

    // Draw route polyline connecting all stops in sequence
    if (routeCoords.length >= 2) {
      const polyline = L.polyline(routeCoords, {
        color: '#1e40af',
        weight: 4,
        opacity: 0.75,
        dashArray: '12, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit the map to show all route markers
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

  }, [places, selectedPlace, onPlaceSelect]);

  // 4. Pan to selected place when sidebar card is clicked
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    const lat = parseFloat(selectedPlace.lat);
    const lng = parseFloat(selectedPlace.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    map.setView([lat, lng], 17, { animate: true, duration: 1.0 });

    const marker = markersRef.current[selectedPlace.id];
    if (marker) {
      setTimeout(() => marker.openPopup(), 300);
    }
  }, [selectedPlace]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
      
      {/* Map Layer Switcher */}
      <button 
        type="button"
        onClick={() => setMapType(prev => prev === 'road' ? 'satellite' : 'road')}
        className="absolute top-4 left-4 z-[10] bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-md flex items-center gap-2 transition-all cursor-pointer select-none group"
      >
        {mapType === 'road' ? (
          <div className="flex items-center gap-1.5 pr-2">
            <div className="w-8 h-8 rounded-md bg-[url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=80&q=80')] bg-cover border border-gray-300 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"></div>
            <span className="text-[11px] font-bold text-gray-700">Satellite</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pr-2">
            <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-200 shadow-sm flex-shrink-0 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-700">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-gray-700">Map View</span>
          </div>
        )}
      </button>

      {/* Route overlay HUD */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-gray-200/80 z-[10] text-[10px] font-bold text-gray-700 pointer-events-none uppercase tracking-wider flex items-center gap-1.5 select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
        Ziyarat Route Guide
      </div>

      {/* Route legend */}
      <div className="absolute bottom-14 left-4 z-[10] bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-gray-200 p-3 text-[10px] space-y-1.5 pointer-events-none select-none">
        <div className="font-bold text-gray-700 uppercase tracking-wider text-[9px] mb-1">Route Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-sm"></span>
          <span className="text-gray-600 font-semibold">Start Point</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0f5132] border border-white shadow-sm"></span>
          <span className="text-gray-600 font-semibold">Intermediate Stops</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 border border-white shadow-sm"></span>
          <span className="text-gray-600 font-semibold">Final Stop</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
          <div className="w-6 h-0 border-t-2 border-dashed border-blue-600"></div>
          <span className="text-gray-600 font-semibold">Walking Route</span>
        </div>
      </div>

      {/* Inject CSS for pulse animation */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .route-map-marker { background: none !important; border: none !important; }
      `}</style>
    </div>
  );
}
