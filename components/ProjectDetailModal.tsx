'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Layers, Calendar, Tag } from 'lucide-react';
import { Project } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ProjectDetailModal = ({ isOpen, onClose, project }: ProjectDetailModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors z-10 bg-black/20 backdrop-blur-md rounded-full"
              aria-label="ปิด"
            >
              <X size={20} />
            </button>

            {/* Left side - Image */}
            <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-full">
              <Image 
                src={project.imageUrl || `https://picsum.photos/seed/${project.title}/800/450`} 
                alt={project.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-900" />
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="mb-8">
                <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                  {project.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none mb-6 text-white">
                  {project.title}
                </h3>
                <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                 {/* เพิ่ม whitespace-pre-line และ break-words เพื่อกันข้อความยาวๆ ล้นขอบ */}
                  <p className="whitespace-pre-line break-words">{project.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <Tag size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Category</span>
                    </div>
                    <div className="text-xs font-bold text-white">{project.category}</div>
                </div>
                {/* Add more project details here */}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 text-xs tracking-widest uppercase shadow-lg shadow-indigo-600/20"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all active:scale-95 text-xs tracking-widest uppercase border border-zinc-700"
                  >
                    <Github size={16} />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
