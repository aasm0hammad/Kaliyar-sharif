import { useState, useEffect } from 'react';
import { MapPin, Map, Star, Train, Bus, Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import InteractiveMap from './InteractiveMap';

export default function MapAndStays() {
  const [stays, setStays] = useState([]);
  const [transport, setTransport] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);

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
        setStays(formatted.slice(0, 3));
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
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            {stays.map(stay => (
              <div key={stay.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-32 overflow-hidden bg-gray-100">
                  <img src={stay.img} alt={stay.name} className="w-full h-full object-cover" />
                  {stay.featured ? (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded">
                      Featured
                    </span>
                  ) : null}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-[13px] font-bold text-gray-800 mb-1 leading-tight">{stay.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <Star size={10} className="text-secondary fill-secondary" />
                    <span className="font-bold text-gray-700">{stay.rating}</span>
                    <span>({stay.reviews})</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3">{stay.distance} from Dargah</p>
                  <div className="mt-auto">
                    <button className="w-full py-1.5 border border-primary text-primary hover:bg-primary hover:text-white rounded text-xs font-bold transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {stays.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-400">No hotels listed yet.</div>
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
