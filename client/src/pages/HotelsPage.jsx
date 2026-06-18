import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Filter, CheckCircle2, ChevronRight, Info, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewModal from '../components/ReviewModal';
import BookingModal from '../components/BookingModal';
import api from '../api';

export default function HotelsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const activeCategory = category || 'all';
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingHotel, setBookingHotel] = useState(null);

  const openBookingModal = (hotel) => {
    setBookingHotel(hotel);
    setIsBookingModalOpen(true);
  };

  const openReviewModal = (hotel) => {
    setSelectedHotel(hotel);
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    // Fetch hotels
    api.get('/hotels')
      .then(res => {
        setHotels(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching hotels:", err);
        setLoading(false);
      });

    // Handle authenticated state & fetch saved hotels
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.get(`/users/${parsedUser.id}/saved-places`)
          .then(res => {
            const ids = res.data.filter(sp => sp.place_type === 'hotel').map(sp => sp.place_id);
            setSavedIds(ids);
          })
          .catch(err => console.error(err));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleToggleSave = async (hotelId) => {
    if (!user) {
      alert('Please login to save hotels.');
      return;
    }
    const isSaved = savedIds.includes(hotelId);
    try {
      if (isSaved) {
        await api.delete(`/users/${user.id}/saved-places`, { data: { place_type: 'hotel', place_id: hotelId } });
        setSavedIds(savedIds.filter(id => id !== hotelId));
      } else {
        await api.post(`/users/${user.id}/saved-places`, { place_type: 'hotel', place_id: hotelId });
        setSavedIds([...savedIds, hotelId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { id: 'all', name: 'All Stays' },
    { id: 'budget', name: 'Budget Hotels' },
    { id: 'family', name: 'Family Rooms' },
    { id: 'guesthouse', name: 'Guest Houses' },
    { id: 'dargah', name: 'Dargah Accommodation' },
    { id: 'ac', name: 'AC Rooms' },
  ];

  const filteredHotels = hotels.filter(h => {
    // 1. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        h.name.toLowerCase().includes(query) || 
        (h.address && h.address.toLowerCase().includes(query)) ||
        (h.distance && h.distance.toLowerCase().includes(query)) ||
        (h.category && h.category.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // 2. Direct Category Match
    if (activeCategory === 'all') return true;
    if (h.category === activeCategory) return true;

    // 3. Match via parsed amenities list
    let amenitiesList = [];
    if (h.amenities) {
      if (Array.isArray(h.amenities)) {
        amenitiesList = h.amenities;
      } else if (typeof h.amenities === 'string') {
        try {
          amenitiesList = JSON.parse(h.amenities);
        } catch (e) {
          amenitiesList = [];
        }
      }
    }

    const lowerAmenities = amenitiesList.map(a => String(a).toLowerCase());

    if (activeCategory === 'ac') {
      return lowerAmenities.includes('ac') && !lowerAmenities.includes('non-ac');
    }
    if (activeCategory === 'non-ac') {
      return lowerAmenities.includes('non-ac');
    }
    if (activeCategory === 'budget') {
      return h.price <= 800 || h.category === 'budget' || lowerAmenities.some(a => a.includes('budget') || a.includes('dormitory') || a.includes('langar'));
    }
    if (activeCategory === 'family') {
      return h.category === 'family' || lowerAmenities.some(a => a.includes('family'));
    }
    if (activeCategory === 'guesthouse') {
      return h.category === 'guesthouse' || lowerAmenities.some(a => a.includes('guest') || a.includes('gh'));
    }
    if (activeCategory === 'dargah') {
      return h.category === 'dargah' || lowerAmenities.some(a => a.includes('dargah') || a.includes('musafirkhana'));
    }

    return false;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-10 lg:py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Hotels & Stay</h1>
            <p className="text-gray-200 max-w-xl">Find comfortable accommodation near the Dargah, from budget-friendly guest houses to premium AC family rooms.</p>
          </div>
          <div className="bg-white/10 p-1 rounded-lg backdrop-blur-md flex max-w-sm w-full">
            <input 
              type="text" 
              placeholder="Search hotels..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-white placeholder-white/70 px-4 py-2 w-full focus:outline-none text-sm" 
            />
            <button className="bg-white text-primary px-4 py-2 rounded font-bold text-sm" onClick={() => setSearchQuery(searchQuery)}>Search</button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Filters */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Filter size={18} className="text-primary" /> Categories
              </h3>
              <ul className="flex flex-row overflow-x-auto gap-2 pb-2 lg:flex-col lg:space-y-2 lg:gap-0 lg:pb-0 scrollbar-none">
                {categories.map(cat => (
                  <li key={cat.id} className="flex-shrink-0">
                    <button 
                      onClick={() => navigate(`/stay/${cat.id}`)}
                      className={`flex items-center justify-between px-4 lg:px-3 py-2 rounded-full lg:rounded-lg text-sm transition-colors whitespace-nowrap lg:w-full ${
                        activeCategory === cat.id ? 'bg-primary text-white lg:bg-primary/10 lg:text-primary font-bold shadow-sm lg:shadow-none' : 'bg-gray-100 text-gray-600 lg:bg-transparent hover:bg-gray-200 lg:hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                      {activeCategory === cat.id && <CheckCircle2 size={16} className="hidden lg:block text-primary ml-2" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:block bg-gradient-to-br from-secondary to-yellow-600 text-white rounded-xl shadow-sm p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold mb-2 relative z-10">Premium Listings</h3>
              <p className="text-sm text-yellow-50 mb-4 relative z-10 leading-relaxed">
                Want to list your hotel at the top of the search results? Become a premium partner today.
              </p>
              <button className="bg-white text-secondary px-4 py-2 rounded font-bold text-sm shadow hover:bg-gray-50 transition-colors w-full relative z-10">
                Promote Business
              </button>
            </div>

          </div>

          {/* Main Content: Hotel List */}
          <div className="lg:col-span-9 flex flex-col">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'Stay' : 'Stays'} Found
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select className="bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary">
                  <option>Recommended</option>
                  <option>Price (Low to High)</option>
                  <option>Distance</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow group relative">
                  
                  {hotel.featured && (
                    <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 uppercase tracking-wider">
                      Featured
                    </div>
                  )}

                  <div className="w-full sm:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0 bg-gray-100 relative cursor-pointer" onClick={() => navigate(`/hotel/${hotel.id}`)}>
                    <img src={hotel.img_url || hotel.img || 'https://placehold.co/400x300?text=No+Image'} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 p-5 lg:p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 onClick={() => navigate(`/hotel/${hotel.id}`)} className="text-xl font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors cursor-pointer hover:underline">{hotel.name}</h3>
                          <button onClick={() => handleToggleSave(hotel.id)} className={`transition-colors p-1 rounded hover:bg-gray-50 ${savedIds.includes(hotel.id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                            <Heart size={18} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-2">
                          <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {hotel.distance} from Dargah</span>
                          <span className="flex items-center gap-1"><Phone size={14} className="text-primary" /> {hotel.phone}</span>
                        </div>
                      </div>
                      <div className="bg-primary/10 px-2 py-1 rounded-lg flex flex-col items-center flex-shrink-0 cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => openReviewModal(hotel)}>
                        <div className="flex items-center gap-1 text-primary font-bold">
                          {hotel.rating} <Star size={14} className="fill-primary" />
                        </div>
                        <span className="text-[10px] text-primary hover:underline">{hotel.reviews} reviews</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 mb-4">
                      {hotel.amenities && Array.isArray(hotel.amenities) ? hotel.amenities.map((amenity, i) => (
                         <span key={i} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded border border-gray-200">
                           {amenity}
                         </span>
                      )) : typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities).map((amenity, i) => (
                         <span key={i} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded border border-gray-200">
                           {amenity}
                         </span>
                      )) : null}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-gray-500 block">Starting from</span>
                        <div className="text-xl font-black text-gray-800">₹{hotel.price} <span className="text-xs font-medium text-gray-500">/night</span></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => navigate(`/hotel/${hotel.id}`)} className="hidden lg:flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                          <Info size={16} /> Details
                        </button>
                        <button
                          onClick={() => openBookingModal(hotel)}
                          className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition-all hover:-translate-y-0.5"
                        >
                          Book Now <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredHotels.length === 0 && (
                <div className="text-center py-10 text-gray-400">No stays matching this category.</div>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />

      {/* Review Modal */}
      {selectedHotel && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          itemType="hotel"
          itemId={selectedHotel.id}
          itemName={selectedHotel.name}
          onReviewAdded={() => {
            api.get('/hotels').then(res => setHotels(res.data));
          }}
        />
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && bookingHotel && (
        <BookingModal
          hotel={bookingHotel}
          onClose={() => { setIsBookingModalOpen(false); setBookingHotel(null); }}
        />
      )}
    </div>
  );
}
