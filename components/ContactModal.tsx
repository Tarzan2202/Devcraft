'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
              aria-label="ปิด"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-4">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2 uppercase text-white">แสกนเพื่อเพิ่มเพื่อน</h3>
              <p className="text-zinc-500 text-sm">แสกนคิวอาร์โค้ดด้านล่างเพื่อปรึกษาผมได้ทันที</p>
            </div>

            <div className="bg-white p-4 rounded-3xl inline-block mb-6 shadow-xl">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://line.me/ti/p/_d4yKzdv_U" 
                alt="LINE QR Code" 
                className="w-48 h-48"
              />
            </div>

            <div className="space-y-4">
              <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest bg-zinc-950 py-3 rounded-xl border border-zinc-800">
                LINE ID: 0904028671
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-zinc-100 text-black font-black rounded-2xl hover:bg-white transition-all active:scale-95 text-xs tracking-widest uppercase"
              >
                ตกลง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
