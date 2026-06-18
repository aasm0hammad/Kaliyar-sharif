import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, AlertOctagon } from 'lucide-react';
import api from '../api';

export default function AlertBanner() {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts/active');
      const activeAlerts = res.data;
      
      // Filter out dismissed alerts
      const dismissedIds = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
      const visibleAlerts = activeAlerts.filter(a => !dismissedIds.includes(a.id));
      
      setAlerts(visibleAlerts);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  const dismissAlert = (id) => {
    const dismissedIds = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
    dismissedIds.push(id);
    localStorage.setItem('dismissedAlerts', JSON.stringify(dismissedIds));
    setAlerts(alerts.filter(a => a.id !== id));
  };

  if (alerts.length === 0) return null;

  const getAlertConfig = (type) => {
    switch(type) {
      case 'emergency': return { bg: 'bg-red-500', icon: <AlertOctagon size={20} className="text-white" /> };
      case 'warning': return { bg: 'bg-orange-500', icon: <AlertTriangle size={20} className="text-white" /> };
      case 'success': return { bg: 'bg-green-500', icon: <CheckCircle size={20} className="text-white" /> };
      default: return { bg: 'bg-blue-600', icon: <Info size={20} className="text-white" /> }; // info
    }
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full md:w-[400px]">
      {alerts.map(alert => {
        const config = getAlertConfig(alert.type);
        return (
          <div key={alert.id} className={`${config.bg} text-white rounded-xl shadow-2xl p-4 pr-12 relative animate-fade-in-up border border-white/20 backdrop-blur-md`}>
            <button 
              onClick={() => dismissAlert(alert.id)}
              className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg shrink-0 mt-0.5">
                {config.icon}
              </div>
              <div>
                <h4 className="font-bold text-base leading-tight mb-1">{alert.title}</h4>
                <p className="text-sm text-white/90 leading-snug font-medium">{alert.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
