'use client';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getAllResearch, getRelatedResearch, getResearchBySlug } from '@/data/research';
import Navbar from '@/components/Navbar';
import TableOfContents from '@/components/research/TableOfContents';
import ResearchContent from '@/components/research/ResearchContent';
import RelatedResearch from '@/components/research/RelatedResearch';
import { useState } from 'react';

interface ResearchPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ResearchPageProps): Promise<Metadata> {
  const research = getResearchBySlug(params.slug);
  
  if (!research) {
    return {
      title: 'Research Not Found',
      description: 'The requested research project could not be found.'
    };
  }
  
  return {
    title: `${research.title} | Research`,
    description: research.shortDescription,
  };
}

export async function generateStaticParams() {
  const researches = getAllResearch();
  
  return researches.map((research) => ({
    slug: research.slug,
  }));
}

export default function ResearchPage({ params }: ResearchPageProps) {
  const research = getResearchBySlug(params.slug);
  
  if (!research) {
    notFound();
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const relatedProjects = getRelatedResearch(research.id);
  const readTime = Math.ceil(research.fullDescription.split(' ').length / 200); // Estimate read time based on word count

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Abstract Background */}
      <div className="fixed inset-0 bg-black z-0">
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
               backgroundSize: '100% 100%',
             }}
        />
      </div>

      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="relative z-10 container mx-auto px-4 py-10 max-w-6xl">
        {/* Back Button */}
        <Link href="/research" className="inline-flex items-center gap-2 mb-8 text-white/70 hover:text-sky-500/90 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Research</span>
        </Link>
        
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-white/90">{research.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(research.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{readTime} min read</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {research.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 text-xs font-light rounded-full 
                  bg-white/[0.03] text-white/80 border border-white/10"
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-xl text-white/80 font-light leading-relaxed max-w-4xl">
            {research.shortDescription}
          </p>
        </div>
        
        {/* Feature Image */}
        {research.image && (
          <div className="relative w-full aspect-video mb-16 rounded-xl overflow-hidden">
            <Image
              src={research.image}
              alt={research.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Main Content */}
          <div>
            <ResearchContent content={research.content} title={''} date={''} author={''} estimatedReadTime={0} category={''} />
            
            {/* References */}
            {research.references && research.references.length > 0 && (
              <div className="mt-16 border-t border-white/10 pt-8">
                <h2 className="text-2xl font-light mb-6 text-white/90">References</h2>
                <ul className="space-y-3 list-decimal pl-5">
                  {research.references.map((reference, index) => (
                    <li key={index} className="text-white/70 text-sm">
                      {reference.url ? (
                        <Link 
                          href={reference.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-sky-500/90 transition-colors"
                        >
                          {reference.title}
                        </Link>
                      ) : (
                        reference.title
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 self-start space-y-8">
            <TableOfContents content={research.content} />
            
            {relatedProjects.length > 0 && (
              <RelatedResearch projects={relatedProjects} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 