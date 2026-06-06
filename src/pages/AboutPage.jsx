import { BookOpen, Calendar, Image as ImageIcon, MapPin, Users, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { lang, t } = useLanguage();

  const timeline = [
    { 
      year: '1196 CE', 
      event: lang === 'hi' ? 'हेरात, अफगानिस्तान में हज़रत मखदूम अलाउद्दीन अली अहमद साबिर कलियरी का जन्म।' : 
             lang === 'ur' ? 'ہرات، افغانستان میں حضرت مخدوم علاؤ الدین علی احمد صابر کلیاری کی ولادت۔' : 
             'Birth of Hazrat Makhdoom Alauddin Ali Ahmed Sabir Kalyari in Herat, Afghanistan.' 
    },
    { 
      year: '1204 CE', 
      event: lang === 'hi' ? 'पाकपट्टन, पाकिस्तान में अपने मामा बाबा फरीद गंजशकर के पास चले गए।' : 
             lang === 'ur' ? 'پاکپتن، پاکستان میں اپنے ماموں بابا فرید گنج شکر کے پاس چلے گئے۔' : 
             'Moved to Pakpattan, Pakistan to his maternal uncle, Baba Farid Ganjshakar.' 
    },
    { 
      year: '1253 CE', 
      event: lang === 'hi' ? 'बाबा फरीद द्वारा आध्यात्मिक उत्तराधिकारी (खलीफा) के रूप में कलियर शरीफ भेजा गया।' : 
             lang === 'ur' ? 'بابا فرید کی طرف سے روحانی جانشین (خلیفہ) کے طور پر کلیار شریف بھیجا گیا۔' : 
             'Sent to Kaliyar Sharif by Baba Farid as a spiritual successor (Khalifa).' 
    },
    { 
      year: '1291 CE', 
      event: lang === 'hi' ? 'रबी उल-अव्वल की 13 तारीख को साबिर पाक का विसाल (निधन)।' : 
             lang === 'ur' ? '13 ربیع الاول کو صابر پاک کا وصال (وفات)۔' : 
             'Wisaal (Demise) of Sabir Pak on the 13th of Rabi al-Awwal.' 
    },
    { 
      year: '15th Century', 
      event: lang === 'hi' ? 'सुल्तान इब्राहिम लोधी द्वारा दरगाह का पहला प्रमुख निर्माण।' : 
             lang === 'ur' ? 'سلطان ابراہیم لودھی کے ذریعے درگاہ کی پہلی بڑی تعمیر۔' : 
             'First major construction of the Dargah by Sultan Ibrahim Lodhi.' 
    },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1542314831-c53cd4185af1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{t('aboutKaliyar')}</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            {lang === 'hi' ? 'हज़रत मखदूम अलाउद्दीन अली अहमद साबिर कलियरी के समृद्ध इतिहास, आध्यात्मिक महत्व और कालातीत विरासत की खोज करें।' :
             lang === 'ur' ? 'حضرت مخدوم علاؤ الدین علی احمد صابر کلیاری کی بھرپور تاریخ، روحانی اہمیت اور لازوال ورثہ دریافت کریں۔' :
             'Discover the rich history, spiritual significance, and timeless legacy of Hazrat Makhdoom Alauddin Ali Ahmed Sabir Kalyari.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <BookOpen size={24} />
                <h2 className="text-2xl font-bold text-gray-800">
                  {lang === 'hi' ? 'परिचय और इतिहास' : lang === 'ur' ? 'تعارف اور تاریخ' : 'Introduction & History'}
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm lg:text-base">
                <p>
                  {lang === 'hi' ? (
                    <>पीरान कलियर 13वीं शताब्दी के अत्यधिक सम्मानित सूफी संत, <strong>हज़रत मखदूम अलाउद्दीन अली अहमद साबिर कलियरी</strong> का विश्राम स्थल है, जिन्हें लोकप्रिय रूप से साबिर पिया के नाम से जाना जाता है। उत्तराखंड के हरिद्वार जिले में रुड़की के पास स्थित, यह दुनिया भर के लाखों लोगों के लिए एकता, भाईचारे और आध्यात्मिक सांत्वना का प्रतीक है।</>
                  ) : lang === 'ur' ? (
                    <>پیران کلیار 13ویں صدی کے انتہائی معزز صوفی بزرگ، <strong>حضرت مخدوم علاؤ الدین علی احمد صابر کلیاری</strong> کی آخری آرام گاہ ہے، جو صابر پیا کے نام سے مشہور ہیں۔ یہ اتراکھنڈ کے ضلع ہری دوار میں روڑکی کے قریب واقع ہے، جو دنیا بھر کے لاکھوں لوگوں کے لیے اتحاد، بھائی چارے اور روحانی سکون کی علامت ہے۔</>
                  ) : (
                    <>Piran Kaliyar is the resting place of the highly revered 13th-century Sufi saint, <strong>Hazrat Makhdoom Alauddin Ali Ahmed Sabir Kalyari</strong>, famously known as Sabir Piya. Situated near Roorkee in Haridwar district, Uttarakhand, it stands as a symbol of unity, brotherhood, and spiritual solace for millions across the globe.</>
                  )}
                </p>
                <p>
                  {lang === 'hi' ? (
                    'साबिर पिया चिश्ती सिलसिले के एक प्रमुख संत और बाबा फरीद गंजशकर के भतीजे और उत्तराधिकारी थे। उनका जीवन अत्यधिक तपस्या, ईश्वर के प्रति गहन भक्ति और चमत्कारी धैर्य (सब्र) द्वारा परिभाषित था, जिससे उन्हें उनकी उपाधि \'साबिर\' मिली।'
                  ) : lang === 'ur' ? (
                    'صابر پیا چشتیہ سلسلے کے ایک ممتاز بزرگ اور بابا فرید گنج شکر کے بھانجے اور خلیفہ تھے۔ ان کی زندگی انتہائی زہد و تقویٰ، خدا کے لیے گہری عقیدت اور معجزاتی صبر سے عبارت تھی، جس سے انہیں ان کا لقب \'صابر\' ملا۔'
                  ) : (
                    "Sabir Piya was a prominent saint of the Chishti order and the nephew and successor of Baba Farid Ganjshakar. His life was defined by extreme asceticism, profound devotion to God, and miraculous patience (Sabr), from which he derived his title 'Sabir'."
                  )}
                </p>
                <p>
                  {lang === 'hi' ? (
                    'दरगाह सभी धर्मों के भक्तों—मुसलमानों, हिंदुओं, सिखों और अन्य लोगों को आकर्षित करती है—जो आशीर्वाद, आध्यात्मिक और शारीरिक बीमारियों से मुक्ति और अपनी प्रार्थनाओं की पूर्ति के लिए आते हैं।'
                  ) : lang === 'ur' ? (
                    'درگاہ تمام مذاہب کے عقیدت مندوں—مسلمانوں، ہندوؤں، سکھوں اور دیگر کو اپنی طرف متوجہ کرتی ہے—جو یہاں برکات، روحانی اور جسمانی بیماریوں سے شفا اور دعاؤں کی قبولیت کے لیے آتے ہیں۔'
                  ) : (
                    'The Dargah attracts devotees of all faiths—Muslims, Hindus, Sikhs, and others—who come seeking blessings, healing from spiritual and physical ailments, and fulfillment of their prayers.'
                  )}
                </p>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <Heart size={24} />
                <h2 className="text-2xl font-bold text-gray-800">
                  {t('spiritualSignificance') || 'Spiritual Significance'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {lang === 'hi' ? 'आध्यात्मिक उपचार' : lang === 'ur' ? 'روحانی شفا' : 'Spiritual Healing'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'hi' ? 'यह दरगाह रहस्यमयी बीमारियों, काले जादू और शारीरिक रोगों को ठीक करने के लिए व्यापक रूप से प्रसिद्ध है।' :
                     lang === 'ur' ? 'درگاہ صوفیانہ امراض، کالے جادو اور جسمانی بیماریوں کے علاج کے لیے بڑے پیمانے پر مشہور ہے۔' :
                     'The shrine is widely renowned for curing mystical ailments, black magic, and physical diseases.'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {lang === 'hi' ? 'एकता का प्रतीक' : lang === 'ur' ? 'اتحاد کی علامت' : 'Symbol of Unity'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'hi' ? 'कलियर शरीफ भारत की गंगा-जमुनी तहजीब का प्रतिनिधित्व करता है, जहां विभिन्न धर्मों के लोग एक साथ बैठते हैं।' :
                     lang === 'ur' ? 'کلیار شریف ہندوستان کی گنگا جمنی تہذیب کی نمائندگی کرتا ہے، جہاں مختلف مذاہب کے لوگ اکٹھے بیٹھتے ہیں۔' :
                     'Kaliyar Sharif represents the Ganga-Jamuni Tehzeeb (syncretic culture) of India, where people from different religious backgrounds sit together.'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {lang === 'hi' ? 'लंगर (मुफ़्त रसोई)' : lang === 'ur' ? 'لنگر خانوں کی خدمات' : 'Langar (Free Kitchen)'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'hi' ? 'चिश्ती परंपरा के बाद, दरगाह निरंतर लंगर सेवाएं चलाती है जिससे यह सुनिश्चित होता है कि कोई भूखा न रहे।' :
                     lang === 'ur' ? 'چشتی روایت کے مطابق، درگاہ مسلسل لنگر کی خدمات چلاتی ہے جس سے یہ یقینی بنایا جاتا ہے کہ کوئی بھوکا نہ رہے۔' :
                     'Following the Chishti tradition, the Dargah runs continuous Langar services ensuring no visitor ever goes hungry.'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {lang === 'hi' ? 'समा (कव्वाली)' : lang === 'ur' ? 'سماع (قوالی)' : 'Samaa (Qawwali)'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {lang === 'hi' ? 'आध्यात्मिक संगीत चिश्ती सिलसिले का एक मुख्य हिस्सा है। प्रांगण प्रतिदिन कव्वालियों से गूंजता है।' :
                     lang === 'ur' ? 'روحانی موسیقی چشتی سلسلے کا بنیادی حصہ ہے۔ درگاہ کا صحن روزانہ صوفیانہ قوالیوں سے گونجتا ہے۔' :
                     'Spiritual music is a core part of the Chishti order. The courtyard resonates with Qawwalis daily.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <ImageIcon size={24} />
                <h2 className="text-2xl font-bold text-gray-800">
                  {lang === 'hi' ? 'फोटो गैलरी' : lang === 'ur' ? 'فوٹو گیلری' : 'Photo Gallery'}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group relative">
                    <img src={img} alt={`Kaliyar Sharif ${idx+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <Calendar size={20} />
                <h3 className="text-lg font-bold text-gray-800">{t('historyTimeline')}</h3>
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1 space-x-2 text-sm font-bold text-primary">
                        {item.year}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-xl shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Users size={80} /></div>
              <h3 className="text-lg font-bold mb-2 relative z-10">{t('ursInformation') || t('urs') || 'Urs Information'}</h3>
              <p className="text-sm text-gray-100 mb-4 relative z-10 leading-relaxed">
                {lang === 'hi' ? 'साबिर पिया का वार्षिक उर्स रबी अल-अव्वल के महीने में मनाया जाता है। आध्यात्मिक रस्मों और भव्य कव्वाली के लिए लाखों श्रद्धालु एकत्र होते हैं।' :
                 lang === 'ur' ? 'صابر پیا کا سالانہ عرس ربیع الاول کے مہینے میں منایا جاتا ہے۔ روحانی تقریبات اور شاندار قوالیوں کے لیے لاکھوں عقیدت مند جمع ہوتے ہیں۔' :
                 'The annual Urs of Sabir Piya is celebrated in the month of Rabi al-awwal. Millions of devotees gather for spiritual ceremonies and majestic Qawwalis.'}
              </p>
              <Link to="/urs" className="bg-white text-primary px-4 py-2 rounded font-bold text-sm shadow hover:bg-gray-50 transition-colors w-full text-center block relative z-10">
                {lang === 'hi' ? 'उर्स अनुसूची देखें' : lang === 'ur' ? 'عرس کا شیڈول دیکھیں' : 'View Urs Schedule'}
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
               <MapPin size={32} className="text-primary mx-auto mb-3" />
               <h3 className="font-bold text-gray-800 mb-1">
                 {lang === 'hi' ? 'अपनी यात्रा की योजना बनाएं' : lang === 'ur' ? 'اپنی زیارت کا منصوبہ بنائیں' : 'Plan Your Visit'}
               </h3>
               <p className="text-xs text-gray-500 mb-4">
                 {lang === 'hi' ? 'दरगाह के पास के मार्ग, पार्किंग और आवास विकल्प खोजें।' :
                  lang === 'ur' ? 'درگاہ کے قریب راستے، پارکنگ اور رہائش کے اختیارات تلاش کریں۔' :
                  'Discover routes, parking, and accommodation options near the Dargah.'}
               </p>
               <Link to="/ziyarat" className="border border-primary text-primary hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded font-bold text-sm w-full block text-center">
                 {lang === 'hi' ? 'ज़ियारत गाइड खोलें' : lang === 'ur' ? 'زیارت گائیڈ کھولیں' : 'Open Ziyarat Guide'}
               </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
