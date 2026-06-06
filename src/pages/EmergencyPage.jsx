import { Phone, ShieldAlert, Ambulance, Flame, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function EmergencyPage() {
  const { lang } = useLanguage();

  const contacts = [
    { 
      title: lang === 'hi' ? 'पुलिस स्टेशन' : lang === 'ur' ? 'پولیس اسٹیشن' : 'Police Station', 
      number: '112 / 100', 
      desc: lang === 'hi' ? 'कलियर शरीफ थाना' : lang === 'ur' ? 'کلیار شریف تھانہ' : 'Kaliyar Sharif Thana', 
      icon: ShieldAlert, 
      color: 'bg-blue-600' 
    },
    { 
      title: lang === 'hi' ? 'एम्बुलेंस' : lang === 'ur' ? 'ایمبولینس' : 'Ambulance', 
      number: '108', 
      desc: lang === 'hi' ? 'चिकित्सा आपातकाल' : lang === 'ur' ? 'طبی ایمرجنسی' : 'Medical Emergency', 
      icon: Ambulance, 
      color: 'bg-red-600' 
    },
    { 
      title: lang === 'hi' ? 'दमकल विभाग' : lang === 'ur' ? 'فائر سروس' : 'Fire Service', 
      number: '101', 
      desc: lang === 'hi' ? 'अग्नि आपातकाल' : lang === 'ur' ? 'آگ کی ہنگامی صورتحال' : 'Fire Emergency', 
      icon: Flame, 
      color: 'bg-orange-600' 
    },
    { 
      title: lang === 'hi' ? 'खोया-पाया विभाग' : lang === 'ur' ? 'کھویا اور پایا' : 'Lost & Found', 
      number: '+91 9876543210', 
      desc: lang === 'hi' ? 'दरगाह कमेटी कार्यालय' : lang === 'ur' ? 'درگاہ کمیٹی آفس' : 'Dargah Committee Office', 
      icon: HelpCircle, 
      color: 'bg-gray-700' 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-red-600 text-white py-12 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
              <Phone size={36} className="animate-pulse" /> 
              {lang === 'hi' ? 'आपातकालीन सहायता' : lang === 'ur' ? 'ایمرجنسی مدد' : 'Emergency Help'}
            </h1>
            <p className="text-red-100 max-w-xl">
              {lang === 'hi' ? 'पुलिस, एम्बुलेंस और दरगाह प्रशासन के लिए त्वरित एसओएस नंबर।' : 
               lang === 'ur' ? 'پولیس، ایمبولینس اور درگاہ انتظامیہ کے لیے فوری ایس او ایس نمبر۔' : 
               'Instant SOS numbers for police, ambulance, and Dargah administration.'}
            </p>
          </div>
          <a href="tel:112" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-xl shadow-lg transition-transform hover:scale-105">
            {lang === 'hi' ? 'अभी 112 डायल करें' : lang === 'ur' ? 'ابھی 112 پر کال کریں' : 'CALL 112 NOW'}
          </a>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${c.color} text-white flex items-center justify-center flex-shrink-0 shadow`}>
                  <c.icon size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.desc}</p>
                </div>
              </div>
              <a href={`tel:${c.number.split(' / ')[0]}`} className="bg-gray-100 hover:bg-primary hover:text-white text-gray-700 px-4 py-2 rounded-lg font-bold text-lg transition-colors">
                {c.number}
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
