import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: "HOME",
    ziyarat: "ZIYARAT",
    stay: "STAYS",
    parking: "PARKING",
    transport: "TRANSPORT",
    foodServices: "FOOD & SERVICES",
    emergency: "EMERGENCY",
    aboutUs: "ABOUT US",
    welcome: "Welcome to Kaliyar Sharif",
    subtitle: "Your complete spiritual companion guide",
    exploreZiyarat: "Explore Ziyarat",
    bookStay: "Book Stay",
    popularStays: "Popular Stays",
    liveOccupancy: "Live Occupancy",
    parkingGuide: "Parking Guide",
    newsUpdates: "News & Updates",
    viewAllNews: "View All News",
    aboutKaliyar: "About Kaliyar Sharif",
    historyTimeline: "Historical Timeline",
    savedPlaces: "Saved Places",
    logout: "Logout",
    loginRegister: "Login / Register",
    searchPlaceholder: "Search...",
    searchBtn: "Search",
    phone: "Phone",
    distance: "Distance",
    fromDargah: "from Dargah",
    hours: "Hours",
    routes: "Popular Routes & Fares",
    bookTaxi: "Book Taxi",
    autoServices: "Auto Services",
    fee: "Fee",
    liveStatus: "Live Status",
    action: "Action",
    navigate: "Navigate"
  },
  hi: {
    home: "होम",
    ziyarat: "ज़ियारत",
    stay: "होटल",
    parking: "पार्किंग",
    transport: "परिवहन",
    foodServices: "भोजन और सेवाएँ",
    emergency: "आपातकालीन",
    aboutUs: "हमारे बारे में",
    welcome: "कलियर शरीफ में आपका स्वागत है",
    subtitle: "आपका संपूर्ण आध्यात्मिक मार्गदर्शक",
    exploreZiyarat: "ज़ियारत शुरू करें",
    bookStay: "होटल बुक करें",
    popularStays: "लोकप्रिय होटल",
    liveOccupancy: "लाइव उपलब्धता",
    parkingGuide: "पार्किंग गाइड",
    newsUpdates: "समाचार और अपडेट",
    viewAllNews: "सभी समाचार देखें",
    aboutKaliyar: "कलियर शरीफ के बारे में",
    historyTimeline: "ऐतिहासिक समयरेखा",
    savedPlaces: "सहेजे गए स्थान",
    logout: "लॉगआउट",
    loginRegister: "लॉगिन / पंजीकरण",
    searchPlaceholder: "खोजें...",
    searchBtn: "खोज",
    phone: "फ़ोन",
    distance: "दूरी",
    fromDargah: "दरगाह से",
    hours: "घंटे",
    routes: "लोकप्रिय मार्ग और किराए",
    bookTaxi: "टैक्सी बुक करें",
    autoServices: "ऑटो सेवाएँ",
    fee: "शुल्क",
    liveStatus: "लाइव स्थिति",
    action: "कार्रवाई",
    navigate: "मार्गदर्शन"
  },
  ur: {
    home: "ہوم",
    ziyarat: "زیارت",
    stay: "ہوٹل",
    parking: "پارکنگ",
    transport: "ٹرانسپورٹ",
    foodServices: "کھانا اور خدمات",
    emergency: "ایمرجنسی",
    aboutUs: "ہمارے بارے میں",
    welcome: "کلیار شریف میں خوش آمدید",
    subtitle: "آپ کا مکمل روحانی رہنما",
    exploreZiyarat: "زیارت شروع کریں",
    bookStay: "ہوٹل بک کریں",
    popularStays: "مقبول ہوٹل",
    liveOccupancy: "لائیو دستیابی",
    parkingGuide: "پارکنگ گائیڈ",
    newsUpdates: "خبریں اور اپڈیٹس",
    viewAllNews: "تمام خبریں دیکھیں",
    aboutKaliyar: "کلیار شریف کے بارے میں",
    historyTimeline: "تاریخی خط",
    savedPlaces: "محفوظ کردہ مقامات",
    logout: "لاگ آؤٹ",
    loginRegister: "لاگ ان / رجسٹریشن",
    searchPlaceholder: "تلاش کریں...",
    searchBtn: "تلاش",
    phone: "فون",
    distance: "فاصلہ",
    fromDargah: "درگاہ سے",
    hours: "اوقات",
    routes: "مقبول راستے اور کرایہ",
    bookTaxi: "ٹیکسی بک کریں",
    autoServices: "آٹو سروسز",
    fee: "فیس",
    liveStatus: "لائیو سٹیٹس",
    action: "ایکشن",
    navigate: "راستہ دکھائیں"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      <div dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
