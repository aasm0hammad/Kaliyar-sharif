import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Hotel, Car, Users, Newspaper, Gift, Store, Settings, LogOut, Menu, Lock, Mail, MapPin, Utensils, Image } from 'lucide-react';
import api from '../api';
import AdminHotels from './admin/AdminHotels';
import AdminParkingTransport from './admin/AdminParkingTransport';
import AdminNews from './admin/AdminNews';
import AdminZiyarat from './admin/AdminZiyarat';
import AdminBusinesses from './admin/AdminBusinesses';
import AdminDonations from './admin/AdminDonations';
import AdminUsers from './admin/AdminUsers';
import AdminFood from './admin/AdminFood';
import AdminHeroSlider from './admin/AdminHeroSlider';

export default function AdminPanel() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'dashboard';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center font-sans">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-lg">KS</div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-2">Secure access for authorized personnel only</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-4 text-center">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-primary" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-primary" />
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-lg font-bold shadow transition-colors">
              Secure Login
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400">
            For support, contact IT Dept.
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Slider', icon: Image },
    { id: 'hotels', label: 'Manage Hotels', icon: Hotel },
    { id: 'food', label: 'Food & Services', icon: Utensils },
    { id: 'parking', label: 'Parking & Transport', icon: Car },
    { id: 'news', label: 'News & Updates', icon: Newspaper },
    { id: 'ziyarat', label: 'Manage Ziyarat', icon: MapPin },
    { id: 'business', label: 'Business Directory', icon: Store },
    { id: 'donations', label: 'Donations', icon: Gift },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col transition-all">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-black">KS</div>
          <h2 className="font-bold text-lg tracking-wide">Admin Portal</h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => navigate(`/admin/${item.id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-white/10 text-secondary' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors w-full">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-primary"><Menu size={24} /></button>
            <h1 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-gray-400 hover:text-primary"><Settings size={20} /></button>
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: '1,245', color: 'text-blue-600' },
                  { label: 'Active Hotels', value: '48', color: 'text-green-600' },
                  { label: 'Donations (Month)', value: '₹45,200', color: 'text-orange-600' },
                  { label: 'Businesses', value: '112', color: 'text-purple-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex items-center justify-center">
                <p className="text-gray-400">Analytics Chart Placeholder</p>
              </div>
            </div>
          )}

          {activeTab === 'hero' && <AdminHeroSlider />}
          {activeTab === 'hotels' && <AdminHotels />}
          {activeTab === 'food' && <AdminFood />}
          {activeTab === 'parking' && <AdminParkingTransport />}
          {activeTab === 'news' && <AdminNews />}
          {activeTab === 'ziyarat' && <AdminZiyarat />}
          {activeTab === 'business' && <AdminBusinesses />}
          {activeTab === 'donations' && <AdminDonations />}
          {activeTab === 'users' && <AdminUsers />}

          {activeTab !== 'dashboard' && 
           activeTab !== 'hero' &&
           activeTab !== 'hotels' && 
           activeTab !== 'food' && 
           activeTab !== 'parking' && 
           activeTab !== 'news' &&
           activeTab !== 'ziyarat' &&
           activeTab !== 'business' &&
           activeTab !== 'donations' &&
           activeTab !== 'users' && (
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-gray-800 capitalize">Manage {activeTab}</h2>
                 <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow">Add New</button>
               </div>
               <div className="text-center py-12 text-gray-400">
                  <p>Module integration pending.</p>
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
