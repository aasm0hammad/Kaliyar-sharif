import { useState } from 'react';
import { Heart, Gift, Coffee, Home, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function DonationPage() {
  const [selectedType, setSelectedType] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { lang, t } = useLanguage();

  const donationTypes = [
    { 
      key: 'chadar', 
      title: lang === 'hi' ? 'चादर चढ़ावा' : lang === 'ur' ? 'چادر عطیہ' : 'Chadar Donation', 
      desc: lang === 'hi' ? 'दरगाह पर चढ़ाई जाने वाली पवित्र चादर में योगदान दें।' : 
            lang === 'ur' ? 'درگاہ پر پیش کی جانے والی مقدس چادر کے لیے عطیہ دیں۔' : 
            'Contribute towards the holy chadar offered at the Dargah.', 
      icon: Gift, 
      color: 'text-purple-600 bg-purple-50' 
    },
    { 
      key: 'langar', 
      title: lang === 'hi' ? 'लंगर दान' : lang === 'ur' ? 'لنگر عطیہ' : 'Langar Donation', 
      desc: lang === 'hi' ? 'ज़रूरतमंदों को भोजन कराएं। दैनिक मुफ़्त रसोई चलाने में मदद करें।' : 
            lang === 'ur' ? 'ضرورت مندوں کو کھانا کھلائیں۔ روزانہ کے مفت لنگر کو برقرار رکھنے میں مدد کریں۔' : 
            'Feed the needy. Help sustain the daily free kitchen.', 
      icon: Coffee, 
      color: 'text-green-600 bg-green-50' 
    },
    { 
      key: 'masjid', 
      title: lang === 'hi' ? 'मस्जिद रखरखाव' : lang === 'ur' ? 'مسجد کی دیکھ بھال' : 'Masjid Maintenance', 
      desc: lang === 'hi' ? 'मस्जिद के रख-रखाव और सफाई के लिए दान करें।' : 
            lang === 'ur' ? 'مسجد کی دیکھ بھال اور صفائی کے لیے عطیہ دیں۔' : 
            'Donate for the upkeep and cleaning of the mosque.', 
      icon: Home, 
      color: 'text-blue-600 bg-blue-50' 
    },
  ];

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const user = JSON.parse(localStorage.getItem('userData'));
      const userId = user ? user.id : null;
      const transactionId = 'TXN' + Math.floor(Math.random() * 10000000);

      await api.post('/donations', {
        userId,
        amount: Number(amount),
        type: selectedType.key,
        transactionId
      });

      setSuccess(true);
      setAmount('');
      setTimeout(() => {
        setSelectedType(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="bg-primary text-white py-12 text-center relative overflow-hidden">
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">
          {lang === 'hi' ? 'दान करें' : lang === 'ur' ? 'عطیہ کریں' : 'Make a Donation'}
        </h1>
        <p className="text-gray-200">
          {lang === 'hi' ? 'दरगाह प्रशासन का समर्थन करें और आध्यात्मिक पुरस्कार प्राप्त करें।' :
           lang === 'ur' ? 'درگاہ انتظامیہ کی مدد کریں اور روحانی اجر حاصل کریں۔' :
           'Support the Dargah administration and earn spiritual rewards.'}
        </p>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {donationTypes.map((type, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center animate-fadeIn">
               <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type.color}`}>
                 <type.icon size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2">{type.title}</h3>
               <p className="text-sm text-gray-500 mb-6">{type.desc}</p>
               <button onClick={() => setSelectedType(type)} className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors">
                 {lang === 'hi' ? 'अभी दान करें' : lang === 'ur' ? 'ابھی عطیہ کریں' : 'Donate Now'}
               </button>
            </div>
          ))}
        </div>

        {/* Donation Modal */}
        {selectedType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative">
              <button onClick={() => setSelectedType(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {lang === 'hi' ? `योगदान करें: ${selectedType.title}` : lang === 'ur' ? `عطیہ برائے: ${selectedType.title}` : `Contribute to ${selectedType.title}`}
              </h3>
              <p className="text-sm text-gray-500 mb-6">{selectedType.desc}</p>

              {success ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center font-bold">
                  {lang === 'hi' ? 'धन्यवाद! आपका दान सफलतापूर्वक दर्ज किया गया।' :
                   lang === 'ur' ? 'شکریہ! آپ کا عطیہ کامیابی سے درج ہو گیا۔' :
                   'Thank you! Your donation was recorded successfully.'}
                </div>
              ) : (
                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
                      {lang === 'hi' ? 'राशि दर्ज करें (₹)' : lang === 'ur' ? 'رقم درج کریں (₹)' : 'Enter Amount (₹)'}
                    </label>
                    <input required type="number" min="10" placeholder="e.g. 500" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-lg font-bold focus:outline-primary" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-lg font-bold transition-colors shadow">
                    {loading ? (lang === 'hi' ? 'प्रक्रिया जारी है...' : lang === 'ur' ? 'پروسیسنگ جاری ہے...' : 'Processing...') : (lang === 'hi' ? 'सुरक्षित भुगतान करें' : lang === 'ur' ? 'محفوظ ادائیگی کریں' : 'Pay Securely')}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto text-center">
          <Heart size={48} className="text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">
            {lang === 'hi' ? 'सुरक्षित ऑनलाइन भुगतान' : lang === 'ur' ? 'محفوظ آن لائن ادائیگی' : 'Secure Online Payment'}
          </h2>
          <p className="text-gray-600 mb-6 font-medium">
            {lang === 'hi' ? 'सभी लेनदेन सुरक्षित हैं। आपको ईमेल के माध्यम से एक आधिकारिक रसीद प्राप्त होगी।' :
             lang === 'ur' ? 'تمام ٹرانزیکشنز محفوظ ہیں۔ آپ کو ای میل کے ذریعے آفیشل رسید ملے گی۔' :
             'All transactions are secured. You will receive an official receipt via email.'}
          </p>
          <div className="text-sm text-gray-500 border-t border-gray-100 pt-6">
            {lang === 'hi' ? 'सीधे बैंक ट्रांसफर या बड़े दान के लिए, कृपया दरगाह कमेटी कार्यालय पर जाएँ या संपर्क करें' :
             lang === 'ur' ? 'براہِ راست بینک ٹرانسفر یا بڑے عطیات کے لیے، براہ کرم درگاہ کمیٹی کے دفتر جائیں یا رابطہ کریں' :
             'For direct bank transfers or large donations, please visit the Dargah Committee Office or contact'}{' '}
            <span className="font-bold">+91 9876543210</span>.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
