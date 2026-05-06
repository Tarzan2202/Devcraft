'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, User, LogOut, Layout, X, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import ContactModal from '@/components/ContactModal';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-800">
               <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Code2 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-400">MY<span className="text-white">PORTFOLIO</span></h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#projects" className="text-zinc-400 hover:text-white transition-colors">ผลงาน</Link>
            
            {/* Contact Dropdown */}
            <div className="relative group">
              <button className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1 py-7">
                ติดต่อเรา
              </button>
              <div className="absolute top-full -right-4 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl translate-y-2 group-hover:translate-y-0">
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => setShowQRModal(true)}
                    className="w-full flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LINE ID</div>
                      <div className="text-xs font-bold">@0904028671</div>
                    </div>
                  </button>

                  <a 
                    href="tel:0904028671" 
                    className="w-full flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">โทรเลย</div>
                      <div className="text-xs font-bold">090-402-8671</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="h-4 w-px bg-zinc-800 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white px-5 py-2 rounded-full border border-indigo-500/20 flex items-center gap-2 transition-all"
                  >
                    <Layout size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase leading-none mb-1">{user.role}</div>
                    <div className="text-xs font-medium text-white max-w-[100px] truncate">สวัสดี, {user.name}</div>
                  </div>
                  <button 
                    onClick={signOut}
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-white text-black hover:bg-zinc-200 px-6 py-2 rounded-full flex items-center gap-2 transition-all active:scale-95 font-bold text-xs"
              >
                <User size={14} />
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ContactModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </>
  );
};

export default Navbar;

