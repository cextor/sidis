import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileDown, FileUp, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

import { User } from '../types.ts';

const StatCard = ({ label, value, icon: Icon, colorClass, trend }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <p className={cn("text-[10px] mt-2 font-medium", trend > 0 ? "text-green-600" : "text-red-600")}>
            {trend > 0 ? '+' : ''}{trend}% dibanding bulan lalu
          </p>
        )}
      </div>
      <div className={cn("p-3 rounded-lg", colorClass)}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export const Dashboard = ({ user }: { user: User }) => {
  const [stats, setStats] = useState({ incoming: 0, outgoing: 0, completed: 0, pending: 0 });
  const [recentMails, setRecentMails] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { default: api } = await import('../services/api.ts');
        const res = await api.get('/dashboard');
        setStats(res.data.stats || { incoming: 0, outgoing: 0, completed: 0, pending: 0 });
        setRecentMails(res.data.recentMails || []);
        setNotifs(res.data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Sistem</h2>
        <p className="text-slate-500 text-sm">Selamat datang kembali, {user.displayName}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Surat Masuk" value={stats.incoming} icon={FileDown} colorClass="bg-blue-600" />
        <StatCard label="Surat Keluar" value={stats.outgoing} icon={FileUp} colorClass="bg-purple-600" />
        <StatCard label="Selesai" value={stats.completed} icon={CheckCircle} colorClass="bg-green-600" />
        <StatCard label="Menunggu" value={stats.pending} icon={Clock} colorClass="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Aktivitas Terbaru</h3>
            <button className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono hover:underline">Lihat Semua</button>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {recentMails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Belum ada aktivitas terbaru.</div>
            ) : recentMails.map((mail, idx) => (
              <div key={idx} className="group p-4 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <FileDown size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{mail.letterNumber || 'Surat Masuk'}</p>
                    <p className="text-xs text-slate-500">{mail.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-400">{new Date(mail.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-wider">{mail.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Notifikasi Penting</h3>
          <div className="space-y-3">
            {notifs.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">Tidak ada notifikasi penting.</div>
            ) : notifs.map((n, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border-l-4 border-l-orange-500 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-orange-600 uppercase font-mono mb-1">{n.title || 'Pemberitahuan'}</p>
                <p className="text-sm text-slate-900 font-medium leading-snug">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
