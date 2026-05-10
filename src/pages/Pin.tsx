import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Lock, Loader2, Save, Info } from 'lucide-react';
import { toast } from 'react-toastify';

export const PinPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success('PIN Keamanan berhasil diperbarui!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <header>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">PIN Keamanan</h2>
        <p className="text-slate-500 text-sm font-medium">PIN digunakan untuk otentikasi disposisi dan persetujuan surat</p>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 border border-slate-100">
              <Fingerprint size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest italic">Konfigurasi PIN Digital</h3>
              <p className="text-xs text-slate-400 font-bold">Status: Aktif (6 Digit)</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
                <Lock size={32} />
              </div>
              <p className="text-sm font-medium text-slate-600">Masukkan PIN Baru Anda</p>
            </div>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input 
                  key={i}
                  type="password"
                  maxLength={1}
                  className="w-12 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-xl font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="•"
                />
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit mx-auto">Verifikasi PIN Baru</label>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input 
                      key={i}
                      type="password"
                      maxLength={1}
                      className="w-12 h-14 bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-xl font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
              <Info size={18} className="text-blue-600 shrink-0" />
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                PIN Keamanan adalah lapisan pertahanan kedua. Jangan gunakan kombinasi angka yang mudah ditebak seperti tanggal lahir.
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
                  Simpan PIN Baru
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
