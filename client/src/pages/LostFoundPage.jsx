import { useState, useEffect } from 'react';
import { MapPin, Search, PlusCircle, Calendar, Phone, User, X, CheckCircle, Info } from 'lucide-react';
import api from '../api';

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, lost, found
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    type: 'lost',
    item_name: '',
    description: '',
    date: '',
    location: '',
    contact_name: '',
    contact_phone: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/lost-found');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lost-found', {
        ...formData,
        user_id: user ? user.id : null,
      });
      setSuccessMsg('Your report has been submitted successfully and is waiting for admin approval.');
      setIsModalOpen(false);
      setFormData({ type: 'lost', item_name: '', description: '', date: '', location: '', contact_name: '', contact_phone: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      alert('Error submitting report. Please try again.');
    }
  };

  const filteredItems = items.filter(item => filter === 'all' ? true : item.type === filter);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Khoya-Paya (Lost & Found)</h1>
          <p className="text-lg md:text-xl text-white/90">Report lost items or help reunite found items with their owners at Kaliyar Sharif.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button onClick={() => setFilter('all')} className={`px-6 py-3 font-bold text-sm transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>All</button>
            <button onClick={() => setFilter('lost')} className={`px-6 py-3 font-bold text-sm transition-colors border-l border-gray-200 ${filter === 'lost' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Lost</button>
            <button onClick={() => setFilter('found')} className={`px-6 py-3 font-bold text-sm transition-colors border-l border-gray-200 ${filter === 'found' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>Found</button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Report Lost/Found Item
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-semibold">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Items Found</h3>
            <p className="text-gray-500">There are no {filter !== 'all' ? filter : ''} items reported at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider text-white shadow-sm z-10 ${item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}>
                  {item.type}
                </div>
                {item.image_url ? (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                    <Info size={40} />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.item_name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {item.location && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-primary shrink-0" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Contact Details</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <User size={14} className="text-gray-400" /> {item.contact_name}
                    </div>
                    {item.contact_phone && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-1">
                        <Phone size={14} /> {item.contact_phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for reporting */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">Report an Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded-full flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {!user && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-4 border border-blue-200">
                  <span className="font-bold">Note:</span> You are not logged in. You can still report an item, but logging in helps us track your reports better.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center font-bold transition-all ${formData.type === 'lost' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  <input type="radio" name="type" value="lost" checked={formData.type === 'lost'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="hidden" />
                  I Lost Something
                </label>
                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center font-bold transition-all ${formData.type === 'found' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  <input type="radio" name="type" value="found" checked={formData.type === 'found'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="hidden" />
                  I Found Something
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name *</label>
                <input type="text" required value={formData.item_name} onChange={(e) => setFormData({...formData, item_name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary focus:bg-white" placeholder="e.g. Black Wallet, Key chain" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary focus:bg-white resize-none" placeholder="Color, brand, identifying marks..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date {formData.type === 'lost' ? 'Lost' : 'Found'} *</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Location *</label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary focus:bg-white" placeholder="e.g. Near Sabir Pak Dargah" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-5 mt-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                  <input type="text" required value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary focus:bg-white" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Your Phone *</label>
                  <input type="text" required value={formData.contact_phone} onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary focus:bg-white" placeholder="Phone Number" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold shadow-lg transition-colors text-lg">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
