'use client';

import React, { useState, useEffect } from 'react';
import { getKnowledge, addKnowledge, updateKnowledge, deleteKnowledge } from '@/lib/actions';
import { Knowledge } from '@/lib/types';
import { Plus, Trash2, Edit2, Save, X, Brain, Database, Search } from 'lucide-react';
import { motion } from 'motion/react';

const KnowledgeAdmin = () => {
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Knowledge, '_id' | 'updatedAt' | 'embedding'>>({
    title: '',
    content: '',
    category: 'profile'
  });

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const data = await getKnowledge();
      setKnowledgeList(data);
    } catch (error) {
      console.error('Failed to fetch knowledge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateKnowledge(isEditing, formData);
      } else {
        await addKnowledge(formData);
      }
      setFormData({ title: '', content: '', category: 'profile' });
      setIsEditing(null);
      fetchKnowledge();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleEdit = (k: Knowledge) => {
    setIsEditing(k._id as string);
    setFormData({
      title: k.title,
      content: k.content,
      category: k.category
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('ยืนยันการลบข้อมูลนี้ออกจากคลังความรู้? (ระบบจะลบ Vector เก่าออกไปด้วย)')) {
      try {
        await deleteKnowledge(id);
        fetchKnowledge();
      } catch (error) {
        alert('ไม่สามารถลบข้อมูลได้');
      }
    }
  };

  const filteredList = knowledgeList.filter(k => 
    k.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    k.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Brain className="text-indigo-500" size={32} />
              KNOWLEDGE BASE <span className="text-indigo-500">RAG (768 Dim)</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">จัดการสิ่งที่ AI "จำ" ได้ เพื่อนำไปตอบในหน้าแชต</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="ค้นหาข้อมูล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                {isEditing ? 'EDIT KNOWLEDGE' : 'ADD KNOWLEDGE'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">หัวข้อ (Title)</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="เช่น ประสบการณ์ทำงาน"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">หมวดหมู่</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                  >
                    <option value="profile">ข้อมูลส่วนตัว</option>
                    <option value="experience">ประสบการณ์</option>
                    <option value="skill">ทักษะ</option>
                    <option value="faq">คำถามพบบ่อย</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">เนื้อหา (Content)</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="พิมพ์รายละเอียดที่ต้องการให้ AI จดจำ..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {isEditing ? 'UPDATE' : 'SAVE'}
                  </button>
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => { setIsEditing(null); setFormData({ title: '', content: '', category: 'profile' }); }}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Database size={20} /> 
              CURRENT DATABASE 
              <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full">{filteredList.length} items</span>
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 border-dashed">
                <p className="text-zinc-500">ไม่พบข้อมูลในระบบ</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredList.map((k) => (
                  <motion.div 
                    layout
                    key={k._id as string}
                    className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl group hover:border-indigo-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            k.category === 'profile' ? 'bg-blue-500/10 text-blue-400' :
                            k.category === 'experience' ? 'bg-green-500/10 text-green-400' :
                            k.category === 'skill' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            {k.category}
                          </span>
                          <h3 className="font-bold text-lg">{k.title}</h3>
                        </div>
                        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                          {k.content}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="text-[10px] text-zinc-600">
                            ID: {(k._id as string).substring(0, 8)}...
                          </div>
                          <div className="text-[10px] text-zinc-600">
                            Vector Status: {k.embedding ? '✅ Active (768 Dim)' : '❌ Missing'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEdit(k)}
                          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(k._id as string)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAdmin;