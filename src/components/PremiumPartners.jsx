import { useState, useEffect } from 'react';
import api from '../api';

export default function PremiumPartners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.get('/businesses')
      .then(res => {
        const premiumOnes = res.data.filter(b => b.premium === 1 || b.premium === true);
        const mapped = premiumOnes.map(p => ({
          id: p.id,
          name: p.name,
          subtitle: p.description || 'Premium Partner',
          btn: p.category === 'hotel' ? 'Book Now' : p.category === 'transport' ? 'Call Now' : 'Visit Now',
          img: p.logo_url || 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        }));
        setPartners(mapped);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-8">
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm">
        <div className="flex items-center gap-6 overflow-x-auto pb-2">
          
          {/* Header Title in Row */}
          <div className="min-w-[180px] flex-shrink-0 border-r border-gray-100 pr-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <span className="text-secondary text-lg leading-none">+</span>
              Our Premium Partners
            </h2>
            <p className="text-[11px] text-gray-500 font-medium mt-1">Promote Your Business</p>
          </div>

          {/* Partner Cards */}
          <div className="flex gap-4 flex-1">
            {partners.map(partner => (
              <div key={partner.id} className="flex gap-3 min-w-[240px] items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={partner.img} alt={partner.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-gray-800 truncate">{partner.name}</h3>
                  <p className="text-[10px] text-gray-500 mb-1.5 truncate">{partner.subtitle}</p>
                  <button className="text-[10px] border border-gray-300 text-gray-600 px-3 py-1 rounded font-semibold hover:border-primary hover:text-primary transition-colors">
                    {partner.btn}
                  </button>
                </div>
              </div>
            ))}
            {partners.length === 0 && (
              <div className="text-xs text-gray-400 py-3">No premium partners listed.</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
