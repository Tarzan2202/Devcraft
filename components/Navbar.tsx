'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, User, LogOut, Layout, X, MessageCircle, Phone, Menu, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import ContactModal from '@/components/ContactModal';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Code2 className="text-white sm:w-5 sm:h-5" size={18} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-indigo-400 whitespace-nowrap">MY<span className="text-white">PORTFOLIO</span></h1>
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
                  <a 
                    href="mailto:peeravich22@gmail.com"
                    className="w-full flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">อีเมล</div>
                      <div className="text-xs font-bold">peeravich22@gmail.com</div>
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

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {/* เปลี่ยนเป็นปุ่มกดเพื่อสั่งเปิด Modal ตัวเดียวกับ Desktop */}
              {/* Mobile Navigation */}
          <div className="md:hidden relative flex items-center gap-2" id="mobile-nav">
            <Link 
              href="/#projects" 
              className="text-[11px] font-bold uppercase tracking-widest bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              ผลงาน
            </Link>
            
            {/* ปุ่มหลักสำหรับสลับเปิด/ปิด Dropdown เมนู */}
            <button 
              onClick={() => {
                // ประกาศตัวแปรนี้เพิ่มด้านบนด้วย หรือถ้าขยับไปใช้ State ตัวเดิมก็สามารถสั่งผูกได้ครับ
                // ตัวอย่างนี้สมมติให้โยงไปเปิดเมนูด้านล่าง
                const dropdown = document.getElementById('mobile-contact-dropdown');
                dropdown?.classList.toggle('hidden');
              }}
              className="text-[11px] font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-1"
            >
              ติดต่อผม
            </button>

            {/* กล่องรายการ Dropdown (ซ่อนอยู่ตอนแรก จะแสดงเมื่อกดปุ่มด้านบน) */}
            <div 
              id="mobile-contact-dropdown"
              className="hidden absolute top-full right-0 mt-2 w-60 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="space-y-1">
                {/* LINE */}
                <a 
                  href="https://line.me/ti/p/_d4yKzdv_U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 shrink-0">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">LINE ID</div>
                    <div className="text-xs font-bold text-zinc-300">@0904028671</div>
                  </div>
                </a>

                {/* โทรศัพท์ */}
                <a 
                  href="tel:0904028671" 
                  className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">โทรเลย</div>
                    <div className="text-xs font-bold text-zinc-300">090-402-8671</div>
                  </div>
                </a>

                {/* อีเมล */}
                <a 
                  href="mailto:peeravich22@gmail.com"
                  className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">อีเมล</div>
                    <div className="text-xs font-bold text-zinc-300">peeravich22@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </nav>
      <ContactModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
    </>
  );
};

export default Navbar;

