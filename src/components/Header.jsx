import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const [user, setUser] = useState(null);
  const { lang, changeLanguage, t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    window.location.reload();
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('ziyarat'), path: '/ziyarat' },
    { name: t('stay'), path: '/stay' },
    { name: t('parking'), path: '/parking' },
    { name: t('transport'), path: '/transport' },
    { name: t('foodServices'), path: '/food-services' },
    { name: t('emergency'), path: '/emergency' },
    { name: t('aboutUs'), path: '/about' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-primary text-white rounded-t-full flex flex-col justify-end items-center pb-1 overflow-hidden relative border-b-2 border-primary">
            <div className="w-10 h-8 bg-white/20 rounded-t-full relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-white/20 rounded-t-full"></div>
            </div>
            <div className="w-12 h-2 bg-white/20 mt-0.5 rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary tracking-wide leading-tight">
              KALIYAR SHARIF
            </h1>
            <h2 className="text-sm font-semibold text-secondary tracking-widest uppercase">
              {t('parkingGuide').split(' ')[1] ? t('ziyarat') + ' Guide' : 'زیارت گائیڈ'}
            </h2>
            <p className="text-[10px] text-gray-500 font-medium">
              {lang === 'hi' ? 'आपकी ज़ियारत, हमारी ज़िम्मेदारी' : lang === 'ur' ? 'آپ کی زیارت، ہماری ذمہ داری' : 'Aapki Ziyarat, Hamari Zimmedari'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navLinks.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.path}
              className="text-[12px] xl:text-[13px] font-bold text-gray-700 border-b-2 border-transparent hover:text-primary hover:border-primary pb-1 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-50 rounded-md border border-gray-200 overflow-hidden text-xs font-semibold">
            <button 
              onClick={() => changeLanguage('hi')} 
              className={`px-3 py-1.5 border-r border-gray-200 transition-colors ${lang === 'hi' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              हिंदी
            </button>
            <button 
              onClick={() => changeLanguage('ur')} 
              className={`px-3 py-1.5 border-r border-gray-200 transition-colors ${lang === 'ur' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              اردو
            </button>
            <button 
              onClick={() => changeLanguage('en')} 
              className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              English
            </button>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">{user.name}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 rounded-md transition-colors shadow">
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link to="/auth" className="bg-primary hover:bg-primary-light text-white text-sm font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors shadow">
              <User size={16} />
              {t('loginRegister')}
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
