import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Image, Upload, Globe, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from 'lucide-react';
import api from '../../api';

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('en');
  const [imgInputMethod, setImgInputMethod] = useState('upload');
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    img_url: '',
    title_en: '',
    title_hi: '',
    title_ur: '',
    subtitle_en: '',
    subtitle_hi: '',
    subtitle_ur: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = () => {
    setLoading(true);
    api.get('/hero-slides/all')
      .then(res => { setSlides(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileData = new FormData();
    fileData.append('image', file);
    setUploadingImage(true);
    try {
      const res = await api.post('/upload', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, img_url: res.data.url }));
      setUploadingImage(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to upload image.');
      setUploadingImage(false);
    }
  };

  const handleEditClick = (slide) => {
    setFormData({
      img_url: slide.img_url || '',
      title_en: slide.title_en || '',
      title_hi: slide.title_hi || '',
      title_ur: slide.title_ur || '',
      subtitle_en: slide.subtitle_en || '',
      subtitle_hi: slide.subtitle_hi || '',
      subtitle_ur: slide.subtitle_ur || ''
    });
    setEditingId(slide.id);
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
    if (!formData.img_url) {
      alert('Please upload or provide an image URL for the slide.');
      return;
    }
    try {
      if (isEditing) {
        await api.put(`/hero-slides/${editingId}`, formData);
        setMessage('Slide updated successfully!');
      } else {
        await api.post('/hero-slides', formData);
        setMessage('Slide added successfully!');
      }
      handleCancel();
      fetchSlides();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to save slide.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    try {
      await api.delete(`/hero-slides/${id}`);
      setMessage('Slide deleted.');
      fetchSlides();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error(err); }
  };

  const handleToggleActive = async (id, currentVal) => {
    try {
      await api.put(`/hero-slides/${id}/toggle`, { is_active: !currentVal });
      setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentVal ? 1 : 0 } : s));
      setMessage(!currentVal ? 'Slide activated.' : 'Slide deactivated.');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) { console.error(err); }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newSlides = [...slides];
    [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
    setSlides(newSlides);
    try {
      await api.put('/hero-slides/reorder', { orderedIds: newSlides.map(s => s.id) });
    } catch (err) { console.error(err); }
  };

  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    setSlides(newSlides);
    try {
      await api.put('/hero-slides/reorder', { orderedIds: newSlides.map(s => s.id) });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hero Slider Manager</h2>
          <p className="text-xs text-gray-500 mt-1">Manage homepage banner images. Slides auto-rotate on the frontend. Drag to reorder, toggle visibility.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setIsEditing(false); setFormData(initialFormState); }}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow flex items-center justify-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Plus size={16} /> Add New Slide
          </button>
        )}
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-3 rounded-lg text-sm font-semibold mb-6 flex items-center gap-2 animate-fadeIn">
          <Check size={16} className="text-emerald-600" /> {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 mb-8 space-y-6 animate-fadeIn relative">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              {isEditing ? 'Edit Slide' : 'Add New Slide'}
            </h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full">
              <X size={18} />
            </button>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Image size={14} className="text-primary" /> Slide Image *
            </h4>

            <div className="flex gap-4 border-b pb-2 text-xs">
              <button type="button" onClick={() => setImgInputMethod('upload')}
                className={`pb-1.5 font-bold transition-all ${imgInputMethod === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                Upload Photo
              </button>
              <button type="button" onClick={() => setImgInputMethod('url')}
                className={`pb-1.5 font-bold transition-all ${imgInputMethod === 'url' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-gray-600'}`}>
                Paste Image Link
              </button>
            </div>

            {imgInputMethod === 'upload' ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer relative group">
                <input type="file" accept="image/*" onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center text-center pointer-events-none">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-gray-500">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-primary transition-colors mb-3 border">
                        <Upload size={20} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Choose a banner image</span>
                      <span className="text-xs text-gray-400 mt-1">Recommended: 1400×420px, PNG/JPG/WEBP, max 5MB</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Image URL</label>
                <input type="text" value={formData.img_url} onChange={e => setFormData({ ...formData, img_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://example.com/banner.jpg" />
              </div>
            )}

            {formData.img_url && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center gap-4 animate-fadeIn">
                <img src={formData.img_url} alt="Slide Preview"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-300/60 shadow-sm"
                  onError={(e) => { e.target.src = 'https://placehold.co/320x200?text=Invalid+Image'; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">Image Preview</p>
                  <p className="text-[10px] text-gray-400 font-mono truncate mt-0.5">{formData.img_url}</p>
                </div>
                <button type="button" onClick={() => setFormData({ ...formData, img_url: '' })}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Multilingual Title/Subtitle Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-gray-200">
              <button type="button" onClick={() => setActiveLangTab('en')}
                className={`py-2.5 px-4 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-all ${activeLangTab === 'en' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                <Globe size={14} /> English
              </button>
              <button type="button" onClick={() => setActiveLangTab('hi')}
                className={`py-2.5 px-4 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-all ${activeLangTab === 'hi' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                <span>🇮🇳</span> Hindi
              </button>
              <button type="button" onClick={() => setActiveLangTab('ur')}
                className={`py-2.5 px-4 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-all ${activeLangTab === 'ur' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                <span>🇵🇰</span> Urdu
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200/60 shadow-inner">
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Title (English)</label>
                    <input type="text" value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="e.g. Kaliyar Sharif Dargah" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Subtitle (English)</label>
                    <input type="text" value={formData.subtitle_en} onChange={e => setFormData({ ...formData, subtitle_en: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="e.g. Darbar-e-Aala Hazrat" />
                  </div>
                </div>
              )}
              {activeLangTab === 'hi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Title (Hindi)</label>
                    <input type="text" value={formData.title_hi} onChange={e => setFormData({ ...formData, title_hi: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="जैसे: कलियर शरीफ दरगाह" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Subtitle (Hindi)</label>
                    <input type="text" value={formData.subtitle_hi} onChange={e => setFormData({ ...formData, subtitle_hi: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="जैसे: दरबार-ए-आला हज़रत" />
                  </div>
                </div>
              )}
              {activeLangTab === 'ur' && (
                <div className="space-y-4" dir="rtl">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-right">عنوان (Urdu)</label>
                    <input type="text" value={formData.title_ur} onChange={e => setFormData({ ...formData, title_ur: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                      placeholder="مثال: کلیار شریف درگاہ" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider text-right">ذیلی عنوان (Urdu)</label>
                    <input type="text" value={formData.subtitle_ur} onChange={e => setFormData({ ...formData, subtitle_ur: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                      placeholder="مثال: دربارِ اعلیٰ حضرت" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-3 border-t">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow transition-colors">
              {isEditing ? 'Save Changes' : 'Add Slide'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Slides List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-gray-400">Loading slides...</span>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-bold text-sm">No hero slides added yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add New Slide" to create your first banner image.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">
              {slides.length} slide{slides.length !== 1 ? 's' : ''} total • {slides.filter(s => s.is_active).length} active
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Slides auto-rotate every 5 seconds on frontend</p>
          </div>

          {slides.map((slide, index) => {
            const isActive = !!slide.is_active;
            return (
              <div key={slide.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isActive ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-50'
              }`}>
                {/* Order Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isActive ? 'bg-primary text-white' : 'bg-gray-300 text-white'
                }`}>
                  {index + 1}
                </div>

                {/* Image Preview */}
                <img src={slide.img_url} alt={slide.title_en || 'Slide'}
                  className="w-28 h-16 object-cover rounded-lg border border-gray-200 shrink-0 shadow-sm"
                  onError={(e) => { e.target.src = 'https://placehold.co/280x160?text=No+Image'; }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-800 truncate">
                    {slide.title_en || 'Untitled Slide'}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                    {slide.subtitle_en || 'No subtitle'}
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {slide.title_hi && <span className="text-[9px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold">🇮🇳 Hindi</span>}
                    {slide.title_ur && <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold">🇵🇰 Urdu</span>}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move Up">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => handleMoveDown(index)} disabled={index === slides.length - 1}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors" title="Move Down">
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => handleToggleActive(slide.id, slide.is_active)}
                    className={`p-1.5 rounded transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`} title={isActive ? 'Deactivate' : 'Activate'}>
                    {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => handleEditClick(slide)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg transition-all" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(slide.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg transition-all" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
