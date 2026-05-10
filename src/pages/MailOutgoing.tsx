import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUp, Plus, Search, Filter, Eye, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '../types.ts';

interface MailOutgoingProps {
  user: User;
}

export const MailOutgoing = ({ user }: MailOutgoingProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Surat Keluar</h2>
          <p className="text-slate-500 text-sm">Kelola arsip surat yang dikirim oleh instansi.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Buat Surat Baru</span>
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Cari no surat atau tujuan..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-white transition-colors bg-slate-50 text-slate-600">
              <Filter size={14} />
              <span className="hidden sm:inline">Advanced Filter</span>
            </button>
          </div>
          <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
            Terkirim: 84 Total
          </div>
        </div>

        {/* Mobile List View */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 space-y-3 active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-fit shadow-sm bg-purple-100 text-purple-700 border border-purple-200 mb-1">
                    Terkirim
                  </span>
                  <p className="text-sm font-black text-slate-900 leading-tight">OUT/00{i}/ORG/2026</p>
                  <p className="text-xs font-bold text-slate-500">Badan Kepegawaian Negara</p>
                </div>
                <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">05 Sep 2026</p>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 italic">"Laporan Kinerja Bulanan Pegawai Bulan Agustus 2026"</p>
              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-100 shadow-sm active:scale-95 transition-all">
                  <Eye size={12} /> Pratinjau
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-100 shadow-sm active:scale-95 transition-all">
                  <Archive size={12} /> Arsipkan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 backdrop-blur-sm">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100">Info Surat Keluar</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100">Penerima & Tanggal</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 tracking-tight">OUT/00{i}/ORG/2026</p>
                    <p className="text-xs text-slate-500 max-w-xs truncate italic">Laporan Kinerja Bulanan Pegawai Bulan Agustus 2026</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">Badan Kepegawaian Negara</p>
                    <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase">Tgl: 05 Sep 2026</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button title="Lihat" className="p-2.5 bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm"><Eye size={16} /></button>
                       <button title="Arsip" className="p-2.5 bg-slate-100 text-slate-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm"><Archive size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Basic Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Buat Surat Keluar</h3>
                <p className="text-sm text-slate-500">Daftarkan surat yang akan dikirim secara resmi.</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. Surat</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900" placeholder="Auto-generate" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tgl. Kirim</label>
                    <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penerima</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900" placeholder="Instansi Tujuan" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perihal</label>
                  <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900 h-20" placeholder="Isi perihal surat..."></textarea>
                </div>
              </div>

              <div className="p-6 bg-slate-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900"
                >
                  Batal
                </button>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
                  Simpan Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
