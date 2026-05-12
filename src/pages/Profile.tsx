import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, BadgeCheck, Edit, Save, X, Loader2, Camera } from 'lucide-react';
import { User as UserType } from '../types.ts';
import api from '../services/api.ts';
import { toast } from 'react-toastify';

interface ProfilePageProps {
  user: UserType;
}

export const ProfilePage = ({ user: initialUser }: ProfilePageProps) => {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const file = formData.get('avatar') as File;
    if (file && file.size > 1024 * 1024) {
      toast.error('Ukuran maksimal foto profil adalah 1MB');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users/profile', formData);
      toast.success('Profil berhasil diperbarui');
      
      const res = await api.get('/users/me');
      if (res.data.status) {
        setUser(res.data.user);
        setAvatarPreview(res.data.user.avatarUrl);
      }
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.messages?.error || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form 
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSave}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                    <Edit size={16} className="text-slate-400" />
                    Edit Profil
                  </h4>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setIsEditing(false); setAvatarPreview(user.avatarUrl); }} className="px-3 py-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-lg transition-colors">Batal</button>
                    <button type="submit" disabled={loading} className="px-4 py-1.5 text-[10px] font-black text-white bg-blue-600 uppercase tracking-widest hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                      {loading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Simpan
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex flex-shrink-0 relative">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} className="m-auto text-slate-400" />
                        )}
                        <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Camera size={20} />
                          <input type="file" name="avatar" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ganti Foto Profil</p>
                      <p className="text-[10px] text-slate-500 mt-1">Format: JPG, PNG. Maksimal ukuran 1MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                      <input name="displayName" defaultValue={user.displayName} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                      <input name="email" type="email" defaultValue={user.email} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIP / ID Pegawai</label>
                      <input name="nip" defaultValue={user.nip} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan Struktural</label>
                      <input name="position_name" defaultValue={user.position_name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Golongan / Ruang</label>
                      <input name="golongan" defaultValue={user.golongan} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja</label>
                      <input name="unit_name" defaultValue={user.unit_name} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. WhatsApp</label>
                      <input name="phone" defaultValue={user.phone} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat</label>
                      <input name="address" defaultValue={user.address} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-400" />
                      Data Kepegawaian
                    </h4>
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all flex items-center gap-2">
                      <Edit size={12} /> Edit Profil
                    </button>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NIP / ID Pegawai</p>
                      <p className="text-sm font-bold text-slate-900">{user.nip || '-'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jabatan Struktural</p>
                      <p className="text-sm font-bold text-slate-900">{user.position_name || '-'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Golongan / Ruang</p>
                      <p className="text-sm font-bold text-slate-900">{user.golongan || '-'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja</p>
                      <p className="text-sm font-bold text-slate-900">{user.unit_name || '-'}</p>
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
                        <p className="text-sm font-bold text-slate-900 mt-1">{user.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><Phone size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">WhatsApp / Telepon</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{user.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><MapPin size={18} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Alamat Domisili</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{user.address || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
