import { useState, useEffect } from 'react';
import { UtensilsCrossed, Coffee, HeartPulse, CreditCard, Droplets, MapPin, Star, Phone, Info } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function FoodPage() {
  const [allItems, setAllItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('restaurant');
  const [counts, setCounts] = useState({ restaurant: 0, tea: 0, medical: 0, atm: 0, water: 0 });
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    api.get('/food')
      .then(res => {
        setAllItems(res.data);
        
        // Count entries for categories
        const c = { restaurant: 0, tea: 0, medical: 0, atm: 0, water: 0 };
        res.data.forEach(item => {
          if (item.category === 'restaurant') c.restaurant++;
          else if (item.category === 'tea' || item.category === 'sweet') c.tea++;
          else if (item.category === 'medical' || item.category === 'hospital') c.medical++;
          else if (item.category === 'atm') c.atm++;
          else if (item.category === 'water') c.water++;
        });
        setCounts(c);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { 
      id: 'restaurant',
      icon: UtensilsCrossed, 
      name: lang === 'hi' ? 'भोजनालय' : lang === 'ur' ? 'ریستوراں' : 'Restaurants', 
      count: counts.restaurant, 
      color: 'text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100/50' 
    },
    { 
      id: 'tea',
      icon: Coffee, 
      name: lang === 'hi' ? 'चाय और नाश्ता' : lang === 'ur' ? 'چائے اور اسنیکس' : 'Tea & Snacks', 
      count: counts.tea, 
      color: 'text-amber-700 bg-amber-50 border-amber-100 hover:bg-amber-100/50' 
    },
    { 
      id: 'medical',
      icon: HeartPulse, 
      name: lang === 'hi' ? 'चिकित्सा/अस्पताल' : lang === 'ur' ? 'طبی/ہسپتال' : 'Medical/Hospitals', 
      count: counts.medical, 
      color: 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100/50' 
    },
    { 
      id: 'atm',
      icon: CreditCard, 
      name: lang === 'hi' ? 'एटीएम' : lang === 'ur' ? 'اے ٹی ایم' : 'ATMs', 
      count: counts.atm, 
      color: 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100/50' 
    },
    { 
      id: 'water',
      icon: Droplets, 
      name: lang === 'hi' ? 'पेयजल स्थल' : lang === 'ur' ? 'پینے کا پانی' : 'Water Points', 
      count: counts.water, 
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100 hover:bg-cyan-100/50' 
    },
  ];

  const filteredItems = allItems.filter(item => {
    if (activeCategory === 'restaurant') return item.category === 'restaurant';
    if (activeCategory === 'tea') return item.category === 'tea' || item.category === 'sweet';
    if (activeCategory === 'medical') return item.category === 'medical' || item.category === 'hospital';
    if (activeCategory === 'atm') return item.category === 'atm';
    if (activeCategory === 'water') return item.category === 'water';
    return false;
  });

  const getHeaderTitle = () => {
    switch (activeCategory) {
      case 'restaurant':
        return lang === 'hi' ? 'लोकप्रिय भोजनालय और रेस्टोरेंट' : lang === 'ur' ? 'مقبول ریستوراں اور ہوٹل' : 'Popular Dining & Restaurants';
      case 'tea':
        return lang === 'hi' ? 'चाय, नाश्ता और मिठाई की दुकानें' : lang === 'ur' ? 'چائے اور مٹھائی کی دکانیں' : 'Tea Stalls & Sweet Shops';
      case 'medical':
        return lang === 'hi' ? 'दवा की दुकानें और अस्पताल' : lang === 'ur' ? 'میڈیکل اسٹورز اور ہسپتال' : 'Pharmacies & Emergency Hospitals';
      case 'atm':
        return lang === 'hi' ? 'एटीएम और बैंकिंग बूथ' : lang === 'ur' ? 'اے ٹی ایم اور بینکنگ بوتھ' : 'ATMs & Cash Facilities';
      case 'water':
        return lang === 'hi' ? 'ठंडा पेयजल और सबील पॉइंट' : lang === 'ur' ? 'پینے کے پانی کی سہولیات' : 'Cold Drinking Water Booths';
      default:
        return lang === 'hi' ? 'सुविधाएं' : lang === 'ur' ? 'سہولیات' : 'Essential Services';
    }
  };

  const getFallbackImage = (cat) => {
    switch (cat) {
      case 'restaurant':
        return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
      case 'tea':
      case 'sweet':
        return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80';
      case 'medical':
      case 'hospital':
        return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';
      case 'atm':
        return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80';
      case 'water':
        return 'https://images.unsplash.com/photo-1548839134-6fd0b20be532?auto=format&fit=crop&w=600&q=80';
      default:
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
    }
  };

  const getCategoryTags = (item) => {
    if (item.category === 'restaurant') return ['Mughlai', 'Veg/Non-Veg', 'Family Dining'];
    if (item.category === 'tea') return ['Chai', 'Snacks'];
    if (item.category === 'sweet') return ['Mithai', 'Sweets'];
    if (item.category === 'medical') return ['Pharmacy', 'Medicines'];
    if (item.category === 'hospital') return ['Doctor Available', 'First Aid'];
    if (item.category === 'atm') return ['24 Hours', 'Card Accepted'];
    if (item.category === 'water') return ['Pure RO Water', 'Free of Cost'];
    return ['Service'];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Header />
      
      {/* Premium Hero Header */}
      <div className="bg-primary text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-secondary uppercase mb-3 inline-block">
            {lang === 'hi' ? 'सुविधाएं निर्देशिका' : lang === 'ur' ? 'سہولیات کی ڈائرکٹری' : 'Kaliyar Directory'}
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">{t('foodServices')}</h1>
          <p className="text-gray-200 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
            {lang === 'hi' ? 'साबिर पिया दरगाह के पास स्थित रेस्तरां, भोजनालय, चाय की दुकानें, मेडिकल स्टोर, अस्पताल और एटीएम जैसी महत्वपूर्ण सुविधाओं की जानकारी।' :
             lang === 'ur' ? 'صابر پیا درگاہ کے قریب ریستوراں، چائے کے اسٹالز، میڈیکل اسٹورز، ہسپتالوں اور اے ٹی ایم جیسی ضروری سہولیات کی فہرست۔' :
             'Locate essential public services, popular food joints, pure drinking water booths, emergency clinics, and ATMs close to the holy shrine.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-10">
        
        {/* Category Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <div 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`bg-white p-5 rounded-xl border transition-all cursor-pointer text-center relative overflow-hidden group select-none ${isActive ? 'border-primary ring-2 ring-primary/10 shadow-md scale-[1.02]' : 'border-gray-200 hover:border-primary/60 hover:shadow-sm'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${cat.color} ${isActive ? 'scale-110 shadow-inner' : ''}`}>
                  <cat.icon size={22} className="group-hover:rotate-6 transition-transform" />
                </div>
                <h3 className="font-bold text-sm text-gray-800 tracking-wide">{cat.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">
                  {cat.count} {lang === 'hi' ? 'स्थान उपलब्ध' : lang === 'ur' ? 'مقامات دستیاب' : 'Places Listed'}
                </p>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-gray-800 tracking-tight">{getHeaderTitle()}</h2>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'hi' ? `दरगाह क्षेत्र में ${filteredItems.length} स्थान सूचीबद्ध हैं` : 
               lang === 'ur' ? `درگاہ کے علاقے میں ${filteredItems.length} مقامات درج ہیں` : 
               `Showing ${filteredItems.length} services currently operating in the area`}
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-gray-400">Loading directory...</span>
          </div>
        ) : (
          /* Grid list items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Visual Image Banner */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden shrink-0">
                  <img 
                    src={item.img_url || getFallbackImage(item.category)} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Category Pill Over Image */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm capitalize tracking-wider border border-gray-100">
                    {item.category === 'tea' ? 'Tea Stall' : item.category === 'sweet' ? 'Sweet Shop' : item.category === 'medical' ? 'Pharmacy' : item.category === 'hospital' ? 'Hospital' : item.category}
                  </span>

                  {/* Distance Pill Over Image */}
                  <span className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1">
                    <MapPin size={13} className="text-secondary fill-secondary" /> 
                    {item.distance ? (item.distance.toLowerCase().includes('m') || item.distance.toLowerCase().includes('km') ? item.distance : `${item.distance}`) : 'Nearby'} from Dargah
                  </span>
                </div>

                {/* Card Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-base text-gray-800 leading-snug group-hover:text-primary transition-colors">{item.name}</h3>
                      <span className="flex items-center text-xs font-black text-white bg-emerald-600 px-2 py-0.5 rounded shrink-0">
                        {item.rating || '4.0'} <Star size={10} className="ml-1 fill-white text-white" />
                      </span>
                    </div>

                    {item.address ? (
                      <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">{item.address}</p>
                    ) : (
                      <p className="text-xs text-gray-400 italic min-h-[32px]">Address not registered. Located near the main bazar street.</p>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {getCategoryTags(item).map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded border border-gray-150">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {item.phone && (
                      <a 
                        href={`tel:${item.phone}`} 
                        className="text-primary hover:text-white hover:bg-primary border border-primary/20 p-2 rounded-lg transition-colors flex items-center justify-center"
                        title={`Call ${item.name}`}
                      >
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border rounded-2xl p-12 text-center shadow-sm">
                <Info className="mx-auto text-gray-300 mb-3" size={40} />
                <h4 className="font-bold text-gray-800 text-base mb-1">
                  {lang === 'hi' ? 'कोई स्थान उपलब्ध नहीं है' : lang === 'ur' ? 'کوئی جگہ دستیاب نہیں ہے' : 'No Places Listed'}
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {lang === 'hi' ? 'इस श्रेणी के अंतर्गत अभी कोई स्थान या सुविधा पंजीकृत नहीं की गई है।' :
                   lang === 'ur' ? 'اس زمرے کے تحت ابھی تک کوئی مقام یا سہولت درج نہیں کی گئی ہے۔' :
                   'We currently do not have any listings registered under this category.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
