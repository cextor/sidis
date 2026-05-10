import React from 'react';
import { motion } from 'motion/react';
import { Archive, Search, FileText, Download, ExternalLink } from 'lucide-react';
import { User } from '../types.ts';

export const ArchivePage = ({ user }: { user: User }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Arsip Digital</h2>
        <p className="text-slate-500 text-sm">Pusat penyimpanan dokumen yang telah selesai diproses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic border-b border-slate-100 pb-2">Kategori Arsip</h3>
            <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0 scrollbar-hide">
              {['Semua Arsip', 'Surat Masuk', 'Surat Keluar', 'SK & Regulasi'].map((cat, i) => (
                <button key={cat} className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                  {cat}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
              <Archive size={80} />
            </div>
            <h4 className="text-lg font-black tracking-tight mb-2 italic">Storage Space</h4>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-blue-400 h-full w-[45%] shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest leading-none">4.5 GB / 10 GB USED</p>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="bg-white p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input type="text" placeholder="Cari di arsip digital..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-slate-200 focus:ring-0 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-slate-900 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900"><Download size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900"><ExternalLink size={14} /></button>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">SK/2026/00{i} - Penetapan Struktur Organisasi Baru</h4>
                <p className="text-[10px] text-slate-400 font-mono uppercase">PDF • 2.4 MB</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">12 Sep 2026</span>
                  <Archive size={14} className="text-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
