'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  setIsResumeOpen?: (isOpen: boolean) => void;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen, setIsResumeOpen }: NavbarProps) {
  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResumeOpen?.(true);
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <motion.a 
          href="/"
          className="font-light text-base"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          mandip
        </motion.a>

        <div className="flex items-center gap-12">
          <div className="hidden md:flex items-center gap-12">
            {['about', 'projects', 'contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="font-light text-base hover:text-neutral-400 transition-all"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              onClick={handleResumeClick}
              className="font-light text-base hover:text-neutral-400 transition-all inline-flex items-center gap-2"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="w-4 h-4" />
              resume
            </motion.button>
          </div>
          
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative flex items-center gap-3"
            whileHover={{ opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-light text-base">menu</span>
            <div className="flex flex-col gap-1.5">
              <motion.span 
                className="block h-[1px] w-7 bg-current"
                animate={{ 
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 6 : 0
                }}
              />
              <motion.span 
                className="block h-[1px] w-7 bg-current"
                animate={{ 
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -6 : 0
                }}
              />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
} 