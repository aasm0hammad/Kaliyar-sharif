import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../api';

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title_en: '', content_en: '', type: 'News' });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get('/news');
      setNews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Setup payload and format dates appropriately for backend
      const payload = {
        ...formData,
        title_hi: '',
        title_ur: '',
        date_posted: new Date().toISOString().split('T')[0]
      };
      await api.post('/news', payload);
      setIsAdding(false);
      setFormData({ title_en: '', content_en: '', type: 'News' });
      fetchNews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this announcement?')) {
      try {
        await api.delete(`/news/${id}`);
        fetchNews();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">Manage News & Announcements</h2>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-1">
            <Plus size={16} /> Add Announcement
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-gray-50 rounded-lg border">
          <input required type="text" placeholder="Title" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full border p-2 rounded text-sm bg-white" />
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border p-2 rounded text-sm bg-white">
            <option value="News">News</option>
            <option value="Announcement">Announcement</option>
            <option value="Update">Update</option>
          </select>
          <textarea required placeholder="Content details..." value={formData.content_en} onChange={e => setFormData({...formData, content_en: e.target.value})} rows="4" className="w-full border p-2 rounded text-sm bg-white"></textarea>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold">Post</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-200 px-4 py-2 rounded text-sm font-bold">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-400">{n.date_posted ? new Date(n.date_posted).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold">{n.type}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">{n.title_en || n.title}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr><td colSpan="4" className="text-center py-4 text-gray-400">No announcements posted.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
