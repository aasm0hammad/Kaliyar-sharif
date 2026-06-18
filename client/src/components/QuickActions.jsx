import { MapPin, Info, Music, UtensilsCrossed, Hotel, ParkingCircle, Bus, HeartPulse, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function QuickActions() {
  const { lang } = useLanguage();

  const actions = [
    { 
      icon: MapPin, 
      title: lang === 'hi' ? 'ज़ियारत नक्शा' : lang === 'ur' ? 'زیارت کا نقشہ' : 'Ziyarat Map', 
      subtitle: lang === 'hi' ? 'स्थानों का अन्वेषण करें' : lang === 'ur' ? 'مقامات تلاش کریں' : 'Explore Places', 
      path: '/ziyarat' 
    },
    { 
      icon: Route, 
      title: lang === 'hi' ? 'उर्स शेड्यूल' : lang === 'ur' ? 'عرس شیڈول' : 'Urs Schedule', 
      subtitle: lang === 'hi' ? 'उर्स कार्यक्रम' : lang === 'ur' ? 'عرس پروگرام' : 'Urs Events', 
      path: '/urs' 
    },
    { 
      icon: Music, 
      title: lang === 'hi' ? 'कव्वाली स्थान' : lang === 'ur' ? 'قوالی کے مقامات' : 'Qawwali Places', 
      subtitle: lang === 'hi' ? 'समा और कव्वाली' : lang === 'ur' ? 'سماع اور قوالی' : 'Samaa & Qawwali', 
      path: '/ziyarat' 
    },
    { 
      icon: UtensilsCrossed, 
      title: lang === 'hi' ? 'लंगर के स्थान' : lang === 'ur' ? 'لنگر کے مقامات' : 'Langar Locations', 
      subtitle: lang === 'hi' ? 'लंगर सेवाएँ' : lang === 'ur' ? 'لنگر خدمات' : 'Langar Services', 
      path: '/ziyarat' 
    },
    { 
      icon: Hotel, 
      title: lang === 'hi' ? 'होटल और स्टे' : lang === 'ur' ? 'ہوٹل اور قیام' : 'Hotels & Stay', 
      subtitle: lang === 'hi' ? 'सर्वोत्तम आवास' : lang === 'ur' ? 'بہترین رہائش' : 'Best Accommodation', 
      path: '/stay' 
    },
    { 
      icon: ParkingCircle, 
      title: lang === 'hi' ? 'पार्किंग गाइड' : lang === 'ur' ? 'پارکنگ گائیڈ' : 'Parking Guide', 
      subtitle: lang === 'hi' ? 'पार्किंग की जानकारी' : lang === 'ur' ? 'پارکنگ کی معلومات' : 'Parking Information', 
      path: '/parking' 
    },
    { 
      icon: Bus, 
      title: lang === 'hi' ? 'परिवहन' : lang === 'ur' ? 'ٹرانسپورٹ' : 'Transport', 
      subtitle: lang === 'hi' ? 'सभी परिवहन जानकारी' : lang === 'ur' ? 'تمام ٹرانسپورٹ معلومات' : 'All Transport Info', 
      path: '/transport' 
    },
    { 
      icon: HeartPulse, 
      title: lang === 'hi' ? 'आपातकालीन सहायता' : lang === 'ur' ? 'ایمرجنسی مدد' : 'Emergency Help', 
      subtitle: lang === 'hi' ? 'त्वरित सहायता' : lang === 'ur' ? 'فوری مدد' : 'Instant Support', 
      path: '/emergency' 
    },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {actions.map((action, idx) => (
          <Link 
            key={idx} 
            to={action.path}
            className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:!text-white transition-colors duration-300 flex-shrink-0">
              <action.icon size={20} />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                {action.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
