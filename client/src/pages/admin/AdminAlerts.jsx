import { useState, useEffect } from 'react';
import { Trash2, PlusCircle, Bell, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import api from '../../api';

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/admin/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.put(`/admin/alerts/${id}/toggle`, { is_active: !currentStatus });
      fetchAlerts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alert permanently?')) return;
    try {
      await api.delete(`/admin/alerts/${id}`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/alerts', formData);
      setIsModalOpen(false);
      setFormData({ title: '', message: '', type: 'info' });
      fetchAlerts();
    } catch (err) {
      alert('Failed to create alert');
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="text-primary" /> Push Notifications & Alerts
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} /> Add New Alert
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-500">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
            No alerts found. Create one to notify your visitors.
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`p-5 rounded-2xl border flex items-start justify-between gap-4 transition-all ${alert.is_active ? 'bg-white shadow-sm border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl mt-1 ${
                  alert.type === 'emergency' ? 'bg-red-100 text-red-600' :
                  alert.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                  alert.type === 'success' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {alert.type === 'emergency' ? <AlertOctagon size={24} /> :
                   alert.type === 'warning' ? <AlertTriangle size={24} /> :
                   <Info size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{alert.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${alert.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{alert.message}</p>
                  <div className="text-xs text-gray-400 font-semibold">
                    Posted on: {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <label className="flex items-center cursor-pointer relative">
                  <input type="checkbox" className="sr-only" checked={alert.is_active} onChange={() => handleToggle(alert.id, alert.is_active)} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${alert.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${alert.is_active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </label>
                <button onClick={() => handleDelete(alert.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors mt-2" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">Create Push Notification</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1.5 shadow-sm">
                <Trash2 size={18} className="hidden" /> {/* just spacing */}
                <span className="font-bold px-2">X</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Alert Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary font-semibold">
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning / Urs Schedule (Orange)</option>
                  <option value="emergency">Emergency / Alert (Red)</option>
                  <option value="success">Success / Good News (Green)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary" placeholder="e.g. Urs Schedule Updated" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                <textarea required rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-primary resize-none" placeholder="Alert details..."></textarea>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg mt-2">
                Publish Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
