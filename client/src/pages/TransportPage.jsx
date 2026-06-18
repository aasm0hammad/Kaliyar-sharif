import { useState, useEffect } from 'react';
import { Bus, Train, Car, Navigation, MapPin, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function TransportPage() {
  const [routes, setRoutes] = useState([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    api.get('/transport')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map(t => ({
            id: t.id,
            from: t.route.split(' → ')[0] || t.route,
            distance: t.distance,
            type: t.type,
            fare: `₹${t.fare_min} - ₹${t.fare_max}`
          }));
          setRoutes(formatted);
        } else {
          // Fallback to static list if db empty
          setRoutes([
            { id: 1, from: lang === 'hi' ? 'रुड़की रेलवे स्टेशन' : lang === 'ur' ? 'روڑکی ریلوے اسٹیشن' : 'Roorkee Railway Station', distance: '25 km', type: 'Bus & Auto', fare: '₹50 - ₹100' },
            { id: 2, from: lang === 'hi' ? 'हरिद्वार' : lang === 'ur' ? 'ہری دوار' : 'Haridwar', distance: '45 km', type: 'Bus & Taxi', fare: '₹80 - ₹150' },
            { id: 3, from: lang === 'hi' ? 'दिल्ली' : lang === 'ur' ? 'دہلی' : 'Delhi', distance: '220 km', type: 'Train/Bus/Taxi', fare: '₹600 - ₹1200' },
          ]);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [lang]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-3">{t('transport')}</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            {lang === 'hi' ? 'ट्रेन, बस और टैक्सी के माध्यम से कलियर शरीफ कैसे पहुँचें, इस पर पूरा गाइड। किराए देखें और सवारी बुक करें।' :
             lang === 'ur' ? 'ٹرین، بس اور ٹیکسی کے ذریعے کلیار شریف پہنچنے کے بارے میں مکمل گائیڈ۔ کرائے دیکھیں اور سواری بک کریں۔' :
             'Complete guide on how to reach Kaliyar Sharif via Train, Bus, and Taxi. View fares and book rides.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><Train size={32} /></div>
             <h3 className="font-bold text-lg mb-2">
               {lang === 'hi' ? 'ट्रेन से' : lang === 'ur' ? 'ٹرین کے ذریعے' : 'By Train'}
             </h3>
             <p className="text-sm text-gray-600">
               {lang === 'hi' ? 'निकटतम रेलवे स्टेशन रुड़की (RK) है। वहाँ से, आप सीधे दरगाह के लिए एक साझा ऑटो या टैक्सी ले सकते हैं।' :
                lang === 'ur' ? 'قریب ترین ریلوے اسٹیشن روڑکی (RK) ہے۔ وہاں سے آپ درگاہ کے لیے ڈائریکٹ شیئرڈ آٹو یا ٹیکسی لے سکتے ہیں۔' :
                'Nearest railway station is Roorkee (RK). From there, you can take a shared auto or taxi directly to the Dargah.'}
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4"><Bus size={32} /></div>
             <h3 className="font-bold text-lg mb-2">
               {lang === 'hi' ? 'बस से' : lang === 'ur' ? 'بس کے ذریعے' : 'By Bus'}
             </h3>
             <p className="text-sm text-gray-600">
               {lang === 'hi' ? 'दिल्ली ISBT, हरिद्वार और देहरादून से रुड़की बस स्टैंड के लिए राज्य की बसें नियमित रूप से चलती हैं।' :
                lang === 'ur' ? 'دہلی ISBT، ہری دوار اور دہرادون سے روڑکی بس اسٹینڈ کے لیے باقاعدگی سے سرکاری بسیں چلتی ہیں۔' :
                'State buses operate regularly from Delhi ISBT, Haridwar, and Dehradun to Roorkee bus stand.'}
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4"><Car size={32} /></div>
             <h3 className="font-bold text-lg mb-2">
               {lang === 'hi' ? 'टैक्सी/ऑटो से' : lang === 'ur' ? 'ٹیکسی/آٹو کے ذریعے' : 'By Taxi/Auto'}
             </h3>
             <p className="text-sm text-gray-600">
               {lang === 'hi' ? 'रुड़की स्टेशन से सीधे कलियर शरीफ के लिए निजी टैक्सी और साझा ऑटो 24/7 उपलब्ध हैं।' :
                lang === 'ur' ? 'روڑکی اسٹیشن سے براہِ راست کلیار شریف کے لیے پرائیویٹ ٹیکسیاں اور شیئرڈ آٹو 24/7 دستیاب ہیں۔' :
                'Private taxis and shared autos are available 24/7 from Roorkee station directly to Kaliyar Sharif.'}
             </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('routes')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div>
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  {r.from} <Navigation size={16} className="text-gray-400" /> {lang === 'hi' ? 'कलियर' : lang === 'ur' ? 'کلیار' : 'Kaliyar'}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-primary"/> {r.distance}</span>
                  <span className="flex items-center gap-1"><Car size={14} className="text-primary"/> {r.type}</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-500 mb-1">
                  {lang === 'hi' ? 'अनुमानित किराया' : lang === 'ur' ? 'تخمینی کرایہ' : 'Estimated Fare'}
                </p>
                <p className="font-bold text-xl text-primary">{r.fare}</p>
                <button className="text-xs font-bold text-blue-600 hover:underline mt-2 flex items-center sm:justify-end gap-1 w-full">
                  {t('bookTaxi')} <ExternalLink size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
