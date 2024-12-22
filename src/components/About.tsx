'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.3], [-5, 0]);

  const skills = [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TailwindCSS", "TypeScript"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "Go", "GraphQL"]
    },
    {
      category: "Database",
      items: ["PostgreSQL", "Redis", "Prisma", "MongoDB"]
    },
    {
      category: "DevOps",
      items: ["AWS", "Docker", "CI/CD", "Kubernetes"]
    }
  ];

  const experiences = [
    {
      period: "February 2024 - Present",
      role: "Project Specialist",
      company: "Office of Institutional Effectiveness, USM",
      description: "Consolidated degree requirements for 50+ programs into a streamlined format, digitized 500+ faculty transcripts into a searchable database, and coordinated accurate SACSCOC accreditation data analysis with a team."
    },
    {
      period: "May 2022 - August 2022",
      role: "Student Intern",
      company: "Nobel Explorers",
      description: "Led UI/UX workshops improving web design skills by 40%, developed an interactive cafe website, and mentored 25+ interns in practical UI/UX design."
    }
  ];

  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.12), transparent 50%)'
    },
    hover: {
      opacity: 0.8,
      scale: 1.05,
      background: [
        'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.12), transparent 50%)',
        'radial-gradient(circle at 55% 45%, rgba(56,189,248,0.12), transparent 50%)',
        'radial-gradient(circle at 45% 55%, rgba(56,189,248,0.12), transparent 50%)',
        'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.12), transparent 50%)'
      ],
      transition: {
        background: {
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        },
        scale: {
          duration: 2,
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
      id="about" 
      className="relative min-h-screen flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)]"
    >
      {/* Background Elements */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, 100]),
          opacity: useTransform(scrollYProgress, [0, 0.3], [0.5, 1])
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.12),transparent)]"
        style={{
          scale: useTransform(scrollYProgress, [0, 0.3], [0.8, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1])
        }}
      />

      <motion.div 
        style={{ opacity, scale, y, rotateX: rotate }}
        className="relative w-full px-6 md:px-12 transition-all duration-700"
      >
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-[1fr,1.5fr] gap-12 md:gap-24">
            {/* Left Column */}
            <div className="space-y-12">
              <motion.h2 
                className="text-7xl md:text-8xl lg:text-9xl font-light text-white/90 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                About
                <motion.span
                  className="absolute -bottom-3 left-0 w-1/3 h-px bg-sky-500/50"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.h2>

              {/* Modern Profile Card */}
              <motion.div
                className="relative aspect-square rounded-xl overflow-hidden group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsImageHovered(true)}
                onHoverEnd={() => setIsImageHovered(false)}
              >
                {/* Animated Glow Effect */}
                <motion.div
                  className="absolute -inset-4 md:-inset-6 rounded-2xl pointer-events-none"
                  initial="initial"
                  animate="hover"
                  variants={glowVariants}
                />

                <div className="relative h-full rounded-xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm
                  border border-white/[0.08] group-hover:border-sky-500/20 transition-all duration-700
                  group-hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.15)]">
                  {/* Profile Image */}
                  <Image
                    src="/self.png"
                    alt="Mandip Adhikari"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  
                  {/* Hover Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-neutral-950/20 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isImageHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Interactive Particles */}
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-sky-500/40 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: isImageHovered ? [0, -30, 0] : 0,
                          opacity: isImageHovered ? [0, 1, 0] : 0,
                          scale: isImageHovered ? [1, 1.5, 1] : 1,
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Intro Text */}
              <motion.p 
                className="text-2xl text-white/80 font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                I'm a full-stack developer with a passion for building innovative solutions 
                that bridge the gap between complex theoretical concepts and practical applications.
              </motion.p>

              {/* Skills Grid - Restored Previous Design */}
              <div className="grid grid-cols-2 gap-6">
                {skills.map((category, i) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="space-y-4 group"
                  >
                    <motion.h3 
                      className="text-white/50 text-sm tracking-wider uppercase flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <motion.span
                        className="inline-block w-2 h-2 rounded-full bg-sky-500/50"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                      {category.category}
                    </motion.h3>
                    <div className="flex flex-wrap gap-3">
                      {category.items.map((item, index) => (
                        <motion.div
                          key={item}
                          className="group/item relative"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ y: -2 }}
                        >
                          <span className="relative z-10 text-lg font-light text-white/80 group-hover/item:text-sky-500/90 transition-colors">
                            {item}
                          </span>
                          <motion.div
                            className="absolute -bottom-1 left-0 h-px w-0 bg-sky-500/50 group-hover/item:w-full transition-all duration-300"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Modern Experience Section */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-white/50 text-sm tracking-wider uppercase">Experience</h3>
                <div className="relative space-y-12">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-3 bottom-3 w-px bg-gradient-to-b from-sky-500/50 via-sky-500/25 to-transparent" />
                  
                  {experiences.map((exp, i) => (
                    <motion.div
                      key={exp.period}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + i * 0.2 }}
                      className="group relative flex items-start gap-6 hover:-translate-y-1 transition-transform duration-300"
                    >
                      {/* Modern Icon Container */}
                      <div className="relative shrink-0">
                        <motion.div
                          className="w-12 h-12 rounded-xl bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center 
                            border border-sky-500/20 group-hover:border-sky-500/40 transition-all duration-300
                            group-hover:shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]"
                          initial={{ scale: 0, rotate: -45 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                        >
                          <div className="relative">
                            {/* Animated squares for a more modern look */}
                            <motion.div 
                              className="absolute inset-0 rotate-45 border border-sky-500/30"
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [45, 45, 45],
                                opacity: [0.5, 0.8, 0.5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                            <motion.div 
                              className="absolute inset-0 rotate-45 bg-sky-500/20"
                              animate={{
                                scale: [1.1, 1.3, 1.1],
                                rotate: [45, 45, 45],
                                opacity: [0.3, 0.5, 0.3],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2 + 0.2,
                              }}
                            />
                            <div className="w-4 h-4 rotate-45 bg-sky-500/40 group-hover:bg-sky-500/60 transition-colors duration-300" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <p className="text-sky-500/80 text-sm font-light">{exp.period}</p>
                        <h4 className="text-xl text-white/90 font-light group-hover:text-sky-500/90 transition-colors duration-300">
                          {exp.role}
                        </h4>
                        <p className="text-white/50 font-light">{exp.company}</p>
                        <motion.p 
                          className="text-white/70 font-light text-sm leading-relaxed max-w-lg"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.9 + i * 0.2 }}
                        >
                          {exp.description}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}