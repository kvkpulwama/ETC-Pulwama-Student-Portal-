import React from 'react';
import { AdminPage } from './pages/AdminPage';

export default function AdminApp() {
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-emerald-800 selection:text-white">
      <AdminPage onNavigate={handleNavigate as any} />
    </div>
  );
}
