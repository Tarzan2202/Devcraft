'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import ContactModal from '@/components/ContactModal';
import { getProjects } from '@/lib/actions';
import { Code2, Monitor, Heart, Shield, ChevronRight, Star, Layout, Briefcase, Zap, Globe, CheckCircle2, MessageCircle } from 'lucide-react';
import { Project } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error: any) {
        console.error('Failed to fetch projects', error);
        if (error.message === 'DATABASE_NOT_CONFIGURED') {
          setDbError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px]">
            
            {/* Hero Card */}
            <div className="md:col-span-8 md:row-span-2 bento-card relative overflow-hidden flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe size={200} />
              </div>
              <div className="relative z-10 p-2 md:p-8">
                <span className="text-indigo-500 font-bold text-xs mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Star size={14} className="fill-indigo-500" /> MY CREATIVE PORTFOLIO
                </span>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.9] tracking-tighter">
                </h2>
                <p className="text-zinc-400 max-w-xl text-sm md:text-lg leading-relaxed mb-4">
                  ยินดีต้อนรับสู่พื้นที่รวบรวมผลงานและโปรเจกต์ต่างๆ ที่ผมได้พัฒนาขึ้นมา 
                  โดยเน้นการสร้างประสบการณ์ผู้ใช้งานที่ดี การออกแบบที่สวยงาม 
                  และเลือกใช้เทคโนโลยีที่ทันสมัยเพื่อตอบโจทย์การใช้งานที่มีประสิทธิภาพ
                </p>
              </div>
            </div>

            {/* Success Story Stats */}
            <div className="md:col-span-4 md:row-span-1 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between group shadow-2xl shadow-indigo-500/20">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-6 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">EXPERIENCE</span>
              </div>
              <div>
                <div className="text-5xl font-black mb-1">{projects.length > 0 ? projects.length : 12}+</div>
                <div className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em]">โปรเจกต์ที่ทำเสร็จสิ้น</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Archive Section */}
      <section id="projects" className="py-32 px-6 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-indigo-500 font-black text-[10px] uppercase font-bold tracking-[0.4em] mb-3 block">Portfolio</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">ผลงานที่ผมภาคภูมิใจ</h2>
              <p className="text-zinc-500 text-sm md:text-lg mt-4 max-w-lg">
                สำรวจเว็บไซต์และระบบต่างๆ ที่ผมได้พัฒนาขึ้นมา เพื่อตอบโจทย์ความท้าทายและการเรียนรู้เทคโนโลยีใหม่ๆ
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 h-[450px] rounded-3xl animate-pulse" />
              ))
            ) : dbError ? (
              <div className="col-span-full py-20 text-center border border-zinc-800 bg-red-500/5 rounded-[2.5rem]">
                <p className="text-red-400 font-bold uppercase tracking-[0.2em] mb-2">ไม่สามารถเชื่อมต่อฐานข้อมูลได้</p>
                <p className="text-zinc-500 text-sm">หากคุณรันบนเครื่องตัวเอง โปรดตรวจสอบไฟล์ .env.local และตั้งค่า MONGODB_URI</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project._id?.toString()} project={project} />
              ))
            ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-[2.5rem]">
                    <p className="text-zinc-600 font-bold uppercase tracking-[0.3em]">ยังไม่มีผลงานในระบบ</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer System Status */}
      <footer className="py-16 px-6 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Code2 className="text-white" size={16} />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-indigo-400 uppercase">MY PORTFOLIO</h1>
              </Link>
              <p className="text-zinc-600 text-xs max-w-xs text-center md:text-left leading-relaxed">
                มุ่งมั่นพัฒนาซอฟต์แวร์และเว็บไซต์ที่มีคุณภาพ เพื่อส่งมอบประสบการณ์ที่ดีที่สุดให้กับผู้ใช้งาน
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6 text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
              <div className="flex gap-8">
                <a href="#projects" className="hover:text-white transition-colors">ผลงาน</a>
                <a href="#services" className="hover:text-white transition-colors">ทักษะ</a>
                <button 
                  onClick={() => setShowQR(true)}
                  className="hover:text-white transition-colors"
                >
                  ติดต่อผม
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span>&copy; 2024 MY PORTFOLIO</span>
                <div className="h-4 w-px bg-zinc-800"></div>
                <span className="text-green-500 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   พร้อมสำหรับโอกาสใหม่
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ContactModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </main>
  );
}
