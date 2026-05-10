import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, BadgeCheck } from 'lucide-react';
import { User as UserType } from '../types.ts';

interface ProfilePageProps {
  user: UserType;
}

export const ProfilePage = ({ user }: ProfilePageProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <header>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Profil Pegawai</h2>
        <p className="text-slate-500 text-sm font-medium">Informasi personal dan kepegawaian dalam sistem SIDIS</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
            <div className="relative pt-4">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg mx-auto overflow-hidden rotate-3">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={40} />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{user.displayName}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role} System</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1 px-4 bg-slate-50 rounded-full border border-slate-100 w-fit mx-auto">
              <BadgeCheck size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase">Verified Employee</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-black tracking-tight italic">124</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Disposisi</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black tracking-tight italic">98%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Response Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                <Briefcase size={16} className="text-slate-400" />
                Data Kepegawaian
              </h4>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Edit Profil</button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIP / ID Pegawai</p>
                <p className="text-sm font-bold text-slate-900">19880102 201103 1 004</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jabatan Struktural</p>
                <p className="text-sm font-bold text-slate-900">Kepala Sub Bagian Kepegawaian</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Golongan / Ruang</p>
                <p className="text-sm font-bold text-slate-900">Pembina, IV/a</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja</p>
                <p className="text-sm font-bold text-slate-900">Bagian Umum & Sekretariat</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                Kontak & Alamat
              </h4>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><Mail size={18} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Email Resmi</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><Phone size={18} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">WhatsApp / Telepon</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">+62 812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><MapPin size={18} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Alamat Domisili</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">Jl. Kemang Timur No. 12, Jakarta Selatan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
