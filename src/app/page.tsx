'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink, Mail, ArrowUpRight, Instagram, Contact } from 'lucide-react';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import ResumeViewer from '@/components/ResumeViewer';

// Particle System Component
const ParticleSystem = () => {
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-sky-400/40 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Particle Connection Lines */}
          <motion.div
            className="absolute w-20 h-px origin-left"
            style={{
              background: 'linear-gradient(90deg, rgba(56,189,248,0.3), transparent)',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Wave Pattern Component
const WavePatterns = () => (
  <>
    {/* Primary Wave */}
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 60%)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Secondary Wave */}
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(circle at 30% 70%, rgba(168,85,247,0.05), transparent 50%)',
      }}
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
    
    {/* Interference Pattern */}
    <motion.div
      className="absolute inset-0"
      style={{
        background: 'repeating-linear-gradient(45deg, rgba(56,189,248,0.03) 0px, transparent 10px, rgba(168,85,247,0.03) 20px)',
      }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </>
);

// Update the QuantumOverlay component
const QuantumOverlay = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modern Quantum Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.98)_0%,rgba(0,0,0,0.98)_100%)]">
          {/* Enhanced Background Elements */}
          <WavePatterns />
          <ParticleSystem />
          
          {/* Quantum Grid */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2, delay: 1 }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </motion.div>

          {/* Quantum Wave Pattern */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.08), transparent 60%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto px-6">
            {/* Complex Quantum Equations with Enhanced Animations */}
            {[
              { 
                eq: "iℏ∂ψ/∂t = -(ℏ²/2m)∇²ψ + V(r,t)ψ", 
                color: "sky", 
                name: "Time-dependent Schrödinger",
                position: { left: "5%", top: "15%" },
                derivation: ["∂ψ/∂t", "Ĥψ", "-(ℏ²/2m)∇²ψ + V(r,t)ψ"]
              },
              { 
                eq: "⟨ψ|Â|ψ⟩ = ∫ψ*(x)Âψ(x)dx", 
                color: "purple", 
                name: "Expectation Value",
                position: { left: "60%", top: "20%" },
                glow: true
              },
              { 
                eq: "Ĥ = -ℏ²/2m ∇² + V(r)", 
                color: "teal", 
                name: "Hamiltonian",
                position: { left: "10%", top: "35%" },
                pulse: true
              },
              { 
                eq: "P(x) = |ψ(x)|² = ψ*(x)ψ(x)", 
                color: "rose", 
                name: "Probability Density",
                position: { left: "55%", top: "45%" }
              },
              { 
                eq: "dρ/dt = -i/ℏ[Ĥ,ρ]", 
                color: "amber", 
                name: "Von Neumann",
                position: { left: "15%", top: "55%" }
              },
              {
                eq: "ψ(x,t) = ∑ cₙφₙ(x)e^(-iEₙt/ℏ)",
                color: "sky",
                name: "Time Evolution",
                position: { left: "65%", top: "65%" }
              },
              {
                eq: "∇ × B = μ₀(J + ε₀∂E/∂t)",
                color: "purple",
                name: "Ampère-Maxwell",
                position: { left: "20%", top: "75%" }
              },
              {
                eq: "G_μν + Λg_μν = 8πGT_μν/c⁴",
                color: "teal",
                name: "Einstein Field",
                position: { left: "70%", top: "30%" }
              }
            ].map((eq, i) => (
              <motion.div
                key={eq.name}
                className={`absolute text-3xl md:text-4xl lg:text-5xl text-${eq.color}-500/70 font-serif`}
                style={{
                  ...eq.position,
                  filter: eq.glow ? 'drop-shadow(0 0 8px rgba(56,189,248,0.3))' : undefined,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5],
                  y: [-30, 0, 0, 30]
                }}
                transition={{ 
                  duration: 8,
                  delay: i * 0.8,
                  times: [0, 0.3, 0.7, 1]
                }}
              >
                <div className="flex flex-col items-center gap-3 relative">
                  {/* Main Equation */}
                  <motion.span 
                    className="text-balance relative"
                    animate={eq.pulse ? {
                      textShadow: [
                        '0 0 8px rgba(56,189,248,0)',
                        '0 0 16px rgba(56,189,248,0.5)',
                        '0 0 8px rgba(56,189,248,0)'
                      ]
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {eq.eq}
                  </motion.span>

                  {/* Equation Name with Enhanced Style */}
                  <motion.span 
                    className="text-base text-white/30"
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {eq.name}
                  </motion.span>

                  {/* Derivation Steps */}
                  {eq.derivation && (
                    <div className="absolute -right-full top-0 space-y-2">
                      {eq.derivation.map((step, index) => (
                        <motion.div
                          key={index}
                          className="text-lg text-white/20"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: [0, 0.5, 0],
                            x: [-20, 0, 20]
                          }}
                          transition={{
                            duration: 4,
                            delay: index * 1.5,
                            repeat: Infinity,
                            repeatDelay: eq.derivation!.length * 1.5
                          }}
                        >
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Energy Field Effect */}
                  {eq.glow && (
                    <motion.div
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background: `radial-gradient(circle at center, ${eq.color === 'sky' ? 'rgba(56,189,248,0.1)' : 'rgba(168,85,247,0.1)'}, transparent 70%)`
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}

            {/* Advanced Quantum Concepts - Positioned in gaps */}
            {[
              { text: "Quantum Teleportation Protocol", position: { left: "40%", top: "10%" } },
              { text: "Bell's Inequality: |⟨AB⟩ - ⟨AC⟩| ≤ 1 + ⟨BC⟩", position: { left: "25%", top: "25%" } },
              { text: "Quantum Error Correction", position: { left: "75%", top: "40%" } },
              { text: "Quantum Fourier Transform", position: { left: "35%", top: "50%" } },
              { text: "Phase Estimation: |ψ⟩ = Σ|j⟩⊗|u_j⟩", position: { left: "80%", top: "55%" } },
              { text: "No-Cloning Theorem", position: { left: "45%", top: "70%" } },
              { text: "Quantum Tunneling", position: { left: "30%", top: "85%" } },
              { text: "Quantum Entanglement", position: { left: "85%", top: "80%" } }
            ].map((concept, i) => (
              <motion.div
                key={concept.text}
                className="absolute text-lg md:text-xl text-white/40 font-light"
                style={concept.position}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5],
                }}
                transition={{ 
                  duration: 6,
                  delay: i * 0.5 + 4,
                  times: [0, 0.3, 0.7, 1]
                }}
              >
                {concept.text}
              </motion.div>
            ))}

            {/* Floating Mathematical Symbols - Scattered in remaining spaces */}
            {[..."ℏ∇∫∑∏√∞≈≠∂ℵ"].map((symbol, i) => (
              <motion.div
                key={`symbol-${i}`}
                className="absolute text-2xl md:text-3xl text-white/20 font-serif"
                style={{
                  left: `${10 + (i * 8)}%`,
                  top: `${Math.random() * 90}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                {symbol}
              </motion.div>
            ))}

            {/* Final Question Marks */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 10 }}
            >
              <motion.div
                className="text-9xl md:text-[12rem] font-serif text-white/90 flex items-center gap-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 10,
                  duration: 2,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <motion.span
                  animate={{ 
                    rotateY: [0, 180, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  ?
                </motion.span>
                <motion.span
                  animate={{ 
                    rotateY: [0, -180, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  ?
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [symbolSequence, setSymbolSequence] = useState<string[]>([]);
  const [showSpecialEffect, setShowSpecialEffect] = useState(false);
  const correctSequence = ['quantum', 'dimensions'];

  const handleConceptClick = (concept: string) => {
    console.log('Concept clicked:', concept);
    const newSequence = [...symbolSequence, concept];
    setSymbolSequence(newSequence);

    // Check if the sequence matches the correct order so far
    const isCorrect = newSequence.every((item, i) => item === correctSequence[i]);
    
    if (!isCorrect) {
      console.log('Incorrect sequence');
      setSymbolSequence([]);
      return;
    }

    // If completed correct sequence
    if (newSequence.length === correctSequence.length) {
      console.log('Correct sequence completed!');
      setShowSpecialEffect(true);
      setTimeout(() => {
        setShowSpecialEffect(false);
        setSymbolSequence([]);
      }, 12000);
    }
  };

  return (
    <>
    <main className="text-white min-h-screen selection:bg-teal-300 selection:text-neutral-950 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)]" />
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="absolute inset-0">
          {/* Quantum Wave Function Collapse */}
          <motion.div className="absolute right-[12%] top-[25%]">
            <motion.div
              className="relative w-48 h-48"
              style={{
                background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.15), transparent 70%)',
                filter: 'blur(20px)',
                boxShadow: '0 0 40px rgba(56, 189, 248, 0.2)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Energy Particle */}
              <motion.div
                className="absolute w-4 h-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.6), transparent 70%)',
                  filter: 'blur(2px)',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                  borderRadius: '50%',
                }}
              />
            </motion.div>

            {/* Psi Symbol */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center z-50"
              style={{
                fontFamily: 'serif',
                fontSize: '2.5rem',
                color: 'rgba(56, 189, 248, 0.4)',
                textShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
              }}
            >
              Ψ
            </motion.div>

            {/* Wave Function Orbits */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0 border-2 border-sky-500/20 rounded-full"
                  style={{
                    rotate: i * 30,
                  }}
                  animate={{
                    rotate: [i * 30, i * 30 + 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 8 - i * 2,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
                {/* Probability Cloud */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(from ${i * 120}deg, rgba(56, 189, 248, 0.1), transparent, rgba(56, 189, 248, 0.1))`,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    rotate: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              </motion.div>
            ))}

            {/* Quantum State Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`quantum-${i}`}
                className="absolute w-1.5 h-1.5 bg-sky-400 rounded-full"
                style={{
                  left: `${50 + Math.cos(i * Math.PI / 3) * 40}%`,
                  top: `${50 + Math.sin(i * Math.PI / 3) * 40}%`,
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                  x: [0, Math.cos(i * Math.PI / 3) * 10, 0],
                  y: [0, Math.sin(i * Math.PI / 3) * 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Multi-dimensional Matrix */}
          <motion.div 
            className="absolute right-[25%] top-[40%]"
            style={{
              perspective: "1000px",
            }}
          >
            {/* Phi Symbol */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center z-50"
              style={{
                fontFamily: 'serif',
                fontSize: '2.5rem',
                color: 'rgba(20, 184, 166, 0.4)',
                textShadow: '0 0 20px rgba(20, 184, 166, 0.4)',
              }}
            >
              Φ
            </motion.div>
            {/* Matrix content without the Phi symbol */}
            <motion.div
              className="relative w-64 h-64"
              animate={{
                rotateY: [0, 360],
                rotateX: [30, 390],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Dimensional Planes */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-teal-500/20 rounded-lg"
                  style={{
                    transform: `translateZ(${i * 40}px) rotateX(${i * 15}deg)`,
                    boxShadow: '0 0 30px rgba(20, 184, 166, 0.1)',
                  }}
                  animate={{
                    scale: [1 - i * 0.1, 1.1 - i * 0.1, 1 - i * 0.1],
                    opacity: [0.6 - i * 0.15, 0.8 - i * 0.15, 0.6 - i * 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
                  {/* Dimensional Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.1)_1px,transparent_1px)] bg-[size:16px_16px]" />
                </motion.div>
              ))}
              {/* Matrix Points with Connections */}
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={`point-${i}`}
                  className="absolute"
                  style={{
                    left: `${(i % 4) * 33.33}%`,
                    top: `${Math.floor(i / 4) * 33.33}%`,
                  }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 bg-teal-400 rounded-full"
                    style={{
                      boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  />
                  {/* Connection Lines */}
                  {i < 12 && (
                    <motion.div
                      className="absolute w-[33.33%] h-px bg-gradient-to-r from-teal-500/30 via-teal-500/10 to-transparent"
                      style={{
                        transformOrigin: "left center",
                      }}
                      animate={{
                        scaleX: [0.5, 1, 0.5],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Quantum Entanglement Field */}
          <motion.div 
            className="absolute right-[15%] bottom-[20%]"
            style={{
              perspective: "1000px",
            }}
          >
            {/* Eta Symbol */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center z-50"
              style={{
                fontFamily: 'serif',
                fontSize: '2.5rem',
                color: 'rgba(168, 85, 247, 0.4)',
                textShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
              }}
            >
              η
            </motion.div>
            {/* Entanglement content without the Eta symbol */}
            <motion.div
              className="relative w-48 h-48"
              animate={{
                rotateY: [0, 360],
                rotateX: [20, 380],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Entangled Particles */}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={`entangled-${i}`}
                  className="absolute w-10 h-10"
                  style={{
                    left: i === 0 ? '20%' : '70%',
                    top: i === 0 ? '20%' : '70%',
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-full"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4), transparent 80%)',
                      filter: 'blur(8px)',
                      boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                  />
                  {/* Quantum State Indicators */}
                  {[...Array(4)].map((_, j) => (
                    <motion.div
                      key={`state-${j}`}
                      className="absolute w-1 h-1 bg-purple-400 rounded-full"
                      style={{
                        left: `${50 + Math.cos(j * Math.PI / 2) * 20}%`,
                        top: `${50 + Math.sin(j * Math.PI / 2) * 20}%`,
                        boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: j * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              ))}
              {/* Entanglement Connection */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.2), transparent 30%, rgba(168, 85, 247, 0.2) 70%, transparent)',
                  boxShadow: '0 0 50px rgba(168, 85, 247, 0.1)',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Quantum Interference Pattern */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(45deg, rgba(168, 85, 247, 0.1) 0px, transparent 4px, rgba(168, 85, 247, 0.1) 8px)',
                  filter: 'blur(2px)',
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        setIsResumeOpen={setIsResumeOpen}
      />

      {/* Hero Section */}
      <section className="flex flex-col justify-center min-h-screen px-6 md:px-12 relative">
        <div className="max-w-screen-xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Primary Introduction */}
            <div className="space-y-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Mandip Adhikari
                </motion.h1>
                <motion.p 
                  className="text-neutral-400 text-lg font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Full Stack Developer
                </motion.p>
              </motion.div>
              
              <motion.h2 
                className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-neutral-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Building robust applications and scalable systems with modern technologies.
              </motion.h2>
            </div>

            {/* Secondary Interest */}
            <div className="space-y-6">
              <motion.p
                className="text-neutral-300 text-lg font-light max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Beyond development, I explore the fascinating world of machine learning, quantum theories and computational dimensions, trying to combine complex theoretical concepts into practical solutions.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col md:flex-row gap-8 md:items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <motion.a 
                  href="#projects" 
                  className="group inline-flex items-center gap-3 text-base font-light hover:text-neutral-400 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  View Projects
                  <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </motion.a>
                <div className="h-px w-full md:w-px md:h-8 bg-neutral-800" />
                <div className="text-neutral-400 text-base font-light">
                  Currently exploring{' '}
                  <motion.button 
                    onClick={() => handleConceptClick('quantum')}
                    className="text-white hover:text-neutral-400 transition-colors inline-flex items-center gap-2 bg-transparent border-none cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    quantum computing
                    <span className={`block w-1 h-1 rounded-full ${
                      symbolSequence.includes('quantum') ? 'bg-sky-400' : 'bg-teal-400'
                    }`} />
                  </motion.button>
                  <span className="text-neutral-400"> and </span>
                  <motion.button 
                    onClick={() => handleConceptClick('dimensions')}
                    className="text-white hover:text-neutral-400 transition-colors inline-flex items-center gap-2 bg-transparent border-none cursor-pointer"
                    whileHover={{ x: 2 }}
                  >
                    computational dimensions
                    <span className={`block w-1 h-1 rounded-full ${
                      symbolSequence.includes('dimensions') ? 'bg-purple-400' : 'bg-teal-400'
                    }`} />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                {[
                  { icon: Github, href: "https://github.com/mandipadk" },
                  { icon: Linkedin, href: "https://linkedin.com/in/mandipadk" },
                  { icon: Twitter, href: "https://twitter.com/mandipadk" },
                  { icon: Mail, href: "mailto:hello@mandip.dev" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="absolute inset-0 backdrop-blur-2xl bg-neutral-950/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <div className="relative h-full flex items-center px-6 md:px-12">
              <div className="w-full max-w-screen-xl mx-auto grid md:grid-cols-[1.5fr,1fr] gap-20">
                <nav className="space-y-8">
                  {[
                    { name: 'about', desc: 'know me better' },
                    { name: 'projects', desc: 'things i do occasionally' },
                    { name: 'resume', desc: 'my experience and skills' },
                    { name: 'contact', desc: 'get in touch' }
                  ].map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                      <a
                        href={item.name === 'resume' ? '#' : `#${item.name.toLowerCase()}`}
                        onClick={(e) => {
                          if (item.name === 'resume') {
                            e.preventDefault();
                            setIsResumeOpen(true);
                          }
                          setIsMenuOpen(false);
                        }}
                        className="block group-hover:text-neutral-400 transition-colors"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="text-5xl md:text-7xl lg:text-8xl font-light">
                            {item.name}
                          </span>
                          <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-neutral-400 text-xl mt-2 font-light">
                          {item.desc}
                        </p>
                      </a>
                    </motion.div>
                  ))}
                </nav>

                <div className="space-y-16">
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-neutral-400 text-base font-light tracking-wider uppercase">Contact</p>
                    <a 
                      href="mailto:hello@mandip.dev" 
                      className="block text-2xl hover:text-neutral-400 transition-colors group inline-flex items-center gap-3"
                    >
                      hello@mandip.dev
                      <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </motion.div>

                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-neutral-400 text-base font-light tracking-wider uppercase">Socials</p>
                    <div className="space-y-4">
                      {[
                        { name: 'Github', icon: Github, username: '@mandipadk', href: 'https://github.com/mandipadk' },
                        { name: 'LinkedIn', icon: Linkedin, username: '@mandipadk', href: 'https://linkedin.com/in/mandipadk' },
                        { name: 'Twitter', icon: Twitter, username: '@mandipadk', href: 'https://twitter.com/mandipadk' },
                        { name: 'Instagram', icon: Instagram, username: '@mandipadk7', href: 'https://instagram.com/mandipadk7' }
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-4 hover:text-neutral-400 transition-colors text-xl"
                        >
                          <social.icon className="w-6 h-6" />
                          <span>{social.name}</span>
                          <span className="text-neutral-500 text-base">{social.username}</span>
                          <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResumeOpen(false)}
            />
            
            <motion.div 
              className="relative w-full max-w-5xl bg-neutral-900 rounded-lg overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-neutral-800">
                <h2 className="text-xl font-light">Resume</h2>
                <div className="flex items-center gap-4">
                  <a 
                    href="/resume.pdf" 
                    download
                    className="flex items-center gap-2 text-sm hover:text-neutral-400 transition-colors"
                  >
                    Download PDF
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => setIsResumeOpen(false)}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="h-[80vh] overflow-auto p-4">
                <iframe 
                  src="/resume.pdf" 
                  className="w-full h-full rounded"
                  title="Resume"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuantumOverlay isVisible={showSpecialEffect} />
    </main>
    <About />
    <Projects />
    <ContactForm />
    <Footer />
    <ResumeViewer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>)
}
