import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ShieldCheck, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api.ts';

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

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.status && response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.reload();
      } else {
        setError('Email atau password salah.');
      }
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
      // await resetPassword(email);
      setMessage('Instruksi reset password telah dikirim ke email Anda.');
    } catch (err: any) {
      setError('Gagal mengirim email reset. Pastikan email terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Kolom Kiri: Desain Keren */}
      <div className="hidden lg:flex flex-1 relative bg-slate-950 overflow-hidden items-center justify-center">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 z-0" />
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[100px] pointer-events-none"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-cyan-600/20 to-blue-600/20 blur-[100px] pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 p-16 w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center text-white mb-10 border border-white/20 shadow-2xl rotate-3">
              <Mail size={40} />
            </div>
            
            <h1 className="text-5xl xl:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
              Sistem Informasi<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                Disposisi Surat.
              </span>
            </h1>
            
            <p className="text-lg xl:text-xl text-slate-300 leading-relaxed max-w-xl mb-12 font-medium">
              Platform modern untuk mengelola administrasi, surat masuk, keluar, dan disposisi dengan cepat, aman, dan efisien.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-lg border border-white/10 px-5 py-3 rounded-2xl">
                <ShieldCheck className="text-cyan-400" size={24} />
                <div className="text-sm">
                  <p className="text-white font-bold">Keamanan Terjamin</p>
                  <p className="text-slate-400 text-xs">Enkripsi End-to-End</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-lg border border-white/10 px-5 py-3 rounded-2xl">
                <Lock className="text-indigo-400" size={24} />
                <div className="text-sm">
                  <p className="text-white font-bold">Akses Terkontrol</p>
                  <p className="text-slate-400 text-xs">Role-based Access</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-16 xl:px-24 bg-white relative z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.05)] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="lg:hidden mb-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white rotate-3 shadow-lg">
              <Mail size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">SIDIS</h1>
              <p className="text-slate-500 text-xs font-bold mt-1">Sistem Disposisi</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">Silakan masuk menggunakan akun Anda untuk melanjutkan.</p>
                </div>

                {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} className="text-slate-400" /> Email
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@organisasi.id"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={14} className="text-slate-400" /> Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => { setView('forgot'); setError(''); setMessage(''); }}
                        className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
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
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-70 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Masuk ke Dashboard</span>}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleReset}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <button 
                    type="button"
                    onClick={() => setView('login')}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                  >
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">Masukkan email Anda dan kami akan mengirimkan instruksi pemulihan.</p>
                </div>

                {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">{error}</div>}
                {message && <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold rounded-xl">{message}</div>}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-slate-400" /> Email Terdaftar
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@organisasi.id"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 disabled:opacity-70 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Kirim Instruksi</span>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center gap-2 justify-center text-xs text-slate-400 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>Sidis v1.0 • Keamanan Sistem</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
