import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, ShieldCheck, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

export const PasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success('Kata sandi berhasil diperbarui!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <header>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Keamanan Akun</h2>
        <p className="text-slate-500 text-sm font-medium">Perbarui kata sandi untuk menjaga keamanan data akses</p>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-900 border border-slate-100">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest italic">Ubah Kata Sandi</h3>
              <p className="text-xs text-slate-400 font-bold">Terakhir diubah: 3 bulan yang lalu</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Kata Sandi Lama</label>
              <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" />
            </div>

            <div className="h-px bg-slate-100"></div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Kata Sandi Baru</label>
              <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Konfirmasi Sandi Baru</label>
              <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" />
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
              <ShieldCheck size={18} className="text-orange-600 shrink-0" />
              <p className="text-[11px] text-orange-700 leading-relaxed">
                <span className="font-bold">Tips Keamanan:</span> Gunakan minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol untuk keamanan maksimal.
              </p>
            </div>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
            <button 
              disabled={loading}
              className="bg-slate-900 text-white px-10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  <Save size={16} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
