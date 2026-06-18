import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, LogIn, MailCheck, User, Phone, Calendar, Users,
  MessageSquare, ChevronRight, ShieldCheck, AlertCircle, Loader2
} from 'lucide-react';

export default function BookingModal({ hotel, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('check'); // 'check' | 'not-logged-in' | 'not-verified' | 'form' | 'success'

  // Form fields
  const [form, setForm] = useState({
    name: '',
    phone: '',
    checkin: '',
    checkout: '',
    guests: '1',
    requests: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (!raw) {
      setStep('not-logged-in');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
      // Pre-fill name and phone from user profile
      setForm(f => ({
        ...f,
        name: parsed.name || '',
        phone: parsed.phone || ''
      }));
      if (!parsed.is_verified) {
        setStep('not-verified');
      } else {
        setStep('form');
      }
    } catch {
      setStep('not-logged-in');
    }
  }, []);

  // Today date string for min date
  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Apna naam likhein';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Sahih 10-digit mobile number likhein';
    if (!form.checkin) e.checkin = 'Check-in date select karein';
    if (!form.checkout) e.checkout = 'Check-out date select karein';
    if (form.checkin && form.checkout && form.checkout <= form.checkin)
      e.checkout = 'Check-out date, Check-in se baad honi chahiye';
    if (!form.guests || parseInt(form.guests) < 1) e.guests = 'Guests ki tadad likhein';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const getNights = () => {
    if (!form.checkin || !form.checkout) return 0;
    const diff = (new Date(form.checkout) - new Date(form.checkin)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const nights = getNights();
    const total = nights * (hotel.price || 0);

    const msg = encodeURIComponent(
      `*Hotel Booking Request — Kaliyar Sharif Portal*\n\n` +
      `🏨 *Hotel:* ${hotel.name}\n` +
      `👤 *Name:* ${form.name}\n` +
      `📞 *Phone:* ${form.phone}\n` +
      `📧 *Email:* ${user?.email || 'N/A'}\n` +
      `📅 *Check-in:* ${form.checkin}\n` +
      `📅 *Check-out:* ${form.checkout}\n` +
      `🌙 *Nights:* ${nights}\n` +
      `👥 *Guests:* ${form.guests}\n` +
      `💰 *Estimated Total:* ₹${total.toLocaleString()}\n` +
      `📝 *Special Requests:* ${form.requests || 'None'}\n\n` +
      `_Sent via Kaliyar Sharif Portal_`
    );

    const phone = hotel.phone ? hotel.phone.replace(/[^0-9]/g, '') : '';

    setTimeout(() => {
      setSubmitting(false);
      setStep('success');
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    }, 800);
  };

  // ─── OVERLAY ──────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-emerald-600 text-white px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black leading-tight">Book Your Stay</h2>
            <p className="text-white/80 text-sm mt-0.5 font-medium line-clamp-1">{hotel.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0 ml-3"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Step: Not Logged In ──────────────────────────────────── */}
        {step === 'not-logged-in' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Login Zaruri Hai</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Hotel book karne ke liye pehle apna account login karein.<br />
              Agar account nahi hai to abhi register karein.
            </p>
            <button
              onClick={() => { onClose(); navigate('/auth'); }}
              className="w-full bg-primary hover:bg-primary-light text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              <LogIn size={18} /> Login / Register
            </button>
            <button onClick={onClose} className="mt-3 w-full py-3 text-sm text-gray-500 hover:text-gray-700 font-medium">
              Cancel
            </button>
          </div>
        )}

        {/* ── Step: Email Not Verified ─────────────────────────────── */}
        {step === 'not-verified' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Email Verify Karein</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              Hotel booking ke liye aapka email verified hona zaruri hai.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-blue-700 font-bold mb-1">📧 {user?.email}</p>
              <p className="text-xs text-blue-600">
                Is email par ek verification link bheja gaya hai. Apna inbox check karein aur link par click karein. Spam folder bhi check karein.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Email verify karne ke baad dobara login karein aur booking proceed karein.</p>
            </div>
            <button
              onClick={() => { onClose(); navigate('/auth'); }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <LogIn size={18} /> Dobara Login Karein
            </button>
            <button onClick={onClose} className="mt-3 w-full py-3 text-sm text-gray-500 hover:text-gray-700 font-medium">
              Cancel
            </button>
          </div>
        )}

        {/* ── Step: Booking Form ───────────────────────────────────── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Verified badge */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
              <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-bold">Verified User — {user?.email}</p>
            </div>

            {/* Price info */}
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Starting Price</span>
                <span className="text-xl font-black text-primary">₹{hotel.price}<span className="text-xs font-normal text-gray-500">/night</span></span>
              </div>
              {getNights() > 0 && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/10">
                  <span className="text-sm text-gray-600">{getNights()} night{getNights() > 1 ? 's' : ''} × ₹{hotel.price}</span>
                  <span className="font-black text-gray-800">≈ ₹{(getNights() * hotel.price).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Aapka Poora Naam *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Jaise: Mohammed Ali Khan"
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:ring-primary/20 focus:border-primary'}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Mobile Number *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:ring-primary/20 focus:border-primary'}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Check-in *</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={form.checkin}
                    min={today}
                    onChange={e => handleChange('checkin', e.target.value)}
                    className={`w-full pl-9 pr-2 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.checkin ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:ring-primary/20 focus:border-primary'}`}
                  />
                </div>
                {errors.checkin && <p className="text-red-500 text-xs mt-1 font-medium">{errors.checkin}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Check-out *</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={form.checkout}
                    min={form.checkin || today}
                    onChange={e => handleChange('checkout', e.target.value)}
                    className={`w-full pl-9 pr-2 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all ${errors.checkout ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:ring-primary/20 focus:border-primary'}`}
                  />
                </div>
                {errors.checkout && <p className="text-red-500 text-xs mt-1 font-medium">{errors.checkout}</p>}
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Guests (Mehmanon ki Tadad) *</label>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.guests}
                  onChange={e => handleChange('guests', e.target.value)}
                  className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all appearance-none ${errors.guests ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:ring-primary/20 focus:border-primary'}`}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              {errors.guests && <p className="text-red-500 text-xs mt-1 font-medium">{errors.guests}</p>}
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Koi Khas Farmaish? (Optional)</label>
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <textarea
                  value={form.requests}
                  onChange={e => handleChange('requests', e.target.value)}
                  placeholder="Jaise: Ground floor room chahiye, halal food..."
                  rows={3}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white py-4 rounded-xl font-black text-base shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:translate-y-0"
            >
              {submitting ? (
                <><Loader2 size={20} className="animate-spin" /> Processing...</>
              ) : (
                <>WhatsApp par Book Karein <ChevronRight size={20} /></>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">
              Yeh aapki details hotel ke WhatsApp par bhej dega
            </p>
          </form>
        )}

        {/* ── Step: Success ────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-once">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Shukriya!</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-2">
              Aapki booking request WhatsApp par bhej di gayi hai.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Agar WhatsApp nahi khula, to hotel ko directly call karein:<br/>
              <strong className="text-primary">{hotel.phone}</strong>
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${hotel.phone?.replace(/[^0-9+]/g, '')}`}
                className="w-full block text-center border-2 border-primary text-primary hover:bg-primary/5 py-3 rounded-xl font-bold transition-colors"
              >
                📞 Reception Call Karein
              </a>
              <button
                onClick={onClose}
                className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Loading/checking state */}
        {step === 'check' && (
          <div className="p-12 flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
