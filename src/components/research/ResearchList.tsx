'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Tag } from 'lucide-react';
import { type ResearchProject } from '@/data/research';

interface ResearchListProps {
  researchProjects: ResearchProject[];
}

export default function ResearchList({ researchProjects }: ResearchListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique tags from research projects
  const allTags = [...new Set(researchProjects.flatMap(project => project.tags))];

  // Filter projects based on selected tags and search query
  const filteredProjects = researchProjects.filter(project => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => project.tags.includes(tag));
    
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTags && matchesSearch;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-12">
      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research projects..."
            className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 
              text-white/90 placeholder-white/30 backdrop-blur-sm
              focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50
              transition-all duration-300"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-3">
          {allTags.map(tag => (
            <motion.button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-light flex items-center gap-2
                border transition-all duration-300 transform hover:scale-105
                ${selectedTags.includes(tag) 
                  ? 'bg-sky-500/20 text-white border-sky-500/50' 
                  : 'bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <motion.p 
          className="text-white/50 text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No research projects match your criteria.
        </motion.p>
      ) : (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredProjects.map((project) => (
            <ResearchCard key={project.id} project={project} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function ResearchCard({ project }: { project: ResearchProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/research/${project.slug}`}>
        <motion.div 
          className="group relative h-full rounded-xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm
            border border-white/[0.08] hover:border-sky-500/20 transition-all duration-500
            hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.15)]"
          whileHover={{ y: -5 }}
        >
          {/* Project Image */}
          <div className="aspect-video relative overflow-hidden">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-purple-500/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-80" />
            
            {/* Tags */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 text-xs font-light rounded-full 
                    bg-white/10 backdrop-blur-sm text-white/80 border border-white/10"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="px-3 py-1 text-xs font-light rounded-full 
                  bg-white/10 backdrop-blur-sm text-white/70 border border-white/10">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h3 className="text-xl font-light text-white/90 group-hover:text-sky-500/90 transition-colors duration-500">
              {project.title}
            </h3>
            
            <p className="text-white/60 text-sm font-light leading-relaxed">
              {project.shortDescription}
            </p>
            
            {/* Date and Read More */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-white/40 text-sm">
                {new Date(project.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
              
              <motion.div 
                className="flex items-center gap-1 text-white/60 group-hover:text-sky-500/90 transition-colors duration-500"
                whileHover={{ x: 3 }}
              >
                <span className="text-sm">Read More</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Hover Effect */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 70%)',
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
} 