import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Car, Bus, Bike, Train } from 'lucide-react';
import api from '../../api';

export default function AdminParkingTransport() {
  const [parking, setParking] = useState([]);
  const [transport, setTransport] = useState([]);
  const [isAddingParking, setIsAddingParking] = useState(false);
  const [isAddingTransport, setIsAddingTransport] = useState(false);
  
  const [parkingForm, setParkingForm] = useState({ name: '', type: 'car', capacity: 0, available_slots: 0, rate: 0, distance: '' });
  const [transportForm, setTransportForm] = useState({ route: '', distance: '', fare_min: 0, fare_max: 0, type: 'bus' });

  const [editingParkingId, setEditingParkingId] = useState(null);
  const [editSlots, setEditSlots] = useState(0);
  const [editCapacity, setEditCapacity] = useState(0);
  const [editRate, setEditRate] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const parkRes = await api.get('/parking');
      const transRes = await api.get('/transport');
      setParking(parkRes.data);
      setTransport(transRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddParking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/parking', parkingForm);
      setIsAddingParking(false);
      setParkingForm({ name: '', type: 'car', capacity: 0, available_slots: 0, rate: 0, distance: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteParking = async (id) => {
    if (confirm('Delete this parking lot?')) {
      try {
        await api.delete(`/parking/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEditParking = (p) => {
    setEditingParkingId(p.id);
    setEditSlots(p.available_slots);
    setEditCapacity(p.capacity);
    setEditRate(p.rate);
  };

  const handleSaveParking = async (id) => {
    try {
      await api.put(`/parking/${id}`, {
        available_slots: editSlots,
        capacity: editCapacity,
        rate: editRate
      });
      setEditingParkingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTransport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transport', transportForm);
      setIsAddingTransport(false);
      setTransportForm({ route: '', distance: '', fare_min: 0, fare_max: 0, type: 'bus' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransport = async (id) => {
    if (confirm('Delete this transport route?')) {
      try {
        await api.delete(`/transport/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Parking Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Manage Parking Lots</h2>
          {!isAddingParking && (
            <button onClick={() => setIsAddingParking(true)} className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-1">
              <Plus size={16} /> Add Parking Lot
            </button>
          )}
        </div>

        {isAddingParking ? (
          <form onSubmit={handleAddParking} className="space-y-4 max-w-md mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-bold text-sm text-gray-700">Add New Parking</h3>
            <input required type="text" placeholder="Parking Name" value={parkingForm.name} onChange={e => setParkingForm({...parkingForm, name: e.target.value})} className="w-full border p-2 rounded text-sm bg-white" />
            <select value={parkingForm.type} onChange={e => setParkingForm({...parkingForm, type: e.target.value})} className="w-full border p-2 rounded text-sm bg-white">
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="bus">Bus</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input required type="number" placeholder="Capacity" value={parkingForm.capacity} onChange={e => setParkingForm({...parkingForm, capacity: Number(e.target.value), available_slots: Number(e.target.value)})} className="border p-2 rounded text-sm bg-white" />
              <input required type="number" placeholder="Rate (₹)" value={parkingForm.rate} onChange={e => setParkingForm({...parkingForm, rate: Number(e.target.value)})} className="border p-2 rounded text-sm bg-white" />
            </div>
            <input required type="text" placeholder="Distance (e.g. 300m)" value={parkingForm.distance} onChange={e => setParkingForm({...parkingForm, distance: e.target.value})} className="w-full border p-2 rounded text-sm bg-white" />
            <div className="flex gap-2">
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold">Save</button>
              <button type="button" onClick={() => setIsAddingParking(false)} className="bg-gray-200 px-4 py-2 rounded text-sm font-bold">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Occupancy</th>
                  <th className="px-4 py-3">Rate (₹)</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parking.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 uppercase text-xs flex items-center gap-1.5 mt-1">
                      {p.type === 'car' && <Car size={14} className="text-blue-500" />}
                      {p.type === 'bus' && <Bus size={14} className="text-green-500" />}
                      {p.type === 'bike' && <Bike size={14} className="text-orange-500" />}
                      {p.type}
                    </td>
                    <td className="px-4 py-3">
                      {editingParkingId === p.id ? (
                        <div className="flex items-center gap-1">
                          <input type="number" className="border w-16 p-1 rounded text-xs" value={editSlots} onChange={e => setEditSlots(Number(e.target.value))} />
                          <span>/</span>
                          <input type="number" className="border w-16 p-1 rounded text-xs" value={editCapacity} onChange={e => setEditCapacity(Number(e.target.value))} />
                        </div>
                      ) : (
                        <span>{p.available_slots} / {p.capacity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingParkingId === p.id ? (
                        <input type="number" className="border w-20 p-1 rounded text-xs" value={editRate} onChange={e => setEditRate(Number(e.target.value))} />
                      ) : (
                        <span>₹{p.rate}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.distance}</td>
                    <td className="px-4 py-3 text-right">
                      {editingParkingId === p.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSaveParking(p.id)} className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditingParkingId(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button onClick={() => startEditParking(p)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteParking(p.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {parking.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-4 text-gray-400">No parking lots registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transport Display & Management */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Transport Routes</h2>
          {!isAddingTransport && (
            <button onClick={() => setIsAddingTransport(true)} className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-1">
              <Plus size={16} /> Add Route
            </button>
          )}
        </div>

        {isAddingTransport ? (
          <form onSubmit={handleAddTransport} className="space-y-4 max-w-md mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-bold text-sm text-gray-700">Add New Route</h3>
            <input required type="text" placeholder="Route (e.g. Roorkee → Kaliyar)" value={transportForm.route} onChange={e => setTransportForm({...transportForm, route: e.target.value})} className="w-full border p-2 rounded text-sm bg-white" />
            <input required type="text" placeholder="Distance (e.g. 25 km)" value={transportForm.distance} onChange={e => setTransportForm({...transportForm, distance: e.target.value})} className="w-full border p-2 rounded text-sm bg-white" />
            <div className="grid grid-cols-2 gap-2">
              <input required type="number" placeholder="Min Fare (₹)" value={transportForm.fare_min} onChange={e => setTransportForm({...transportForm, fare_min: Number(e.target.value)})} className="border p-2 rounded text-sm bg-white" />
              <input required type="number" placeholder="Max Fare (₹)" value={transportForm.fare_max} onChange={e => setTransportForm({...transportForm, fare_max: Number(e.target.value)})} className="border p-2 rounded text-sm bg-white" />
            </div>
            <select value={transportForm.type} onChange={e => setTransportForm({...transportForm, type: e.target.value})} className="w-full border p-2 rounded text-sm bg-white">
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="taxi">Taxi</option>
              <option value="auto">Auto</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold">Save</button>
              <button type="button" onClick={() => setIsAddingTransport(false)} className="bg-gray-200 px-4 py-2 rounded text-sm font-bold">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Vehicle Type</th>
                  <th className="px-4 py-3">Estimated Fare</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transport.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold">{t.route}</td>
                    <td className="px-4 py-3">{t.distance}</td>
                    <td className="px-4 py-3 uppercase text-xs flex items-center gap-1.5 mt-1">
                      {t.type === 'bus' && <Bus size={14} className="text-green-500" />}
                      {t.type === 'train' && <Train size={14} className="text-blue-500" />}
                      {t.type === 'taxi' && <Car size={14} className="text-orange-500" />}
                      {t.type === 'auto' && <Car size={14} className="text-purple-500" />}
                      {t.type}
                    </td>
                    <td className="px-4 py-3 text-primary font-semibold">₹{t.fare_min} - ₹{t.fare_max}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDeleteTransport(t.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {transport.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-4 text-gray-400">No routes configured.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
