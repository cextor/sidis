import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Plus, Search, Edit, Trash2, Users } from 'lucide-react';

export const MasterPositions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockPositions = [
    { id: '1', title: 'Kepala Pusat', level: 'Eselon II', memberCount: 1 },
    { id: '2', title: 'Kepala Bagian Umum', level: 'Eselon III', memberCount: 1 },
    { id: '3', title: 'Kepala Sub Bagian Keuangan', level: 'Eselon IV', memberCount: 3 },
    { id: '4', title: 'Staf Administrasi', level: 'Staff', memberCount: 12 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Jabatan</h2>
          <p className="text-slate-500 text-sm font-medium">Pengelolaan struktur jabatan dan hierarki</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
          <Plus size={16} />
          Tambah Jabatan
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama jabatan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Jabatan</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level/Golongan</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Jumlah Pegawai</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockPositions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Briefcase size={18} />
                      </div>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{pos.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 uppercase tracking-widest">
                      {pos.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 w-fit mx-auto px-3 py-1 rounded-full border border-slate-100">
                      <Users size={14} className="text-slate-400" />
                      <span>{pos.memberCount} Pegawai</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} /></button>
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
