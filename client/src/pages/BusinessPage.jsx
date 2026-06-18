import { useState, useEffect } from 'react';
import { Store, Phone, MessageCircle, Star, MapPin, Search, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewModal from '../components/ReviewModal';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { lang } = useLanguage();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const openReviewModal = (business) => {
    setSelectedBusiness(business);
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    api.get('/businesses')
      .then(res => {
        setBusinesses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching businesses:", err);
        setLoading(false);
      });
  }, []);

  const getCategoryLabel = (cat) => {
    if (lang === 'hi') {
      switch (cat) {
        case 'attar': return 'अत्तर और इत्र';
        case 'chadar': return 'चादर और फूल';
        case 'restaurant': return 'भोजन और रेस्तरां';
        case 'transport': return 'यात्रा और परिवहन';
        case 'hotel': return 'होटल और लॉज';
        case 'gift': return 'उपहार और स्मृति चिन्ह';
        default: return cat;
      }
    } else if (lang === 'ur') {
      switch (cat) {
        case 'attar': return 'عطر اور عطورات';
        case 'chadar': return 'چادر اور پھول';
        case 'restaurant': return 'کھانا اور ریستوراں';
        case 'transport': return 'سفر اور ٹرانسپورٹ';
        case 'hotel': return 'ہوٹل اور قیام گاہ';
        case 'gift': return 'تحائف اور سوغات';
        default: return cat;
      }
    } else {
      switch (cat) {
        case 'attar': return 'Attar & Perfumes';
        case 'chadar': return 'Chadar & Flowers';
        case 'restaurant': return 'Restaurants & Food';
        case 'transport': return 'Travel & Transport';
        case 'hotel': return 'Hotels & Lodges';
        case 'gift': return 'Gifts & Souvenirs';
        default: return cat;
      }
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'attar': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'chadar': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'restaurant': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'transport': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'hotel': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'gift': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  // Search & Filter
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = 
      (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || b.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Premium Hero Banner */}
      <div className="relative bg-gradient-to-r from-primary to-primary-light text-white py-16 px-6 overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-3 z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'hi' ? 'स्थानीय व्यापार निर्देशिका' : lang === 'ur' ? 'مقامی کاروباری ڈائرکٹری' : 'Local Business Directory'}
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-medium">
            {lang === 'hi' ? 'कलियर शरीफ में विश्वसनीय दुकानों, ट्रैवल एजेंसियों, भोजन सेवाओं और होटलों को खोजें।' :
             lang === 'ur' ? 'کلیار شریف میں قابلِ اعتماد دکانیں، ٹریول ایجنسیاں، کھانے پینے کے مراکز اور ہوٹل تلاش کریں۔' :
             'Explore verified shops, travel services, dining places, and accommodations around Dargah Kaliyar Sharif.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search and Filters Segment */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder={lang === 'hi' ? 'दुकानें, सेवाएं या पता खोजें...' : lang === 'ur' ? 'دکانیں، خدمات یا پتہ تلاش کریں...' : 'Search shops, services, or locations...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1 flex-shrink-0">
              <Filter size={12} /> {lang === 'hi' ? 'फ़िल्टर:' : lang === 'ur' ? 'فلٹر:' : 'Filter:'}
            </span>
            {[
              { id: 'all', label: lang === 'hi' ? 'सभी' : lang === 'ur' ? 'سبھی' : 'All' },
              { id: 'attar', label: lang === 'hi' ? 'अत्तर' : lang === 'ur' ? 'عطر' : 'Attar' },
              { id: 'chadar', label: lang === 'hi' ? 'चादर' : lang === 'ur' ? 'چادر' : 'Chadar' },
              { id: 'restaurant', label: lang === 'hi' ? 'भोजन' : lang === 'ur' ? 'کھانا' : 'Food' },
              { id: 'transport', label: lang === 'hi' ? 'परिवहन' : lang === 'ur' ? 'سفر' : 'Transport' },
              { id: 'hotel', label: lang === 'hi' ? 'होटल' : lang === 'ur' ? 'ہوٹل' : 'Stay' },
              { id: 'gift', label: lang === 'hi' ? 'उपहार' : lang === 'ur' ? 'تحائف' : 'Gifts' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex-shrink-0 ${selectedFilter === tab.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-gray-400">Loading directory listings...</span>
          </div>
        ) : (
          <div>
            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBusinesses.map(b => (
                <div 
                  key={b.id} 
                  className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col h-full ${b.premium ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'}`}
                >
                  {/* Shop Image / Header Banner */}
                  <div className="h-48 w-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                    {b.logo_url ? (
                      <img 
                        src={b.logo_url} 
                        alt={b.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary-light/5 flex items-center justify-center text-primary/40">
                        <Store size={48} strokeWidth={1.5} />
                      </div>
                    )}
                    
                    {/* Category Label Overlay */}
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm ${getCategoryColor(b.category)}`}>
                      {getCategoryLabel(b.category)}
                    </span>

                    {/* Premium listing indicator */}
                    {(b.premium === 1 || b.premium === true) && (
                      <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-400">
                        <Star size={11} className="fill-white text-white" />
                        {lang === 'hi' ? 'प्रीमियम विक्रेता' : lang === 'ur' ? 'پریمیم وینڈر' : 'PREMIUM VENDOR'}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-extrabold text-lg text-gray-800 tracking-tight leading-tight">{b.name}</h3>
                      </div>

                      {/* Ratings widget */}
                      <div 
                        className="flex items-center gap-1.5 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openReviewModal(b)}
                      >
                        <div className="flex items-center text-amber-500">
                          <Star size={14} className="fill-amber-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-800">{parseFloat(b.rating || 0.0).toFixed(1)}</span>
                        <span className="text-xs text-gray-400 font-semibold hover:underline">({b.reviews_count || 0} {lang === 'hi' ? 'समीक्षाएं' : lang === 'ur' ? 'جائزے' : 'reviews'})</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed font-medium">
                        {b.description || b.desc}
                      </p>
                    </div>

                    {/* Address & Actions */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 flex-shrink-0">
                      {b.address && (
                        <div className="flex items-start gap-1.5 text-xs text-gray-500 font-medium">
                          <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">{b.address}</span>
                        </div>
                      )}

                      {/* Call and WhatsApp CTA buttons */}
                      <div className="flex gap-3">
                        {b.phone && (
                          <a 
                            href={`tel:${b.phone}`}
                            className="flex-1 border border-primary/20 text-primary hover:bg-primary hover:text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-sm hover:shadow"
                          >
                            <Phone size={14} /> 
                            {lang === 'hi' ? 'कॉल करें' : lang === 'ur' ? 'کال کریں' : 'Call'}
                          </a>
                        )}
                        {b.whatsapp && (
                          <a 
                            href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-sm hover:shadow hover:shadow-green-100"
                          >
                            <MessageCircle size={14} /> 
                            {lang === 'hi' ? 'व्हाट्सएप' : lang === 'ur' ? 'واٹس ایپ' : 'WhatsApp'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredBusinesses.length === 0 && (
              <div className="bg-white border rounded-2xl py-16 px-4 text-center max-w-md mx-auto mt-6 shadow-sm">
                <Store className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {lang === 'hi' ? 'कोई परिणाम नहीं मिला' : lang === 'ur' ? 'کوئی نتیجہ نہیں ملا' : 'No Results Found'}
                </h3>
                <p className="text-sm text-gray-400">
                  {lang === 'hi' ? 'कृपया अपनी खोज बदलें या कोई अन्य फ़िल्टर चुनें।' :
                   lang === 'ur' ? 'براہ کرم اپنی تلاش تبدیل کریں یا کوئی اور فلٹر منتخب کریں۔' :
                   'Try adjusting your search query or choosing a different filter tab.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />

      {/* Review Modal */}
      {selectedBusiness && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          itemType="business"
          itemId={selectedBusiness.id}
          itemName={selectedBusiness.name}
          onReviewAdded={() => {
            api.get('/businesses').then(res => setBusinesses(res.data));
          }}
        />
      )}
    </div>
  );
}
