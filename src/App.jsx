import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import QuickActions from './components/QuickActions';
import MapAndStays from './components/MapAndStays';
import AboutSection from './components/AboutSection';
import LatestUpdates from './components/LatestUpdates';
import PremiumPartners from './components/PremiumPartners';
import Footer from './components/Footer';

import AboutPage from './pages/AboutPage';
import ZiyaratPage from './pages/ZiyaratPage';
import HotelsPage from './pages/HotelsPage';
import ParkingPage from './pages/ParkingPage';
import TransportPage from './pages/TransportPage';
import FoodPage from './pages/FoodPage';
import EmergencyPage from './pages/EmergencyPage';
import UrsPage from './pages/UrsPage';
import DonationPage from './pages/DonationPage';
import BusinessPage from './pages/BusinessPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';


import { LanguageProvider } from './context/LanguageContext';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <QuickActions />
        <AboutSection />
        <MapAndStays />
        <LatestUpdates />
        <PremiumPartners />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ziyarat" element={<ZiyaratPage />} />
          <Route path="/stay" element={<HotelsPage />} />
          <Route path="/stay/:category" element={<HotelsPage />} />

          <Route path="/parking" element={<ParkingPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/food-services" element={<FoodPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/urs" element={<UrsPage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/:tab" element={<AdminPanel />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
