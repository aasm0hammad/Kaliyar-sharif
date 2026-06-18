import { useState, useEffect } from 'react';
import { MapPin, Map, Star, Train, Bus, Car, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import InteractiveMap from './InteractiveMap';

export default function MapAndStays() {
  const [stays, setStays] = useState([]);
  const [transport, setTransport] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/hotels')
      .then(res => {
        // Map API model to presentation
        const formatted = res.data.map(h => ({
          id: h.id,
          name: h.name,
          rating: h.rating,
          reviews: h.reviews,
          distance: h.distance,
          img: h.img_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          featured: h.featured
        }));
        const popularStays = formatted.filter(h => h.featured);
        // Fallback to top 3 if none are featured to avoid empty state, but prioritize featured
        setStays(popularStays.length > 0 ? popularStays.slice(0, 3) : formatted.slice(0, 3));
      })
      .catch(err => console.error(err));

    api.get('/transport')
      .then(res => {
        setTransport(res.data.slice(0, 3));
      })
      .catch(err => console.error(err));

    api.get('/ziyarat')
      .then(res => {
        setPlaces(res.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  const getTransportIcon = (type) => {
    if (type === 'train') return Train;
    if (type === 'bus') return Bus;
    return Car;
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map Section */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-bold text-gray-800 relative">
              Plan Your Ziyarat
              <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h2>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-gray-200 flex-1 min-h-[350px]">
            <InteractiveMap 
              places={places} 
              selectedPlace={activePlace} 
              onPlaceSelect={(place) => setActivePlace(place)}
            />
            <Link 
              to="/ziyarat" 
              className="absolute bottom-4 left-4 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-lg transition-all z-[10]"
            >
              <Map size={14} /> View Full Map <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Popular Stays */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-bold text-gray-800 relative">
              Popular Stays
              <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h2>
            <Link to="/stay/all" className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
              Explore All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1">
            {stays.map(stay => (
              <div 
                key={stay.id} 
                onClick={() => navigate(`/hotel/${stay.id}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col relative"
              >
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  <img src={stay.img} alt={stay.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {stay.featured ? (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-primary to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
                      Featured
                    </span>
                  ) : null}
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="w-full bg-white/90 backdrop-blur-sm text-primary py-1.5 rounded-lg text-[10px] font-bold shadow-sm">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50">
                  <h3 className="text-sm font-black text-gray-800 mb-1.5 leading-tight group-hover:text-primary transition-colors line-clamp-1">{stay.name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
                    <span className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded font-bold border border-yellow-100">
                      <Star size={10} className="fill-yellow-500 text-yellow-500" /> {stay.rating}
                    </span>
                    <span className="font-medium">({stay.reviews} reviews)</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <MapPin size={12} className="text-primary" />
                      {stay.distance}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {stays.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-400">No popular hotels listed yet.</div>
            )}
          </div>
        </div>

        {/* Transport Options */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-bold text-gray-800 relative">
              Transport Options
              <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h2>
            <a href="#" className="text-[11px] font-bold text-primary hover:underline">View All</a>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {transport.map(item => {
              const IconComponent = getTransportIcon(item.type);
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 text-primary flex items-center justify-center flex-shrink-0">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{item.route}</h4>
                      <span className="text-[10px] text-gray-500">{item.distance}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-700">
                    ₹{item.fare_min} - ₹{item.fare_max}
                  </div>
                </div>
              );
            })}
            {transport.length === 0 && (
              <div className="text-center py-6 text-gray-400">No transport routes configured.</div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
              <button className="bg-primary hover:bg-primary-light text-white py-2.5 rounded-md text-xs font-bold transition-colors">
                Book Taxi
              </button>
              <button className="bg-white border border-gray-300 hover:border-primary hover:text-primary text-gray-700 py-2.5 rounded-md text-xs font-bold transition-colors">
                Auto Services
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
