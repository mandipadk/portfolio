import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import { CalendarIcon, TagIcon, ClockIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ContentSection {
  title: string;
  content: string;
  visualType?: "code" | "table" | "image" | "graph" | "equation";
  visual?: string;
}

interface ResearchContentProps {
  title: string;
  date: string;
  author: string;
  content: {
    sections: ContentSection[];
  };
  estimatedReadTime: number;
  category: string;
}

const ResearchContent: React.FC<ResearchContentProps> = ({
  title,
  date,
  author,
  content,
  estimatedReadTime,
  category
}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.article 
      className="research-content w-full max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
    >
      <header className="mb-12">
        <motion.h1 
          className="text-5xl font-bold mb-6 text-white"
          variants={fadeInUp}
        >
          {title}
        </motion.h1>

        <motion.div 
          className="flex flex-wrap gap-4 text-sm text-white/60"
          variants={fadeInUp}
        >
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {format(new Date(date), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            {estimatedReadTime} min read
          </div>
          <div className="flex items-center">
            <TagIcon className="w-4 h-4 mr-2" />
            {category}
          </div>
        </motion.div>

        <motion.div 
          className="mt-4 text-white/60"
          variants={fadeInUp}
        >
          By {author}
        </motion.div>
      </header>

      <div className="content">
        {content.sections.map((section, index) => {
          const id = section.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          
          return (
            <div key={index} className="mb-12">
              <motion.h2 
                id={id}
                className="text-2xl font-light mb-6 text-white/90" 
                variants={fadeInUp}
              >
                {section.title}
              </motion.h2>
              
              <motion.div 
                className="text-base text-white/70 mb-6 leading-relaxed" 
                variants={fadeInUp}
              >
                <p>{section.content}</p>
                
                {section.visualType && section.visual && (
                  <div className="my-8">
                    {section.visualType === 'image' && (
                      <div className="relative h-80 w-full">
                        <Image 
                          src={section.visual}
                          alt={section.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {section.visualType === 'code' && (
                      <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                        <code className="language-javascript text-sm">
                          {section.visual}
                        </code>
                      </pre>
                    )}
                    
                    {section.visualType === 'equation' && (
                      <div className="py-4 text-center text-xl font-serif text-white/80">
                        {section.visual}
                      </div>
                    )}
                    
                    {section.visualType === 'graph' && (
                      <div className="relative h-60 w-full">
                        <Image 
                          src={section.visual}
                          alt={`Graph: ${section.title}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    
                    {section.visualType === 'table' && (
                      <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700">
                              <tbody className="divide-y divide-gray-700 bg-black/20">
                                {section.visual.split('\n').map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.split(',').map((cell, cellIndex) => (
                                      <td key={cellIndex} className="whitespace-nowrap px-3 py-2 text-sm text-white/60">
                                        {cell.trim()}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.article>
  );
};

export default ResearchContent; 