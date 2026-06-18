import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();

  useEffect(() => {
    api.get('/news')
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, []);

  const getTypeLabel = (type) => {
    if (type === 'Announcement') return lang === 'hi' ? 'घोषणा' : lang === 'ur' ? 'اعلان' : 'Announcement';
    if (type === 'News') return lang === 'hi' ? 'समाचार' : lang === 'ur' ? 'خبر' : 'News';
    if (type === 'Update') return lang === 'hi' ? 'अपडेट' : lang === 'ur' ? 'اپڈیٹ' : 'Update';
    if (type === 'Urs') return lang === 'hi' ? 'उर्स' : lang === 'ur' ? 'عرس' : 'Urs';
    return type;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary text-white py-12 text-center">
        <h1 className="text-3xl font-bold mb-3">{t('newsUpdates')}</h1>
        <p className="text-gray-200">
          {lang === 'hi' ? 'दरगाह प्रशासन से नवीनतम घोषणाएं।' : 
           lang === 'ur' ? 'درگاہ انتظامیہ کی طرف سے تازہ ترین اعلانات۔' : 
           'Latest announcements from the Dargah Administration.'}
        </p>
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 space-y-6">
        {news.map(n => (
          <div key={n.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fadeIn">
             <div className="flex items-center justify-between mb-3">
               <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                 {getTypeLabel(n.type)}
               </span>
               <span className="text-xs text-gray-500 flex items-center gap-1">
                 <Calendar size={14}/> {n.date_posted ? new Date(n.date_posted).toLocaleDateString() : 'N/A'}
               </span>
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-3">
               {lang === 'hi' ? (n.title_hi || n.title_en || n.title) :
                lang === 'ur' ? (n.title_ur || n.title_en || n.title) :
                (n.title_en || n.title)}
             </h2>
             <p className="text-gray-600 text-sm leading-relaxed">{n.content_en || n.content}</p>
          </div>
        ))}
        {news.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-400">
            {lang === 'hi' ? 'इस समय कोई समाचार या अपडेट नहीं है।' :
             lang === 'ur' ? 'اس وقت کوئی خبر یا اپ ڈیٹ نہیں ہے۔' :
             'No news or updates at this time.'}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
