'use client';

import React, { useState, useEffect } from 'react';
import { Project, User } from '@/lib/types';
import { Plus, Edit2, Trash2, Search, ExternalLink, Users, Layout, Shield, Mail, Phone, Save, X, UserCog } from 'lucide-react';
import AdminProjectForm from './AdminProjectForm';
import { deleteProject, getAllUsers, updateUser } from '@/lib/actions';
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

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      const controller = { aborted: false };
      const load = async () => {
        if (!controller.aborted) {
          await fetchUsers();
        }
      };
      load();
      return () => { controller.aborted = true; };
    }
  }, [activeTab]);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      setProjects(projects.filter(p => p._id!.toString() !== id));
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser._id) return;

    try {
      await updateUser(editingUser._id.toString(), {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        password: editingUser.password
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-8">
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
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
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
                <div className="w-full md:w-32 h-20 bg-zinc-950 rounded-xl overflow-hidden shrink-0 relative border border-zinc-800">
                  <Image 
                    src={project.imageUrl || `https://picsum.photos/seed/${project.title}/200/120`} 
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[9px] font-black transform uppercase tracking-widest text-indigo-400">{project.category}</span>
                    {project.featured && (
                      <div className="flex items-center gap-1 text-[9px] font-black text-amber-500">
                        <div className="w-1 h-1 rounded-full bg-amber-500"></div> CORE PROJECT
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-100 transition-colors">{project.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setEditingProject(project)}
                    className="p-3 bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-zinc-400 hover:text-white rounded-xl transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id!.toString())}
                    className="p-3 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 text-zinc-600 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <a 
                    href={project.liveUrl || '#'} 
                    target="_blank"
                    className="p-3 bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 text-zinc-400 hover:text-white rounded-xl transition-all"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map(user => (
              <div 
                key={user._id?.toString()}
                className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 hover:bg-zinc-900 transition-all group"
              >
                {editingUser && editingUser._id === user._id ? (
                  <form onSubmit={handleUpdateUser} className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Edit Operator Profile</h4>
                      <button type="button" onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                    </div>
                    <input 
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500"
                      placeholder="Name"
                    />
                    <input 
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500"
                      placeholder="Email"
                    />
                    <input 
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500"
                      placeholder="Phone"
                    />
                    <input 
                      type="password"
                      onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500"
                      placeholder="New Password (leave blank to keep current)"
                    />
                    <select 
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'user'})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500"
                    >
                      <option value="admin">แอดมิน</option>
                      <option value="user">ผู้ใช้</option>
                    </select>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> Commit Changes
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                          <Shield className={user.role === 'admin' ? 'text-indigo-400' : 'text-zinc-500'} size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-indigo-100 transition-colors">{user.name}</h3>
                          <div className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-indigo-400' : 'text-zinc-500'}`} style={{fontSize: '9px'}}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <UserCog size={16} />
                      </button>
                    </div>

                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <Mail size={14} /> {user.email}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <Phone size={14} /> {user.phone || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardClient;
