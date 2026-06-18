import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Star, ShieldCheck, X, Search, Filter, Image, Upload, Phone, MessageCircle, MapPin } from 'lucide-react';
import api from '../../api';

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Form & Edit states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Image input tab state
  const [imgInputMethod, setImgInputMethod] = useState('upload'); // 'upload', 'url'
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    name: '',
    category: 'attar',
    description: '',
    phone: '',
    whatsapp: '',
    logo_url: '',
    address: '',
    rating: '4.5',
    reviews_count: '0',
    premium: false
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = () => {
    setLoading(true);
    api.get('/businesses')
      .then(res => {
        setBusinesses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching businesses:", err);
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
      setFormData(prev => ({ ...prev, logo_url: res.data.url }));
      setUploadingImage(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  const handleEditClick = (biz) => {
    setFormData({
      name: biz.name || '',
      category: biz.category || 'attar',
      description: biz.description || biz.desc || '',
      phone: biz.phone || '',
      whatsapp: biz.whatsapp || '',
      logo_url: biz.logo_url || '',
      address: biz.address || '',
      rating: biz.rating !== undefined ? String(biz.rating) : '4.5',
      reviews_count: biz.reviews_count !== undefined ? String(biz.reviews_count) : '0',
      premium: biz.premium === 1 || biz.premium === true
    });
    setEditingId(biz.id);
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
    
    const payload = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : 0.0,
      reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : 0,
      premium: formData.premium ? 1 : 0
    };

    try {
      if (isEditing) {
        await api.put(`/businesses/${editingId}`, payload);
        setMessage('Vendor listing updated successfully!');
      } else {
        await api.post('/businesses', payload);
        setMessage('Vendor listing created successfully!');
      }
      handleCancel();
      fetchBusinesses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save vendor details');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this shop/vendor listing? This action cannot be undone.')) return;
    try {
      await api.delete(`/businesses/${id}`);
      setMessage('Listing removed successfully.');
      fetchBusinesses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'attar': return 'Attar & Perfumes';
      case 'chadar': return 'Chadar & Flowers';
      case 'restaurant': return 'Restaurants & Food';
      case 'transport': return 'Travel & Transport';
      case 'hotel': return 'Hotels & Lodges';
      case 'gift': return 'Gifts & Souvenirs';
      default: return cat;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'attar': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'chadar': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'restaurant': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'transport': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'hotel': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'gift': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter and Search logic
  const filteredBusinesses = businesses.filter(biz => {
    const matchesSearch = 
      (biz.name && biz.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (biz.description && biz.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (biz.address && biz.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || biz.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Businesses & Vendors</h2>
          <p className="text-xs text-gray-500 mt-1">Approve, update, or remove local vendor shops, travel services, and hotels in Kaliyar Sharif.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setShowForm(true); setIsEditing(false); setFormData(initialFormState); }}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Plus size={16} /> Add Listing
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
              {isEditing ? 'Modify Vendor Listing' : 'Register New Vendor / Shop'}
            </h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Vendor / Shop Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Sabri Attar Palace" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Category *</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="attar">Attar & Perfumes</option>
                <option value="chadar">Chadar & Flowers</option>
                <option value="restaurant">Restaurants & Food</option>
                <option value="transport">Travel & Transport</option>
                <option value="hotel">Hotels & Lodges</option>
                <option value="gift">Gifts & Souvenirs</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700 select-none">
                <input 
                  type="checkbox" 
                  checked={formData.premium} 
                  onChange={e => setFormData({ ...formData, premium: e.target.checked })} 
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" 
                />
                Premium / Sponsored Tier
              </label>
            </div>
          </div>

          {/* Contact and Timings Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Phone size={14} />
                </span>
                <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <MessageCircle size={14} />
                </span>
                <input type="text" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="919876543210 (with country code)" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Rating (0.0 to 5.0)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                </span>
                <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="4.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Reviews Count</label>
              <input type="number" min="0" value={formData.reviews_count} onChange={e => setFormData({ ...formData, reviews_count: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="45" />
            </div>
          </div>

          {/* Description & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Description & Services</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Items sold, special offers, working hours, etc..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Shop Address / Landmark</label>
              <textarea required rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="e.g. Shop 24, Near Sabir Piya Main Gate, Kaliyar Sharif" />
            </div>
          </div>

          {/* Premium Image Upload Component */}
          <div className="bg-white p-5 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Image size={14} className="text-primary" /> Vendor Photo / Shop Image
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
                  value={formData.logo_url} 
                  onChange={e => setFormData({ ...formData, logo_url: e.target.value })} 
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                  placeholder="e.g. https://images.unsplash.com/photo-..." 
                />
              </div>
            )}

            {/* Image Preview Window */}
            {formData.logo_url && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-4 animate-fadeIn">
                <img 
                  src={formData.logo_url} 
                  alt="Uploaded Shop Preview" 
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300/60 shadow-sm"
                  onError={(e) => { e.target.src = 'https://placehold.co/100?text=Invalid+Image'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">Selected Image Path:</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{formData.logo_url}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, logo_url: '' })} 
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
              {isEditing ? 'Save Changes' : 'Publish Listing'}
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
            placeholder="Search shops by name, services, or address..." 
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
            { id: 'attar', label: 'Attar' },
            { id: 'chadar', label: 'Chadar' },
            { id: 'restaurant', label: 'Food' },
            { id: 'transport', label: 'Transport' },
            { id: 'hotel', label: 'Stay' },
            { id: 'gift', label: 'Gifts' }
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
          <span className="text-xs font-bold text-gray-400">Fetching vendor listings...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-150">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 text-gray-800 font-bold border-b border-gray-150">
              <tr>
                <th className="px-6 py-4">Shop & Vendor Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Contacts</th>
                <th className="px-6 py-4">Rating & Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredBusinesses.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {b.logo_url ? (
                        <img 
                          src={b.logo_url} 
                          alt={b.name} 
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200/80 flex-shrink-0 shadow-sm"
                          onError={(e) => { e.target.src = 'https://placehold.co/100?text=No+Photo'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center text-[10px] font-bold border border-dashed border-gray-200 flex-shrink-0">
                          <Image size={16} className="text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="truncate">{b.name}</span>
                          {(b.premium === 1 || b.premium === true) && (
                            <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5 flex-shrink-0" title="Premium Featured Listing">
                              <Star size={10} className="fill-amber-500 text-amber-500" /> Premium
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{b.description || b.desc}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider text-[10px] ${getCategoryColor(b.category)}`}>
                      {getCategoryLabel(b.category)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
                        <Phone size={12} className="text-primary flex-shrink-0" />
                        <span>{b.phone || 'N/A'}</span>
                      </div>
                      {b.whatsapp && (
                        <div className="flex items-center gap-1 text-[11px] text-green-600 font-medium">
                          <MessageCircle size={12} className="text-green-500 flex-shrink-0" />
                          <span>{b.whatsapp}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                          <Star size={12} className="fill-amber-500" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">{parseFloat(b.rating || 0).toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400 font-medium">({b.reviews_count || 0} reviews)</span>
                      </div>
                      {b.address && (
                        <div className="text-[11px] text-gray-400 font-medium line-clamp-1 max-w-[200px]" title={b.address}>
                          <MapPin size={10} className="inline mr-0.5 text-gray-300" />
                          {b.address}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(b)} 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all" 
                        title="Edit Details"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)} 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all" 
                        title="Delete Listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBusinesses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400 font-medium">
                    No vendor listings matched your search query or filter.
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
