import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Star, MapPin, Phone, Coffee, HeartPulse, CreditCard, Droplets, UtensilsCrossed, X, Upload, Image, Search, Filter } from 'lucide-react';
import api from '../../api';

export default function AdminFood() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialFormState = {
    name: '',
    category: 'restaurant',
    rating: 4.5,
    distance: '100m',
    phone: '',
    address: '',
    img_url: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imgInputMethod, setImgInputMethod] = useState('upload'); // 'upload', 'url'
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/food');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, img_url: res.data.url }));
      setUploadingImage(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      name: item.name,
      category: item.category,
      rating: item.rating,
      distance: item.distance || '',
      phone: item.phone || '',
      address: item.address || '',
      img_url: item.img_url || ''
    });
    setEditingId(item.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/food/${editingId}`, formData);
        setMessage('Service updated successfully!');
      } else {
        await api.post('/food', formData);
        setMessage('Service registered successfully!');
      }
      handleCancel();
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service listing?')) return;
    try {
      await api.delete(`/food/${id}`);
      setMessage('Service removed successfully.');
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and Search logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'restaurant' && item.category === 'restaurant') ||
      (selectedFilter === 'tea' && (item.category === 'tea' || item.category === 'sweet')) ||
      (selectedFilter === 'medical' && (item.category === 'medical' || item.category === 'hospital')) ||
      (selectedFilter === 'atm' && item.category === 'atm') ||
      (selectedFilter === 'water' && item.category === 'water');

    return matchesSearch && matchesFilter;
  });

  const getCategoryBadgeStyles = (cat) => {
    switch (cat) {
      case 'restaurant':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'tea':
      case 'sweet':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'medical':
      case 'hospital':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'atm':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'water':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'restaurant': return <UtensilsCrossed size={12} />;
      case 'tea':
      case 'sweet': return <Coffee size={12} />;
      case 'medical':
      case 'hospital': return <HeartPulse size={12} />;
      case 'atm': return <CreditCard size={12} />;
      case 'water': return <Droplets size={12} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Food & Essential Services</h2>
          <p className="text-xs text-gray-500 mt-1">Configure restaurants, tea stalls, hospitals, clinics, ATMs, and water booths surrounding the Dargah area.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setShowForm(true); setIsEditing(false); setFormData(initialFormState); }}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Plus size={16} /> Register Service
          </button>
        )}
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-lg text-sm font-semibold mb-6 flex items-center gap-2">
          <Check size={16} className="text-emerald-600" /> {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 mb-8 space-y-6 animate-fadeIn relative">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <h3 className="font-bold text-gray-800 text-base">{isEditing ? 'Modify Service Details' : 'Register New Facility/Service'}</h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Facility/Shop Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-primary/25" placeholder="e.g. Al-Habib Restaurant" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Category Type</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white">
                <option value="restaurant">Restaurant (Dining)</option>
                <option value="tea">Tea & Snacks Stall</option>
                <option value="sweet">Sweet Shop (Mithai)</option>
                <option value="atm">ATM Facility</option>
                <option value="medical">Medical Store / Pharmacy</option>
                <option value="hospital">Hospital / Clinic</option>
                <option value="water">Sabil / Drinking Water Point</option>
                <option value="toilet">Public Toilet / Washroom</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Distance</label>
                <input required type="text" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="e.g. 100m" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Rating</label>
                <input required type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="4.5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="e.g. +91 98765 43210" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Full Address/Location Detail</label>
              <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="e.g. Main Bazar, opposite Gate 2" />
            </div>
          </div>

          {/* Visual Media Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Image size={14} className="text-primary" /> Visual Cover Photo
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex gap-4 border-b pb-2 text-xs mb-3">
                  <button 
                    type="button" 
                    onClick={() => setImgInputMethod('upload')} 
                    className={`pb-1.5 font-bold transition-all ${imgInputMethod === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Upload Shop Photo
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImgInputMethod('url')} 
                    className={`pb-1.5 font-bold transition-all ${imgInputMethod === 'url' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Paste Image Link
                  </button>
                </div>

                {imgInputMethod === 'upload' ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer relative group min-h-[120px]">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center text-center pointer-events-none">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-bold text-gray-500">Uploading cover...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors mb-2 border">
                            <Upload size={16} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">Choose a file or drag & drop</span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Image Web Address (URL)</label>
                    <input 
                      type="text" 
                      value={formData.img_url} 
                      onChange={e => setFormData({ ...formData, img_url: e.target.value })} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                      placeholder="e.g. https://images.unsplash.com/photo-..." 
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                {formData.img_url && (
                  <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50 flex items-center gap-3 animate-fadeIn">
                    <img 
                      src={formData.img_url} 
                      alt="Cover Preview" 
                      className="w-20 h-20 object-cover rounded-lg border shadow-xs"
                      onError={(e) => { e.target.src = 'https://placehold.co/100?text=Invalid+Image'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-700 truncate">Selected Image Path:</p>
                      <p className="text-[9px] text-gray-400 font-mono truncate mt-0.5">{formData.img_url}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, img_url: '' })} 
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t mt-4">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow transition-colors">
              {isEditing ? 'Save Changes' : 'Register Service'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search food & services by name or address..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1 flex-shrink-0">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Services' },
            { id: 'restaurant', label: 'Restaurants' },
            { id: 'tea', label: 'Tea & Sweets' },
            { id: 'medical', label: 'Medical/Hospitals' },
            { id: 'atm', label: 'ATMs' },
            { id: 'water', label: 'Water' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex-shrink-0 ${selectedFilter === tab.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-gray-400 font-sans">Fetching services directory...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-150">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 text-gray-800 font-bold border-b border-gray-150">
              <tr>
                <th className="px-6 py-4">Facility Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Location & Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.img_url ? (
                        <img src={item.img_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg border flex-shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center text-[10px] font-bold border border-dashed flex-shrink-0">
                          <Image size={16} className="text-gray-300" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-800">{item.name}</div>
                        {item.address && <div className="text-xs text-gray-400 mt-0.5 font-medium truncate max-w-xs">{item.address}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider text-[9px] inline-flex items-center gap-1 ${getCategoryBadgeStyles(item.category)}`}>
                      {getCategoryIcon(item.category)}
                      {item.category === 'tea' ? 'Tea Stall' : item.category === 'sweet' ? 'Sweet Shop' : item.category === 'medical' ? 'Pharmacy' : item.category === 'hospital' ? 'Hospital' : item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-bold text-primary text-xs">
                      {item.rating || '4.0'} <Star size={12} className="fill-primary text-primary" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1 text-gray-600 font-medium">
                        <MapPin size={12} className="text-primary flex-shrink-0" /> {item.distance || 'Not specified'}
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Phone size={10} /> {item.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Edit Service">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete Service">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    No facilities found. Click "Register Service" to list a new vendor or public facility.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
