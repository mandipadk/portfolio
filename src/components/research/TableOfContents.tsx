'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentSection {
  title: string;
  content: string;
  visualType?: "code" | "table" | "image" | "graph" | "equation";
  visual?: string;
}

interface TableOfContentsProps {
  content: {
    sections: ContentSection[];
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [headings, setHeadings] = useState<{id: string, text: string, level: number}[]>([]);

  useEffect(() => {
    // Extract headings from content
    const extractedHeadings = content.sections.map(section => {
      const id = section.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
      return {
        id,
        text: section.title,
        level: 2 // Default level for section titles
      };
    });
    
    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      if (headingElements.length === 0) return;
      
      // Find the heading that is currently in view
      let currentHeading = '';
      
      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentHeading = heading.id;
        }
      });
      
      setActiveSection(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  // Style based on heading level
  const getHeadingStyle = (level: number) => {
    const paddingLeft = (level - 1) * 12;
    return { paddingLeft: `${paddingLeft}px` };
  };

  return (
    <div className="toc-container py-4 px-6 bg-white/5 backdrop-blur-sm rounded-xl">
      <h3 className="text-lg font-medium mb-6 text-white/80">Table of Contents</h3>
      
      <motion.ul className="space-y-3">
        {headings.map((heading) => (
          <motion.li 
            key={heading.id}
            className="toc-item"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={`text-sm w-full text-left truncate transition-colors duration-200 ${
                activeSection === heading.id 
                  ? 'text-blue-400 font-medium' 
                  : 'text-white/60 hover:text-white/80'
              }`}
              style={getHeadingStyle(heading.level)}
            >
              {heading.text}
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default TableOfContents; 