/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { MailIncoming } from './pages/MailIncoming.tsx';
import { MailOutgoing } from './pages/MailOutgoing.tsx';
import { MailDetail } from './pages/MailDetail.tsx';
import { MasterUsers } from './pages/MasterUsers.tsx';
import { MasterPositions } from './pages/MasterPositions.tsx';
import { MasterOrganization } from './pages/MasterOrganization.tsx';
import { ProfilePage } from './pages/Profile.tsx';
import { PasswordPage } from './pages/Password.tsx';
import { PinPage } from './pages/Pin.tsx';
import { ArchivePage } from './pages/Archive.tsx';
import { Login } from './pages/Login.tsx';
import { useAuth } from './hooks/useAuth.ts';

// Placeholder components for other pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center p-20 text-slate-400">
    <h2 className="text-xl font-bold">{name}</h2>
    <p>Halaman sedang dikembangkan...</p>
  </div>
);

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Memuat Sistem...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/incoming" element={<MailIncoming user={user} />} />
          <Route path="/incoming/detail/:id" element={<MailDetail />} />
          <Route path="/outgoing" element={<MailOutgoing user={user} />} />
          <Route path="/archive" element={<ArchivePage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/password" element={<PasswordPage />} />
          <Route path="/pin" element={<PinPage />} />
          <Route path="/settings/users" element={<MasterUsers />} />
          <Route path="/settings/positions" element={<MasterPositions />} />
          <Route path="/settings/organization" element={<MasterOrganization />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <ToastContainer position="bottom-right" theme="dark" aria-label="Notifikasi Sistem" />
    </Router>
  );
}
