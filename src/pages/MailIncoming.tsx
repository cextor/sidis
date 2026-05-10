import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FileDown, Plus, Search, Filter, Eye, Share2, Archive, Loader2, X, Download, User as UserIcon, Calendar, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import { User, MailIncoming as MailType, MailStatus } from '../types.ts';

interface MailIncomingProps {
  user: User;
}

export const MailIncoming = ({ user }: MailIncomingProps) => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDispositionModalOpen, setIsDispositionModalOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<MailType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mails, setMails] = useState<MailType[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock initial data
  useEffect(() => {
    const initialMails: MailType[] = [
      {
        id: '1',
        letterNumber: '001/UND/2026',
        dateReceived: '2026-09-12',
        dateOnLetter: '2026-09-10',
        sender: 'Dinas Pendidikan DKI',
        subject: 'Undangan Koordinasi Kurikulum Merdeka',
        classification: 'PENTING',
        status: MailStatus.PENDING,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        letterNumber: '088/SK/KEMENKES/VI/2026',
        dateReceived: '2026-08-15',
        dateOnLetter: '2026-08-12',
        sender: 'Kementerian Kesehatan',
        subject: 'Pemberitahuan Vaksinasi Tahap III',
        classification: 'BIASA',
        status: MailStatus.COMPLETED,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    setMails(initialMails);
  }, []);

  const filteredMails = mails.filter(mail => 
    mail.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mail.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mail.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    await new Promise(r => setTimeout(r, 1000));
    
    const newMail: MailType = {
      id: Math.random().toString(36).substr(2, 9),
      letterNumber: (e.currentTarget as any).letterNumber.value,
      sender: (e.currentTarget as any).sender.value,
      subject: (e.currentTarget as any).subject.value,
      dateReceived: (e.currentTarget as any).dateReceived.value,
      expiryDate: (e.currentTarget as any).expiryDate.value,
      dateOnLetter: new Date().toISOString(),
      classification: 'BIASA',
      status: MailStatus.PENDING,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMails([newMail, ...mails]);
    setLoading(false);
    setIsAddModalOpen(false);
    toast.success('Surat berhasil didaftarkan secara real-time!');
  };

  const openDispositionPortal = (mail: MailType) => {
    setSelectedMail(mail);
    setIsDispositionModalOpen(true);
  };

  const openDetailPortal = (mail: MailType) => {
    navigate(`/incoming/detail/${mail.id}`);
  };

  const handleDispositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    await new Promise(r => setTimeout(r, 1200));
    
    setLoading(false);
    setIsDispositionModalOpen(false);
    toast.info(`Disposisi untuk surat ${selectedMail?.letterNumber} telah diteruskan.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Surat Masuk</h2>
          <p className="text-slate-500 text-sm italic">"Keamanan Arsip adalah Kunci Integritas Organisasi"</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Registrasi Surat</span>
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. Surat, Pengirim, atau Perihal..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-white transition-colors bg-slate-50 text-slate-600">
              <Filter size={14} />
              <span className="hidden sm:inline">Advanced Filter</span>
            </button>
          </div>
          <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
            Records: {filteredMails.length} Total
          </div>
        </div>

        {/* Mobile List View */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {filteredMails.map((mail) => (
            <div key={mail.id} className="p-4 space-y-3 active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={cn(
                    "text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-fit shadow-sm mb-1",
                    mail.status === MailStatus.COMPLETED ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                  )}>
                    {mail.status}
                  </span>
                  <p className="text-sm font-black text-slate-900 leading-tight">{mail.letterNumber}</p>
                  <p className="text-xs font-bold text-slate-500">{mail.sender}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{new Date(mail.dateReceived).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 italic">"{mail.subject}"</p>
              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => openDetailPortal(mail)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-100 shadow-sm active:scale-95 transition-all"
                >
                  <Eye size={12} /> Detail
                </button>
                <button 
                  onClick={() => openDispositionPortal(mail)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all"
                >
                  <Share2 size={12} /> Disposisi
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100">Info Surat</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100">Sifat & Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 text-right">Manajemen Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMails.map((mail) => (
                <tr key={mail.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <FileDown size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 tracking-tight">{mail.letterNumber}</p>
                        <p className="text-xs font-bold text-slate-500 mb-1">{mail.sender}</p>
                        <p className="text-xs text-slate-400 leading-snug line-clamp-1 max-w-sm">{mail.subject}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                       <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-fit shadow-sm",
                        mail.status === MailStatus.COMPLETED ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                      )}>
                        {mail.status}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase">
                        Terima: {new Date(mail.dateReceived).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openDetailPortal(mail)}
                        title="Detail & Riwayat" 
                        className="p-2.5 bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => openDispositionPortal(mail)}
                        title="Disposisi" 
                        className="p-2.5 bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                      >
                        <Share2 size={16} />
                      </button>
                      <button title="Arsip Manual" className="p-2.5 bg-slate-100 text-slate-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm"><Archive size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMails.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Search size={48} />
                      <p className="text-sm font-bold uppercase tracking-widest">Tidak ada surat ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* Registration Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <form onSubmit={handleSave}>
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">SIDIS Registry</h3>
                    <p className="text-sm text-slate-500 font-medium">Formulir Pendaftaran Surat Masuk Baru</p>
                  </div>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">No. Surat Resmi</label>
                      <input name="letterNumber" required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="Contoh: 001/SK/ORGANISASI/2026" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Tanggal Terima</label>
                      <input name="dateReceived" required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all font-mono" defaultValue={new Date().toISOString().substr(0, 10)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Instansi Pengirim</label>
                      <input name="sender" required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="Nama Instansi/Organisasi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Tanggal Kadaluarsa</label>
                      <input name="expiryDate" type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all font-mono" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Perihal Utama</label>
                    <textarea name="subject" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all h-24 resize-none" placeholder="Ringkasan atau Judul Surat..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Digitalisasi Archive (PDF)</label>
                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 hover:border-slate-400 transition-all group cursor-pointer">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:scale-110 shadow-sm transition-all">
                        <Download size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-900 uppercase">Pilih File PDF</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-widest mt-1">DRAG & DROP • MAX 10MB</p>
                      </div>
                      <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 shadow-inner">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                  >
                    Batalkan
                  </button>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="bg-slate-900 text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Simpan</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Disposition Modal */}
        {isDispositionModalOpen && selectedMail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDispositionModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <form onSubmit={handleDispositionSubmit}>
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Layanan Disposisi</h3>
                    <p className="text-sm text-slate-500 font-medium italic">"{selectedMail.letterNumber}"</p>
                  </div>
                  <button type="button" onClick={() => setIsDispositionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {/* Mail Info Summary */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Info size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Informasi Surat</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{selectedMail.subject}</p>
                    <p className="text-xs text-slate-500">Dari: {selectedMail.sender}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit flex items-center gap-2">
                        <UserIcon size={12} /> Teruskan Ke (Pejabat/Unit)
                      </label>
                      <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none cursor-pointer">
                        <option value="">Pilih Penerima Disposisi...</option>
                        <option value="1">Kepala Bagian Umum - Dr. H. Ahmad Fauzi, M.Si</option>
                        <option value="2">Kepala Sub Bagian Keuangan - Sri Wahyuni, S.E., Ak.</option>
                        <option value="3">Kepala Sub Bagian Kepegawaian - Bambang Susanto, S.Sos</option>
                        <option value="4">Sekretaris Pimpinan - Maria Christina, M.Pd</option>
                        <option value="5">Staf Administrasi Kurikulum - Irvan Pratama, S.Kom</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit flex items-center gap-2">
                          <Calendar size={12} /> Target Selesai
                        </label>
                        <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all font-mono" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Sifat Instruksi</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none cursor-pointer">
                          <option>BIASA</option>
                          <option>SEGERA</option>
                          <option>AMAT SEGERA</option>
                          <option>RAHASIA</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Instruksi / Catatan Pimpinan</label>
                      <textarea required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all h-32 resize-none" placeholder="Tuliskan arahan spesifik untuk penerima disposisi..."></textarea>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsDispositionModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                  >
                    Batal
                  </button>
                  <button 
                    disabled={loading}
                    type="submit"
                    className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70 flex items-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Kirim Disposisi</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};
