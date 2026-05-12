import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { FileDown, Plus, Search, Filter, Eye, Share2, Archive, Loader2, X, Download, User as UserIcon, Calendar, Info, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import { User, MailIncoming as MailType, MailStatus } from '../types.ts';
import api from '../services/api.ts';

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
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = [
    { id: 'ALL', label: 'Semua Surat' },
    { id: 'PENDING', label: 'Belum Dibaca' },
    { id: 'DISPOSED', label: 'Sudah Disposisi' },
    { id: 'COMPLETED', label: 'Selesai' },
  ];

  const fetchMails = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get('/mails/incoming');
      setMails(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data surat masuk');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, []);

  const filteredMails = mails.filter(mail => {
    const matchesSearch = mail.letterNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'ALL') return true;
    return mail.status === activeTab;
  });

  const openAddModal = () => {
    setSelectedMail(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (mail: MailType) => {
    setSelectedMail(mail);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus surat ini?')) return;
    try {
      await api.delete(`/mails/incoming/${id}`);
      toast.success('Surat berhasil dihapus');
      fetchMails();
    } catch (err: any) {
      const msg = err.response?.data?.messages?.error || err.response?.data?.message || 'Gagal menghapus surat';
      toast.error(msg);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      if (selectedMail) {
        await api.post(`/mails/incoming/update/${selectedMail.id}`, formData);
        toast.success('Surat berhasil diperbarui!');
      } else {
        await api.post('/mails/incoming', formData);
        toast.success('Surat berhasil didaftarkan!');
      }
      setIsAddModalOpen(false);
      fetchMails();
    } catch (err: any) {
      const msg = err.response?.data?.messages?.error || err.response?.data?.message || 'Gagal menyimpan surat';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
    // Simulate API Call for disposition
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
          onClick={openAddModal}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Tambah Surat</span>
        </button>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300",
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
          </div>
          <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
            Records: {filteredMails.length} Total
          </div>
        </div>

        {fetchLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={32} /></div>
        ) : (
          <>
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
                        {mail.status || 'PENDING'}
                      </span>
                      <p className="text-sm font-black text-slate-900 leading-tight">{mail.letterNumber}</p>
                      <p className="text-xs font-bold text-slate-500">{mail.sender}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{mail.dateReceived ? new Date(mail.dateReceived).toLocaleDateString('id-ID') : '-'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 italic">"{mail.subject}"</p>
                  <div className="flex items-center gap-2 pt-2">
                    <button onClick={() => openEditModal(mail)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-100 shadow-sm active:scale-95 transition-all"><Edit size={12} /> Edit</button>
                    <button onClick={() => handleDelete(mail.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-red-100 shadow-sm active:scale-95 transition-all"><Trash2 size={12} /> Hapus</button>
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
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 text-right">Aksi</th>
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
                            {mail.status || 'PENDING'}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase">
                            Terima: {mail.dateReceived ? new Date(mail.dateReceived).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openDetailPortal(mail)} title="Detail" className="p-2.5 bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm"><Eye size={16} /></button>
                          <button onClick={() => openDispositionPortal(mail)} title="Disposisi" className="p-2.5 bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"><Share2 size={16} /></button>
                          <button onClick={() => openEditModal(mail)} title="Edit" className="p-2.5 bg-slate-100 text-slate-500 hover:bg-indigo-500 hover:text-white rounded-xl transition-all shadow-sm"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(mail.id)} title="Hapus" className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={16} /></button>
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
          </>
        )}
      </div>

      <AnimatePresence>
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
                    <p className="text-sm text-slate-500 font-medium">{selectedMail ? 'Edit Data Surat Masuk' : 'Formulir Pendaftaran Surat Masuk Baru'}</p>
                  </div>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">No. Surat Resmi</label>
                      <input name="letterNumber" required defaultValue={selectedMail?.letterNumber} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="Contoh: 001/SK/ORGANISASI/2026" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Tanggal Terima</label>
                      <input name="dateReceived" required defaultValue={selectedMail?.dateReceived ? selectedMail.dateReceived.substr(0,10) : new Date().toISOString().substr(0, 10)} type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Sifat Surat</label>
                      <select name="classification" required defaultValue={selectedMail?.classification || 'BIASA'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none cursor-pointer">
                        <option value="BIASA">BIASA</option>
                        <option value="PENTING">PENTING</option>
                        <option value="RAHASIA">RAHASIA</option>
                        <option value="SANGAT RAHASIA">SANGAT RAHASIA</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Tanggal Expired</label>
                      <input name="expiryDate" defaultValue={selectedMail?.expiryDate ? selectedMail.expiryDate.substr(0,10) : ''} type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all font-mono" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Instansi Pengirim</label>
                    <input name="sender" required defaultValue={selectedMail?.sender} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="Nama Instansi/Organisasi" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Perihal Utama</label>
                    <textarea name="subject" required defaultValue={selectedMail?.subject} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all h-24 resize-none" placeholder="Ringkasan atau Judul Surat..."></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Upload Surat Masuk (PDF)</label>
                    <input name="file" type="file" accept=".pdf" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900 transition-all" />
                    <p className="text-[10px] font-bold text-slate-400 italic">Batas maksimal file adalah 10MB</p>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 shadow-inner">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Batalkan</button>
                  <button disabled={loading} type="submit" className="bg-slate-900 text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-70 flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Simpan</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Disposition Modal (Unchanged Layout) */}
        {isDispositionModalOpen && selectedMail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDispositionModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
              <form onSubmit={handleDispositionSubmit}>
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Layanan Disposisi</h3>
                    <p className="text-sm text-slate-500 font-medium italic">"{selectedMail.letterNumber}"</p>
                  </div>
                  <button type="button" onClick={() => setIsDispositionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit flex items-center gap-2"><UserIcon size={12} /> Teruskan Ke</label>
                    <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"><option value="">Pilih Penerima...</option><option value="1">Kepala Bagian</option></select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-fit">Instruksi</label>
                    <textarea required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none h-32 resize-none" placeholder="Tuliskan arahan..."></textarea>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button type="button" onClick={() => setIsDispositionModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Batal</button>
                  <button disabled={loading} type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
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
