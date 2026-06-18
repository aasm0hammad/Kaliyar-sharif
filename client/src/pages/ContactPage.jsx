import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const { lang, t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-10">
          {lang === 'hi' ? 'संपर्क करें' : lang === 'ur' ? 'ہم سے رابطہ کریں' : 'Contact Us'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">
              {lang === 'hi' ? 'हमसे जुड़ें' : lang === 'ur' ? 'رابطے میں رہیں' : 'Get in Touch'}
            </h2>
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full text-primary"><Phone size={24}/></div>
              <div>
                <p className="text-sm text-gray-500">{t('phone')}</p>
                <p className="font-bold">+91 9876543210</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full text-primary"><Mail size={24}/></div>
              <div>
                <p className="text-sm text-gray-500">{lang === 'hi' ? 'ईमेल' : lang === 'ur' ? 'ای میل' : 'Email'}</p>
                <p className="font-bold">contact@kaliyarsharif.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full text-primary"><MapPin size={24}/></div>
              <div>
                <p className="text-sm text-gray-500">{lang === 'hi' ? 'पता' : lang === 'ur' ? 'پتہ' : 'Address'}</p>
                <p className="font-bold">
                  {lang === 'hi' ? 'दरगाह कमेटी, कलियर शरीफ, उत्तराखंड' :
                   lang === 'ur' ? 'درگاہ کمیٹی، کلیار شریف، اتراکھنڈ' :
                   'Dargah Committee, Kaliyar Sharif, Uttarakhand'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
             <h2 className="text-xl font-bold mb-6">
               {lang === 'hi' ? 'संदेश भेजें' : lang === 'ur' ? 'پیغام بھیجیں' : 'Send a Message'}
             </h2>
             {sent ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-bold">
                  {lang === 'hi' ? 'धन्यवाद! आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।' :
                   lang === 'ur' ? 'شکریہ! آپ کا پیغام کامیابی سے بھیج دیا گیا ہے۔ ہم جلد ہی آپ سے رابطہ کریں گے۔' :
                   'Thank you! Your message has been sent successfully. We will get back to you shortly.'}
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required type="text" placeholder={lang === 'hi' ? 'आपका नाम' : lang === 'ur' ? 'آپ کا نام' : 'Your Name'} value={name} onChange={e => setName(e.target.value)} className="w-full border p-3 rounded-lg focus:outline-primary" />
                  <input required type="email" placeholder={lang === 'hi' ? 'ईमेल पता' : lang === 'ur' ? 'ای میل ایڈریس' : 'Email Address'} value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-3 rounded-lg focus:outline-primary" />
                  <textarea required rows="4" placeholder={lang === 'hi' ? 'आपका संदेश' : lang === 'ur' ? 'آپ کا پیغام' : 'Your Message'} value={message} onChange={e => setMessage(e.target.value)} className="w-full border p-3 rounded-lg focus:outline-primary"></textarea>
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark">
                    {lang === 'hi' ? 'संदेश भेजें' : lang === 'ur' ? 'پیغام بھیجیں' : 'Send Message'}
                  </button>
                </form>
             )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
