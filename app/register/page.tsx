'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { register } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/login?registered=true');
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-6">
      <Navbar />
      
      <div className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
        >
          <div className="mb-10 text-center">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <ShieldCheck className="text-indigo-500" size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Create Account</h1>
            <p className="text-zinc-500 text-sm">Join CodecrafTH to manage your artifacts.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  required
                  name="name"
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  required
                  name="email"
                  type="email"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  required
                  name="phone"
                  type="tel"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="+66 81 234 5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                <input 
                  required
                  name="password"
                  type="password"
                  minLength={6}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-indigo-500/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Register Artifact <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-zinc-800">
            <p className="text-zinc-500 text-xs">
              Already have an account?{' '}
              <Link href="/login" className="text-white font-bold hover:text-indigo-400 transition-colors">
                Login now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
