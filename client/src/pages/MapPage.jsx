import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Info } from 'lucide-react';
import api from '../api';

// Fix Leaflet's default icon path issues
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for different categories
const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  ziyarat: createCustomIcon('green'),
  hotel: createCustomIcon('blue'),
  parking: createCustomIcon('red'),
  washroom: createCustomIcon('orange'),
  food: createCustomIcon('yellow')
};

export default function MapPage() {
  const [locations, setLocations] = useState({
    ziyarat: [],
    hotels: [],
    food: [],
  });
  const [activeFilter, setActiveFilter] = useState('all');

  // Center of Kaliyar Sharif roughly
  const defaultCenter = [29.9079, 77.9252];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const [ziyaratRes, hotelsRes, foodRes] = await Promise.all([
        api.get('/ziyarat'),
        api.get('/hotels'), // Might not have lat/lng, but we'll try to map them if they do
        api.get('/food')
      ]);

      // Filter those that have valid lat/lng
      const validZiyarat = ziyaratRes.data.filter(item => item.lat && item.lng);
      
      // For demonstration, since hotels/food might not have lat/lng in DB, 
      // we generate some random offsets around the center for dummy visualization if needed,
      // OR we just show the ones we have. Let's assume we show what we have.
      const validHotels = hotelsRes.data.filter(item => item.lat && item.lng);
      const validFood = foodRes.data.filter(item => item.lat && item.lng);

      // Add Dargah explicitly if not in DB
      if (validZiyarat.length === 0) {
        validZiyarat.push({
          id: 999,
          name_en: "Sabir Pak Dargah",
          type: "dargah",
          lat: 29.9079,
          lng: 77.9252,
          desc_en: "Main Shrine of Hazrat Makhdoom Alauddin Ali Ahmed Sabir Pak"
        });
        
        validZiyarat.push({
          id: 998,
          name_en: "Imam Sahab Dargah",
          type: "mazaraat",
          lat: 29.9085,
          lng: 77.9260,
          desc_en: "Dargah of Imam Sahab"
        });
      }

      setLocations({ ziyarat: validZiyarat, hotels: validHotels, food: validFood });
    } catch (err) {
      console.error('Failed to fetch map data', err);
    }
  };

  const allMarkers = [
    ...(activeFilter === 'all' || activeFilter === 'ziyarat' ? locations.ziyarat.map(item => ({ ...item, category: 'ziyarat', icon: icons.ziyarat })) : []),
    ...(activeFilter === 'all' || activeFilter === 'hotel' ? locations.hotels.map(item => ({ ...item, category: 'hotel', icon: icons.hotel })) : []),
    ...(activeFilter === 'all' || activeFilter === 'food' ? locations.food.map(item => ({ ...item, category: 'food', icon: icons.food })) : []),
  ];

  return (
    <div className="bg-gray-50 flex flex-col h-[calc(100vh-80px)]">
      {/* Filters Overlay */}
      <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 z-10 shrink-0">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <MapPin className="text-primary" /> Interactive Map
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">Explore places around Kaliyar Sharif</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'ziyarat', label: 'Dargah & Ziyarat' },
              { id: 'hotel', label: 'Hotels' },
              { id: 'food', label: 'Food & Washrooms' },
            ].map(filter => (
              <button 
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeFilter === filter.id ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer center={defaultCenter} zoom={16} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {allMarkers.map((marker) => (
            <Marker 
              key={`${marker.category}-${marker.id}`} 
              position={[marker.lat, marker.lng]}
              icon={marker.icon}
            >
              <Popup className="custom-popup">
                <div className="min-w-[200px]">
                  <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                    marker.category === 'ziyarat' ? 'text-green-600' :
                    marker.category === 'hotel' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {marker.category}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base mb-1">{marker.name_en || marker.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {marker.desc_en || marker.description || marker.address || 'No details available.'}
                  </p>
                  
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation size={14} /> Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 z-[1000] hidden md:block">
          <h4 className="font-bold text-gray-800 text-sm mb-3">Map Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div><span className="text-xs font-semibold text-gray-600">Dargah / Ziyarat</span></div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div><span className="text-xs font-semibold text-gray-600">Hotels & Stays</span></div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div><span className="text-xs font-semibold text-gray-600">Parking</span></div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div><span className="text-xs font-semibold text-gray-600">Food / Washrooms</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
