import { useState, useEffect, useRef, useCallback } from 'react';
import { Video, Users, Sun, Clock, Megaphone, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSection() {
  const [status, setStatus] = useState({ crowd: 'Medium', weather: { temp: '28°C', desc: 'Partly Cloudy', humidity: '54%' }, namaz: { next: 'Zuhr', time: '12:35 PM' } });
  const [announcements, setAnnouncements] = useState([]);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const { lang, t } = useLanguage();

  // Default fallback slide when no admin slides exist
  const defaultSlide = {
    img_url: '/dargah_hero_bg.png',
    title_en: 'Kaliyar Sharif Dargah',
    title_hi: 'कलियर शरीफ दरगाह',
    title_ur: 'کلیار شریف درگاہ',
    subtitle_en: 'Darbar-e-Aala Hazrat',
    subtitle_hi: 'दरबार-ए-आला हज़रत',
    subtitle_ur: 'دربارِ اعلیٰ حضرت'
  };

  useEffect(() => {
    // Fetch live status
    api.get('/status')
      .then(res => setStatus(res.data))
      .catch(err => console.error(err));

    // Fetch news and filter announcements
    api.get('/news')
      .then(res => {
        const list = res.data.filter(n => n.type === 'Announcement');
        setAnnouncements(list);
      })
      .catch(err => console.error(err));

    // Fetch hero slides
    api.get('/hero-slides')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const activeSlides = slides.length > 0 ? slides : [defaultSlide];

  // Get the localized title for the current slide
  const getTitle = (slide) => {
    if (lang === 'hi') return slide.title_hi || slide.title_en || 'कलियर शरीफ दरगाह';
    if (lang === 'ur') return slide.title_ur || slide.title_en || 'کلیار شریف درگاہ';
    return slide.title_en || 'Kaliyar Sharif Dargah';
  };

  const getSubtitle = (slide) => {
    if (lang === 'hi') return slide.subtitle_hi || slide.subtitle_en || 'दरबार-ए-आला हज़रत';
    if (lang === 'ur') return slide.subtitle_ur || slide.subtitle_en || 'دربارِ اعلیٰ حضرت';
    return slide.subtitle_en || 'Darbar-e-Aala Hazrat';
  };

  // Auto slide
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (activeSlides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000);
  }, [activeSlides.length]);

  useEffect(() => {
    startAutoSlide();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoSlide]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
    startAutoSlide();
  };

  const goToNext = () => {
    setCurrentSlide(prev => (prev + 1) % activeSlides.length);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
    setTimeout(() => setIsTransitioning(false), 700);
    startAutoSlide();
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    goToNext();
    setTimeout(() => setIsTransitioning(false), 700);
    startAutoSlide();
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-4 mb-8">
      {/* Hero Banner with Slider */}
      <div className="relative rounded-2xl overflow-hidden h-[360px] lg:h-[420px] shadow-lg group">
        
        {/* Slides Container */}
        <div className="absolute inset-0">
          {activeSlides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-700 ease-in-out"
              style={{
                opacity: currentSlide === index ? 1 : 0,
                transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)',
                zIndex: currentSlide === index ? 1 : 0,
              }}
            >
              <img
                src={slide.img_url}
                alt={slide.title_en || 'Kaliyar Sharif'}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 z-[2] bg-gradient-to-r ${
          lang === 'ur'
            ? 'from-transparent via-black/50 to-black/95'
            : 'from-black/95 via-black/50 to-transparent'
        }`}></div>

        {/* Content */}
        <div className={`relative z-[3] h-full flex flex-col justify-center px-6 md:px-12 lg:px-16 w-full md:w-[75%] lg:w-[60%] text-white ${lang === 'ur' ? 'items-end text-right ml-auto' : ''}`}>
          
          {/* Animated Title - changes per slide */}
          <h2
            key={`title-${currentSlide}`}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
            style={{ animation: 'heroFadeUp 0.7s ease-out' }}
          >
            {getTitle(activeSlides[currentSlide])}
          </h2>
          
          <div className="flex items-center gap-4 mb-4 w-full">
            <div className="h-[2px] flex-1 bg-white/20"></div>
            <h3
              key={`subtitle-${currentSlide}`}
              className="text-lg md:text-xl lg:text-2xl font-semibold"
              style={{ animation: 'heroFadeUp 0.7s ease-out 0.1s both' }}
            >
              {getSubtitle(activeSlides[currentSlide])}
            </h3>
            <div className="h-[2px] flex-1 bg-white/20"></div>
          </div>
          
          <p className="text-xs md:text-sm lg:text-base text-gray-200 mb-6 leading-relaxed max-w-md">
            {lang === 'hi' ? (
              <>यहाँ हर दिल को सुकून मिलता है, <br/>और हर दुआ क़बूल होती है।</>
            ) : lang === 'ur' ? (
              <>یہاں ہر دل کو سکون ملتا ہے، <br/>اور ہر دعا قبول ہوتی ہے۔</>
            ) : (
              <>Yahan har dil ko sukoon milta hai, <br/>aur har dua qabool hoti hai.</>
            )}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mb-6 w-full">
            <div className="flex bg-white rounded-lg overflow-hidden shadow-lg p-1">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="flex-1 px-4 py-2 text-sm text-gray-800 focus:outline-none"
              />
              <button className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-md font-semibold text-sm transition-colors flex-shrink-0">
                {t('searchBtn')}
              </button>
            </div>
          </div>

          <Link to="/about" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 w-max transition-colors text-xs md:text-sm">
            {lang === 'hi' ? 'दरगाह के बारे में अधिक जानें' : lang === 'ur' ? 'درگاہ کے بارے میں مزید معلومات' : 'More About Dargah'}
            <ArrowRight size={16} className={lang === 'ur' ? 'rotate-180' : ''} />
          </Link>
        </div>

        {/* Slider Controls - only show when more than 1 slide */}
        {activeSlides.length > 1 && (
          <>
            {/* Left/Right Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-[4] w-10 h-10 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-[4] w-10 h-10 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'w-8 h-2.5 bg-white shadow-lg'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-[4] h-[3px] bg-white/10">
              <div
                className="h-full bg-white/60 transition-all"
                style={{
                  width: `${((currentSlide + 1) / activeSlides.length) * 100}%`,
                  transition: 'width 0.5s ease'
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Status Card (Positioned overlapping the hero image) */}
      <div className="relative z-10 -mt-8 sm:-mt-12 lg:-mt-16 mx-0 sm:mx-6 lg:mx-8 bg-white rounded-2xl border border-gray-100 shadow-xl p-4 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 pb-4 md:pb-6 border-b border-gray-100">
          
          {/* Live Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50 sm:border-transparent">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Video className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5 sm:mb-1">
                {lang === 'hi' ? 'लाइव स्टेटस' : lang === 'ur' ? 'لائیو سٹیٹس' : 'LIVE STATUS'}
              </div>
              <div className="text-sm sm:text-base font-bold text-gray-800 mb-0.5 sm:mb-1">
                {lang === 'hi' ? 'लाइव दर्शन' : lang === 'ur' ? 'لائیو زیارت' : 'Live View'}
              </div>
              <a href="#" className="text-primary text-[10px] sm:text-xs font-semibold hover:underline flex items-center gap-1">
                {lang === 'hi' ? 'अभी देखें' : lang === 'ur' ? 'ابھی دیکھیں' : 'Watch Now'} <ArrowRight size={10} className="sm:w-3 sm:h-3" />
              </a>
            </div>
          </div>

          {/* Crowd Level */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50 sm:border-transparent">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5 sm:mb-1">
                {lang === 'hi' ? 'भीड़ का स्तर' : lang === 'ur' ? 'رش کا حجم' : 'CROWD LEVEL'}
              </div>
              <div className="text-sm sm:text-base font-bold text-orange-500 mb-0.5 sm:mb-1">
                {status.crowd === 'High' ? (lang === 'hi' ? 'अत्यधिक' : lang === 'ur' ? 'زیادہ' : 'High') : 
                 status.crowd === 'Low' ? (lang === 'hi' ? 'कम' : lang === 'ur' ? 'کم' : 'Low') : 
                 (lang === 'hi' ? 'सामान्य' : lang === 'ur' ? 'درمیانہ' : 'Medium')}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                {lang === 'hi' ? `भीड़ ${status.crowd === 'High' ? 'अत्यधिक' : status.crowd === 'Low' ? 'कम' : 'सामान्य'} है` : 
                 lang === 'ur' ? `رش ${status.crowd === 'High' ? 'زیادہ' : status.crowd === 'Low' ? 'کم' : 'درمیانہ'} ہے` : 
                 `Crowd is ${status.crowd}`}
              </div>
            </div>
          </div>

          {/* Weather */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50 sm:border-transparent">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
              <Sun className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5 sm:mb-1">
                {lang === 'hi' ? 'मौसम' : lang === 'ur' ? 'موسم' : 'WEATHER'}
              </div>
              <div className="text-sm sm:text-base font-bold text-gray-800 mb-0.5 sm:mb-1">{status.weather.temp}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                {status.weather.desc} • {status.weather.humidity}
              </div>
            </div>
          </div>

          {/* Next Namaz */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50 sm:border-transparent">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5 sm:mb-1">
                {lang === 'hi' ? 'अगली नमाज़' : lang === 'ur' ? 'اگلی نماز' : 'NEXT NAMAZ'}
              </div>
              <div className="text-sm sm:text-base font-bold text-gray-800 mb-0.5 sm:mb-1">
                {status.namaz.next} • {status.namaz.time}
              </div>
              <a href="#" className="text-primary text-[10px] sm:text-xs font-semibold hover:underline flex items-center gap-1">
                {lang === 'hi' ? 'सभी देखें' : lang === 'ur' ? 'تمام اوقات' : 'View Timings'} <ArrowRight size={10} className="sm:w-3 sm:h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Announcements Bar */}
        <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
            <div className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 flex-shrink-0 shadow-sm">
              <Megaphone size={14} />
              <span className="hidden sm:inline">{lang === 'hi' ? 'महत्वपूर्ण घोषणाएं' : lang === 'ur' ? 'اہم اعلانات' : 'ANNOUNCEMENTS'}</span>
              <span className="sm:hidden">ANNOUNCEMENTS</span>
            </div>
            <div className="flex-1 overflow-hidden text-xs font-semibold text-gray-700 whitespace-nowrap">
              <span className="inline-block animate-pulse w-full truncate">
                {announcements.length > 0 ? (
                  announcements.map((ann, idx) => (
                    <span key={ann.id}>
                      {idx > 0 && ' | '}
                      {ann.title_en || ann.title}
                    </span>
                  ))
                ) : (
                  lang === 'hi' ? 'इस समय कोई महत्वपूर्ण घोषणा नहीं है।' : lang === 'ur' ? 'اس وقت کوئی اہم اعلان نہیں ہے۔' : 'No important announcements at this time.'
                )}
              </span>
            </div>
          </div>
          <a href="/news" className="text-primary text-xs font-bold flex items-center gap-1 flex-shrink-0 hover:underline">
            {lang === 'hi' ? 'सभी देखें' : lang === 'ur' ? 'تمام دیکھیں' : 'View All'} 
            <ArrowRight size={12} className={lang === 'ur' ? 'rotate-180' : ''} />
          </a>
        </div>
      </div>

      {/* Keyframe animation for title fade-up */}
      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
