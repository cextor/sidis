import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileDown, Download, Share2, ArrowLeft, X, User as UserIcon, Calendar, Info, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MailIncoming as MailType, MailStatus, Disposition } from '../types.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { toast } from 'react-toastify';

export const MailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMail, setSelectedMail] = useState<MailType | null>(null);
  const [dispositions, setDispositions] = useState<Disposition[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toId, setToId] = useState('');
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { default: api } = await import('../services/api.ts');
        const [resMail, resDisp, resUsers] = await Promise.all([
          api.get('/mails/incoming'),
          api.get(`/dispositions?mailIncomingId=${id}`),
          api.get('/users')
        ]);
        
        const mail = resMail.data.find((m: MailType) => m.id === id);
        if (mail) setSelectedMail(mail);
        
        const disps = resDisp.data || [];
        setDispositions(disps);
        setUsers(resUsers.data || []);

        // Mark as read if pending for current user
        for (const disp of disps) {
          if (disp.toId === user?.uid && disp.status === 'PENDING') {
            await api.put(`/dispositions/${disp.id}/read`);
            disp.status = 'READ';
            setDispositions([...disps]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [id, user]);

  const handleDispose = async () => {
    if (!toId) return toast.error('Pilih tujuan disposisi');
    try {
      const { default: api } = await import('../services/api.ts');
      await api.post('/dispositions', {
        mailIncomingId: id,
        toId,
        instruction
      });
      toast.success('Disposisi berhasil dikirim');
      setIsModalOpen(false);
      setToId('');
      setInstruction('');
      // Refresh dispositions
      const resDisp = await api.get(`/dispositions?mailIncomingId=${id}`);
      setDispositions(resDisp.data || []);
    } catch (err) {
      toast.error('Gagal mengirim disposisi');
    }
  };

  if (!selectedMail) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <Clock className="animate-pulse mb-4" size={48} />
        <h2 className="text-xl font-bold uppercase tracking-widest">Memuat Dokumen...</h2>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4 sm:space-y-6 max-w-5xl mx-auto"
    >
      <header className="flex items-center gap-3 sm:gap-4 px-1">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 sm:p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Detail Dokumen</h2>
          <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Management Portal v1.0</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Document Preview */}
        <div className="w-full lg:w-5/12 bg-slate-50 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="w-full aspect-[4/5] lg:h-full bg-white rounded-2xl shadow-inner border border-slate-200 p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 text-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-md rotate-3 group-hover:rotate-0 transition-transform">
              <FileDown size={32} className="sm:w-10 sm:h-10" />
            </div>
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase italic leading-tight">Pratinjau Digital</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono italic break-all max-w-[200px] mx-auto">
                {selectedMail.pdfUrl ? selectedMail.pdfUrl.split('/').pop() : `DOC_${selectedMail.id.toUpperCase()}.PDF`}
              </p>
            </div>
            {selectedMail.pdfUrl ? (
              <a href={`http://localhost:8080${selectedMail.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                <Download size={14} className="sm:w-4 sm:h-4" />
                Lihat PDF
              </a>
            ) : (
              <button disabled className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 text-slate-400 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-not-allowed">
                <FileDown size={14} className="sm:w-4 sm:h-4" />
                PDF Tidak Tersedia
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Info & History */}
        <div className="w-full lg:w-7/12 flex flex-col bg-white">
          <div className="p-6 sm:p-8 border-b border-slate-50 space-y-6 sm:space-y-8">
             <div className="flex items-center justify-between">
              <span className="text-[8px] sm:text-[10px] px-2 sm:px-3 py-1 bg-slate-900 text-white font-black rounded-full uppercase tracking-widest">
                Internal Tracking
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Monitor</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-8">
              <div className="col-span-2 space-y-1.5">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                  <Info size={10} className="sm:w-3 sm:h-3" /> Nomor Surat Resmi
                </p>
                <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none italic">{selectedMail.letterNumber}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                  <UserIcon size={10} className="sm:w-3 sm:h-3" /> Pengirim
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">{selectedMail.sender}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                  <Info size={10} className="sm:w-3 sm:h-3" /> Status
                </p>
                <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded uppercase tracking-wider block w-fit border border-blue-200">{selectedMail.status}</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                  <Calendar size={10} className="sm:w-3 sm:h-3" /> Tgl Terima
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">{new Date(selectedMail.dateReceived).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                  <Clock size={10} className="sm:w-3 sm:h-3" /> Kadaluarsa
                </p>
                <p className={cn(
                  "text-xs sm:text-sm font-bold leading-tight",
                  selectedMail.expiryDate ? "text-red-500" : "text-slate-400 italic"
                )}>
                  {selectedMail.expiryDate ? new Date(selectedMail.expiryDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'No Expiry'}
                </p>
              </div>

              <div className="col-span-2 space-y-2 pt-4 border-t border-slate-50">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Perihal Utama</p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 italic leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">"{selectedMail.subject}"</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-50 pb-3">
              <Share2 size={16} className="text-blue-500" />
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-tighter italic">Workflow History</h4>
            </div>
            
            <div className="space-y-6 relative ml-2">
               {/* Timeline Line */}
               <div className="absolute left-[9px] top-6 bottom-6 w-px bg-slate-100"></div>

               <div className="relative pl-8 group">
                   <div className="absolute left-0 top-1 w-[19px] h-[19px] rounded-full bg-white border-2 border-slate-200 group-hover:border-slate-900 transition-all z-10 flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors"></div>
                   </div>
                   <div className="space-y-1">
                     <div className="flex items-center justify-between">
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{new Date(selectedMail.createdAt).toLocaleString('id-ID')}</p>
                        <span className="text-[8px] font-black text-slate-400 px-1 border border-slate-100 rounded leading-none pt-0.5">TERIMA</span>
                     </div>
                     <p className="text-[12px] font-black text-slate-900 tracking-tight leading-tight">Surat Diterima</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sistem</p>
                   </div>
                </div>

               {dispositions.map((step: any, idx: number) => (
                 <div key={idx} className="relative pl-8 group">
                   <div className="absolute left-0 top-1 w-[19px] h-[19px] rounded-full bg-white border-2 border-slate-200 group-hover:border-slate-900 transition-all z-10 flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors"></div>
                   </div>
                   <div className="space-y-1">
                     <div className="flex items-center justify-between">
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{new Date(step.createdAt).toLocaleString('id-ID')}</p>
                        <span className={cn(
                          "text-[8px] font-black px-1 border rounded leading-none pt-0.5",
                          step.status === 'PENDING' ? "text-orange-500 border-orange-200 bg-orange-50" : "text-green-500 border-green-200 bg-green-50"
                        )}>{step.status === 'PENDING' ? 'BELUM DIBACA' : 'SUDAH DIBACA'}</span>
                     </div>
                     <p className="text-[12px] font-black text-slate-900 tracking-tight leading-tight">Disposisi ke {step.toName}</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Dari: {step.fromName || 'System'}</p>
                     {step.instruction && (
                       <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 italic leading-snug">
                         "{step.instruction}"
                       </div>
                     )}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 mt-auto">
            <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
              <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
              Lanjutkan Disposisi
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
          >
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Form Disposisi</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Teruskan Ke</label>
                  <select 
                    value={toId}
                    onChange={(e) => setToId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Tujuan --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.displayName} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Instruksi / Catatan</label>
                  <textarea 
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Masukkan instruksi..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDispose}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Kirim Disposisi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
