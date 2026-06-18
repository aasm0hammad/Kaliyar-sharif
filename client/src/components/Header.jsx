import { useState, useEffect } from 'react';
import { User, Menu as MenuIcon, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

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
    { 
      name: 'Services', 
      isDropdown: true,
      subLinks: [
        { name: t('foodServices'), path: '/food-services' },
        { name: t('parking'), path: '/parking' },
        { name: t('transport'), path: '/transport' }
      ]
    },
    { name: 'Interactive Map', path: '/map' },
    // { name: 'Lost & Found', path: '/lost-found' },
    { name: t('emergency'), path: '/emergency' },
    { name: t('aboutUs'), path: '/about' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm relative">
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
            link.isDropdown ? (
              <div key={idx} className="relative group cursor-pointer py-2">
                <div className="flex items-center gap-1 text-[12px] xl:text-[13px] font-bold text-gray-700 border-b-2 border-transparent group-hover:text-primary group-hover:border-primary pb-1 transition-colors">
                  {link.name} <ChevronDown size={14} />
                </div>
                <div className="absolute top-full left-0 mt-0 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col py-2">
                  {link.subLinks.map((sub, sidx) => (
                    <Link key={sidx} to={sub.path} className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
            <Link 
              key={idx} 
              to={link.path}
              className="text-[12px] xl:text-[13px] font-bold text-gray-700 border-b-2 border-transparent hover:text-primary hover:border-primary pb-1 transition-colors py-2"
            >
              {link.name}
            </Link>
            )
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
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
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2 px-3 rounded-md transition-colors">
                <User size={14} />
                {user.name}
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 font-bold p-1.5 transition-colors" title={t('logout')}>
                <X size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="bg-primary hover:bg-primary-light text-white text-sm font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition-colors shadow">
              <User size={16} />
              {t('loginRegister')}
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 z-50">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, idx) => (
              link.isDropdown ? (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="text-base font-bold text-gray-700">{link.name}</div>
                  <div className="flex flex-col gap-3 pl-4 border-l-2 border-primary/20">
                    {link.subLinks.map((sub, sidx) => (
                      <Link 
                        key={sidx} 
                        to={sub.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-bold text-gray-600 hover:text-primary transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  key={idx} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold text-gray-700 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>
          
          <div className="h-px bg-gray-100 my-2"></div>
          
          <div className="flex flex-col gap-4">
            <div className="flex bg-gray-50 rounded-md border border-gray-200 overflow-hidden text-sm font-semibold w-max">
              <button onClick={() => { changeLanguage('hi'); setIsMobileMenuOpen(false); }} className={`px-4 py-2 border-r border-gray-200 transition-colors ${lang === 'hi' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}>हिंदी</button>
              <button onClick={() => { changeLanguage('ur'); setIsMobileMenuOpen(false); }} className={`px-4 py-2 border-r border-gray-200 transition-colors ${lang === 'ur' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}>اردو</button>
              <button onClick={() => { changeLanguage('en'); setIsMobileMenuOpen(false); }} className={`px-4 py-2 transition-colors ${lang === 'en' ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}>English</button>
            </div>
            
            <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors">
              {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
            </button>

            {user ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors">
                  <User size={18} />
                  {user.name} - Profile
                </Link>
                <button onClick={handleLogout} className="text-red-500 bg-red-50 hover:bg-red-100 text-sm font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors">
                  <X size={18} />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary hover:bg-primary-light text-white text-base font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow">
                <User size={18} />
                {t('loginRegister')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
