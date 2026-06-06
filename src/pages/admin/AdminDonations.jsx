import { useState, useEffect } from 'react';
import { DollarSign, Clock, Hash, Gift } from 'lucide-react';
import api from '../../api';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/donations')
      .then(res => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalRaised = donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Contributions</p>
            <h3 className="text-3xl font-black text-primary">₹{totalRaised.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">₹</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
            <h3 className="text-3xl font-black text-gray-800">{donations.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"><Hash size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Campaigns</p>
            <h3 className="text-3xl font-black text-purple-600">3</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Gift size={24} /></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Recent Donation Transactions</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading donation list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-800 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Campaign/Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donations.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-gray-800">{d.transaction_id || 'N/A'}</td>
                    <td className="px-6 py-4 capitalize font-semibold">{d.type}</td>
                    <td className="px-6 py-4 font-bold text-primary">₹{d.amount}</td>
                    <td className="px-6 py-4 flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={12} /> {d.created_at ? new Date(d.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                        {d.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400">No donations received yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
