import { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isLogin) {
        const res = await api.post('/users/login', { email, password });
        localStorage.setItem('userToken', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data.user));
        setMessage('Logged in successfully!');
        window.location.href = '/';
      } else {
        await api.post('/users/register', { name, email, password });
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-sm text-gray-500 mt-2">{isLogin ? 'Login to access your saved places and bookings' : 'Join to manage your ziyarat journey'}</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-4 text-center">{error}</div>}
          {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-bold mb-4 text-center">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input required type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-primary" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-primary" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-primary" />
            </div>
            
            {isLogin && <div className="text-right"><a href="#" className="text-xs text-primary font-bold">Forgot Password?</a></div>}
            
            <button className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-lg font-bold transition-colors">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
