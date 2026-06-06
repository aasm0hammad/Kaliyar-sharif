import { useState, useEffect } from 'react';
import { Newspaper, BellRing, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function LatestUpdates() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    api.get('/news')
      .then(res => {
        // Take the latest 3 updates
        setUpdates(res.data.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-12">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
        <h2 className="text-xl font-bold text-gray-800 relative">
          Latest News & Updates
          <span className="absolute -bottom-2.5 left-0 w-12 h-1 bg-primary rounded-full"></span>
        </h2>
        <Link to="/news" className="text-sm font-bold text-primary hover:underline">View All News</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {updates.map(update => (
          <div key={update.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-primary hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider 
                ${update.type === 'Announcement' ? 'bg-orange-100 text-orange-600' : 
                  update.type === 'News' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {update.type}
              </span>
              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <BellRing size={12} /> {update.date_posted ? new Date(update.date_posted).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <h3 className="text-[15px] font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{update.title_en || update.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">{update.content_en || update.content}</p>
          </div>
        ))}
        {updates.length === 0 && (
          <div className="col-span-3 text-center py-6 text-gray-400">No news or updates at this time.</div>
        )}
      </div>
    </section>
  );
}
