import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Navigation.tsx';
import { Bell, Search, User as UserIcon, LogOut, Menu, Key, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types.ts';
import { auth } from '../lib/firebase.ts';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

export const Layout = ({ children, user }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sidis_session');
    auth.signOut().then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="relative w-full group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari surat, disposisi, atau arsip..." 
                className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 focus:ring-0 rounded-xl py-2 pl-10 pr-4 text-sm transition-all outline-none"
              />
            </div>

            {/* Mobile Title */}
            <div className="sm:hidden">
              <h1 className="text-lg font-black italic tracking-tighter text-slate-900 leading-none">SIDIS</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 relative" ref={userMenuRef}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold leading-none">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{user.role}</p>
              </div>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200 shadow-inner shrink-0 hover:border-slate-400 transition-all focus:outline-none"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={18} />
                )}
              </button>

              {/* User Menu Popup */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-2"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs font-black text-slate-900 tracking-tight uppercase italic">{user.displayName}</p>
                      <p className="text-[10px] text-slate-400 font-bold truncate">{user.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link 
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group text-left"
                      >
                        <UserIcon size={16} className="text-slate-400 group-hover:text-slate-900" />
                        Profil Saya
                      </Link>
                      <Link 
                        to="/password"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group text-left"
                      >
                        <Key size={16} className="text-slate-400 group-hover:text-slate-900" />
                        Ubah Password
                      </Link>
                      <Link 
                        to="/pin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group text-left"
                      >
                        <Fingerprint size={16} className="text-slate-400 group-hover:text-slate-900" />
                        Atur PIN Keamanan
                      </Link>
                    </div>

                    <div className="mt-1 pt-1 border-t border-slate-50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-left"
                      >
                        <LogOut size={16} />
                        Keluar Aplikasi
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
