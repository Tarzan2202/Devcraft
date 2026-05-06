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
                  <Star size={14} className="fill-indigo-500" /> บริการรับทำเว็บไซต์โดยมืออาชีพ
                </span>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.9] tracking-tighter">
                  ให้ธุรกิจของคุณ<br/>
                  <span className="text-zinc-500 text-3xl font-medium tracking-tight">เติบโตบนโลกออนไลน์</span>
                </h2>
                <p className="text-zinc-400 max-w-xl text-sm md:text-lg leading-relaxed mb-4">
                  เราช่วยสร้างเว็บไซต์ที่ตอบโจทย์ความต้องการของคุณ ไม่ว่าคุณจะทำร้านค้าออนไลน์ 
                  หรือเว็บไซต์แนะนำบริษัท เราออกแบบให้สวยงาม ใช้งานง่าย 
                  และที่สำคัญคือคุณไม่ต้องปวดหัวกับเรื่องเทคนิคที่เราดูแลให้ครบวงจร
                </p>
              </div>
            </div>

            {/* Success Story Stats */}
            <div className="md:col-span-4 md:row-span-1 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between group shadow-2xl shadow-indigo-500/20">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-6 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">ความภูมิใจของเรา</span>
              </div>
              <div>
                <div className="text-5xl font-black mb-1">{projects.length > 0 ? projects.length : 12}+</div>
                <div className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em]">ธุรกิจที่เราได้ร่วมงานด้วย</div>
              </div>
            </div>

            {/* Fast & Secure Tile */}
            <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-3">
                <Zap size={20} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">ความเร็ว</span>
              <div className="font-bold text-sm text-white">โหลดไว ทันใจ</div>
            </div>
            
            <div className="md:col-span-2 md:row-span-1 bento-card flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-3">
                <Shield size={20} />
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">ความปลอดภัย</span>
              <div className="font-bold text-sm text-white">ปลอดภัย ได้มาตรฐาน</div>
            </div>

            {/* Contact CTA */}
            <div id="contact" className="md:col-span-4 md:row-span-2 bento-card bg-zinc-950 flex flex-col justify-between border-dashed border-2 border-zinc-800 p-8">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">พร้อมดูแลคุณ</h3>
               </div>
               <div>
                  <h2 className="text-2xl font-black mb-4 uppercase leading-tight">เริ่มสร้างเว็บไซต์<br/>ที่ใช่สำหรับคุณ</h2>
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed">ปรึกษาเราได้ฟรี ไม่มีค่าใช้จ่าย 
                  เราช่วยคุณออกแบบระบบที่ใช้งานง่ายที่สุด เพื่อผลกำไรของธุรกิจคุณ</p>
                  <button 
                    onClick={() => setShowQR(true)}
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    คุยกับเราทาง LINE
                  </button>
               </div>
            </div>

            {/* Services Summary */}
            <div id="services" className="md:col-span-8 md:row-span-1 bento-card grid grid-cols-3 gap-8 items-center bg-indigo-950/10 border-indigo-900/30 p-8">
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 transition-colors">
                  <Layout size={20} className="text-indigo-400 group-hover:text-white" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-widest leading-tight">ออกแบบ<br/>เห็นแล้วจดจำ</span>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 transition-colors">
                  <Monitor size={20} className="text-indigo-400 group-hover:text-white" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-widest leading-tight">ใช้ง่าย<br/>ไม่ยุ่งยาก</span>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-600 transition-colors">
                  <Star size={20} className="text-indigo-400 group-hover:text-white" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-widest leading-tight">ดูแลดี<br/>ไม่มีทิ้งงาน</span>
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
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">ผลงานที่เราภาคภูมิใจ</h2>
              <p className="text-zinc-500 text-sm md:text-lg mt-4 max-w-lg">
                สำรวจเว็บไซต์และระบบต่างๆ ที่เราพัฒนาขึ้นมา เพื่อตอบโจทย์ความต้องการที่หลากหลายของธุรกิจ
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
                <h1 className="text-lg font-bold tracking-tight text-indigo-400 uppercase">CODECRAFT<span className="text-white">.TH</span></h1>
              </Link>
              <p className="text-zinc-600 text-xs max-w-xs text-center md:text-left leading-relaxed">
                สร้างสรรค์เว็บไซต์และระบบออนไลน์ที่มีคุณภาพ เพื่อการเติบโตที่ไม่สิ้นสุดของธุรกิจคุณ
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6 text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
              <div className="flex gap-8">
                <a href="#projects" className="hover:text-white transition-colors">ผลงาน</a>
                <a href="#services" className="hover:text-white transition-colors">บริการ</a>
                <button 
                  onClick={() => {
                    const navContactBtn = document.querySelector('button[onClick*="setShowContactPopup"]');
                    if (navContactBtn) (navContactBtn as HTMLButtonElement).click();
                  }}
                  className="hover:text-white transition-colors"
                >
                  ติดต่อเรา
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span>&copy; 2024 CODECRAFT THAILAND</span>
                <div className="h-4 w-px bg-zinc-800"></div>
                <span className="text-green-500 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   พร้อมรับโครงการใหม่
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
