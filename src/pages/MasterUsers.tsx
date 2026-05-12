import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MasterUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mockUsers = [
    { id: '1', name: 'Dr. H. Ahmad Fauzi, M.Si', username: 'ahmad.fauzi', role: 'admin', position: 'Kepala Bagian Umum', status: 'active' },
    { id: '2', name: 'Sri Wahyuni, S.E., Ak.', username: 'sri.wahyuni', role: 'user', position: 'Kepala Sub Bagian Keuangan', status: 'active' },
    { id: '3', name: 'Bambang Susanto, S.Sos', username: 'bambang.s', role: 'user', position: 'Kepala Sub Bagian Kepegawaian', status: 'active' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">User & Pegawai</h2>
          <p className="text-slate-500 text-sm font-medium">Pengelolaan data akun dan profil pegawai</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95">
          <UserPlus size={16} />
          Tambah User
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau username..." 
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pegawai</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{user.name}</p>
                        <p className="text-[10px] font-mono font-bold text-slate-400">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-600">{user.position}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                      user.role === 'admin' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      <Shield size={10} />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Edit size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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
