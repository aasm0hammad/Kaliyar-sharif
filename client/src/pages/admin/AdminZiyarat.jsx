import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, MapPin, Clock, Image, Upload, Globe, X, Search, Filter, ArrowUp, ArrowDown, Eye, EyeOff, Route } from 'lucide-react';
import api from '../../api';
import LocationPickerMap from '../../components/LocationPickerMap';

export default function AdminZiyarat() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Form & Edit states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Multilingual tab state
  const [activeLangTab, setActiveLangTab] = useState('en'); // 'en', 'hi', 'ur'
  
  // Image input method state
  const [imgInputMethod, setImgInputMethod] = useState('upload'); // 'upload', 'url'
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    name_en: '',
    name_hi: '',
    name_ur: '',
    type: 'mazaraat',
    desc_en: '',
    desc_hi: '',
    desc_ur: '',
    img_url: '',
    timings: '24 Hours',
    opening_time: '05:00 AM',
    closing_time: '10:00 PM',
    has_namaz: false,
    fajr_time: '05:15 AM',
    dhuhr_time: '01:30 PM',
    asr_time: '05:30 PM',
    maghrib_time: '07:15 PM',
    isha_time: '08:45 PM',
    lat: '',
    lng: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = () => {
    setLoading(true);
    api.get('/ziyarat')
      .then(res => {
        setPlaces(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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

  const handleEditClick = (place) => {
    setFormData({
      name_en: place.name_en || place.name || '',
      name_hi: place.name_hi || '',
      name_ur: place.name_ur || '',
      type: place.type || 'mazaraat',
      desc_en: place.desc_en || place.desc || '',
      desc_hi: place.desc_hi || '',
      desc_ur: place.desc_ur || '',
      img_url: place.img_url || '',
      timings: place.timings || '24 Hours',
      opening_time: place.opening_time || '05:00 AM',
      closing_time: place.closing_time || '10:00 PM',
      has_namaz: !!(place.fajr_time || place.dhuhr_time || place.asr_time || place.maghrib_time || place.isha_time),
      fajr_time: place.fajr_time || '05:15 AM',
      dhuhr_time: place.dhuhr_time || '01:30 PM',
      asr_time: place.asr_time || '05:30 PM',
      maghrib_time: place.maghrib_time || '07:15 PM',
      isha_time: place.isha_time || '08:45 PM',
      lat: place.lat || '',
      lng: place.lng || ''
    });
    setEditingId(place.id);
    setIsEditing(true);
    setShowForm(true);
    setActiveLangTab('en');
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name_en: formData.name_en,
      name_hi: formData.name_hi || null,
      name_ur: formData.name_ur || null,
      type: formData.type,
      desc_en: formData.desc_en || null,
      desc_hi: formData.desc_hi || null,
      desc_ur: formData.desc_ur || null,
      img_url: formData.img_url || null,
      timings: formData.timings,
      opening_time: formData.opening_time || null,
      closing_time: formData.closing_time || null,
      fajr_time: formData.has_namaz ? formData.fajr_time : null,
      dhuhr_time: formData.has_namaz ? formData.dhuhr_time : null,
      asr_time: formData.has_namaz ? formData.asr_time : null,
      maghrib_time: formData.has_namaz ? formData.maghrib_time : null,
      isha_time: formData.has_namaz ? formData.isha_time : null,
      lat: formData.lat ? parseFloat(formData.lat) : null,
      lng: formData.lng ? parseFloat(formData.lng) : null
    };

    try {
      if (isEditing) {
        await api.put(`/ziyarat/${editingId}`, payload);
        setMessage('Ziyarat place updated successfully!');
      } else {
        await api.post('/ziyarat', payload);
        setMessage('Ziyarat place added successfully!');
      }
      handleCancel();
      fetchPlaces();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save Ziyarat place');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Ziyarat place? This action cannot be undone.')) return;
    try {
      await api.delete(`/ziyarat/${id}`);
      setMessage('Ziyarat place deleted successfully.');
      fetchPlaces();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle show_on_route
  const handleToggleRoute = async (id, currentVal) => {
    try {
      await api.put(`/ziyarat/${id}/toggle-route`, { show_on_route: !currentVal });
      setPlaces(prev => prev.map(p => p.id === id ? { ...p, show_on_route: !currentVal ? 1 : 0 } : p));
      setMessage(!currentVal ? 'Place added to route map.' : 'Place hidden from route map.');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) { console.error(err); }
  };

  // Move sequence up
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newPlaces = [...places];
    [newPlaces[index - 1], newPlaces[index]] = [newPlaces[index], newPlaces[index - 1]];
    setPlaces(newPlaces);
    try {
      await api.put('/ziyarat/reorder', { orderedIds: newPlaces.map(p => p.id) });
    } catch (err) { console.error(err); }
  };

  // Move sequence down
  const handleMoveDown = async (index) => {
    if (index === places.length - 1) return;
    const newPlaces = [...places];
    [newPlaces[index], newPlaces[index + 1]] = [newPlaces[index + 1], newPlaces[index]];
    setPlaces(newPlaces);
    try {
      await api.put('/ziyarat/reorder', { orderedIds: newPlaces.map(p => p.id) });
    } catch (err) { console.error(err); }
  };


  // Filter and Search logic
  const filteredPlaces = places.filter(place => {
    const matchesSearch = 
      (place.name_en && place.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.name_hi && place.name_hi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.name_ur && place.name_ur.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.desc_en && place.desc_en.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || place.type === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'dargah':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'mazaraat':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'qawwali':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'langar':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'wuzu':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Ziyarat Places</h2>
          <p className="text-xs text-gray-500 mt-1">Configure sacred locations, timings, namaz schedules, descriptions, and media uploads.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setShowForm(true); setIsEditing(false); setFormData(initialFormState); }}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Plus size={16} /> Add New Place
          </button>
        )}
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-lg text-sm font-semibold mb-6 flex items-center gap-2 animate-fadeIn">
          <Check size={16} className="text-emerald-600" /> {message}
        </div>
      )}

      {/* Slide-down Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 mb-8 space-y-6 animate-fadeIn relative">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              {isEditing ? 'Modify Ziyarat Place' : 'Create New Ziyarat Place'}
            </h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
              <X size={18} />
            </button>
          </div>

          {/* Multilingual Tabs Panel */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`py-2.5 px-4 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-all ${activeLangTab === 'en' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                <Globe size={14} /> English Info
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('hi')}
                className={`py-2.5 px-4 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-all ${activeLangTab === 'hi' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                <span>🇮🇳</span> Hindi (हिन्दी)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('ur')}
                className={`py-2.5 px-4 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-all ${activeLangTab === 'ur' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                <span>🇵🇰</span> Urdu (اردو)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-white p-4 rounded-lg border border-gray-200/60 shadow-inner">
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Place Name (English) *</label>
                    <input required type="text" value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Imam Sahab Mazar" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Description & History (English)</label>
                    <textarea rows="3" value={formData.desc_en} onChange={e => setFormData({ ...formData, desc_en: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Spiritual history, religious details, visitor instructions in English..." />
                  </div>
                </div>
              )}

              {activeLangTab === 'hi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Place Name (Hindi)</label>
                    <input type="text" value={formData.name_hi} onChange={e => setFormData({ ...formData, name_hi: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="जैसे: इमाम साहब मज़ार" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Description & History (Hindi)</label>
                    <textarea rows="3" value={formData.desc_hi} onChange={e => setFormData({ ...formData, desc_hi: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="हिंदी में इतिहास और धार्मिक महत्व..." />
                  </div>
                </div>
              )}

              {activeLangTab === 'ur' && (
                <div className="space-y-4" dir="rtl">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-right">مقام کا نام (Urdu)</label>
                    <input type="text" value={formData.name_ur} onChange={e => setFormData({ ...formData, name_ur: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right" placeholder="مثال: امام صاحب مزار" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-right">تفصیل اور تاریخ (Urdu)</label>
                    <textarea rows="3" value={formData.desc_ur} onChange={e => setFormData({ ...formData, desc_ur: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right" placeholder="اردو میں تاریخی اور روحانی معلومات..." />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Categorization & Core details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Category Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="dargah">Dargah Sharif (Main Tomb)</option>
                <option value="mazaraat">Nearby Mazaraat (Shrines)</option>
                <option value="qawwali">Qawwali Places (Auditorium)</option>
                <option value="langar">Langar Locations (Food distribution)</option>
                <option value="wuzu">Wuzu Areas / Washrooms</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">General Timings Description</label>
              <input required type="text" value={formData.timings} onChange={e => setFormData({ ...formData, timings: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. 24 Hours, or 6:00 AM - 10:00 PM" />
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Latitude</label>
                  <input type="number" step="0.000001" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="29.9324" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Longitude</label>
                  <input type="number" step="0.000001" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="77.9322" />
                </div>
              </div>
              <LocationPickerMap 
                lat={formData.lat}
                lng={formData.lng}
                onChange={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
              />
            </div>
          </div>

          {/* Time Picker Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Clock size={14} className="text-primary" /> Timings & Hours Configuration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Opening Time</label>
                <input type="text" value={formData.opening_time} onChange={e => setFormData({ ...formData, opening_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. 05:00 AM" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Closing Time</label>
                <input type="text" value={formData.closing_time} onChange={e => setFormData({ ...formData, closing_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. 10:00 PM" />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  checked={formData.has_namaz} 
                  onChange={e => setFormData({ ...formData, has_namaz: e.target.checked })} 
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer" 
                />
                Include Daily Namaz Timings for this location
              </label>
              <p className="text-[11px] text-gray-400 font-medium ml-6 mt-0.5">Activate this option if congregations are held here (e.g. in the Mosque, main shrine courtyard).</p>
            </div>

            {formData.has_namaz && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-dashed animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Fajr Time</label>
                  <input type="text" value={formData.fajr_time} onChange={e => setFormData({ ...formData, fajr_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-gray-50" placeholder="05:15 AM" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Dhuhr Time</label>
                  <input type="text" value={formData.dhuhr_time} onChange={e => setFormData({ ...formData, dhuhr_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-gray-50" placeholder="01:30 PM" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Asr Time</label>
                  <input type="text" value={formData.asr_time} onChange={e => setFormData({ ...formData, asr_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-gray-50" placeholder="05:30 PM" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Maghrib Time</label>
                  <input type="text" value={formData.maghrib_time} onChange={e => setFormData({ ...formData, maghrib_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-gray-50" placeholder="07:15 PM" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Isha Time</label>
                  <input type="text" value={formData.isha_time} onChange={e => setFormData({ ...formData, isha_time: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2 text-xs bg-gray-50" placeholder="08:45 PM" />
                </div>
              </div>
            )}
          </div>

          {/* Premium Image Upload Component */}
          <div className="bg-white p-5 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Image size={14} className="text-primary" /> Visual Media
            </h4>

            <div className="flex gap-4 border-b pb-2 text-xs">
              <button 
                type="button" 
                onClick={() => setImgInputMethod('upload')} 
                className={`pb-1.5 font-bold transition-all ${imgInputMethod === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Upload Photo File
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
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="flex flex-col items-center text-center pointer-events-none">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-gray-500">Uploading photo...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors mb-3 border">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Choose a file or drag & drop</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</span>
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

            {/* Image Preview Window */}
            {formData.img_url && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-4 animate-fadeIn">
                <img 
                  src={formData.img_url} 
                  alt="Uploaded Ziyarat Preview" 
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300/60 shadow-sm"
                  onError={(e) => { e.target.src = 'https://placehold.co/100?text=Invalid+Image'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">Selected Image Path:</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{formData.img_url}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, img_url: '' })} 
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-3 border-t">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow transition-colors">
              {isEditing ? 'Save Changes' : 'Save Ziyarat Place'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}


      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search places by English, Hindi, or Urdu names..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1 flex-shrink-0">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'dargah', label: 'Dargah Sharif' },
            { id: 'mazaraat', label: 'Mazaraat' },
            { id: 'qawwali', label: 'Qawwali' },
            { id: 'langar', label: 'Langar' },
            { id: 'wuzu', label: 'Wuzu/Toilet' }
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

      {/* List section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-gray-400">Fetching holy locations...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-150">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 text-gray-800 font-bold border-b border-gray-150">
              <tr>
                <th className="px-6 py-4">Place Identity</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Hours & Namaz</th>
                <th className="px-6 py-4">Geo Coordinates</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredPlaces.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.img_url ? (
                        <img 
                          src={p.img_url} 
                          alt={p.name_en} 
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200/80 flex-shrink-0 shadow-sm"
                          onError={(e) => { e.target.src = 'https://placehold.co/100?text=No+Photo'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center text-[10px] font-bold border border-dashed border-gray-200 flex-shrink-0">
                          <Image size={16} className="text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 truncate">{p.name_en || p.name}</div>
                        <div className="text-[11px] text-gray-400 font-medium space-y-0.5 mt-0.5">
                          {p.name_hi && <div className="truncate">🇮🇳 {p.name_hi}</div>}
                          {p.name_ur && <div className="truncate text-right" dir="rtl">🇵🇰 {p.name_ur}</div>}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider text-[10px] ${getTypeBadgeStyles(p.type)}`}>
                      {p.type === 'wuzu' ? 'Wuzu / Toilet' : p.type === 'mazaraat' ? 'Mazar' : p.type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
                        <Clock size={12} className="text-primary flex-shrink-0" />
                        <span>{p.timings || '24 Hours'}</span>
                      </div>
                      {p.opening_time && (
                        <div className="text-[11px] text-gray-400 font-medium">
                          Hours: {p.opening_time} - {p.closing_time}
                        </div>
                      )}
                      {(p.fajr_time || p.dhuhr_time || p.asr_time || p.maghrib_time || p.isha_time) ? (
                        <span className="inline-flex items-center gap-0.5 bg-green-50 border border-green-150 text-[9px] font-bold text-green-700 px-1.5 py-0.5 rounded mt-1">
                          Namaz Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">No congregations</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs font-mono">
                    {p.lat && p.lng ? (
                      <a 
                        href={`https://www.google.com/maps?q=${p.lat},${p.lng}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                        title="View on Google Maps"
                      >
                        <MapPin size={12} />
                        <span>{parseFloat(p.lat).toFixed(4)}, {parseFloat(p.lng).toFixed(4)}</span>
                      </a>
                    ) : (
                      <span className="text-gray-300 italic">Not set</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(p)} 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all" 
                        title="Edit Details"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all" 
                        title="Delete Place"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlaces.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400 font-medium">
                    No Ziyarat places matched your search query or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== ROUTE SEQUENCE MANAGER (Bottom) ===== */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-gray-800 text-base flex items-center gap-2">
            <Route size={18} className="text-blue-600" /> Route Sequence Manager
          </h3>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {places.filter(p => p.show_on_route).length} on Route Map
          </span>
        </div>
        <p className="text-xs text-gray-500">Control the numbered sequence (1→2→3→...) shown on the Ziyarat route map. Use arrows to reorder and the eye toggle to show/hide.</p>
        
        <div className="space-y-1.5">
          {places.map((place, index) => {
            const isOnRoute = !!place.show_on_route;
            const routeIndex = places.slice(0, index + 1).filter(p => p.show_on_route).length;
            return (
              <div key={place.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isOnRoute ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}>
                {/* Sequence number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isOnRoute ? 'bg-blue-600 text-white' : 'bg-gray-300 text-white'
                }`}>
                  {isOnRoute ? routeIndex : '—'}
                </div>

                {/* Image */}
                {place.img_url ? (
                  <img src={place.img_url} alt="" className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center shrink-0">
                    <Image size={14} className="text-gray-300" />
                  </div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-800 truncate">{place.name_en || place.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{place.type} • {place.lat ? `${parseFloat(place.lat).toFixed(4)}, ${parseFloat(place.lng).toFixed(4)}` : 'No location'}</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move Up">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => handleMoveDown(index)} disabled={index === places.length - 1}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move Down">
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => handleToggleRoute(place.id, place.show_on_route)}
                    className={`p-1.5 rounded transition-colors ${
                      isOnRoute ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`} title={isOnRoute ? 'Hide from Route' : 'Show on Route'}>
                    {isOnRoute ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
          {places.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-xs">No places added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
