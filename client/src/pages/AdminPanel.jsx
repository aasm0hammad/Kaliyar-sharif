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
import AdminLostFound from './admin/AdminLostFound';
import AdminAlerts from './admin/AdminAlerts';
import AdminMart from './admin/AdminMart';
import { Bell, ShoppingBag, Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'dashboard';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [stats, setStats] = useState({ users: 0, hotels: 0, donations: 0, businesses: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const res = await api.get('/admin/dashboard-stats');
          setStats(res.data.stats);
          setRecentUsers(res.data.recentUsers);
        } catch (err) {
          console.error('Error fetching stats:', err);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [isAuthenticated, activeTab]);

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
    { id: 'mart', label: 'Kaliyar Mart', icon: ShoppingBag },
    // { id: 'donations', label: 'Donations', icon: Gift },
    { id: 'users', label: 'Users', icon: Users },
    // { id: 'lost-found', label: 'Lost & Found', icon: Store },
    { id: 'alerts', label: 'Push Alerts', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative overflow-hidden">
      
      {/* Decorative Glassmorphism Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-300/40 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Glassmorphism */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 text-white flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
          <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white font-black z-10 shadow-inner">KS</div>
          <h2 className="font-bold text-lg tracking-wide z-10 drop-shadow-sm">Admin Portal</h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => { navigate(`/admin/${item.id}`); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-gradient-to-r from-primary/60 to-primary/20 text-white shadow-lg border border-primary/30 backdrop-blur-md' : 'text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10 border border-transparent'}`}
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
        
        {/* Topbar - Light Glassmorphism */}
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-sm h-16 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-primary md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-gray-400 hover:text-primary"><Settings size={20} /></button>
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats.users, color: 'text-blue-600' },
                  { label: 'Active Hotels', value: stats.hotels, color: 'text-green-600' },
                  // { label: 'Donations', value: `₹${stats.donations}`, color: 'text-orange-600' },
                  { label: 'Businesses', value: stats.businesses, color: 'text-purple-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full z-0 pointer-events-none transition-transform group-hover:scale-110"></div>
                    <p className="text-sm font-bold text-gray-500 mb-1 relative z-10">{stat.label}</p>
                    <h3 className={`text-3xl font-black ${stat.color} drop-shadow-sm relative z-10`}>
                      {loadingStats ? <span className="text-xl text-gray-400">...</span> : stat.value}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pending Approvals */}
                <div className="lg:col-span-2 bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-200/50 pb-3">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                      <Clock size={20} className="text-orange-500 animate-pulse"/> Pending Approvals
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Hotel size={18} /></div>
                        <div>
                          <p className="font-bold text-gray-800">Hotel Listings</p>
                          <p className="text-xs text-gray-500">5 new hotels waiting for approval</p>
                        </div>
                      </div>
                      <button onClick={() => navigate('/admin/hotels')} className="px-4 py-2 bg-white text-orange-600 font-bold text-sm rounded-lg shadow-sm hover:shadow hover:bg-orange-50 transition-all border border-orange-100">Review</button>
                    </div>
                    <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Store size={18} /></div>
                        <div>
                          <p className="font-bold text-gray-800">Business Listings</p>
                          <p className="text-xs text-gray-500">3 new businesses waiting for approval</p>
                        </div>
                      </div>
                      <button onClick={() => navigate('/admin/business')} className="px-4 py-2 bg-white text-blue-600 font-bold text-sm rounded-lg shadow-sm hover:shadow hover:bg-blue-50 transition-all border border-blue-100">Review</button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-200/50 pb-3">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                      <Zap size={20} className="text-yellow-500"/> Quick Actions
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/admin/alerts')} className="flex items-center justify-start gap-3 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-sm transition-colors border border-red-100 w-full">
                      <AlertTriangle size={18}/> Send Push Alert
                    </button>
                    <button onClick={() => navigate('/admin/hotels')} className="flex items-center justify-start gap-3 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold text-sm transition-colors border border-primary/20 w-full">
                      <Hotel size={18}/> Add New Hotel
                    </button>
                    <button onClick={() => navigate('/admin/mart')} className="flex items-center justify-start gap-3 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-bold text-sm transition-colors border border-green-100 w-full">
                      <ShoppingBag size={18}/> Add Mart Item
                    </button>
                  </div>
                </div>

              </div>

              {/* Analytics & Recent Users */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Analytics Graph */}
                <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2"><TrendingUp size={20} className="text-primary"/> Platform Growth (Last 7 Days)</h3>
                  </div>
                  <div className="flex-1 flex items-end gap-2 h-48 mt-4 pt-4 relative">
                    {/* Dummy Chart Bars */}
                    {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                        <div className="w-full max-w-[40px] bg-primary/20 hover:bg-primary rounded-t-md transition-all duration-300 relative" style={{height: `${h}%`}}>
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">
                            {h * 12}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-2">Day {i+1}</span>
                      </div>
                    ))}
                    <div className="absolute inset-0 pointer-events-none border-b border-gray-200"></div>
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg min-h-[400px] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2"><Users size={20} className="text-primary"/> Recent Users</h3>
                    <button onClick={() => { setActiveTab('users'); navigate('/admin/users'); }} className="text-sm font-bold text-primary hover:text-primary-light transition-colors">View All</button>
                  </div>
                  
                  {loadingStats ? (
                     <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/40 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold rounded-tl-xl rounded-bl-xl">User ID</th>
                            <th className="p-4 font-bold">Name</th>
                            <th className="p-4 font-bold">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                          {recentUsers.slice(0,4).map(u => (
                            <tr key={u.id} className="hover:bg-white/60 transition-colors">
                              <td className="p-4 font-black text-gray-600">#{u.id}</td>
                              <td className="p-4 font-bold text-gray-800">{u.name}</td>
                              <td className="p-4 font-medium text-gray-600">{u.email}</td>
                            </tr>
                          ))}
                          {recentUsers.length === 0 && (
                            <tr><td colSpan="3" className="text-center py-8 text-gray-500 font-medium">No users found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && <AdminHeroSlider />}
          {activeTab === 'hotels' && <AdminHotels />}
          {activeTab === 'food' && <AdminFood />}
          {activeTab === 'parking' && <AdminParkingTransport />}
          {activeTab === 'news' && <AdminNews />}
          {activeTab === 'ziyarat' && <AdminZiyarat />}
          { activeTab === 'business' && <AdminBusinesses /> }
          { activeTab === 'mart' && <AdminMart /> }
          {/* { activeTab === 'donations' && <AdminDonations /> } */}
          {activeTab === 'users' && <AdminUsers />}
          {/* {activeTab === 'lost-found' && <AdminLostFound />} */}
          {activeTab === 'alerts' && <AdminAlerts />}

          {activeTab !== 'dashboard' && 
           activeTab !== 'hero' &&
           activeTab !== 'hotels' && 
           activeTab !== 'food' && 
           activeTab !== 'parking' && 
           activeTab !== 'news' &&
           activeTab !== 'ziyarat' &&
           activeTab !== 'business' &&
           activeTab !== 'mart' &&
           activeTab !== 'donations' &&
           activeTab !== 'users' &&
           // activeTab !== 'lost-found' &&
           activeTab !== 'alerts' && (
             <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg min-h-[400px]">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-gray-800 capitalize">Manage {activeTab}</h2>
                 <button className="bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">Add New</button>
               </div>
               <div className="text-center py-16">
                  <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/50">
                    <Settings size={32} className="text-gray-400 animate-spin-slow" />
                  </div>
                  <p className="text-gray-500 font-bold tracking-wide">Module integration pending.</p>
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}
