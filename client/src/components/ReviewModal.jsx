import { useState, useEffect } from 'react';
import { X, Star, User } from 'lucide-react';
import api from '../api';

export default function ReviewModal({ isOpen, onClose, itemType, itemId, itemName, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      fetchReviews();
      
      // Reset form
      setRating(5);
      setReviewText('');
    }
  }, [isOpen, itemId, itemType]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reviews/${itemType}/${itemId}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review.');
    
    try {
      setSubmitting(true);
      await api.post('/reviews', {
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        rating,
        review_text: reviewText
      });
      await fetchReviews();
      setReviewText('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Reviews & Ratings</h2>
            <p className="text-sm text-gray-500 font-semibold">{itemName}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full flex items-center justify-center shadow-sm transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Write a Review Section */}
          <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Write a Review</h3>
            {user ? (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={28} 
                        className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} transition-colors`} 
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-gray-500">{rating} out of 5</span>
                </div>
                
                <textarea
                  required
                  rows="3"
                  placeholder="Share your experience (e.g., The service was excellent...)"
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-primary focus:border-primary resize-none mb-4 text-sm"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 bg-white rounded-xl border border-blue-50">
                <p className="text-gray-500 text-sm font-semibold mb-3">You must be logged in to post a review.</p>
                <a href="/auth" className="inline-block bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-primary-light transition-colors">Login / Register</a>
              </div>
            )}
          </div>

          {/* Existing Reviews List */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              All Reviews <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{reviews.length}</span>
            </h3>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Star size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-semibold">No reviews yet.</p>
                <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                          {rev.user_name?.charAt(0).toUpperCase() || <User size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{rev.user_name}</div>
                          <div className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={rev.rating >= star ? 'fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                      </div>
                    </div>
                    {rev.review_text && (
                      <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                        "{rev.review_text}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
