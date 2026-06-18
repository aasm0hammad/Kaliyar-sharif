import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Search, Filter, ShoppingBag, X, Package, CheckCircle2, XCircle, Tags, Pizza, Coffee, Image, Upload, Settings } from 'lucide-react';
import api from '../../api';

export default function AdminMart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('917248187225');
  const [savingSettings, setSavingSettings] = useState(false);

  const initialFormState = {
    name: '',
    category: 'CHICKEN ITEMS',
    price: '',
    quantity_info: '',
    is_available: true,
    img_url: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const categories = [
    'CHICKEN ITEMS', 'NON - VEG', 'VEG ITEMS', 'RICE', 'ROTI', 'PARATHA', 'FAST FOOD', 'PIZZA', 'DRINKS'
  ];

  useEffect(() => {
    fetchItems();
    fetchSettings();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mart-items');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings/mart_whatsapp_number');
      if (res.data.value) setWhatsappNumber(res.data.value);
    } catch (err) {
      console.error('Failed to fetch whatsapp setting:', err);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.put('/settings/mart_whatsapp_number', { value: whatsappNumber });
      setMessage('WhatsApp number updated successfully!');
      setShowSettings(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    }
    setSavingSettings(false);
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
      price: item.price,
      quantity_info: item.quantity_info || '',
      is_available: item.is_available === 1 || item.is_available === true,
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
      const payload = { ...formData, price: parseInt(formData.price) || 0 };
      if (isEditing) {
        await api.put(`/mart-items/${editingId}`, payload);
        setMessage('Mart item updated successfully!');
      } else {
        await api.post('/mart-items', payload);
        setMessage('Mart item added successfully!');
      }
      handleCancel();
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save item.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await api.delete(`/mart-items/${id}`);
      setMessage('Item removed successfully.');
      fetchItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      const updatedStatus = !(item.is_available === 1 || item.is_available === true);
      await api.put(`/mart-items/${item.id}`, {
        ...item,
        is_available: updatedStatus
      });
      // Update local state for immediate feedback
      setItems(items.map(i => i.id === item.id ? { ...i, is_available: updatedStatus } : i));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Analytics
  const totalItems = items.length;
  const inStock = items.filter(i => i.is_available === 1 || i.is_available === true).length;
  const outOfStock = totalItems - inStock;
  const categoriesCount = new Set(items.map(i => i.category)).size;

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'PIZZA': return <Pizza size={18} />;
      case 'DRINKS': return <Coffee size={18} />;
      default: return <ShoppingBag size={18} />;
    }
  };

  return (
    <div className="bg-transparent min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-primary/5 rounded-bl-full -z-10 pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-primary" size={28} />
            Kaliyar Mart Control
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage your grocery and food delivery catalog professionally.</p>
        </div>
        {!showForm && (
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Settings size={18} /> Settings
            </button>
            <button 
              onClick={() => { setShowForm(true); setIsEditing(false); setFormData(initialFormState); }}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary-light hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Plus size={18} /> Add New Item
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <Settings size={20} className="text-primary" /> Mart Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveSettings} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">WhatsApp Number for Orders</label>
                  <p className="text-xs text-gray-500 mb-2">Include country code without '+' (e.g., 917248187225)</p>
                  <input 
                    required 
                    type="text" 
                    value={whatsappNumber} 
                    onChange={e => setWhatsappNumber(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                    placeholder="91XXXXXXXXXX" 
                  />
                </div>
              </div>
              <button type="submit" disabled={savingSettings} className="w-full bg-primary hover:bg-primary-light text-white px-4 py-3 rounded-xl font-bold shadow-md transition-all">
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {!showForm && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Items</p>
              <p className="text-2xl font-black text-gray-800">{totalItems}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Stock</p>
              <p className="text-2xl font-black text-gray-800">{inStock}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Out of Stock</p>
              <p className="text-2xl font-black text-gray-800">{outOfStock}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tags size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
              <p className="text-2xl font-black text-gray-800">{categoriesCount}</p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 p-4 rounded-xl text-sm font-bold mb-6 flex items-center gap-3 shadow-sm animate-fadeIn">
          <div className="bg-emerald-500 text-white rounded-full p-1"><Check size={14} /></div> {message}
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        
        {showForm ? (
          <div className="p-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                {isEditing ? <><Edit2 className="text-blue-500" /> Modify Item Details</> : <><Plus className="text-primary" /> Add New Mart Item</>}
              </h3>
              <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item Image <span className="text-gray-400 normal-case">(Optional)</span></label>
                  <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="relative w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 overflow-hidden shadow-sm group">
                      {formData.img_url ? (
                        <>
                          <img src={formData.img_url} alt="Item Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                            <Trash2 size={20} className="text-white cursor-pointer" onClick={() => setFormData({...formData, img_url: ''})} />
                          </div>
                        </>
                      ) : (
                        <Image size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          disabled={uploadingImage}
                        />
                        <button type="button" className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${uploadingImage ? 'text-gray-400' : 'text-primary hover:bg-gray-50'}`}>
                          {uploadingImage ? (
                            <><div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div> Uploading...</>
                          ) : (
                            <><Upload size={16} /> Choose Image</>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Recommended: Square image (500x500px), Max size: 2MB.</p>
                      
                      <div className="mt-2 flex items-center gap-2">
                         <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
                         <input type="text" value={formData.img_url} onChange={e => setFormData({ ...formData, img_url: e.target.value })} className="flex-1 border border-gray-200 rounded-lg p-2 text-xs bg-white focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Paste image URL here" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-800" placeholder="e.g. Chicken Changezi" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-800 appearance-none">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border border-gray-200 rounded-xl py-3.5 pl-8 pr-4 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-800" placeholder="0.00" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity Info <span className="text-gray-400 normal-case">(Optional)</span></label>
                  <input type="text" value={formData.quantity_info} onChange={e => setFormData({ ...formData, quantity_info: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-800" placeholder="e.g. (Qtr), (Half), (1Kg)" />
                </div>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">Stock Availability</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Is this item currently available for ordering?</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.is_available} onChange={e => setFormData({ ...formData, is_available: e.target.checked })} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                </label>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button type="submit" className="bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 flex-1 md:flex-none">
                  {isEditing ? 'Save Changes' : 'Publish Item'}
                </button>
                <button type="button" onClick={handleCancel} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-3.5 rounded-xl font-bold text-sm transition-colors flex-1 md:flex-none">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Filter and Search controls */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/30">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative w-full lg:w-96">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search size={18} />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto">
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${selectedFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      All Items
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${selectedFilter === cat ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Syncing Database...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                      <th className="px-6 py-4 rounded-tl-2xl">Item Info</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock Status</th>
                      <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {item.img_url ? (
                              <img src={item.img_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm flex-shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 flex items-center justify-center border border-gray-200 group-hover:border-primary/30 group-hover:text-primary transition-colors flex-shrink-0 shadow-sm">
                                {getCategoryIcon(item.category)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-gray-800 text-sm group-hover:text-primary transition-colors">
                                {item.name} 
                                {item.quantity_info && <span className="text-xs text-gray-400 font-medium ml-2">{item.quantity_info}</span>}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1">ID: #{item.id.toString().padStart(4, '0')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-gray-200 uppercase tracking-wider bg-gray-50 text-gray-600 inline-block">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-black text-gray-800 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg inline-block border border-green-100/50">
                            ₹{item.price}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => toggleAvailability(item)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                              (item.is_available === 1 || item.is_available === true) 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {(item.is_available === 1 || item.is_available === true) ? <><CheckCircle2 size={14} /> In Stock</> : <><XCircle size={14} /> Sold Out</>}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(item)} className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit Item">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Delete Item">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-16 text-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Search size={32} />
                          </div>
                          <h4 className="text-gray-800 font-bold text-lg mb-1">No items found</h4>
                          <p className="text-gray-500 text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
