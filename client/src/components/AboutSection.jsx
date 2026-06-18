import { History, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AboutSection() {
  const { lang } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-12">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
        
        {/* Left: Image/Pattern */}
        <div className="w-full md:w-2/5 relative min-h-[350px] p-8 lg:p-10 flex flex-col justify-end text-white overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
          
          <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
            <h2 className="text-3xl lg:text-4xl font-black mb-3 text-white drop-shadow-md">
              {lang === 'hi' ? 'कलियर शरीफ के बारे में' : lang === 'ur' ? 'کلیار شریف کے بارے میں' : 'About Kaliyar Sharif'}
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mb-4"></div>
            <p className="text-sm text-gray-200 mb-6 leading-relaxed line-clamp-4">
              {lang === 'hi' ? (
                'पीरान कलियर 13वीं शताब्दी के चिश्ती सिलसिले के सूफी संत अलाउद्दीन अली अहमद साबिर कलियरी की दरगाह है, जिन्हें साबिर पिया भी कहा जाता है। यह भारत में मुसलमानों के लिए सबसे प्रतिष्ठित तीर्थस्थलों में से एक है और हिंदुओं और अन्य धर्मों के लोगों द्वारा भी समान रूप से पूजनीय है।'
              ) : lang === 'ur' ? (
                'پیران کلیار 13 ویں صدی کے چشتی سلسلے کے صوفی بزرگ علاؤ الدین علی احمد صابر کلیاری کی درگاہ ہے، جنہیں صابر پیا بھی کہا جاتا ہے۔ یہ ہندوستان میں مسلمانوں کے سب سے معزز مقامات میں سے ایک ہے اور ہندوؤں اور دیگر مذاہب کے لوگوں میں بھی اتنی ہی عقیدت سے دیکھا جاتا ہے۔'
              ) : (
                'Piran Kaliyar is the dargah of 13th-century Sufi saint of Chishti Order, Alauddin Ali Ahamed Sabir Kalyari also known as Sabir Piya. It is one of the most revered shrines for Muslims in India and is equally revered by Hindus and people of other religions.'
              )}
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:shadow-primary/30 hover:-translate-y-1 hover:bg-primary-light transition-all duration-300">
              {lang === 'hi' ? 'पूरा इतिहास पढ़ें' : lang === 'ur' ? 'مکمل تاریخ پڑھیں' : 'Read Full History'}
            </Link>
          </div>
        </div>

        {/* Right: Key Highlights */}
        <div className="w-full md:w-3/5 p-8 lg:p-10 bg-white flex flex-col justify-center">
          <h3 className="text-xl lg:text-2xl font-black text-gray-800 mb-8 relative inline-block">
            {lang === 'hi' ? 'मुख्य विशेषताएं' : lang === 'ur' ? 'اہم نکات' : 'Key Highlights'}
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full opacity-70"></span>
          </h3>
          
          <div className="space-y-4">
            <div className="group flex gap-5 p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <History size={26} className="drop-shadow-sm" />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-black text-gray-800 group-hover:text-blue-600 transition-colors">
                  {lang === 'hi' ? 'साबिर पाक का इतिहास' : lang === 'ur' ? 'صابر پاک کی تاریخ' : 'History of Sabir Pak'}
                </h4>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">
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
            
            <div className="group flex gap-5 p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={26} className="drop-shadow-sm" />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-black text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {lang === 'hi' ? 'आध्यात्मिक महत्व' : lang === 'ur' ? 'روحانی اہمیت' : 'Spiritual Significance'}
                </h4>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">
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

            <div className="group flex gap-5 p-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Clock size={26} className="drop-shadow-sm" />
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-black text-gray-800 group-hover:text-orange-600 transition-colors">
                  {lang === 'hi' ? 'उर्स की जानकारी' : lang === 'ur' ? 'عرس کی معلومات' : 'Urs Information'}
                </h4>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">
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
