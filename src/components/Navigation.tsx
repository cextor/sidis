import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileDown, FileUp, Archive, Settings, LogOut, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2",
        isActive
          ? "bg-slate-100 border-slate-900 text-slate-900"
          : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const Sidebar = ({ isOpen, onClose, onLogout }: SidebarProps) => {
  const location = useLocation();
  const isSettingsPath = location.pathname.startsWith('/settings');
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsPath);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        id="sidebar" 
        className={cn(
          "fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900">SIDIS</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Sistem Disposisi</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Menu Utama</p>
          </div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
          <NavItem to="/incoming" icon={FileDown} label="Surat Masuk" onClick={onClose} />
          <NavItem to="/outgoing" icon={FileUp} label="Surat Keluar" onClick={onClose} />
          <NavItem to="/archive" icon={Archive} label="Arsip" onClick={onClose} />
          
          <div className="px-4 mt-6 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Personal</p>
          </div>
          
          <div className="space-y-1">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors border-l-2",
                isSettingsPath 
                  ? "bg-slate-100 border-slate-900 text-slate-900" 
                  : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <span>Pengaturan</span>
              </div>
              <ChevronDown size={14} className={cn("transition-transform", isSettingsOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="ml-4 pl-4 border-l border-slate-200 flex flex-col py-1">
                    <NavLink 
                      to="/settings/users" 
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        "text-[11px] py-2 px-3 rounded-lg transition-colors uppercase tracking-tight",
                        isActive ? "text-slate-900 font-black" : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Master User & Pegawai
                    </NavLink>
                    <NavLink 
                      to="/settings/positions" 
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        "text-[11px] py-2 px-3 rounded-lg transition-colors uppercase tracking-tight",
                        isActive ? "text-slate-900 font-black" : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Master Jabatan
                    </NavLink>
                    <NavLink 
                      to="/settings/organization" 
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        "text-[11px] py-2 px-3 rounded-lg transition-colors uppercase tracking-tight",
                        isActive ? "text-slate-900 font-black" : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Master Organisasi
                    </NavLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black italic text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-slate-900 truncate uppercase mt-0.5 tracking-tight line-height-none">Administrator</p>
              <p className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-widest mt-0.5">Admin Utama</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
