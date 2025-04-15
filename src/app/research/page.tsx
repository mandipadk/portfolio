'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAllResearch } from '@/data/research';
import ResearchList from '@/components/research/ResearchList';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function ResearchPage() {
  const researchProjects = getAllResearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <main className="text-white min-h-screen selection:bg-teal-300 selection:text-neutral-950 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)]" />
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Quantum Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:8rem_8rem]" />

        {/* Accent Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.12),transparent)]" />
      </div>

      <Navbar isMenuOpen={false} setIsMenuOpen={setIsMenuOpen} />

      <div className="relative pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="mb-24 space-y-6">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
              >
                Home
                <span className="text-white/30">→</span>
              </Link>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light text-white/90">
                Research
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-white/60 font-light max-w-3xl">
              Exploring quantum computing, computational dimensions, and their practical applications.
            </p>
            <div className="h-px w-1/3 bg-sky-500/20 mt-6"></div>
          </div>

          {/* Research List */}
          <ResearchList researchProjects={researchProjects} />
        </div>
      </div>
    </main>
  );
}
