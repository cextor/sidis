import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Save, Upload, MapPin, Globe, Mail, Phone, Loader2, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

export const MasterOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success('Profil organisasi berhasil diperbarui!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Master Organisasi</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Identitas resmi lembaga & sistem</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            
            {/* Logo Upload Section */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/40">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center p-4">
                    <Building2 className="mx-auto mb-2 text-white/40" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Upload Logo</p>
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer shadow-lg transition-all active:scale-90">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tight leading-none italic">Pusat Pengembangan Sistem Digital</h3>
              <p className="text-xs font-medium text-slate-400 max-w-lg mb-4">Pastikan data organisasi sesuai dengan dokumen resmi untuk digunakan dalam kop surat otomatis dan branding aplikasi.</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Globe size={12} className="text-blue-400" /> ppsd.kemendikbud.go.id
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Mail size={12} className="text-blue-400" /> office@ppsd.go.id
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Nama Resmi Organisasi</label>
              <input required type="text" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all" defaultValue="Pusat Pengembangan Sistem Digital" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Website Resmi</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="url" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all" defaultValue="https://ppsd.kemendikbud.go.id" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Nomor Telepon Kantor</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="tel" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all" defaultValue="+62 (021) 887-8890" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Alamat Operasional Luas</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 text-slate-400" size={16} />
                <textarea className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all min-h-[120px] resize-none" defaultValue="Kawasan Industri Jababeka IX, Kav. 34-36 Blok C, Cikarang, Jawa Barat 17530, Indonesia"></textarea>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Sistem Autentikasi v1.23 Secure
            </div>
            <button 
              disabled={loading}
              className="w-full sm:w-auto bg-slate-900 text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  <Save size={18} />
                  Simpan Profil Organisasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
