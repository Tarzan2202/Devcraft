'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';

export default function UserPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-6">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-32 h-32 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <User size={64} className="text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-bold text-sm tracking-widest uppercase">
                <Shield size={14} /> {user.role} Account
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</div>
              </div>
              <div className="text-lg font-medium">{user.email}</div>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  <Phone size={20} />
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Phone Number</div>
              </div>
              <div className="text-lg font-medium">{user.phone || 'Not provided'}</div>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  <Calendar size={20} />
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Account Created</div>
              </div>
              <div className="text-lg font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown'}
              </div>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                  <Shield size={20} />
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Access Level</div>
              </div>
              <div className="text-lg font-medium capitalize">{user.role}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
