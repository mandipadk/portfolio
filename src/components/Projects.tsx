'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Project {
  title: string;
  description: string;
  tech: string[];
  links: {
    github?: string;
    live?: string;
  };
  image?: string;
  featured?: boolean;
}

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const projects: Project[] = [
    {
      title: "Enygma",
      description: "A sophisticated puzzle-solving platform featuring 10 progressively challenging puzzles. Implements state-of-the-art security measures and anti-cheating systems to ensure fair gameplay and authentic problem-solving experiences.",
      tech: ["Next.js", "TypeScript", "TailwindCSS", "Prisma", "PostgreSQL", "Redis"],
      links: {
        // github: "https://github.com/yourusername/enygma",
        live: "https://enygm.com"
      },
      image: "/enygma.png",
      featured: true
    },
    {
      title: "Evoloke",
      description: "A modern text-based RPG platform enabling authors to publish interactive stories. Features comprehensive admin and author dashboards, advanced story creation tools with visualization capabilities, and an immersive user experience.",
      tech: ["React", "Node.js", "PostgreSQL", "Supabase", "TailwindCSS", "Redis"],
      links: {
        // github: "https://github.com/mandipadk/evoloke",
        live: "https://evoloke.com"
      },
      // image: "/evoloke.png",
      featured: true
    },
    {
      title: "ezl",
      description: "A student productivity platform which uses AI to auto optimize student calenders for work and classes. It uses modular concept to allow students to integrate their email, canvas and calender data seamlessly to offer a rich, interactive unified environment.",
      tech: ["Next.js", "Supabase", "TailwindCSS", "Langchain", "FastAPI"],
      links: {
        // github: "https://github.com/mandipadk/ezl",
        live: "https://ezl.vercel.app"
      },
      image: "/ezl.png",
      featured: true
    },
    {
      title: "Ottomail",
      description: "An innovative email management system that uses AI to categorize and prioritize emails effectively, enhancing productivity and user experience with its intuitive interface.",
      tech: ["Vite", "FastAPI", "AWS Lambda", "Supabase", "TailwindCSS"],
      links: {
        // github: "https://github.com/mandipadk/ottomail",
        live: "https://mailmate.site"
      },
      image: "/ottomail.png",
      featured: true
    },
    {
      title: "TrashTalk",
      description: "An environmental tech initiative that uses AI to identify and categorize waste materials through user-submitted images, promoting recycling and proper waste management.",
      tech: ["React", "TailwindCSS", "TensorFlow", "Python", "WebRTC"],
      links: {
        github: "https://github.com/mandipadk/trashtalk"
      }
    },
    {
      title: "DAppStore",
      description: "A decentralized marketplace for Ethereum-based applications, offering a user-friendly platform for developers to publish and distribute their dApps securely.",
      tech: ["Solidity", "JavaScript", "Web3", "Bootstrap", "IPFS"],
      links: {
        github: "https://github.com/mandipadk/dappstore",
        live: "andipadk.github.io/DAppStore/"
      }
    }
  ];

  // Create individual transforms for each project
  const transforms = Array.from({ length: projects.length }, (_, i) => {
    return useTransform(
      scrollYProgress,
      [i * 0.15, 0.1 + i * 0.15],
      [0, 1]
    );
  });

  const visibleProjects = showAllProjects ? projects : projects.filter(p => p.featured);

  // Add keyframes for the glow animation
  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 70%)'
    },
    hover: {
      opacity: 0.6,
      scale: 1.02,
      background: [
        'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 70%)',
        'radial-gradient(circle at 52% 48%, rgba(56,189,248,0.08), transparent 70%)',
        'radial-gradient(circle at 48% 52%, rgba(56,189,248,0.08), transparent 70%)',
        'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 70%)'
      ],
      transition: {
        background: {
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative min-h-screen bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)] py-24 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.12),transparent)]" />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-7xl md:text-8xl lg:text-9xl font-light text-white/90 mb-32"
        >
          Projects
          <motion.span
            className="absolute -bottom-3 left-0 w-1/3 h-px bg-sky-500/50"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.h2>

        {/* Projects Stack */}
        <div className="relative space-y-24 md:space-y-32">
          {visibleProjects.map((project, index) => {
            const progress = transforms[projects.indexOf(project)];

            const isHovered = hoveredProject === project.title;

            return (
              <motion.div
                key={project.title}
                style={{ opacity: progress }}
                className="relative"
                onMouseEnter={() => setHoveredProject(project.title)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <div 
                    className="group relative rounded-xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm
                      border border-white/[0.08] hover:border-sky-500/20 transition-all duration-700
                      hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.15)]"
                  >
                    <div className="relative p-8 md:p-12">
                      <div className="grid md:grid-cols-[1.5fr,1fr] gap-12">
                        {/* Project Content */}
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <motion.h3 
                                className="text-3xl md:text-4xl font-light text-white/90 group-hover:text-sky-500/90 transition-colors duration-700"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                              >
                                {project.title}
                              </motion.h3>
                              {/* Featured Badge - Enhanced Animation */}
                              {project.featured && (
                                <motion.div
                                  className="px-3 py-1 rounded-full 
                                    bg-white/[0.03] backdrop-blur-sm border border-white/10
                                    flex items-center gap-2 group-hover:border-sky-500/30 
                                    relative overflow-hidden transition-all duration-700"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {/* Animated Glow Effect */}
                                  <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                    animate={{
                                      background: [
                                        'radial-gradient(circle at 0% 50%, rgba(56,189,248,0.1), transparent 50%)',
                                        'radial-gradient(circle at 100% 50%, rgba(56,189,248,0.1), transparent 50%)',
                                        'radial-gradient(circle at 0% 50%, rgba(56,189,248,0.1), transparent 50%)'
                                      ]
                                    }}
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      ease: "linear"
                                    }}
                                  />
                                  <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-sky-400"
                                    animate={{
                                      scale: [1, 1.5, 1],
                                      opacity: [0.5, 1, 0.5],
                                      boxShadow: [
                                        '0 0 0 0 rgba(56,189,248,0)',
                                        '0 0 0 4px rgba(56,189,248,0.3)',
                                        '0 0 0 0 rgba(56,189,248,0)'
                                      ]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                  <span className="text-sm font-light text-white/70 group-hover:text-white/90 transition-colors duration-700 relative z-10">
                                    Featured
                                  </span>
                                </motion.div>
                              )}
                            </div>
                            <motion.p 
                              className="text-lg text-white/50 font-light leading-relaxed"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                            >
                              {project.description}
                            </motion.p>
                          </div>

                          {/* Tech Stack */}
                          <motion.div 
                            className="flex flex-wrap gap-3"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            {project.tech.map((tech, techIndex) => (
                              <motion.span 
                                key={tech}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: techIndex * 0.1,
                                  duration: 0.3,
                                  type: "spring",
                                  stiffness: 150
                                }}
                                className="px-5 py-2 rounded-full text-base font-light
                                  bg-white/[0.03] text-white/70 border border-white/10
                                  hover:bg-white/[0.06] hover:border-white/20 hover:text-white/90 
                                  transition-all duration-300 transform hover:scale-105"
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </motion.div>

                          {/* Links */}
                          <motion.div 
                            className="flex items-center gap-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            {project.links.github && (
                              <motion.a 
                                href={project.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/40 hover:text-sky-500 transition-all duration-300
                                  hover:gap-3 group/link"
                                whileHover={{ x: 5 }}
                              >
                                <Github className="w-5 h-5" />
                                <span className="text-md relative">
                                  View Source
                                  <span className="absolute bottom-0 left-0 w-0 h-px bg-sky-500 transition-all duration-300
                                    group-hover/link:w-full" />
                                </span>
                              </motion.a>
                            )}
                            {project.links.live && (
                              <motion.a 
                                href={project.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/40 hover:text-sky-500 transition-all duration-300
                                  hover:gap-3 group/link"
                                whileHover={{ x: 5 }}
                              >
                                <ExternalLink className="w-5 h-5" />
                                <span className="text-md relative">
                                  Live Demo
                                  <span className="absolute bottom-0 left-0 w-0 h-px bg-sky-500 transition-all duration-300
                                    group-hover/link:w-full" />
                                </span>
                              </motion.a>
                            )}
                          </motion.div>
                        </div>

                        {/* Project Visual */}
                        <motion.div 
                          className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900/50"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.4 }}
                        >
                          {project.image ? (
                            <>
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </>
                          ) : null}
                          
                          {/* Animated Arrow - Now shown for all projects */}
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <motion.div
                              className="w-20 h-20 rounded-full bg-sky-500/10 flex items-center justify-center"
                              animate={{
                                scale: isHovered ? 1.2 : 1,
                                rotate: isHovered ? 90 : 0
                              }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                              <ArrowUpRight className="w-10 h-10 text-sky-500" />
                            </motion.div>
                          </div>
                          
                          {/* Hover Effect */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Animated Border Gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(56,189,248,0.12), transparent 40%)',
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* More Projects Button */}
        {!showAllProjects && projects.length > 4 && (
          <motion.div
            className="mt-32 flex justify-center pb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setShowAllProjects(true)}
              className="group flex items-center gap-3 px-8 py-4 rounded-xl
                bg-neutral-900/50 backdrop-blur-sm border border-white/10
                hover:border-sky-500/30 hover:bg-sky-500/10 transition-all duration-300"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span className="text-lg font-light text-white/80 group-hover:text-white/90">
                More Projects
              </span>
              <motion.div
                className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-3 h-3 rounded-full bg-sky-500/60" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
} 