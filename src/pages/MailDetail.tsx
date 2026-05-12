import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileDown, Download, Share2, ArrowLeft, X, User as UserIcon, Calendar, Info, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MailIncoming as MailType, MailStatus } from '../types.ts';

export const MailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMail, setSelectedMail] = useState<MailType | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { default: api } = await import('../services/api.ts');
        const res = await api.get('/mails/incoming');
        const mail = res.data.find((m: MailType) => m.id === id);
        if (mail) setSelectedMail(mail);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [id]);

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

               {[
                 { date: '12 Sep 2026, 09:12', user: 'Kepala Pusat (John Doe)', action: 'Menerima Surat', note: 'Registrasi Berhasil', icon: 'CHECK' },
                 { date: '12 Sep 2026, 10:45', user: 'Kepala Pusat (John Doe)', action: 'Disposisi Terkirim', note: 'Segera pelajari dan buatkan review.', icon: 'SEND' },
                 { date: '12 Sep 2026, 14:20', user: 'Kabag Umum (Ahmad)', action: 'Dokumen Dibaca', note: '-', icon: 'EYE' },
               ].map((step, idx) => (
                 <div key={idx} className="relative pl-8 group">
                   <div className="absolute left-0 top-1 w-[19px] h-[19px] rounded-full bg-white border-2 border-slate-200 group-hover:border-slate-900 transition-all z-10 flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-slate-900 transition-colors"></div>
                   </div>
                   <div className="space-y-1">
                     <div className="flex items-center justify-between">
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{step.date}</p>
                        <span className="text-[8px] font-black text-slate-400 px-1 border border-slate-100 rounded leading-none pt-0.5">{step.icon}</span>
                     </div>
                     <p className="text-[12px] font-black text-slate-900 tracking-tight leading-tight">{step.action}</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{step.user}</p>
                     {step.note !== '-' && (
                       <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 italic leading-snug">
                         "{step.note}"
                       </div>
                     )}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 mt-auto">
            <button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
              <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
              Lanjutkan Disposisi
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
