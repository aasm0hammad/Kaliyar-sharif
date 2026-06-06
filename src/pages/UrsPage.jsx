import { useState, useEffect } from 'react';
import { Calendar, Music, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function UrsPage() {
  const [schedule, setSchedule] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    api.get('/urs')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map(item => ({
            date: item.event_date ? new Date(item.event_date).toLocaleDateString() : 'TBD',
            event: item.event_name
          }));
          setSchedule(formatted);
        } else {
          // Fallback to static mock schedule if empty
          setSchedule([
            { 
              date: lang === 'hi' ? '1 रबी उल-अव्वल' : lang === 'ur' ? '1 ربیع الاول' : '1st Rabi al-Awwal', 
              event: lang === 'hi' ? 'गुस्ल (दरगाह का स्नान)' : lang === 'ur' ? 'غسل مبارک' : 'Ghusl (Bathing of the Shrine)' 
            },
            { 
              date: lang === 'hi' ? '10 रबी उल-अव्वल' : lang === 'ur' ? '10 ربیع الاول' : '10th Rabi al-Awwal', 
              event: lang === 'hi' ? 'महफिल-ए-समा (भव्य कव्वाली की शुरुआत)' : lang === 'ur' ? 'محفلِ سماع (قوالی کا آغاز)' : 'Mehfil-e-Sama (Grand Qawwali begins)' 
            },
            { 
              date: lang === 'hi' ? '13 रबी उल-अव्वल' : lang === 'ur' ? '13 ربیع الاول' : '13th Rabi al-Awwal', 
              event: lang === 'hi' ? 'कुल शरीफ (मुख्य उर्स दिवस / समापन)' : lang === 'ur' ? 'قل شریف (مرکزی عرس دن / اختتام)' : 'Qul (Main Urs Day / Conclusion)' 
            },
          ]);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [lang]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow">
            {lang === 'hi' ? 'रबी उल-अव्वल 2024' : lang === 'ur' ? 'ربیع الاول 2024' : 'Rabi al-Awwal 2024'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'उर्स-ए-मुबारक साबिर पाक' : lang === 'ur' ? 'عرس مبارک صابر پاک' : 'Urs-e-Mubarak Sabir Pak'}
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto">
            {lang === 'hi' ? 'उर्स कार्यक्रम, कव्वाली कार्यक्रमों और लाइव भीड़ अपडेट के बारे में पूरी जानकारी प्राप्त करें।' :
             lang === 'ur' ? 'عرس کے شیڈول، قوالی پروگراموں اور لائیو رش کی اپ ڈیٹس کے بارے میں مکمل تفصیلات حاصل کریں۔' :
             'Get complete details about the Urs schedule, Qawwali programs, and live crowd updates.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Calendar className="text-primary" /> 
                {lang === 'hi' ? 'आधिकारिक कार्यक्रम समय-सारणी' : lang === 'ur' ? 'سرکاری تقریب کا ٹائم ٹیبل' : 'Official Event Timetable'}
              </h2>
              <div className="space-y-4">
                {schedule.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fadeIn">
                    <div className="w-1/3 font-bold text-primary">{item.date}</div>
                    <div className="w-2/3 text-gray-700 font-medium">{item.event}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                <AlertTriangle size={18}/> 
                {lang === 'hi' ? 'सुरक्षा अपडेट' : lang === 'ur' ? 'سیکیورٹی اپڈیٹس' : 'Security Updates'}
              </h3>
              <p className="text-sm text-orange-700 leading-relaxed">
                {lang === 'hi' ? '13 तारीख को भारी भीड़ की उम्मीद है। मुख्य दरगाह से 2 किमी पहले वाहन रोक दिए जाएंगे। निर्धारित पैदल मार्गों का पालन करें।' :
                 lang === 'ur' ? '13 تاریخ کو شدید رش متوقع ہے۔ گاڑیوں کو مین درگاہ سے 2 کلومیٹر پہلے ہی روک دیا جائے گا۔ پیدل چلنے کے لیے مخصوص راستوں پر عمل کریں۔' :
                 'Heavy crowd expected on the 13th. Vehicles will be stopped 2km before the main Dargah. Follow designated walking routes.'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
              <Music size={32} className="text-primary mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">
                {lang === 'hi' ? 'कव्वाली कार्यक्रम' : lang === 'ur' ? 'قوالی کا شیڈول' : 'Qawwali Schedule'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {lang === 'hi' ? 'उर्स के दिनों में हर रात 9 बजे से फज्र तक लाइव कव्वाली।' :
                 lang === 'ur' ? 'عرس کے دنوں میں ہر رات 9 بجے سے فجر تک لائیو قوالی۔' :
                 'Live Qawwali every night from 9 PM to Fajr during the Urs days.'}
              </p>
              <button className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-dark transition-colors">
                {lang === 'hi' ? 'कलाकारों की सूची देखें' : lang === 'ur' ? 'فنون کاروں کی فہرست دیکھیں' : 'View Performer List'}
              </button>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
