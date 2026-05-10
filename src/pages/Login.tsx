import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ShieldCheck, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { loginWithEmail, resetPassword } from '../lib/firebase.ts';

export const Login = () => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Logic for specified credentials (Demo/Initial Mode)
    if (email === 'humas@sidis.id' && password === '123456') {
      try {
        // Simulate a small delay like an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Save mock session (this would normally be a JWT token from CI4)
        const mockUser = {
          uid: 'demo-humas',
          displayName: 'Humas Sidis',
          email: 'humas@sidis.id',
          role: 'ADMIN',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=humas',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('sidis_session', JSON.stringify(mockUser));
        window.location.reload(); // Refresh to update auth state
        return;
      } catch (err) {
        setError('Terjadi kesalahan sistem.');
      } finally {
        setLoading(false);
      }
    }

    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Instruksi reset password telah dikirim ke email Anda.');
    } catch (err: any) {
      setError('Gagal mengirim email reset. Pastikan email terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="p-8 text-center border-b border-slate-100">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white rotate-3 shadow-lg">
            <Mail size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">SIDIS</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Sistem Informasi Disposisi Surat</p>
        </div>
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin} 
                className="space-y-5"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">Selamat Datang</h2>
                  <p className="text-slate-500 text-sm leading-relaxed text-balance">Masukkan kredensial Anda untuk mengakses dashboard sistem disposisi surat.</p>
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg">{error}</div>}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={12} /> Email Pengguna
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@organisasi.id"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={12} /> Kata Sandi
                      </label>
                      <button 
                        type="button"
                        onClick={() => { setView('forgot'); setError(''); setMessage(''); }}
                        className="text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:underline"
                      >
                        Lupa?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-900/10 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Masuk Sekarang</span>}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleReset}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={() => setView('login')}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    <ArrowLeft size={14} /> Kembali
                  </button>
                  <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">Kami akan mengirimkan instruksi pemulihan ke email terdaftar Anda.</p>
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg">{error}</div>}
                {message && <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs font-bold rounded-lg">{message}</div>}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Terdaftar</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@organisasi.id"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-900/10 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Kirim Instruksi</span>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <div className="px-8 pb-8 flex items-center gap-2 justify-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          <ShieldCheck size={12} />
          <span>Keamanan Terenkripsi • Sidis v1.0</span>
        </div>
      </motion.div>
    </div>
  );
};
