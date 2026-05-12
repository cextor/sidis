import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUp, Plus, Search, Filter, Eye, Archive, Loader2, X, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import { User, MailOutgoing as MailType } from '../types.ts';
import api from '../services/api.ts';

interface MailOutgoingProps {
  user: User;
}

export const MailOutgoing = ({ user }: MailOutgoingProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<MailType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mails, setMails] = useState<MailType[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchMails = async () => {
    setFetchLoading(true);
    try {
      const res = await api.get('/mails/outgoing');
      setMails(res.data);
    } catch (err) {
      toast.error('Gagal mengambil data surat keluar');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
  }, []);

  const filteredMails = mails.filter(mail => 
    mail.letterNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mail.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mail.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      await api.delete(`/mails/outgoing/${id}`);
      toast.success('Surat berhasil dihapus');
      fetchMails();
    } catch (err) {
      toast.error('Gagal menghapus surat');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const mailData = {
      letterNumber: formData.get('letterNumber'),
      recipient: formData.get('recipient'),
      subject: formData.get('subject'),
      dateSent: formData.get('dateSent'),
      classification: formData.get('classification'),
    };

    try {
      if (selectedMail) {
        await api.put(`/mails/outgoing/${selectedMail.id}`, mailData);
        toast.success('Surat berhasil diperbarui!');
      } else {
        await api.post('/mails/outgoing', mailData);
        toast.success('Surat berhasil dibuat!');
      }
      setIsAddModalOpen(false);
      fetchMails();
    } catch (err) {
      toast.error('Gagal menyimpan surat');
    } finally {
      setLoading(false);
    }
  };

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
          onClick={openAddModal}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Surat</span>
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
                placeholder="Cari no surat, penerima, atau perihal..." 
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
                      <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-fit shadow-sm bg-purple-100 text-purple-700 border border-purple-200 mb-1">
                        {mail.status || 'DRAFT'}
                      </span>
                      <p className="text-sm font-black text-slate-900 leading-tight">{mail.letterNumber}</p>
                      <p className="text-xs font-bold text-slate-500">{mail.recipient}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{mail.dateSent ? new Date(mail.dateSent).toLocaleDateString('id-ID') : '-'}</p>
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
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100">Info Surat Keluar</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100">Penerima & Tanggal</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMails.map((mail) => (
                    <tr key={mail.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900 tracking-tight">{mail.letterNumber}</p>
                        <p className="text-xs text-slate-500 max-w-xs truncate italic">{mail.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{mail.recipient}</p>
                        <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase">Tgl: {mail.dateSent ? new Date(mail.dateSent).toLocaleDateString('id-ID') : '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
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

      {/* Add/Edit Modal */}
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
              <form onSubmit={handleSave}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedMail ? 'Edit Surat Keluar' : 'Buat Surat Keluar'}</h3>
                    <p className="text-sm text-slate-500">Daftarkan surat yang akan dikirim secara resmi.</p>
                  </div>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. Surat</label>
                      <input name="letterNumber" required defaultValue={selectedMail?.letterNumber} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900" placeholder="Auto-generate" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tgl. Kirim</label>
                      <input name="dateSent" required defaultValue={selectedMail?.dateSent ? selectedMail.dateSent.substr(0,10) : new Date().toISOString().substr(0, 10)} type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sifat Surat</label>
                      <select name="classification" required defaultValue={selectedMail?.classification || 'BIASA'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900 appearance-none cursor-pointer">
                        <option value="BIASA">BIASA</option>
                        <option value="PENTING">PENTING</option>
                        <option value="RAHASIA">RAHASIA</option>
                        <option value="SANGAT RAHASIA">SANGAT RAHASIA</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penerima</label>
                      <input name="recipient" required defaultValue={selectedMail?.recipient} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900" placeholder="Instansi Tujuan" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Perihal</label>
                    <textarea name="subject" required defaultValue={selectedMail?.subject} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-900 h-20" placeholder="Isi perihal surat..."></textarea>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900">
                    Batal
                  </button>
                  <button disabled={loading} type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Simpan</span>}
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
