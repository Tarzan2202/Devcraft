import React from 'react';
import { getProjects, getCurrentUser, getAdminStatus } from '@/lib/actions';
import AdminDashboardClient from '@/components/AdminDashboardClient';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const [projects, status] = await Promise.all([
    getProjects(),
    getAdminStatus()
  ]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white pt-28 pb-12 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bento-card border-dashed bg-zinc-900/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">Authenticated Access</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Control Center</h1>
            <p className="text-zinc-500 text-sm mt-1">Authorized as {user.name} ({user.email})</p>
          </div>
          <div className="bg-zinc-950/50 backdrop-blur border border-zinc-800 px-5 py-4 rounded-[1.5rem] flex items-center gap-8 text-[11px] font-bold tracking-widest text-zinc-400">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${status.dbConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
              CORE STATUS: {status.dbConnected ? 'SYNCHRONIZED' : 'OFFLINE'}
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
              NODES: {status.projectCount} ARTIFACTS / {status.userCount} ACCOUNTS
            </div>
          </div>
        </header>

        <AdminDashboardClient initialProjects={projects} />
      </div>
    </main>
  );
}
