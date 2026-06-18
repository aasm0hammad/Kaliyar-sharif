import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await api.post('/users/verify-email', { token });
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-primary w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">Verifying Email...</h2>
              <p className="text-gray-500 mt-2">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button 
                onClick={() => navigate('/auth')} 
                className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg font-bold transition-colors w-full"
              >
                Go to Login
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center">
              <XCircle className="text-red-500 w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button 
                onClick={() => navigate('/auth')} 
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold transition-colors w-full"
              >
                Return to Auth Page
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
