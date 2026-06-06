import { useState, useEffect } from 'react';
import { Users, Mail, Clock } from 'lucide-react';
import api from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-primary" size={24} />
        <h2 className="text-lg font-bold text-gray-800">Registered Users</h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading user database...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{u.name}</td>
                  <td className="px-6 py-4 flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {u.email}</td>
                  <td className="px-6 py-4 flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} /> {u.created_at ? new Date(u.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-400">No registered users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
