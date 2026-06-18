import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, CheckCircle2, Heart, Share2, Video, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewModal from '../components/ReviewModal';
import BookingModal from '../components/BookingModal';
import api from '../api';

export default function HotelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' or 'video'
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [user, setUser] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    // Fetch hotel details
    api.get(`/hotels/${id}`)
      .then(res => {
        setHotel(res.data);
        setCurrentPhoto(res.data.img_url || 'https://placehold.co/800x450?text=No+Image');
        if (res.data.video_url && !res.data.img_url) {
          setActiveTab('video');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching hotel details:", err);
        setLoading(false);
      });

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
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      alert('Please login to save hotels.');
      return;
    }
    const isSaved = savedIds.includes(hotel.id);
    try {
      if (isSaved) {
        await api.delete(`/users/${user.id}/saved-places`, { data: { place_type: 'hotel', place_id: hotel.id } });
        setSavedIds(savedIds.filter(savedId => savedId !== hotel.id));
      } else {
        await api.post(`/users/${user.id}/saved-places`, { place_type: 'hotel', place_id: hotel.id });
        setSavedIds([...savedIds, hotel.id]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500 gap-4">
          <h2 className="text-2xl font-bold">Hotel not found</h2>
          <button onClick={() => navigate('/stay/all')} className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to hotels
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  let parsedAmenities = [];
  try {
    parsedAmenities = typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities) : (hotel.amenities || []);
  } catch (e) {
    parsedAmenities = [];
  }

  let parsedGallery = [];
  try {
    parsedGallery = typeof hotel.gallery_images === 'string' ? JSON.parse(hotel.gallery_images) : (hotel.gallery_images || []);
  } catch (e) {
    parsedGallery = [];
  }
  
  const allPhotos = hotel.img_url ? [hotel.img_url, ...parsedGallery] : parsedGallery;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="flex-1">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center gap-4 text-sm font-medium text-gray-500">
            <button onClick={() => navigate('/stay/all')} className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft size={16} /> Back
            </button>
            <span>/</span>
            <span className="uppercase">{hotel.category}</span>
            <span>/</span>
            <span className="text-gray-800 font-bold truncate">{hotel.name}</span>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="flex border-b border-gray-100 bg-gray-50/50">
                <button 
                  onClick={() => setActiveTab('photo')} 
                  className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'photo' ? 'bg-white text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ImageIcon size={18} /> Photos
                </button>
                {hotel.video_url && (
                  <button 
                    onClick={() => setActiveTab('video')} 
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'video' ? 'bg-white text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Video size={18} /> Tour Video
                  </button>
                )}
              </div>
              
              <div className="relative aspect-video bg-gray-100">
                {activeTab === 'photo' ? (
                  <img src={currentPhoto} alt={hotel.name} className="w-full h-full object-cover" />
                ) : (
                  <iframe 
                    src={getEmbedUrl(hotel.video_url)} 
                    className="w-full h-full"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              
              {activeTab === 'photo' && allPhotos.length > 1 && (
                <div className="p-4 border-t border-gray-100 bg-white">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Photo Gallery</h4>
                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                    {allPhotos.map((photo, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentPhoto(photo)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentPhoto === photo ? 'border-primary opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                        <img src={photo} alt={`${hotel.name} - ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-800 mb-2">{hotel.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> {hotel.distance} from Dargah</span>
                    <span className="flex items-center gap-1.5"><Phone size={16} className="text-primary" /> {hotel.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleToggleSave}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${savedIds.includes(hotel.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={20} className={savedIds.includes(hotel.id) ? 'fill-red-500' : ''} />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {hotel.desc || `Experience a comfortable and peaceful stay at ${hotel.name}. Perfectly located just ${hotel.distance} from the Kaliyar Sharif Dargah, offering the best-in-class amenities and warm hospitality.`}
              </p>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Amenities Provided</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                  {parsedAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <CheckCircle2 size={16} className="text-emerald-500" /> {amenity}
                    </div>
                  ))}
                  {parsedAmenities.length === 0 && <div className="text-sm text-gray-400 col-span-2">No specific amenities listed.</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
              <div className="mb-6">
                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider block mb-1">Starting Price</span>
                <div className="text-3xl font-black text-gray-800">₹{hotel.price} <span className="text-sm text-gray-500 font-medium">/ night</span></div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setIsReviewModalOpen(true)}>
                <div>
                  <div className="flex items-center gap-1 font-black text-lg text-gray-800">
                    {hotel.rating} <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-xs text-blue-600 font-bold">{hotel.reviews} Verified Reviews</span>
                </div>
                <div className="text-blue-500 text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm">Rate</div>
              </div>

              <div className="space-y-3">
                <a 
                  href={`tel:${hotel.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full block text-center border-2 border-primary text-primary hover:bg-primary/5 py-3.5 rounded-xl font-bold transition-colors"
                >
                  Call Reception
                </a>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full block text-center bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5"
                >
                  Book Now
                </button>
              </div>
              
              <p className="text-center text-[11px] text-gray-400 mt-4 font-medium">No booking fees. Direct contact with hotel.</p>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
      
      {isReviewModalOpen && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          itemType="hotel"
          itemId={hotel.id}
          itemName={hotel.name}
          onReviewAdded={() => {
            api.get(`/hotels/${id}`).then(res => setHotel(res.data));
          }}
        />
      )}

      {isBookingModalOpen && hotel && (
        <BookingModal
          hotel={hotel}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
