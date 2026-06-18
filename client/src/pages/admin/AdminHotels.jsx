import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, Star, MapPin, Phone, ShieldCheck, X, Upload, Image } from 'lucide-react';
import api from '../../api';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Image upload state
  const [imgInputMethod, setImgInputMethod] = useState('upload'); // 'upload', 'url'
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    name: '',
    category: 'budget',
    price: 1200,
    rating: 4.5,
    reviews: 25,
    distance: '300m',
    img_url: '',
    video_url: '',
    gallery_images: [],
    phone: '+91 ',
    amenities: ['Free WiFi', 'Room Service'],
    featured: false
  };

  const [formData, setFormData] = useState(initialFormState);

  // Default amenity list options
  const amenityOptions = [
    'Free WiFi',
    'Air Conditioning',
    'Room Service',
    'Attached Bathroom',
    'CCTV Security',
    'Power Backup',
    '24/7 Hot Water',
    'Parking Area',
    'Television'
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hotels');
      setHotels(res.data);
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
      setFormData(prev => {
        if (!prev.img_url) {
          return { ...prev, img_url: res.data.url };
        } else {
          return { ...prev, gallery_images: [...prev.gallery_images, res.data.url] };
        }
      });
      setUploadingImage(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  const handleEditClick = (hotel) => {
    let parsedAmenities = [];
    try {
      parsedAmenities = typeof hotel.amenities === 'string' 
        ? JSON.parse(hotel.amenities) 
        : (hotel.amenities || []);
    } catch (e) {
      parsedAmenities = [];
    }

    let parsedGallery = [];
    try {
      parsedGallery = typeof hotel.gallery_images === 'string'
        ? JSON.parse(hotel.gallery_images)
        : (hotel.gallery_images || []);
    } catch (e) {
      parsedGallery = [];
    }

    setFormData({
      name: hotel.name,
      category: hotel.category,
      price: hotel.price,
      rating: hotel.rating,
      reviews: hotel.reviews,
      distance: hotel.distance,
      img_url: hotel.img_url || '',
      video_url: hotel.video_url || '',
      gallery_images: parsedGallery,
      phone: hotel.phone || '',
      amenities: parsedAmenities,
      featured: hotel.featured === 1 || hotel.featured === true
    });
    setEditingId(hotel.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAmenityChange = (amenity) => {
    const current = [...formData.amenities];
    if (current.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: current.filter(a => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...current, amenity]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/hotels/${editingId}`, formData);
        setMessage('Hotel details updated successfully!');
      } else {
        await api.post('/hotels', formData);
        setMessage('New hotel added successfully!');
      }
      handleCancel();
      fetchHotels();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await api.delete(`/hotels/${id}`);
      setMessage('Hotel removed successfully.');
      fetchHotels();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Manage Hotels & Stays</h2>
          <p className="text-xs text-gray-500 mt-0.5">Add, update, and manage visitor lodges and guest rooms around Kaliyar Sharif.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => { setShowForm(true); setIsEditing(false); setFormData(initialFormState); }}
            className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-1.5 transition-colors"
          >
            <Plus size={16} /> Add Hotel
          </button>
        )}
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-bold mb-6 flex items-center gap-2">
          <Check size={16} /> {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 mb-8 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <h3 className="font-bold text-gray-800 text-base">{isEditing ? 'Edit Hotel Details' : 'Add New Hotel'}</h3>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Hotel Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="e.g. Sabri Guest House" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white">
                <option value="budget">Budget Hotel</option>
                <option value="family">Family Lodge</option>
                <option value="guesthouse">Guest House</option>
                <option value="dargah">Dargah Accommodation</option>
                <option value="ac">Premium AC Room</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Price per Night (₹)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="1200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Distance from Dargah</label>
              <input required type="text" value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="e.g. 150m or 5 mins walk" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Contact Phone</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="e.g. +91 9876543210" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Rating (1.0 to 5.0)</label>
              <input required type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0.0})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="4.5" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Review Count</label>
              <input required type="number" value={formData.reviews} onChange={e => setFormData({...formData, reviews: parseInt(e.target.value) || 0})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" placeholder="48" />
            </div>
          </div>

          {/* Visual Media Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Image size={14} className="text-primary" /> Visual Media & Features
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex gap-4 border-b pb-2 text-xs mb-3">
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
                  <>
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
                            <span className="text-xs font-bold text-gray-500">Uploading photo...</span>
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
                    <div className="mt-2 text-[10px] text-gray-400 text-center">First image becomes thumbnail. Additional images add to gallery.</div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Image Web Address (URL)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        id="img_url_input"
                        className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                        placeholder="e.g. https://images.unsplash.com/photo-..." 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const val = document.getElementById('img_url_input').value;
                          if (val) {
                            if (!formData.img_url) {
                              setFormData({ ...formData, img_url: val });
                            } else {
                              setFormData({ ...formData, gallery_images: [...formData.gallery_images, val] });
                            }
                            document.getElementById('img_url_input').value = '';
                          }
                        }}
                        className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-primary-light"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-1 text-[10px] text-gray-400">First image becomes thumbnail. Additional images add to gallery.</div>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Video URL (YouTube/MP4)</label>
                  <input 
                    type="text" 
                    value={formData.video_url} 
                    onChange={e => setFormData({ ...formData, video_url: e.target.value })} 
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                    placeholder="e.g. https://youtube.com/watch?v=..." 
                  />
                  <p className="text-[10px] text-gray-400 mt-1">This video will be displayed on the hotel details page.</p>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-gray-700">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer" />
                    Featured / Starred Lodge
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1 ml-6">Featured lodges are highlighted and shown at the top of lists.</p>
                </div>

                {formData.img_url && (
                  <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50 flex items-center gap-3 animate-fadeIn">
                    <img 
                      src={formData.img_url} 
                      alt="Thumbnail Preview" 
                      className="w-14 h-14 object-cover rounded-lg border shadow-xs"
                      onError={(e) => { e.target.src = 'https://placehold.co/100?text=Invalid+Image'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Thumbnail</span>
                      <p className="text-[9px] text-gray-400 font-mono truncate mt-1">{formData.img_url}</p>
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
                
                {formData.gallery_images && formData.gallery_images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.gallery_images.map((gImg, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                        <img src={gImg} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            const newGallery = [...formData.gallery_images];
                            newGallery.splice(idx, 1);
                            setFormData({ ...formData, gallery_images: newGallery });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Hotel Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {amenityOptions.map(amenity => (
                <label key={amenity} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors text-xs font-bold ${formData.amenities.includes(amenity) ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'}`}>
                  <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="hidden" />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t mt-4">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow transition-colors">
              {isEditing ? 'Save Changes' : 'Save Hotel'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading hotel database...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 font-bold border-b border-gray-150">
              <tr>
                <th className="px-6 py-4">Hotel Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price per Night</th>
                <th className="px-6 py-4">Rating & Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hotels.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {h.img_url ? (
                        <img src={h.img_url} alt={h.name} className="w-12 h-12 object-cover rounded-lg border flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0">No Img</div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-800">{h.name}</span>
                          {(h.featured === 1 || h.featured === true) && (
                            <span className="bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck size={10} /> Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-0.5"><MapPin size={12} className="text-primary"/> {h.distance} from Dargah</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full uppercase font-bold border border-gray-200">
                      {h.category === 'ac' ? 'AC Rooms' : h.category === 'guesthouse' ? 'Guest House' : h.category === 'dargah' ? 'Dargah Accom.' : h.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-800 text-base">₹{h.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-bold text-primary text-xs">
                      {h.rating} <Star size={12} className="fill-primary text-primary" />
                      <span className="text-gray-400 font-medium">({h.reviews} reviews)</span>
                    </div>
                    {h.phone && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                        <Phone size={10} /> {h.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditClick(h)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Edit Hotel">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete Hotel">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {hotels.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">No hotels found. Click "Add Hotel" to add a new accommodation listing.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
