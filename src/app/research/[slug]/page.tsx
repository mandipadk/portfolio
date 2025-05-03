'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getAllResearch, getRelatedResearch, getResearchBySlug, ResearchProject } from '@/data/research';
import Navbar from '@/components/Navbar';
import TableOfContents from '@/components/research/TableOfContents';
import ResearchContent from '@/components/research/ResearchContent';
import RelatedResearch from '@/components/research/RelatedResearch';
import {useState, useEffect} from 'react';

interface ResearchPageProps {
  params: {
    slug: string;
  };
}

export default function ResearchPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const params = useParams(); // Hook to get route parameters
  // State to hold the fetched data and loading status
  const [research, setResearch] = useState<ResearchProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<ResearchProject[]>([]);
  const [readTime, setReadTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Extract slug, ensuring it's a string
  const slug = typeof params.slug === 'string' ? params.slug : null;

  useEffect(() => {
    // Only fetch if slug is a valid string
    if (slug) {
      setIsLoading(true); // Set loading true when starting fetch
      const foundResearch = getResearchBySlug(slug);

      if (!foundResearch) {
        notFound(); // Call Next.js notFound helper
      } else {
        setResearch(foundResearch);
        setRelatedProjects(getRelatedResearch(foundResearch.id));
        setReadTime(foundResearch.fullDescription ? Math.ceil(foundResearch.fullDescription.split(' ').length / 200) : 0);
        setIsLoading(false); // Set loading false after data is processed
      }
    } else if (params.slug !== undefined) {
       // If params.slug exists but isn't a string (e.g. string[]), it's an error case
       notFound();
    }
     // If slug is initially null/undefined, effect runs, does nothing,
     // then re-runs when params object updates with the actual slug.

  }, [slug, params.slug]); // Dependency array: re-run effect if slug changes

  // Render loading state
  if (isLoading) {
    return (
        <main className="relative min-h-screen bg-black text-white flex items-center justify-center">
            {/* You might want Navbar even during loading */}
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <div className="relative z-10">Loading Research Data...</div>
            {/* Add background elements if desired */}
        </main>
    );
  }

  
  if (!research) {
    notFound();
  }
  
  // const relatedProjects = getRelatedResearch(research.id);
  // const readTime = Math.ceil(research.fullDescription.split(' ').length / 200); // Estimate read time based on word count

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)] z-0">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Quantum Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:8rem_8rem]" />

        {/* Accent Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.12),transparent)]" />
        
        {/* Secondary Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_80%,rgba(168,85,247,0.08),transparent)]" />
      </div>

      <Navbar isMenuOpen={false} setIsMenuOpen={()=>{}}/>
      
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
            <ResearchContent 
              content={research.content} 
              title={research.title} 
              date={research.date} 
              author="Mandip Adhikari" 
              estimatedReadTime={readTime} 
              category={research.tags[0] || ''} 
            />
            
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