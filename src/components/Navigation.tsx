import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileDown, FileUp, Archive, Settings, LogOut, X, ChevronDown, Users, Briefcase, Building } from 'lucide-react';
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
          
          <NavItem to="/settings/users" icon={Users} label="User & Pegawai" onClick={onClose} />
          <NavItem to="/settings/positions" icon={Briefcase} label="Jabatan" onClick={onClose} />
          <NavItem to="/settings/organization" icon={Building} label="Organisasi" onClick={onClose} />
        </nav>
      </aside>
    </>
  );
};
