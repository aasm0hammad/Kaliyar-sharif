import { useState, useEffect } from 'react';
import { BellRing, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function LatestUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news')
      .then(res => {
        setUpdates(res.data.slice(0, 3));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getTypeStyle = (type) => {
    switch(type) {
      case 'Announcement':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/30';
      case 'News':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30';
      case 'Alert':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30';
      default:
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30';
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-24 relative">
      {/* Decorative background blur */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Sparkles size={14} className="text-amber-500" /> Stay Informed
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">News & Updates</span>
          </h2>
        </div>
        <Link 
          to="/news" 
          className="group flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary transition-all duration-300 bg-white px-6 py-3 rounded-full border border-gray-200 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/10"
        >
          View All News
          <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/50 rounded-3xl h-72 border border-gray-100 shadow-sm animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {updates.map((update, index) => (
            <div 
              key={update.id} 
              className="group relative bg-white rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-primary/10 flex flex-col justify-between overflow-hidden z-10 h-full min-h-[320px]"
            >
              {/* Dynamic Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
              
              {/* Animated Top Border */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-[-100%] group-hover:translate-y-0"></div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md ${getTypeStyle(update.type)}`}>
                    {update.type || 'Update'}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <Calendar size={13} className="text-gray-400" /> 
                    {update.date_posted ? new Date(update.date_posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-snug">
                  {update.title_en || update.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {update.content_en || update.content}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 group-hover:border-primary/20 transition-colors">
                <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                  Read Full Story <ArrowRight size={16} className="text-primary" />
                </Link>
              </div>
              
              {/* Decorative Watermark Icon */}
              <div className="absolute -bottom-8 -right-8 text-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-12 pointer-events-none -z-10">
                <BellRing size={140} strokeWidth={1} />
              </div>
            </div>
          ))}

          {updates.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-dashed border-gray-300">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <BellRing className="text-gray-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No recent updates</h3>
              <p className="text-gray-500">Check back later for the latest news and announcements.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
