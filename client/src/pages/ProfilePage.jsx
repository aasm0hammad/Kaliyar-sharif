import { useState, useEffect } from 'react';
import { User, LogOut, MapPin, Heart, Hotel, Settings, Camera, ChevronRight, Briefcase } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import statesData from '../data/indian-states-districts.json';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [savedStays, setSavedStays] = useState([]);
  const [savedZiyarat, setSavedZiyarat] = useState([]);
  const [activeTab, setActiveTab] = useState('stays');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [myHotel, setMyHotel] = useState(null);
  const [savingHotel, setSavingHotel] = useState(false);
  const [hotelSaveMessage, setHotelSaveMessage] = useState('');
  
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const [savedRes, hotelsRes, ziyaratRes, profileRes] = await Promise.all([
          api.get(`/users/${parsedUser.id}/saved-places`),
          api.get('/hotels'),
          api.get('/ziyarat'),
          api.get(`/users/${parsedUser.id}/profile`)
        ]);

        const savedData = savedRes.data;
        const allHotels = hotelsRes.data;
        const allZiyarat = ziyaratRes.data;
        setProfileData(profileRes.data);

        try {
          const myHotelRes = await api.get(`/users/${parsedUser.id}/my-hotel`);
          setMyHotel(myHotelRes.data);
        } catch (err) {
          console.error("No hotel owned or route missing", err);
          setMyHotel(null);
        }

        const hotelIds = savedData.filter(s => s.place_type === 'hotel').map(s => parseInt(s.place_id));
        const ziyaratIds = savedData.filter(s => s.place_type === 'ziyarat').map(s => parseInt(s.place_id));

        setSavedStays(allHotels.filter(h => hotelIds.includes(h.id)));
        setSavedZiyarat(allZiyarat.filter(z => ziyaratIds.includes(z.id)));
      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
    window.location.reload();
  };

  const removeSavedPlace = async (type, id) => {
    try {
      await api.delete(`/users/${user.id}/saved-places`, { data: { place_type: type, place_id: id } });
      if (type === 'hotel') {
        setSavedStays(savedStays.filter(s => s.id !== id));
      } else {
        setSavedZiyarat(savedZiyarat.filter(z => z.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (profileData.state) {
      const stateObj = statesData.states.find(s => s.state === profileData.state);
      if (stateObj) {
        setAvailableDistricts(stateObj.districts);
      } else {
        setAvailableDistricts([]);
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [profileData.state]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => {
      // If state changes, reset district
      if (name === 'state' && prev.state !== value) {
        return { ...prev, [name]: value, district: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      const res = await api.put(`/users/${user.id}/profile`, profileData);
      setProfileData(res.data.user);
      
      // Update local storage name if changed
      const updatedUser = { ...user, name: res.data.user.name };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Error updating profile", err);
      setSaveMessage('Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHotelUpdate = async (e) => {
    e.preventDefault();
    setSavingHotel(true);
    setHotelSaveMessage('');
    try {
      await api.put(`/users/${user.id}/my-hotel`, {
        total_rooms: myHotel.total_rooms,
        available_rooms: myHotel.available_rooms,
        phone: myHotel.phone
      });
      setHotelSaveMessage('Hotel details updated successfully!');
      setTimeout(() => setHotelSaveMessage(''), 3000);
    } catch (err) {
      console.error("Error updating hotel", err);
      setHotelSaveMessage('Error updating hotel.');
    } finally {
      setSavingHotel(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Profile Header Banner */}
      <div className="bg-primary pt-12 pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
      </div>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 lg:px-8 -mt-16 lg:-mt-24 relative z-10 pb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Profile Info Section */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-100 relative">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl md:text-5xl font-black shadow-inner border-4 border-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-primary transition-colors border border-gray-100">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mt-2 md:mt-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <button className="flex items-center gap-1.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                  <Settings size={16} /> Edit Profile
                </button>
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            <div className="hidden lg:flex gap-4 mt-4">
              <div className="bg-orange-50 px-6 py-4 rounded-xl text-center">
                <div className="text-2xl font-black text-orange-500">{savedStays.length}</div>
                <div className="text-xs font-bold text-gray-500 uppercase">Saved Stays</div>
              </div>
              <div className="bg-blue-50 px-6 py-4 rounded-xl text-center">
                <div className="text-2xl font-black text-blue-500">{savedZiyarat.length}</div>
                <div className="text-xs font-bold text-gray-500 uppercase">Saved Places</div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex flex-col md:flex-row">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 border-r border-gray-100 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('stays')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'stays' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Hotel size={18} /> My Saved Stays
              </button>
              <button 
                onClick={() => setActiveTab('ziyarat')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'ziyarat' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin size={18} /> My Ziyarat Places
              </button>
              {myHotel && (
                <button 
                  onClick={() => setActiveTab('my-hotel')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'my-hotel' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Briefcase size={18} /> Manage My Hotel
                </button>
              )}
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings size={18} /> Account Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 md:p-8 bg-gray-50/50 min-h-[400px]">
              
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {activeTab === 'my-hotel' && myHotel && (
                    <div className="max-w-3xl">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Briefcase className="text-primary" size={20} /> Manage My Hotel: {myHotel.name}
                      </h2>
                      {hotelSaveMessage && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-bold border ${hotelSaveMessage.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {hotelSaveMessage}
                        </div>
                      )}
                      
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex gap-6">
                        <img src={myHotel.img_url || myHotel.img} alt={myHotel.name} className="w-32 h-32 object-cover rounded-xl" />
                        <div>
                          <h3 className="text-xl font-black text-gray-800 mb-1">{myHotel.name}</h3>
                          <p className="text-gray-500 text-sm mb-4"><MapPin size={14} className="inline mr-1"/> {myHotel.distance}</p>
                          <div className="flex gap-4">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
                              <span className="block text-xs font-bold text-gray-500 uppercase">Total Rooms</span>
                              <span className="text-lg font-black text-blue-600">{myHotel.total_rooms}</span>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-lg text-center">
                              <span className="block text-xs font-bold text-gray-500 uppercase">Available</span>
                              <span className="text-lg font-black text-green-600">{myHotel.available_rooms}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <form className="space-y-5 bg-white p-6 rounded-xl border border-gray-100 shadow-sm" onSubmit={handleHotelUpdate}>
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Update Availability</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Total Rooms</label>
                            <input 
                              type="number" 
                              value={myHotel.total_rooms || ''} 
                              onChange={(e) => setMyHotel({...myHotel, total_rooms: e.target.value})} 
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white font-bold" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Available Rooms (Currently empty & ready to book)</label>
                            <input 
                              type="number" 
                              value={myHotel.available_rooms || ''} 
                              onChange={(e) => setMyHotel({...myHotel, available_rooms: e.target.value})} 
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white font-black text-green-600" 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Reception/Booking Phone Number</label>
                            <input 
                              type="text" 
                              value={myHotel.phone || ''} 
                              onChange={(e) => setMyHotel({...myHotel, phone: e.target.value})} 
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" 
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <button type="submit" disabled={savingHotel} className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-primary-light transition-colors disabled:opacity-70 flex items-center gap-2">
                            {savingHotel ? 'Updating...' : 'Update Hotel Details'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'stays' && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Heart className="text-red-500 fill-red-500" size={20} /> Saved Hotels & Stays
                      </h2>
                      {savedStays.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                          <Hotel size={48} className="mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500 font-medium">You haven't saved any hotels yet.</p>
                          <Link to="/stay" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Explore Stays</Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedStays.map(hotel => (
                            <div key={hotel.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 group relative">
                              <img src={hotel.img_url || hotel.img} alt={hotel.name} className="w-24 h-24 object-cover rounded-lg" />
                              <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{hotel.name}</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {hotel.distance}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="font-bold text-primary">₹{hotel.price}</span>
                                  <Link to="/stay" className="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1">View <ChevronRight size={12}/></Link>
                                </div>
                              </div>
                              <button onClick={() => removeSavedPlace('hotel', hotel.id)} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-red-50 transition-colors" title="Remove from saved">
                                <Heart size={16} className="fill-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'ziyarat' && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MapPin className="text-primary" size={20} /> Saved Ziyarat Places
                      </h2>
                      {savedZiyarat.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                          <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                          <p className="text-gray-500 font-medium">You haven't saved any ziyarat places yet.</p>
                          <Link to="/ziyarat" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">Explore Ziyarat</Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedZiyarat.map(place => (
                            <div key={place.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 relative">
                              <img src={place.img_url || place.img} alt={place.name_en} className="w-24 h-24 object-cover rounded-lg" />
                              <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{place.name_en}</h3>
                                <p className="text-xs text-gray-500 capitalize mt-1">{place.type}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{place.timings || '24 Hours'}</span>
                                  <Link to="/ziyarat" className="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1">Guide <ChevronRight size={12}/></Link>
                                </div>
                              </div>
                              <button onClick={() => removeSavedPlace('ziyarat', place.id)} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-red-50 transition-colors" title="Remove from saved">
                                <Heart size={16} className="fill-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="max-w-3xl">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                      {saveMessage && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-bold border ${saveMessage.includes('Error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          {saveMessage}
                        </div>
                      )}
                      <form className="space-y-5" onSubmit={handleUpdateProfile}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Full Name</label>
                            <input type="text" name="name" value={profileData.name || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Email Address</label>
                            <input type="email" value={profileData.email || ''} disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Phone Number</label>
                            <input type="tel" name="phone" value={profileData.phone || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" placeholder="+91 XXXXX XXXXX" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Date of Birth</label>
                            <input type="date" name="dob" value={profileData.dob ? profileData.dob.split('T')[0] : ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Gender</label>
                            <select name="gender" value={profileData.gender || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white">
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">New Password</label>
                            <input type="password" name="password" onChange={handleProfileChange} placeholder="Leave blank to keep same" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" />
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                          <h3 className="text-sm font-bold text-gray-800 mb-4">Address Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">State</label>
                              <select name="state" value={profileData.state || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white">
                                <option value="">Select State</option>
                                {statesData.states.map((s, idx) => (
                                  <option key={idx} value={s.state}>{s.state}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">District</label>
                              {availableDistricts.length > 0 ? (
                                <select name="district" value={profileData.district || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white">
                                  <option value="">Select District</option>
                                  {availableDistricts.map((d, idx) => (
                                    <option key={idx} value={d}>{d}</option>
                                  ))}
                                </select>
                              ) : (
                                <input type="text" name="district" value={profileData.district || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white bg-gray-50 cursor-not-allowed" placeholder="Select state first" disabled />
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">City / Town</label>
                              <input type="text" name="city" value={profileData.city || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" placeholder="e.g. Roorkee" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1.5">Pincode</label>
                              <input type="text" name="pincode" value={profileData.pincode || ''} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-primary bg-white" placeholder="e.g. 247667" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Street Address / Landmark</label>
                            <textarea name="address" value={profileData.address || ''} onChange={handleProfileChange} rows="2" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-primary bg-white resize-y" placeholder="House No, Building, Street, Landmark..."></textarea>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button type="submit" disabled={isSaving} className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-primary-light transition-colors disabled:opacity-70 flex items-center gap-2">
                            {isSaving ? 'Saving Changes...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
