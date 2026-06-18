import { Phone, Mail, MapPin, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-primary text-white pt-12 pb-6 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-t-full flex flex-col justify-end items-center pb-1 relative">
                 <div className="w-8 h-6 bg-primary/20 rounded-t-full relative"></div>
              </div>
              <div>
                <h3 className="text-base font-bold tracking-wide">KALIYAR SHARIF</h3>
                <h4 className="text-sm font-semibold text-secondary tracking-widest">
                  {lang === 'hi' ? 'ज़ियारत गाइड' : lang === 'ur' ? 'زیارت گائیڈ' : 'ZIYARAT GUIDE'}
                </h4>
              </div>
            </div>
            <p className="text-sm text-gray-200 mt-6 leading-relaxed">
              {lang === 'hi' ? 'आपकी ज़ियारत को आसान बनाना हमारा उद्देश्य है।' :
               lang === 'ur' ? 'آپ کی زیارت کو آسان بنانا ہمارا مقصد ہے۔' :
               'Aapki Ziyarat ko aasaan banana hamara maqsad hai.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">
              {lang === 'hi' ? 'त्वरित लिंक' : lang === 'ur' ? 'فوری لنکس' : 'QUICK LINKS'}
            </h4>
            <ul className="space-y-3 text-sm text-gray-200">
              <li><Link to="/" className="hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link to="/ziyarat" className="hover:text-white transition-colors">{t('ziyarat')}</Link></li>
              <li><Link to="/stay" className="hover:text-white transition-colors">{t('stay')}</Link></li>
              <li><Link to="/parking" className="hover:text-white transition-colors">{t('parking')}</Link></li>
              <li><Link to="/transport" className="hover:text-white transition-colors">{t('transport')}</Link></li>
              <li><Link to="/food-services" className="hover:text-white transition-colors">{t('foodServices')}</Link></li>
              <li><Link to="/emergency" className="hover:text-white transition-colors">{t('emergency')}</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('aboutUs')}</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">
              {lang === 'hi' ? 'उपयोगी लिंक' : lang === 'ur' ? 'مفید لنکس' : 'USEFUL LINKS'}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-200">
              <Link to="#" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'दरगाह इतिहास' : lang === 'ur' ? 'درگاہ کی تاریخ' : 'Dargah History'}
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'संपर्क करें' : lang === 'ur' ? 'ہم سے رابطہ کریں' : 'Contact Us'}
              </Link>
              <Link to="/about" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'फोटो गैलरी' : lang === 'ur' ? 'فوٹو گیلری' : 'Photo Gallery'}
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'गोपनीयता नीति' : lang === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
              </Link>
              <Link to="/urs" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'कव्वाली कार्यक्रम' : lang === 'ur' ? 'قوالی کا شیڈول' : 'Qawwali Schedule'}
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'नियम और शर्तें' : lang === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions'}
              </Link>
              <Link to="/ziyarat" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'लंगर का समय' : lang === 'ur' ? 'لنگر کے اوقات' : 'Langar Timings'}
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                {lang === 'hi' ? 'प्रतिक्रिया' : lang === 'ur' ? 'فیڈ بیک' : 'Feedback'}
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">
              {lang === 'hi' ? 'संपर्क करें' : lang === 'ur' ? 'ہم سے رابطہ کریں' : 'CONTACT US'}
            </h4>
            <ul className="space-y-4 text-sm text-gray-200">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  {lang === 'hi' ? 'कलियर शरीफ दरगाह, रुड़की, हरिद्वार, उत्तराखंड - 247667' :
                   lang === 'ur' ? 'کلیار شریف درگاہ، روڑکی، ہری دوار، اتراکھنڈ - 247667' :
                   'Kaliyar Sharif Dargah, Roorkee, Haridwar, Uttarakhand - 247667'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0" />
                <span>info@kaliyarsharifguide.com</span>
              </li>
            </ul>
          </div>

          {/* Follow Us & App */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-5">
              {lang === 'hi' ? 'हमसे जुड़ें' : lang === 'ur' ? 'ہمیں فالو کریں' : 'FOLLOW US'}
            </h4>
            <div className="flex items-center gap-3 mb-8">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:-translate-y-1 transition-transform text-xs font-bold">F</a>
              <a href="#" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center hover:-translate-y-1 transition-transform text-xs font-bold">I</a>
              <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:-translate-y-1 transition-transform text-xs font-bold">Y</a>
              <a href="#" className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:-translate-y-1 transition-transform"><Phone size={16} /></a>
            </div>

            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              {lang === 'hi' ? 'ऐप डाउनलोड करें' : lang === 'ur' ? 'ایپ ڈاؤن لوڈ کریں' : 'DOWNLOAD APP'}
            </h4>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-black border border-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-900">
                <Download size={20} />
                <div className="text-left">
                  <div className="text-[9px] text-gray-300 leading-none">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-black border border-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-900">
                <Download size={20} />
                <div className="text-left">
                  <div className="text-[9px] text-gray-300 leading-none">Download on the</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </button>
            </div>
          </div>

        </div>
        
        <div className="pt-6 border-t border-white/20 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} Kaliyar Sharif Ziyarat Guide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
