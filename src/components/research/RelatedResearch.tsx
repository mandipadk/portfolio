import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ResearchProject } from '@/data/research';

interface RelatedResearchProps {
  projects: ResearchProject[];
}

const RelatedResearch: React.FC<RelatedResearchProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="related-research py-4 px-6 bg-white/5 backdrop-blur-sm rounded-xl">
      <h3 className="text-lg font-medium mb-6 text-white/80">Related Research</h3>
      
      <div className="space-y-6">
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Link href={`/research/${project.slug}`} className="block">
              <div className="group space-y-2">
                {project.image && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                    <Image 
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                
                <h4 className="text-sm font-medium text-white/80 group-hover:text-sky-400 transition-colors duration-300">
                  {project.title}
                </h4>
                
                <p className="text-xs text-white/50 line-clamp-2">
                  {project.shortDescription}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-sky-400/70 group-hover:text-sky-400 transition-colors duration-300">
                  <span>Read more</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedResearch;
