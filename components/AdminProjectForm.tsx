'use client';

import React, { useState } from 'react';
import { addProject, updateProject, deleteProject } from '@/lib/actions';
import { Project } from '@/lib/types';
import { Plus, X, Save, Trash2, Layout, Link as LinkIcon, Image as ImageIcon, Upload } from 'lucide-react';

interface AdminProjectFormProps {
  existingProject?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminProjectForm: React.FC<AdminProjectFormProps> = ({ existingProject, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Project, '_id' | 'createdAt'>>({
    title: existingProject?.title || '',
    description: existingProject?.description || '',
    imageUrl: existingProject?.imageUrl || '',
    category: existingProject?.category || 'Web Application',
    techStack: existingProject?.techStack || [],
    liveUrl: existingProject?.liveUrl || '',
    githubUrl: existingProject?.githubUrl || '',
    featured: existingProject?.featured || false,
  });

  const [newTech, setNewTech] = useState('');
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large. Please keep it under 2MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingProject?._id) {
      await updateProject(existingProject._id.toString(), formData);
    } else {
      await addProject(formData);
    }
    onSuccess();
  };

  const addTech = () => {
    if (newTech && !formData.techStack.includes(newTech)) {
      setFormData({ ...formData, techStack: [...formData.techStack, newTech] });
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) });
  };

  return (
    <div className="bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-zinc-800 max-w-3xl w-full mx-auto shadow-2xl backdrop-blur-xl">
      <div className="flex justify-between items-center mb-8 md:mb-10">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">{existingProject ? 'EDIT ARTIFACT' : 'REGISTER NEW ARTIFACT'}</h2>
          <p className="text-zinc-500 text-[10px] md:text-xs mt-1">Configure project properties and deployment links.</p>
        </div>
        <button onClick={onCancel} className="p-2 md:p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">System Identity (Title)</label>
            <input 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-sm md:text-base"
              placeholder="e.g. Neural Nexus Dashboard"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data Description</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none text-sm md:text-base"
              placeholder="Detailed overview of the artifact's purpose..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <ImageIcon size={10} /> Image Content
              </label>
              <div className="flex bg-white/5 p-1 rounded-lg">
                <button 
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${imageTab === 'url' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  URL
                </button>
                <button 
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${imageTab === 'upload' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  FILE
                </button>
              </div>
            </div>

            {imageTab === 'url' ? (
              <input 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            ) : (
              <div className="relative group">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full bg-white/5 border border-dashed border-white/10 rounded-xl px-4 py-3 flex items-center justify-center gap-3 group-hover:border-indigo-500/50 transition-colors ${isUploading ? 'animate-pulse' : ''}`}>
                  <Upload size={16} className="text-white/40 group-hover:text-indigo-400" />
                  <span className="text-sm text-white/40 group-hover:text-white">
                    {isUploading ? 'Processing...' : formData.imageUrl.startsWith('data:') ? 'Change Image' : 'Choose local file'}
                  </span>
                </div>
              </div>
            )}
            
            {formData.imageUrl && (
              <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, imageUrl: ''})}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-lg text-white hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Layout size={10} /> Category
            </label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none text-sm"
            >
              <option value="Web Application">Web Application</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Landing Page">Landing Page</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Resource Stack</label>
          <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl">
            {formData.techStack.length === 0 && <span className="text-zinc-700 text-xs italic">No tags added...</span>}
            {formData.techStack.map(tech => (
              <span key={tech} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] md:text-xs font-bold text-indigo-400 animate-in fade-in zoom-in duration-300">
                {tech} 
                <button type="button" onClick={() => removeTech(tech)} className="p-0.5 hover:bg-indigo-500/20 rounded-md transition-colors">
                  <X size={12}/>
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
              placeholder="Add tech (e.g. Next.js, Rust)"
            />
            <button 
              type="button" 
              onClick={addTech}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-800 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold text-xs flex items-center justify-center gap-2"
            >
              <Plus size={16} /> ADD
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <LinkIcon size={10} /> Live Deployment
            </label>
            <input 
              value={formData.liveUrl}
              onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
              placeholder="https://artifact.io"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              Source Repository
            </label>
            <input 
              value={formData.githubUrl}
              onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-zinc-950/30 border border-zinc-800 rounded-2xl">
          <input 
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
            className="w-5 h-5 bg-zinc-950 border border-zinc-700 rounded-md accent-indigo-500 cursor-pointer"
          />
          <label htmlFor="featured" className="text-sm font-bold text-zinc-400 cursor-pointer select-none">
            Promote to <span className="text-indigo-400">Featured Artifact</span>
          </label>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20"
        >
          <Save size={20} /> {existingProject ? 'COMMIT CHANGES' : 'DEPLOY ARTIFACT'}
        </button>
      </form>
    </div>
  );
};

export default AdminProjectForm;
