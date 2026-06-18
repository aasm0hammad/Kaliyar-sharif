import { useState, useEffect } from 'react';
import { Car, Navigation, CircleParking, Clock, Search, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function ParkingPage() {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();

  useEffect(() => {
    api.get('/parking')
      .then(res => {
        const formatted = res.data.map(p => {
          let statusText = 'Available';
          if (p.available_slots === 0) {
            statusText = 'Full';
          } else if (p.available_slots < p.capacity * 0.2) {
            statusText = 'Filling Fast';
          }

          return {
            id: p.id,
            name: p.name,
            type: p.type,
            capacity: p.capacity,
            available: p.available_slots,
            distance: p.distance,
            fee: p.rate > 0 ? `₹${p.rate}/hr` : (lang === 'hi' ? 'निःशुल्क' : lang === 'ur' ? 'مفت' : 'Free'),
            status: statusText
          };
        });
        setParkingAreas(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [lang]);

  const getStatusLabel = (status) => {
    if (status === 'Full') return lang === 'hi' ? 'पूर्ण' : lang === 'ur' ? 'بھر گیا' : 'Full';
    if (status === 'Filling Fast') return lang === 'hi' ? 'तेज़ी से भर रहा है' : lang === 'ur' ? 'تیزی سے بھر رہا ہے' : 'Filling Fast';
    return lang === 'hi' ? 'उपलब्ध' : lang === 'ur' ? 'دستیاب' : 'Available';
  };

  const filteredParking = parkingAreas.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-3">{t('parkingGuide')}</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            {lang === 'hi' ? 'अपने वाहनों के लिए सुरक्षित पार्किंग खोजें। कारों, बाइकों और बसों के लिए लाइव उपलब्धता और शुल्क देखें।' :
             lang === 'ur' ? 'اپنی گاڑیوں کے لیے محفوظ پارکنگ تلاش کریں۔ کاروں، بائیکوں اور بسوں کے لیے لائیو دستیابی اور فیس چیک کریں۔' :
             'Find secure parking for your vehicles. Check live occupancy and fees for cars, bikes, and buses.'}
          </p>
        </div>
      </div>
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3"><Car size={24}/></div>
            <h3 className="font-bold">{lang === 'hi' ? 'कार पार्किंग' : lang === 'ur' ? 'کار پارکنگ' : 'Car Parking'}</h3>
            <p className="text-sm text-gray-500">4 {lang === 'hi' ? 'स्थान' : lang === 'ur' ? 'مقامات' : 'Locations'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3"><CircleParking size={24}/></div>
            <h3 className="font-bold">{lang === 'hi' ? 'बाइक पार्किंग' : lang === 'ur' ? 'بائیک پارکنگ' : 'Bike Parking'}</h3>
            <p className="text-sm text-gray-500">2 {lang === 'hi' ? 'स्थान' : lang === 'ur' ? 'مقامات' : 'Locations'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3"><Navigation size={24}/></div>
            <h3 className="font-bold">{lang === 'hi' ? 'बस पार्किंग' : lang === 'ur' ? 'بس پارکنگ' : 'Bus Parking'}</h3>
            <p className="text-sm text-gray-500">1 {lang === 'hi' ? 'स्थान' : lang === 'ur' ? 'مقامات' : 'Locations'}</p>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-xl shadow-sm text-center flex flex-col justify-center">
            <Clock size={24} className="mx-auto mb-2 opacity-80" />
            <h3 className="font-bold text-lg mb-1">{t('liveOccupancy')}</h3>
            <p className="text-xs text-white/80">
              {lang === 'hi' ? 'वास्तविक समय में अपडेट हो रहा है' : lang === 'ur' ? 'حقیقی وقت میں اپ ڈیٹ ہو رہا ہے' : 'Updating in real-time'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">
              {lang === 'hi' ? 'उपलब्ध पार्किंग स्थल' : lang === 'ur' ? 'دستیاب پارکنگ لاٹس' : 'Available Parking Lots'}
            </h2>
            <div className="flex bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64">
              <Search size={18} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-800 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">{lang === 'hi' ? 'पार्किंग का नाम' : lang === 'ur' ? 'پارکنگ کا نام' : 'Parking Name'}</th>
                  <th className="px-6 py-4">{lang === 'hi' ? 'वाहन का प्रकार' : lang === 'ur' ? 'گاڑی کی قسم' : 'Vehicle Type'}</th>
                  <th className="px-6 py-4">{t('distance')}</th>
                  <th className="px-6 py-4">{t('fee')}</th>
                  <th className="px-6 py-4">{t('liveStatus')}</th>
                  <th className="px-6 py-4 text-right">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParking.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{p.name}</td>
                    <td className="px-6 py-4">
                      {p.type === 'Car' ? (lang === 'hi' ? 'कार' : lang === 'ur' ? 'کار' : 'Car') :
                       p.type === 'Bike' ? (lang === 'hi' ? 'बाइक' : lang === 'ur' ? 'بائیک' : 'Bike') :
                       (lang === 'hi' ? 'बस' : lang === 'ur' ? 'بس' : 'Bus')}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1">
                      <MapPin size={14} className="text-primary"/> {p.distance}
                    </td>
                    <td className="px-6 py-4 font-semibold">{p.fee}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        p.status === 'Full' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {getStatusLabel(p.status)} ({p.available}/{p.capacity})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-bold text-xs flex items-center justify-end gap-1 w-full">
                        <Navigation size={14} /> {t('navigate')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
