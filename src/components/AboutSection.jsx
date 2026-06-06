import { History, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AboutSection() {
  const { lang } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-12">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Left: Image/Pattern */}
        <div className="w-full md:w-2/5 bg-primary relative min-h-[300px] p-8 flex flex-col justify-center text-white">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              {lang === 'hi' ? 'कलियर शरीफ के बारे में' : lang === 'ur' ? 'کلیار شریف کے بارے میں' : 'About Kaliyar Sharif'}
            </h2>
            <p className="text-sm text-gray-200 mb-6 leading-relaxed">
              {lang === 'hi' ? (
                'पीरान कलियर 13वीं शताब्दी के चिश्ती सिलसिले के सूफी संत अलाउद्दीन अली अहमद साबिर कलियरी की दरगाह है, जिन्हें साबिर पिया भी कहा जाता है। यह भारत में मुसलमानों के लिए सबसे प्रतिष्ठित तीर्थस्थलों में से एक है और हिंदुओं और अन्य धर्मों के लोगों द्वारा भी समान रूप से पूजनीय है।'
              ) : lang === 'ur' ? (
                'پیران کلیار 13 ویں صدی کے چشتی سلسلے کے صوفی بزرگ علاؤ الدین علی احمد صابر کلیاری کی درگاہ ہے، جنہیں صابر پیا بھی کہا جاتا ہے۔ یہ ہندوستان میں مسلمانوں کے سب سے معزز مقامات میں سے ایک ہے اور ہندوؤں اور دیگر مذاہب کے لوگوں میں بھی اتنی ہی عقیدت سے دیکھا جاتا ہے۔'
              ) : (
                'Piran Kaliyar is the dargah of 13th-century Sufi saint of Chishti Order, Alauddin Ali Ahamed Sabir Kalyari also known as Sabir Piya. It is one of the most revered shrines for Muslims in India and is equally revered by Hindus and people of other religions.'
              )}
            </p>
            <Link to="/about" className="inline-block bg-white text-primary px-6 py-2.5 rounded-md text-sm font-bold shadow-md hover:bg-gray-50 transition-colors">
              {lang === 'hi' ? 'पूरा इतिहास पढ़ें' : lang === 'ur' ? 'مکمل تاریخ پڑھیں' : 'Read Full History'}
            </Link>
          </div>
        </div>

        {/* Right: Key Highlights */}
        <div className="w-full md:w-3/5 p-8 lg:p-12 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {lang === 'hi' ? 'मुख्य विशेषताएं' : lang === 'ur' ? 'اہم نکات' : 'Key Highlights'}
          </h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <History size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  {lang === 'hi' ? 'साबिर पाक का इतिहास' : lang === 'ur' ? 'صابر پاک کی تاریخ' : 'History of Sabir Pak'}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {lang === 'hi' ? (
                    'हज़रत मखदूम अलाउद्दीन अली अहमद साबिर कलियरी 13वीं शताब्दी के एक प्रमुख सूफी संत थे। वह बाबा फरीद गंजशकर के भतीजे थे।'
                  ) : lang === 'ur' ? (
                    'حضرت مخدوم علاؤ الدین علی احمد صابر کلیاری 13ویں صدی کے ایک ممتاز صوفی بزرگ تھے۔ وہ بابا فرید گنج شکر کے بھانجے تھے۔'
                  ) : (
                    'Hazrat Makhdoom Alauddin Ali Ahmed Sabir Kalyari was a prominent Sufi saint in the 13th century. He was the nephew of Baba Farid Ganjshakar.'
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-primary flex items-center justify-center flex-shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  {lang === 'hi' ? 'आध्यात्मिक महत्व' : lang === 'ur' ? 'روحانی اہمیت' : 'Spiritual Significance'}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {lang === 'hi' ? (
                    'दरगाह अपने आध्यात्मिक उपचार के लिए जानी जाती है। आशीर्वाद और शांति की तलाश में हर साल लाखों श्रद्धालु आते हैं, विशेष रूप से उर्स उत्सव के दौरान।'
                  ) : lang === 'ur' ? (
                    'درگاہ اپنی روحانی شفا کے لیے مشہور ہے۔ لاکھوں عقیدت مند سالانہ یہاں آتے ہیں، خاص طور پر عرس کے دوران، برکات اور سکون حاصل کرنے کے لیے۔'
                  ) : (
                    'The Dargah is known for its spiritual healing. Millions of devotees visit annually, especially during the Urs festival, seeking blessings and peace.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  {lang === 'hi' ? 'उर्स की जानकारी' : lang === 'ur' ? 'عرس کی معلومات' : 'Urs Information'}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {lang === 'hi' ? (
                    'वार्षिक उर्स इस्लामी महीने रबी उल-अव्वल में मनाया जाता है। यह भव्य कव्वाली समारोहों के साथ दुनिया भर से भीड़ को आकर्षित करता है।'
                  ) : lang === 'ur' ? (
                    'سالانہ عرس اسلامی مہینے ربیع الاول میں منایا جاتا ہے۔ یہ شاندار قوالی محفلوں کے ساتھ دنیا بھر سے عقیدت مندوں کو راغب کرتا ہے۔'
                  ) : (
                    'The annual Urs is celebrated in the Islamic month of Rabi al-awwal. It attracts crowds from all over the world with grand Qawwali gatherings.'
                  )}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
