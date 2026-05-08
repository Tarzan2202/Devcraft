'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, User, LogOut, Layout, X, MessageCircle, Phone, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import ContactModal from '@/components/ContactModal';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [showQRModal, setShowQRModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#projects" className="text-zinc-400 hover:text-white transition-colors">ผลงาน</Link>
            
            {/* Contact Dropdown */}
            <div className="relative group">
              <button className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1 py-7">
                ติดต่อผม
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

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                onClick={toggleMobileMenu}
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-20 bottom-0 w-full max-w-xs bg-zinc-900 border-l border-zinc-800 z-50 md:hidden p-6 overflow-y-auto"
              >
                <div className="flex flex-col gap-6">
                  <Link 
                    href="/#projects" 
                    className="text-lg font-bold text-zinc-400 hover:text-white transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    ผลงาน
                  </Link>
                  
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">ช่องทางติดต่อ</div>
                    <button 
                      onClick={() => {
                        setShowQRModal(true);
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-left"
                    >
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-sm font-bold">LINE ID: @0904028671</span>
                    </button>
                    <a 
                      href="tel:0904028671" 
                      className="w-full flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-left"
                    >
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500">
                        <Phone size={20} />
                      </div>
                      <span className="text-sm font-bold">090-402-8671</span>
                    </a>
                  </div>

                  <div className="h-px bg-zinc-800 w-full"></div>

                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{user.role}</div>
                          <div className="text-sm font-bold truncate max-w-[150px]">{user.name}</div>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <Link 
                          href="/admin" 
                          className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
                          onClick={toggleMobileMenu}
                        >
                          <Layout size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          signOut();
                          toggleMobileMenu();
                        }}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold uppercase tracking-widest text-xs"
                      >
                        <LogOut size={16} /> ออกจากระบบ
                      </button>
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs"
                      onClick={toggleMobileMenu}
                    >
                      <User size={16} /> เข้าสู่ระบบ (สำหรับแอดมิน)
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <ContactModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </>
  );
};

export default Navbar;

