import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Info, Search, Map as MapIcon, Compass, Heart, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InteractiveMap from '../components/InteractiveMap';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function ZiyaratPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [rawPlaces, setRawPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapActivePlace, setMapActivePlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { lang, t } = useLanguage();

  useEffect(() => {
    // Fetch places
    api.get('/ziyarat')
      .then(res => {
        if (res.data) {
          setRawPlaces(res.data);
        }
      })
      .catch(err => console.error(err));

    // Handle authenticated state & fetch saved places
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.get(`/users/${parsedUser.id}/saved-places`)
          .then(res => {
            const ids = res.data.filter(sp => sp.place_type === 'ziyarat').map(sp => sp.place_id);
            setSavedIds(ids);
          })
          .catch(err => console.error(err));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleToggleSave = async (placeId) => {
    if (!user) {
      alert(lang === 'hi' ? 'कृपया सेव करने के लिए लॉगिन करें।' : lang === 'ur' ? 'محفوظ کرنے کے لیے لاگ ان کریں۔' : 'Please login to save places.');
      return;
    }
    const isSaved = savedIds.includes(placeId);
    try {
      if (isSaved) {
        await api.delete(`/users/${user.id}/saved-places`, { data: { place_type: 'ziyarat', place_id: placeId } });
        setSavedIds(savedIds.filter(id => id !== placeId));
      } else {
        await api.post(`/users/${user.id}/saved-places`, { place_type: 'ziyarat', place_id: placeId });
        setSavedIds([...savedIds, placeId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formattedPlaces = rawPlaces.map(p => ({
    id: p.id,
    name: lang === 'hi' && p.name_hi ? p.name_hi : lang === 'ur' && p.name_ur ? p.name_ur : (p.name_en || p.name),
    type: p.type,
    category: p.type === 'dargah' || p.type === 'mazaraat' ? 'mazaraat' : p.type === 'qawwali' ? 'qawwali' : p.type === 'langar' ? 'langar' : 'facilities',
    time: p.timings || '24 Hours',
    opening_time: p.opening_time,
    closing_time: p.closing_time,
    fajr_time: p.fajr_time,
    dhuhr_time: p.dhuhr_time,
    asr_time: p.asr_time,
    maghrib_time: p.maghrib_time,
    isha_time: p.isha_time,
    desc: lang === 'hi' && p.desc_hi ? p.desc_hi : lang === 'ur' && p.desc_ur ? p.desc_ur : (p.desc_en || p.desc),
    img: p.img_url || '/mazarat_placeholder.png',
    lat: p.lat,
    lng: p.lng,
    show_on_route: p.show_on_route
  }));

  const filteredPlaces = formattedPlaces.filter(p => {
    const matchesTab = activeTab === 'all' ? true : p.category === activeTab;
    const matchesSearch = searchQuery.trim() === '' ? true : 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-10 lg:py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              {lang === 'hi' ? 'ज़ियारत गाइड' : lang === 'ur' ? 'زیارت گائیڈ' : 'Ziyarat Guide'}
            </h1>
            <p className="text-gray-200 max-w-xl">
              {lang === 'hi' ? 'पवित्र परिसरों का अन्वेषण करें, आस-पास की मज़ारें, कव्वाली प्रांगण और शांतिपूर्ण ज़ियारत के लिए आवश्यक सुविधाएँ खोजें।' :
               lang === 'ur' ? 'مقدس مقامات، قریبی مزارات، قوالی ہال اور پرامن زیارت کے لیے ضروری سہولیات تلاش کریں۔' :
               'Explore the holy precincts, find nearby mazaraat, Qawwali courtyards, and essential facilities for a peaceful Ziyarat.'}
            </p>
          </div>
          <div className="bg-white/10 p-1 rounded-lg backdrop-blur-md flex max-w-sm w-full">
            <input 
              type="text" 
              placeholder={lang === 'hi' ? 'स्थान खोजें...' : lang === 'ur' ? 'مقامات तलाश करें...' : 'Search places...'} 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-white placeholder-white/70 px-4 py-2 w-full focus:outline-none text-sm" 
            />
            <button className="bg-white text-primary px-4 py-2 rounded font-bold text-sm">
              {lang === 'hi' ? 'खोजें' : lang === 'ur' ? 'تلاش' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Map & Routes */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MapIcon size={20} className="text-primary" /> 
                  {lang === 'hi' ? 'इंटरैक्टिव मानचित्र' : lang === 'ur' ? 'انٹرایکٹو نقشہ' : 'Interactive Map'}
                </h3>
                <a 
                  href={mapActivePlace ? `https://www.google.com/maps/dir/?api=1&destination=${mapActivePlace.lat},${mapActivePlace.lng}` : `https://www.google.com/maps/dir/?api=1&destination=29.9324,77.9322`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Navigation size={14} /> 
                  {lang === 'hi' ? 'दिशा-निर्देश प्राप्त करें' : lang === 'ur' ? 'راستہ معلوم کریں' : 'Get Directions'}
                </a>
              </div>
              <div className="relative flex-1 bg-gray-100">
                <InteractiveMap 
                  places={formattedPlaces}
                  selectedPlace={mapActivePlace}
                  onPlaceSelect={(place) => setMapActivePlace(place)}
                  onPlaceDetailsClick={(place) => setSelectedPlace(place)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Compass size={20} className="text-primary" /> 
                {lang === 'hi' ? 'मुख्य प्रवेश और निकास द्वार' : lang === 'ur' ? 'اہم داخلی اور خارجی دروازے' : 'Key Entry & Exit Gates'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 border-b border-gray-50 pb-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      {lang === 'hi' ? 'बुलंद दरवाज़ा (मुख्य प्रवेश)' : lang === 'ur' ? 'بلند دروازہ (مرکزی داخلہ)' : 'Buland Darwaza (Main Entry)'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lang === 'hi' ? 'सभी भक्तों के लिए प्राथमिक प्रवेश। जुम्मा और उर्स के दौरान बहुत भीड़ होती है।' :
                       lang === 'ur' ? 'تمام زائرین کے لیے مرکزی راستہ۔ جمعہ اور عرس کے دوران کافی رش ہوتا ہے۔' :
                       'Primary entrance for all devotees. Very crowded during Jumma and Urs.'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 border-b border-gray-50 pb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      {lang === 'hi' ? 'वीआईपी / कमेटी गेट' : lang === 'ur' ? 'وی آئی پی / کمیٹی گیٹ' : 'VIP/Committee Gate'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lang === 'hi' ? 'प्रशासनिक उद्देश्यों और विशेष पास के लिए उपयोग किया जाता है।' :
                       lang === 'ur' ? 'انتظامی مقاصد اور خصوصی پاس کے لیے استعمال ہوتا ہے۔' :
                       'Used for administrative purposes and special passes.'}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      {lang === 'hi' ? 'लंगर खाना निकास' : lang === 'ur' ? 'لنگر خانہ سے اخراج' : 'Langar Khana Exit'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lang === 'hi' ? 'लंगर वितरण क्षेत्र और पीछे की पार्किंग की ओर सीधा निकास।' :
                       lang === 'ur' ? 'لنگر تقسیم کے علاقے اور پچھلی پارکنگ کی طرف براہ راست اخراج کا راستہ۔' :
                       'Direct exit towards the langar distribution area and rear parking.'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Places List */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-1 scrollbar-hide">
              <button onClick={() => setActiveTab('all')} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {lang === 'hi' ? 'सभी स्थान' : lang === 'ur' ? 'تمام مقامات' : 'All Places'}
              </button>
              <button onClick={() => setActiveTab('mazaraat')} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'mazaraat' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {lang === 'hi' ? 'मज़ारात' : lang === 'ur' ? 'مزارات' : 'Mazaraat'}
              </button>
              <button onClick={() => setActiveTab('qawwali')} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'qawwali' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {lang === 'hi' ? 'कव्वाली' : lang === 'ur' ? 'قوالی' : 'Qawwali'}
              </button>
              <button onClick={() => setActiveTab('langar')} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'langar' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {lang === 'hi' ? 'लंगर' : lang === 'ur' ? 'لنگر' : 'Langar'}
              </button>
              <button onClick={() => setActiveTab('facilities')} className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'facilities' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                {lang === 'hi' ? 'सुविधाएं' : lang === 'ur' ? 'سہولیات' : 'Facilities'}
              </button>
            </div>

            {/* Places List */}
            <div className="space-y-4">
              {filteredPlaces.map(place => (
                <div key={place.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow group">
                  <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                    <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm uppercase">
                      {place.category === 'mazaraat' ? (lang === 'hi' ? 'मज़ार' : lang === 'ur' ? 'مزارات' : 'Mazar') :
                       place.category === 'qawwali' ? (lang === 'hi' ? 'कव्वाली' : lang === 'ur' ? 'قوالی' : 'Qawwali') :
                       place.category === 'langar' ? (lang === 'hi' ? 'लंगर' : lang === 'ur' ? 'لنگر' : 'Langar') :
                       (lang === 'hi' ? 'सुविधा' : lang === 'ur' ? 'سہولت' : 'Facility')}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">{place.name}</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleSave(place.id)} className={`transition-colors p-1 rounded hover:bg-gray-100 ${savedIds.includes(place.id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}>
                          <Heart size={20} />
                        </button>
                        <button onClick={() => setSelectedPlace(place)} className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-gray-100">
                          <Info size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-secondary" /> 
                        {lang === 'hi' ? 'समय: ' : lang === 'ur' ? 'وقت: ' : ''}
                        {place.time === '24 Hours' ? (lang === 'hi' ? '24 घंटे' : lang === 'ur' ? '24 گھنٹے' : '24 Hours') : place.time}
                      </span>
                      <span 
                        onClick={() => {
                          setMapActivePlace(place);
                          // Scroll to map container on smaller screens
                          const mapEl = document.querySelector('.lg\\:col-span-5');
                          if (mapEl) {
                            mapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }
                        }}
                        className="flex items-center gap-1 cursor-pointer hover:underline text-blue-500"
                      >
                        <Navigation size={14} /> 
                        {lang === 'hi' ? 'मार्ग देखें' : lang === 'ur' ? 'راستہ دیکھیں' : 'Get Route'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                      {place.desc}
                    </p>

                    {/* Quick timings indicator */}
                    {(place.opening_time || place.fajr_time || place.dhuhr_time || place.asr_time || place.maghrib_time || place.isha_time) && (
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 mb-3 text-[11px] flex flex-wrap items-center gap-x-4 gap-y-1">
                        {place.opening_time && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock size={11} className="text-primary" />
                            <span>Hours: <strong>{place.opening_time} - {place.closing_time}</strong></span>
                          </div>
                        )}
                        {(place.fajr_time || place.dhuhr_time || place.asr_time || place.maghrib_time || place.isha_time) && (
                          <div className="flex items-center gap-1 text-emerald-750 font-bold bg-emerald-50/60 px-2 py-0.5 rounded text-[10px] border border-emerald-150/50">
                            <span>Namaz Timings Active</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <button onClick={() => setSelectedPlace(place)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                        {lang === 'hi' ? 'पूर्ण विवरण और इतिहास देखें' : lang === 'ur' ? 'تفصیلات اور تاریخ دیکھیں' : 'View Full Details & History'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPlaces.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  {lang === 'hi' ? 'इस श्रेणी में अभी तक कोई स्थान सूचीबद्ध नहीं है।' :
                   lang === 'ur' ? 'اس زمرے میں ابھی کوئی مقامات درج نہیں ہیں۔' :
                   'No places listed in this category yet.'}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="relative h-64 bg-gray-150 flex-shrink-0">
              <img 
                src={selectedPlace.img} 
                alt={selectedPlace.name} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Photo'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white text-left">
                <span className="bg-primary/95 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase border border-white/20">
                  {selectedPlace.type === 'wuzu' ? 'Wuzu / Toilet' : selectedPlace.type === 'mazaraat' ? 'Mazar' : selectedPlace.type}
                </span>
                <h2 className="text-2xl font-bold mt-1.5">{selectedPlace.name}</h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {lang === 'hi' ? 'विवरण और इतिहास' : lang === 'ur' ? 'تفصیل اور تاریخ' : 'Description & History'}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedPlace.desc || (lang === 'hi' ? 'कोई विवरण उपलब्ध नहीं है।' : lang === 'ur' ? 'کوئی تفصیل دستیاب نہیں ہے۔' : 'No description available.')}
                </p>
              </div>

              {/* Timing grids in modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} className="text-primary" />
                    {lang === 'hi' ? 'खुलने और बंद होने का समय' : lang === 'ur' ? 'کھلنے اور بند ہونے کا وقت' : 'Opening & Closing Hours'}
                  </h4>
                  <div className="bg-gray-50 border p-3 rounded-lg text-sm font-semibold text-gray-700">
                    {selectedPlace.opening_time ? `${selectedPlace.opening_time} - ${selectedPlace.closing_time}` : (selectedPlace.time || '24 Hours')}
                  </div>
                </div>

                {selectedPlace.lat && selectedPlace.lng && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={12} className="text-primary" />
                      {lang === 'hi' ? 'स्थान निर्देशांक' : lang === 'ur' ? 'مقام کی تفصیل' : 'Location Coordinates'}
                    </h4>
                    <div className="bg-gray-50 border p-3 rounded-lg text-sm flex items-center justify-between">
                      <span className="font-mono text-gray-600 text-xs">
                        {parseFloat(selectedPlace.lat).toFixed(6)}, {parseFloat(selectedPlace.lng).toFixed(6)}
                      </span>
                      <a 
                        href={`https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                      >
                        <Navigation size={12} />
                        {lang === 'hi' ? 'मार्ग देखें' : lang === 'ur' ? 'راستہ دیکھیں' : 'Directions'}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Namaz times grid in modal */}
              {(selectedPlace.fajr_time || selectedPlace.dhuhr_time || selectedPlace.asr_time || selectedPlace.maghrib_time || selectedPlace.isha_time) && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} className="text-secondary" />
                    {lang === 'hi' ? 'जमात नमाज़ समय सारणी' : lang === 'ur' ? 'جماعت نماز کا ٹائم ٹیبل' : 'Congregation Namaz Timetable'}
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-center">
                      <div className="text-[10px] font-bold text-emerald-800">{lang === 'hi' ? 'फज्र' : lang === 'ur' ? 'فجر' : 'Fajr'}</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{selectedPlace.fajr_time || '--'}</div>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-center">
                      <div className="text-[10px] font-bold text-emerald-800">{lang === 'hi' ? 'जुहर' : lang === 'ur' ? 'ظہر' : 'Zuhr'}</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{selectedPlace.dhuhr_time || '--'}</div>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-center">
                      <div className="text-[10px] font-bold text-emerald-800">{lang === 'hi' ? 'असर' : lang === 'ur' ? 'عصر' : 'Asr'}</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{selectedPlace.asr_time || '--'}</div>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-center">
                      <div className="text-[10px] font-bold text-emerald-800">{lang === 'hi' ? 'मगरिब' : lang === 'ur' ? 'مغرب' : 'Maghrib'}</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{selectedPlace.maghrib_time || '--'}</div>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-center">
                      <div className="text-[10px] font-bold text-emerald-800">{lang === 'hi' ? 'इशा' : lang === 'ur' ? 'عشاء' : 'Isha'}</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{selectedPlace.isha_time || '--'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2 flex-shrink-0">
              <button 
                onClick={() => handleToggleSave(selectedPlace.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${savedIds.includes(selectedPlace.id) ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                <Heart size={14} className={savedIds.includes(selectedPlace.id) ? 'fill-red-600 text-red-600' : ''} />
                {savedIds.includes(selectedPlace.id) ? 
                  (lang === 'hi' ? 'सेव्ड' : lang === 'ur' ? 'محفوظ کردہ' : 'Saved') : 
                  (lang === 'hi' ? 'सेव करें' : lang === 'ur' ? 'محفوظ کریں' : 'Save Place')}
              </button>
              <button 
                onClick={() => setSelectedPlace(null)}
                className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                {lang === 'hi' ? 'बंद करें' : lang === 'ur' ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
