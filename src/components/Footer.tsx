'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Heart } from 'lucide-react';

export default function Footer() {
  const socials = [
    { icon: Github, href: 'https://github.com/mandipadk' },
    { icon: Linkedin, href: 'https://linkedin.com/in/mandipadk' },
    { icon: Twitter, href: 'https://twitter.com/mandipadk' },
    { icon: Instagram, href: 'https://instagram.com/mandipadk7' }
  ];

  return (
    <motion.footer 
      className="relative border-t border-white/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_80px,rgba(56,189,248,0.06),transparent)]" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="h-24 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-white/60 text-base font-light">
              © {new Date().getFullYear()}
            </p>
            <div className="h-4 w-px bg-white/10" />
            <p className="text-white/40 text-base font-light">
              All rights reserved
            </p>
          </motion.div>

          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 text-base font-light flex items-center gap-2">
              Built with 
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-4 h-4 text-sky-500/80" />
              </motion.div>
              by
              <motion.span 
                className="text-white/90 relative group"
                whileHover={{ color: 'rgb(56 189 248 / 0.8)' }}
              >
                Mandip
                <motion.span
                  className="absolute -bottom-px left-0 w-0 h-px bg-sky-500/50 group-hover:w-full"
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </p>
          </motion.div>

          <div className="flex items-center gap-6">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-sky-500/80 transition-colors duration-300"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 * i,
                  y: { duration: 0.2 }
                }}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
} 