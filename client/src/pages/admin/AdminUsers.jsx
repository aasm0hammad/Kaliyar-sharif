import { useState, useEffect } from 'react';
import { Users, Mail, Clock, Search, MapPin, Phone, ShieldCheck, Trash2, Edit2, X } from 'lucide-react';
import api from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = () => {
    api.get('/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/users/${editingUser.id}/profile`, editingUser);
      // Update local state to reflect changes
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editingUser } : u));
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.phone && u.phone.includes(term)) ||
      (u.state && u.state.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden flex flex-col h-full min-h-[500px]">
      
      {/* Header & Controls */}
      <div className="p-6 border-b border-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-white/50 flex items-center justify-center text-primary shadow-sm">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">User Management</h2>
            <p className="text-xs font-bold text-gray-500 mt-1">Total {users.length} registered users</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, or state..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-3 w-full md:w-[320px] bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl text-sm focus:outline-primary focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-white/40 backdrop-blur-md text-gray-800 font-black sticky top-0 z-10 shadow-sm border-b border-white/50">
              <tr>
                <th className="px-6 py-5 uppercase tracking-wider text-[11px] text-gray-500">User Details</th>
                <th className="px-6 py-5 uppercase tracking-wider text-[11px] text-gray-500">Contact Info</th>
                <th className="px-6 py-5 uppercase tracking-wider text-[11px] text-gray-500">Location</th>
                <th className="px-6 py-5 uppercase tracking-wider text-[11px] text-gray-500">Status & Joined</th>
                <th className="px-6 py-5 uppercase tracking-wider text-[11px] text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/60 transition-colors group">
                  
                  {/* User Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-[15px] leading-tight">{u.name}</p>
                        <p className="text-[11px] font-bold text-gray-400 mt-0.5">ID: #{u.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="font-medium text-[13px]">{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <span className="font-medium text-[13px]">{u.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {u.state || u.district || u.city ? (
                        <>
                          <div className="flex items-center gap-1.5 text-gray-800 font-bold text-[13px]">
                            <MapPin size={14} className="text-primary" />
                            {u.city || u.district || u.state}
                          </div>
                          {(u.state && u.state !== (u.city || u.district)) && (
                            <span className="text-[11px] font-bold text-gray-400 ml-5">{u.state}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 italic">Location not provided</span>
                      )}
                    </div>
                  </td>

                  {/* Status & Joined */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-bold border border-green-200">
                        <ShieldCheck size={12} /> Active
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                        <Clock size={12} /> 
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditingUser(u)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/50 border border-white/60 shadow-inner mb-4">
                      <Users size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-bold text-lg">No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Modal - Glassmorphism */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setEditingUser(null)} 
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Edit2 size={20} /></div> Edit User Profile
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input type="text" name="name" value={editingUser.name || ''} onChange={handleEditChange} required className="w-full px-4 py-3 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-primary focus:bg-white shadow-sm text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input type="email" value={editingUser.email || ''} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-400 cursor-not-allowed text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
                  <input type="text" name="phone" value={editingUser.phone || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-primary focus:bg-white shadow-sm text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">State</label>
                  <input type="text" name="state" value={editingUser.state || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-primary focus:bg-white shadow-sm text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">District</label>
                  <input type="text" name="district" value={editingUser.district || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-primary focus:bg-white shadow-sm text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">City</label>
                  <input type="text" name="city" value={editingUser.city || ''} onChange={handleEditChange} className="w-full px-4 py-3 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl focus:outline-primary focus:bg-white shadow-sm text-sm transition-all" />
                </div>
              </div>
              <div className="pt-6 border-t border-white/40 flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-white/60 rounded-xl transition-all shadow-sm border border-white/60">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-3 text-sm font-bold bg-gradient-to-r from-primary to-primary-light text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2 border border-primary/20">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
