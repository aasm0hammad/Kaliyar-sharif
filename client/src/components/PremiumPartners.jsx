import { useState, useEffect } from 'react';
import { Crown, ArrowRight, Star } from 'lucide-react';
import api from '../api';

export default function PremiumPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/businesses')
      .then(res => {
        const premiumOnes = res.data.filter(b => b.premium === 1 || b.premium === true);
        const mapped = premiumOnes.map(p => ({
          id: p.id,
          name: p.name,
          subtitle: p.description || 'Premium Business Partner',
          btn: p.category === 'hotel' ? 'Book Now' : p.category === 'transport' ? 'Call Now' : 'Visit Now',
          img: p.logo_url || 'https://images.unsplash.com/photo-1561489413-985b06da5bee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          rating: p.rating || 5.0
        }));
        setPartners(mapped);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-900 via-[#0a0f18] to-black py-24 relative overflow-hidden mt-16 mb-0">
      {/* Decorative Gold Blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
            <Crown size={16} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Exclusive Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm">Premium Partners</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover the most trusted and highly-rated businesses providing top-tier services and exclusive experiences for ziyareen.
          </p>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[320px] md:min-w-[380px] h-[400px] bg-white/5 border border-white/10 rounded-3xl animate-pulse flex-shrink-0"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory scrollbar-hide px-4 -mx-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style dangerouslySetInnerHTML={{__html: `
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}} />
            
            {partners.map((partner) => (
              <div 
                key={partner.id} 
                className="group snap-center min-w-[320px] md:min-w-[400px] flex-shrink-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all duration-500 overflow-hidden flex flex-col shadow-2xl hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.2)] hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="h-56 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/20 to-transparent z-10"></div>
                  <img 
                    src={partner.img} 
                    alt={partner.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  <div className="absolute top-5 right-5 z-20 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">{parseFloat(partner.rating).toFixed(1)}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col relative bg-gradient-to-b from-[#0a0f18] to-transparent">
                  {/* Subtle top reflection */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed">
                    {partner.subtitle}
                  </p>
                  
                  <div className="mt-auto">
                    <button className="w-full relative overflow-hidden bg-white/5 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 group/btn border border-white/10 hover:border-transparent shadow-[0_0_0_0_rgba(251,191,36,0)] hover:shadow-[0_10px_20px_-10px_rgba(251,191,36,0.5)]">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {partner.btn}
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {partners.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-24 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 border-dashed mx-auto max-w-2xl">
                <div className="bg-white/5 p-6 rounded-full mb-6">
                  <Crown size={56} className="text-white/20" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-3">No Premium Partners</h3>
                <p className="text-gray-500 text-center max-w-sm mb-8">We are currently updating our exclusive directory. Become the first to be listed here!</p>
                <button className="bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-gray-900 border border-amber-500/30 hover:border-amber-500 px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)]">
                  Promote Your Business
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
