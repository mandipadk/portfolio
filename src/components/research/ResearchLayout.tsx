'use client';
import React from 'react';
import { motion } from 'framer-motion';
import TableOfContents from './TableOfContents';
import ResearchContent from './ResearchContent';

interface ContentSection {
  title: string;
  content: string;
  visualType?: "code" | "table" | "image" | "graph" | "equation";
  visual?: string;
}

interface ResearchLayoutProps {
  title: string;
  date: string;
  author: string;
  content: {
    sections: ContentSection[];
  };
  estimatedReadTime?: string;
  category?: string;
}

const ResearchLayout: React.FC<ResearchLayoutProps> = ({
  title,
  date,
  author,
  content,
  estimatedReadTime,
  category
}) => {
  return (
    <div className="research-layout w-full min-h-screen bg-black/90 text-white pt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 text-sm text-white/50 mb-4">
            <span>{category}</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-white/30"></span>
            <span>{estimatedReadTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-white/90">{title}</h1>
          
          <div className="flex items-center mb-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/80 to-purple-600/80 mr-3"></div>
            <span className="text-white/70">{author}</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          <motion.div 
            className="lg:w-3/4 order-2 lg:order-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResearchContent content={content} title={''} date={''} author={''} estimatedReadTime={0} category={''} />
          </motion.div>
          
          <motion.div 
            className="lg:w-1/4 order-1 lg:order-2 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TableOfContents content={content} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResearchLayout; 