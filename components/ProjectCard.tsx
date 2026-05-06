'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Layers } from 'lucide-react';
import { Project } from '@/lib/types';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square md:aspect-video overflow-hidden">
        <Image 
          src={project.imageUrl || `https://picsum.photos/seed/${project.title}/800/450`} 
          alt={project.title}
          fill
          unoptimized
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
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
          {project.title}
        </h3>
        
        <p className="text-zinc-500 text-xs mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-3">
             {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                <ExternalLink size={16} />
              </a>
             )}
             {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" className="text-zinc-600 hover:text-white transition-colors">
                <Github size={16} />
              </a>
             )}
          </div>
          
          <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-indigo-400 transition-colors">
            DETAILS →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
