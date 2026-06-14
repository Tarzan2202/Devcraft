'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Github, Layers } from 'lucide-react';
import { Project } from '@/lib/types';
import Image from 'next/image';
import ProjectDetailModal from './ProjectDetailModal';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showDetail, setShowDetail] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), springConfig);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);

    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <>
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-colors duration-500 flex flex-col"
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(350px circle at ${x}px ${y}px, rgba(79, 70, 229, 0.15), transparent 80%)`
            ),
          }}
        />

        <div className="relative aspect-square md:aspect-video overflow-hidden" style={{ transform: "translateZ(20px)" }}>
          <Image 
            src={project.imageUrl || `https://picsum.photos/seed/${project.title}/800/450`} 
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-black/60 backdrop-blur-md text-white border border-white/10 rounded">
              {project.category}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex-grow flex flex-col" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-lg font-bold text-white mb-2 leading-tight">
            {project.title}
          </h3>
          
          <p className="text-zinc-500 text-xs mb-6 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex gap-3">
               {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" className="text-zinc-600 hover:text-white transition-colors relative z-20">
                  <Github size={16} />
                </a>
               )}
            </div>
            
            <button 
              onClick={() => setShowDetail(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-indigo-400 transition-colors relative z-20"
            >
              DETAILS →
            </button>
          </div>
        </div>
      </motion.div>

      <ProjectDetailModal 
        isOpen={showDetail} 
        onClose={() => setShowDetail(false)} 
        project={project} 
      />
    </>
  );
};

export default ProjectCard;
