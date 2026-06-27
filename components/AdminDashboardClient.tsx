'use client';

import React, { useState, useEffect } from 'react';
import { Project, User } from '@/lib/types';
import { Plus, Edit2, Trash2, Search, ExternalLink, Users, Layout, Shield, Mail, Phone, Save, X, UserCog } from 'lucide-react';
import AdminProjectForm from './AdminProjectForm';
import Image from 'next/image';

interface AdminDashboardClientProps {
  initialProjects: Project[];
}

const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ initialProjects }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'users'>('projects');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // const handleDelete = async (id: string) => {
  //   if (confirm('Are you sure you want to delete this project?')) {
  //     await deleteProject(id);
  //     setProjects(projects.filter(p => p._id!.toString() !== id));
  //   }
  // };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Tab Selection */}
      <div className="flex bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800 w-fit">
        <button 
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'}`}
        >
          <Layout size={18} /> PROJECTS
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'}`}
        >
          <Users size={18} /> OPERATORS
        </button>
      </div>

      {(isFormOpen || editingProject) ? (
        <AdminProjectForm 
          existingProject={editingProject} 
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProject(undefined);
          }} 
        />
      ) : activeTab === 'projects' ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-3xl mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="text" 
                placeholder="Search artifacts..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 md:py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} /> NEW ARTIFACT
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map((project) => (
              <div 
                key={project._id?.toString()}
                className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-zinc-900 transition-all duration-300"
              >
                <div className="w-full md:w-32 h-40 md:h-20 bg-zinc-950 rounded-xl overflow-hidden shrink-0 relative border border-zinc-800">
                  <Image
                    src={project.imageUrl || `https://picsum.photos/seed/${project.title}/200/120`}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                    <span className="text-[9px] font-black transform uppercase tracking-widest text-indigo-400">{project.category}</span>
                    {project.featured && (
                      <div className="flex items-center gap-1 text-[9px] font-black text-amber-500">
                        <div className="w-1 h-1 rounded-full bg-amber-500"></div> CORE PROJECT
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-100 transition-colors truncate">{project.title}</h3>
                </div>
                
                <div className="flex items-center justify-center gap-2 shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => setEditingProject(project)}
                    className="flex-1 md:flex-none p-4 md:p-3 bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-zinc-400 hover:text-white rounded-xl transition-all flex justify-center"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  {/* <button 
                    onClick={() => handleDelete(project._id!.toString())}
                    className="flex-1 md:flex-none p-4 md:p-3 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 text-zinc-600 hover:text-red-500 rounded-xl transition-all flex justify-center"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button> */}
                  <a 
                    href={project.liveUrl || '#'} 
                    target="_blank"
                    className="flex-1 md:flex-none p-4 md:p-3 bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-zinc-400 hover:text-white rounded-xl transition-all flex justify-center"
                    title="View Live"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="py-20 text-center border border-white/5 border-dashed rounded-3xl">
                <p className="text-white/20 font-bold uppercase tracking-widest italic">No matching projects found</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="text" 
                placeholder="Search operators..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Authorized Personnel Only
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardClient;
