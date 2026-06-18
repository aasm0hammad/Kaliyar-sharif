import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api';

export default function AdminLostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/admin/lost-found');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/lost-found/${id}/status`, { status });
      fetchItems();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/lost-found/${id}`);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-10 font-bold text-gray-500">Loading records...</div>;

  return (
    <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lost & Found Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 text-sm font-bold text-gray-600">ID</th>
              <th className="p-4 text-sm font-bold text-gray-600">Type</th>
              <th className="p-4 text-sm font-bold text-gray-600">Item Name</th>
              <th className="p-4 text-sm font-bold text-gray-600">Contact</th>
              <th className="p-4 text-sm font-bold text-gray-600">Status</th>
              <th className="p-4 text-sm font-bold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-white/60 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-500">#{item.id}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">{item.item_name}</div>
                  <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()} • {item.location}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{item.contact_name}</div>
                  <div className="text-xs text-gray-500">{item.contact_phone}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    item.status === 'approved' ? 'bg-green-100 text-green-600' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    item.status === 'resolved' ? 'bg-blue-100 text-blue-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(item.id, 'approved')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => handleUpdateStatus(item.id, 'rejected')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <button onClick={() => handleUpdateStatus(item.id, 'resolved')} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors">
                        Mark Resolved
                      </button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
