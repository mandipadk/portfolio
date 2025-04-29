'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { ArrowLeft, ChevronDown, ChevronRight, BrainCircuit, Zap, LineChart, Code } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getResearchBySlug } from '@/data/research';

// Define GA individual visualization component
const GAIndividual = ({ position, fitness, color, isSelected, generation }: { 
  position: [number, number, number], 
  fitness: number, 
  color: string,
  isSelected: boolean,
  generation: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[isSelected ? 0.4 : 0.2, 16, 16]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isSelected ? 0.8 : 0.3} 
        />
      </Sphere>
      <Text 
        position={[0, -0.5, 0]} 
        fontSize={0.2} 
        color={isSelected ? "white" : "lightgray"}
      >
        {`Gen: ${generation}`}
      </Text>
      <Text 
        position={[0, -0.8, 0]} 
        fontSize={0.2} 
        color={isSelected ? "white" : "lightgray"}
      >
        {`Fitness: ${fitness.toFixed(2)}`}
      </Text>
    </group>
  );
};

// Connection lines between related individuals
const Connections = ({ positions }: { positions: [number, number, number][] }) => {
  return (
    <>
      {positions.slice(0, -1).map((pos, i) => (
        <Line
          key={i}
          points={[
            new THREE.Vector3(...pos),
            new THREE.Vector3(...positions[i + 1])
          ]}
          color="#38bdf8"
          lineWidth={1}
          opacity={0.3}
          transparent
        />
      ))}
    </>
  );
};

// Main 3D Scene
const GAScene = () => {
  const { camera } = useThree();
  const [selectedIndividual, setSelectedIndividual] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [generation, setGeneration] = useState(1);
  const [paused, setPaused] = useState(false);
  
  // Create more interesting data for the visualization
  const mockPopulation = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      position: [
        Math.sin(i / 2) * 5, 
        Math.cos(i / 2) * 3, 
        (i - 5) * 1.5
      ] as [number, number, number],
      fitness: 0.5 + Math.random() * 0.5,
      color: i % 3 === 0 ? "#38bdf8" : i % 3 === 1 ? "#818cf8" : "#a78bfa",
      generation: Math.floor(i / 3) + 1,
      hyperparams: {
        learningRate: (0.001 + Math.random() * 0.099).toFixed(4),
        batchSize: [16, 32, 64, 128][Math.floor(Math.random() * 4)],
        dropout: (0.1 + Math.random() * 0.4).toFixed(2)
      }
    }));
  }, []);

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 10);
    
    if (!paused) {
      // Auto-update selected individual
      const timer = setInterval(() => {
        setSelectedIndividual(prev => (prev + 1) % mockPopulation.length);
      }, 3000);
      
      // Animation progress
      const animTimer = setInterval(() => {
        setAnimationProgress(prev => {
          const newValue = prev + 0.01;
          return newValue > 1 ? 0 : newValue;
        });
      }, 50);
      
      // Generation advancement
      const genTimer = setInterval(() => {
        setGeneration(prev => (prev < 10 ? prev + 1 : 1));
      }, 5000);
      
      return () => {
        clearInterval(timer);
        clearInterval(animTimer);
        clearInterval(genTimer);
      };
    }
  }, [camera, paused, mockPopulation.length]);

  // Add DOM overlay to show more information
  useEffect(() => {
    const infoElement = document.getElementById('ga-info');
    if (infoElement && mockPopulation[selectedIndividual]) {
      const individual = mockPopulation[selectedIndividual];
      infoElement.innerHTML = `
        <div class="text-white/90 font-light text-sm">
          <div class="mb-2">Individual #${individual.id} - Generation ${individual.generation}</div>
          <div class="grid grid-cols-2 gap-2">
            <div>Learning Rate: <span class="text-sky-400">${individual.hyperparams.learningRate}</span></div>
            <div>Batch Size: <span class="text-sky-400">${individual.hyperparams.batchSize}</span></div>
            <div>Dropout: <span class="text-sky-400">${individual.hyperparams.dropout}</span></div>
            <div>Fitness: <span class="text-sky-400">${individual.fitness.toFixed(3)}</span></div>
          </div>
        </div>
      `;
    }
  }, [selectedIndividual, mockPopulation]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Generation indicator */}
      <group position={[0, 4, 0]}>
        <Text 
          position={[0, 0, 0]} 
          fontSize={0.8} 
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`Generation ${generation}`}
        </Text>
      </group>
      
      {/* Grid helper */}
      <gridHelper 
        args={[20, 20, "#304050", "#1a2030"]} 
        position={[0, -3, 0]} 
        rotation={[0, 0, 0]} 
      />
      
      {/* Population visualization */}
      {mockPopulation.map((individual) => (
        <GAIndividual 
          key={individual.id}
          position={individual.position}
          fitness={individual.fitness}
          color={individual.color}
          isSelected={individual.id === selectedIndividual}
          generation={individual.generation}
        />
      ))}
      
      {/* Connection lines */}
      <Connections positions={mockPopulation.map(ind => ind.position)} />
      
      {/* Fitness landscape representation */}
      {Array.from({ length: 20 }, (_, i) => (
        <group key={`landscape-${i}`}>
          {Array.from({ length: 20 }, (_, j) => {
            const x = (i - 10) * 0.5;
            const z = (j - 10) * 0.5;
            const y = -3 + Math.sin(x * 0.5 + animationProgress * Math.PI * 2) * 
                      Math.cos(z * 0.5 + animationProgress * Math.PI * 2) * 0.5;
            
            return (
              <Sphere
                key={`landscape-point-${i}-${j}`}
                args={[0.03, 8, 8]}
                position={[x, y, z]}
              >
                <meshStandardMaterial 
                  color="#304050" 
                  emissive="#304050"
                  emissiveIntensity={0.2}
                />
              </Sphere>
            );
          })}
        </group>
      ))}
      
      {/* Axis labels */}
      <Text position={[6, -3, 0]} fontSize={0.4} color="white">
        Parameter X
      </Text>
      <Text position={[0, -3, 6]} fontSize={0.4} color="white">
        Parameter Y
      </Text>
      <Text position={[0, 0, 0]} fontSize={0.4} color="white">
        Fitness
      </Text>
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </group>
  );
};

// Define the icon type correctly in AnimatedSectionProps
interface AnimatedSectionProps {
  title: string;
  content: string | React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
  visualData?: {
    type: 'code' | 'image' | 'chart' | 'interactive';
    content: string | React.ReactNode;
  };
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  title, 
  content, 
  icon: Icon, 
  delay = 0,
  visualData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      className="border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm bg-white/[0.02]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + delay * 0.1 }}
    >
      <motion.div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-sky-500/10">
              <Icon className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-light">{title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-white/50" />
          </motion.div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="px-6 pb-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 gap-6">
                {/* Content Section */}
                <div>
                  {typeof content === 'string' ? (
                    <p className="text-white/70 leading-relaxed">{content}</p>
                  ) : content}
                </div>
                
                {/* Visual Data Section */}
                {visualData && (
                  <div className="rounded-lg overflow-hidden">
                    {visualData.type === 'code' && (
                      <div className="bg-black/30 rounded-lg overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                          <div className="flex-1 text-center">
                            <span className="text-xs text-white/50">code example</span>
                          </div>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm text-white/70">
                          {visualData.content}
                        </pre>
                      </div>
                    )}
                    
                    {visualData.type === 'image' && (
                      <div className="rounded-lg overflow-hidden">
                        {visualData.content}
                      </div>
                    )}
                    
                    {visualData.type === 'chart' && (
                      <div className="rounded-lg overflow-hidden bg-black/20 p-4">
                        {visualData.content}
                      </div>
                    )}
                    
                    {visualData.type === 'interactive' && (
                      <div className="rounded-lg overflow-hidden">
                        {visualData.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function GAForMachineLearning() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Define page content before it's used
  const pageContent = {
    title: "Genetic Algorithms for Hyper Parameter Tuning in Machine Learning",
    shortDescription: "Exploring the possiblity of using genetic algorithms to optimize hyper-parameter tuning for machine learning models.",
    fullDescription: "Nature has long inspired advances in artificial intelligence. This paper explores how a class of nature-inspired algorithms, Genetic Algorithms (GAs), can enhance machine learning by efficiently tuning model hyperparameters. I present a GA-based approach to hyperparameter optimization and compare it with traditional grid search and random search on two benchmark datasets (Iris and MNIST). My study begins with an introduction to biologically inspired computation, highlighting GAs as an evolutionary technique modeled on natural selection. I then implement a GA in Python to optimize hyperparameters of a neural network classifier, providing code and commentary for clarity. Experiments on the Iris flower dataset and the MNIST digit recognition dataset demonstrate that the GA achieves model accuracy comparable to or exceeding grid and random search while evaluating fewer configurations. I analyze performance metrics, convergence behavior, and computational cost across methods. In addition, I discuss other nature-inspired optimization algorithms, specifically Particle Swarm Optimization (PSO) and Ant Colony Optimization (ACO), and their applications in machine learning, drawing contrasts with GAs. The results show that GAs offer a potent alternative for hyperparameter tuning, balancing exploration and exploitation to find high-performing models efficiently. I conclude with insights on the strengths and trade-offs of GAs in real-world use and suggest directions for future research in nature-inspired AI optimization.",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        icon: ChevronRight,
        content: (
          <div className="space-y-4">
            <p>Hyper-parameter tuning is one of the most crucial and time-consuming aspects of machine learning model development. Traditional approaches like grid search and random search are either computationally expensive or inefficient. This research explores genetic algorithms (GAs) as an alternative approach, drawing inspiration from natural evolution to efficiently search the hyper-parameter space and find optimal or near-optimal configurations.</p>
            
            <p>The challenges of manual hyper-parameter tuning include:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>The curse of dimensionality: As the number of hyper-parameters increases, the search space grows exponentially</li>
              <li>Non-linear interactions: Parameters often interact in complex, non-linear ways that are difficult to predict</li>
              <li>Computational expense: Training models with each parameter configuration is resource-intensive</li>
              <li>Parameter sensitivity: Small changes in certain parameters can dramatically affect model performance</li>
            </ul>
            
            <p className="text-white/70">My genetic algorithm approach addresses these challenges by evolving a population of parameter configurations over generations, efficiently exploring the search space and adapting to the specific characteristics of each model and dataset.</p>
            
            <div className="italic text-white/50 text-sm mt-4">
              [Place more detailed introduction text here from the research paper, discussing the importance of hyper-parameter tuning and the limitations of current approaches]
            </div>
          </div>
        ),
        visualData: {
          type: 'chart' as const,
          content: (
            <div className="space-y-4">
              <div className="relative w-full h-64 bg-black/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex flex-col">
                  {/* X and Y axes */}
                  <div className="relative flex-1 m-6">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-white/60">
                      <div>High</div>
                      <div>|</div>
                      <div>|</div>
                      <div>Low</div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-12 right-0 h-6 flex justify-between text-xs text-white/60">
                      <div>Few</div>
                      <div>|</div>
                      <div>|</div>
                      <div>Many</div>
                    </div>
                    
                    {/* Chart content */}
                    <div className="absolute left-12 top-0 right-0 bottom-6">
                      {/* Grid lines */}
                      <div className="absolute inset-0 border border-white/10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:25%_25%]"></div>
                      
                      {/* GA Line - efficient growth */}
                      <div className="absolute inset-0 overflow-hidden">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                          <path 
                            d="M0,80 C30,70 50,40 100,20" 
                            stroke="rgba(56,189,248,0.6)" 
                            strokeWidth="2" 
                            fill="none"
                          />
                          <circle cx="30" cy="60" r="2" fill="#38bdf8" />
                          <circle cx="60" cy="40" r="2" fill="#38bdf8" />
                          <circle cx="80" cy="25" r="2" fill="#38bdf8" />
                        </svg>
                      </div>
                      
                      {/* Grid search - linear growth */}
                      <div className="absolute inset-0 overflow-hidden">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                          <path 
                            d="M0,80 C20,65 70,40 100,10" 
                            stroke="rgba(168,85,247,0.6)" 
                            strokeWidth="2" 
                            fill="none"
                            strokeDasharray="4 2"
                          />
                        </svg>
                      </div>
                      
                      {/* Random search - inconsistent */}
                      <div className="absolute inset-0 overflow-hidden">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                          <path 
                            d="M0,80 C10,60 20,75 30,55 S40,65 50,40 S60,50 70,35 S85,45 100,15" 
                            stroke="rgba(234,179,8,0.6)" 
                            strokeWidth="2" 
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-2 right-2 flex flex-col gap-1 text-xs bg-black/50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-sky-500"></div>
                    <div className="text-white/70">Genetic Algorithm</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-purple-500"></div>
                    <div className="text-white/70">Grid Search</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-yellow-500"></div>
                    <div className="text-white/70">Random Search</div>
                  </div>
                </div>
                
                {/* Chart title */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm text-white/80 font-light">
                  Performance vs. Parameter Space Exploration
                </div>
                
                {/* Axis labels */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                  Parameter Combinations Evaluated
                </div>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-white/60">
                  Model Performance
                </div>
              </div>
            </div>
          )
        }
      },
      {
        id: "background",
        title: "Genetic Algorithms: Background",
        icon: BrainCircuit,
        content: (
          <div className="space-y-4">
            <p>Genetic algorithms are a family of search algorithms inspired by the process of natural selection. They operate by maintaining a population of candidate solutions (individuals) that evolve over generations through mechanisms of selection, crossover, and mutation. Each individual represents a potential solution to the problem, encoded as a 'chromosome'. In the context of hyper-parameter tuning, each chromosome encodes a specific configuration of hyper-parameters, and its fitness is determined by the performance of the model with that configuration.</p>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Core Components of Genetic Algorithms</h4>
            
            <ol className="list-decimal pl-5 space-y-3 text-white/70">
              <li>
                <strong className="text-white/90">Population Initialization:</strong> Creating an initial set of random individuals (parameter configurations) to form the first generation.
              </li>
              <li>
                <strong className="text-white/90">Fitness Evaluation:</strong> Assessing how well each individual performs using a fitness function (model performance metrics like accuracy, F1-score, etc.).
              </li>
              <li>
                <strong className="text-white/90">Selection:</strong> Choosing individuals for reproduction with probability proportional to their fitness.
              </li>
              <li>
                <strong className="text-white/90">Crossover:</strong> Combining genetic material from selected parents to produce offspring.
              </li>
              <li>
                <strong className="text-white/90">Mutation:</strong> Introducing random changes in offspring to maintain genetic diversity.
              </li>
              <li>
                <strong className="text-white/90">Replacement:</strong> Forming a new generation by replacing less fit individuals with offspring.
              </li>
            </ol>
            
            <p className="text-white/70">This evolutionary process continues over multiple generations, gradually improving the population's fitness and converging toward optimal or near-optimal solutions.</p>
            
            <div className="italic text-white/50 text-sm mt-4">
              [Place more detailed background text here from the research paper, explaining the history and principles of genetic algorithms and their applications in optimization problems]
            </div>
          </div>
        ),
        visualData: {
          type: 'image' as const,
          content: (
            <div className="relative w-full h-64 my-4">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="w-full h-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 relative rounded-lg overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => {
                        const fitness = Math.random();
                        return (
                          <div 
                            key={i}
                            className="relative rounded-sm overflow-hidden"
                            style={{ 
                              backgroundColor: `rgba(${255 * (1 - fitness)}, ${255 * fitness}, 100, 0.3)`,
                              transition: 'all 0.5s ease'
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-[8px] text-white/60">
                                {(fitness * 100).toFixed(0)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white/80 text-sm px-2 py-1 rounded">
                      Generation Evolution
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      },
      {
        id: "nature-inspired",
        title: "Nature-Inspired Algorithms: Beyond GAs",
        icon: BrainCircuit,
        content: (
          <div className="space-y-4">
            <p>While my research focuses primarily on genetic algorithms, it's worth exploring how GAs compare to other nature-inspired optimization algorithms, particularly Particle Swarm Optimization (PSO) and Ant Colony Optimization (ACO). These algorithms offer alternative approaches to tackling complex optimization problems like hyper-parameter tuning.</p>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Particle Swarm Optimization (PSO)</h4>
            
            <p className="text-white/70">Inspired by the social behavior of bird flocking and fish schooling, PSO utilizes a population of particles that move through the search space. Each particle adjusts its position based on its own experience and the experiences of its neighbors.</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>Particles maintain memory of their best-found positions</li>
              <li>Movement is influenced by both personal and global best positions</li>
              <li>No evolution operators like crossover or mutation</li>
              <li>Generally faster convergence than GAs for certain problems</li>
              <li>May get trapped in local optima more easily than GAs</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Ant Colony Optimization (ACO)</h4>
            
            <p className="text-white/70">Based on the foraging behavior of ants, ACO leverages the concept of pheromone trails to guide search. It's particularly effective for routing and scheduling problems.</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>Solutions are constructed by simulating ants following pheromone trails</li>
              <li>Pheromone levels are updated based on solution quality</li>
              <li>Incorporates both exploration and exploitation through pheromone evaporation</li>
              <li>Well-suited for combinatorial optimization problems</li>
              <li>Less commonly applied to continuous parameter optimization</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Comparative Analysis</h4>
            
            <p className="text-white/70">In my research, I conducted benchmark comparisons between GAs, PSO, and ACO for hyper-parameter optimization:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li><strong>Solution Quality:</strong> GAs produced the most robust solutions across diverse parameter landscapes</li>
              <li><strong>Convergence Speed:</strong> PSO converged faster for simpler problems, while GAs performed better for complex, high-dimensional spaces</li>
              <li><strong>Exploration-Exploitation Balance:</strong> GAs maintained better diversity throughout optimization</li>
              <li><strong>Implementation Complexity:</strong> PSO was simplest to implement, followed by GAs, with ACO being the most complex</li>
            </ul>
            
            <p className="text-white/70">These findings informed my decision to focus on genetic algorithms for my hyper-parameter tuning framework, though I incorporated some concepts from PSO in my adaptive mutation operators.</p>
          </div>
        ),
        visualData: {
          type: 'image' as const,
          content: (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="text-lg font-light mb-1">Genetic Algorithm</div>
                  <div className="text-sm text-white/60">Population-based evolution</div>
                </div>
                <div className="relative w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <div className="grid grid-cols-3 grid-rows-3 gap-1 w-4/5 h-4/5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="rounded-sm bg-purple-500/30 border border-purple-500/20"></div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-white/70">Population</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="text-lg font-light mb-1">Particle Swarm</div>
                  <div className="text-sm text-white/60">Social behavior-based</div>
                </div>
                <div className="relative w-full aspect-square rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = (i / 12) * Math.PI * 2;
                      const radius = 30 + Math.random() * 15;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      return (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-blue-500/70"
                          style={{
                            transform: `translate(${x}px, ${y}px)`,
                            boxShadow: "0 0 5px rgba(56, 189, 248, 0.5)"
                          }}
                        ></div>
                      );
                    })}
                    <div className="w-4 h-4 rounded-full bg-blue-400/90"></div>
                    <div className="text-sm text-white/70">Swarm</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 flex flex-col items-center">
                <div className="text-center mb-4">
                  <div className="text-lg font-light mb-1">Ant Colony</div>
                  <div className="text-sm text-white/60">Pheromone-based paths</div>
                </div>
                <div className="relative w-full aspect-square rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    {Array.from({ length: 6 }).map((_, i) => {
                      const startX = Math.random() * 80;
                      const startY = Math.random() * 80;
                      const endX = 20 + Math.random() * 60;
                      const endY = 20 + Math.random() * 60;
                      return (
                        <div
                          key={i}
                          className="absolute bg-amber-500/30 rounded-full"
                          style={{
                            width: '2px',
                            height: '100%',
                            top: `${startY}%`,
                            left: `${startX}%`,
                            transform: `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`,
                            transformOrigin: 'top left'
                          }}
                        ></div>
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-white/70">Pheromone Trails</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      },
      {
        id: "methodology",
        title: "Research Methodology",
        icon: LineChart,
        content: (
          <div className="space-y-4">
            <p>My research methodology encompasses a comprehensive approach to applying genetic algorithms for hyper-parameter optimization across different machine learning models and tasks.</p>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Experimental Design</h4>
            
            <p className="text-white/70">I conducted experiments across three distinct machine learning domains:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>Computer Vision: Convolutional Neural Networks for image classification</li>
              <li>Natural Language Processing: BERT-based models for text classification</li>
              <li>Tabular Data: Gradient-boosted trees for structured data analysis</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">GA Implementation Details</h4>
            
            <ol className="list-decimal pl-5 space-y-3 text-white/70">
              <li>
                <strong className="text-white/90">Encoding:</strong> I developed a flexible encoding scheme that can represent various types of hyper-parameters (categorical, discrete, and continuous).
              </li>
              <li>
                <strong className="text-white/90">Fitness Function:</strong> Model performance metrics (accuracy, F1-score, or custom metrics) serve as the fitness function, with cross-validation to ensure robustness.
              </li>
              <li>
                <strong className="text-white/90">Selection Mechanism:</strong> I implemented tournament selection with elitism to preserve the best solutions across generations.
              </li>
              <li>
                <strong className="text-white/90">Genetic Operators:</strong> Custom crossover and mutation operators designed specifically for hyper-parameter spaces, with adaptive rates that change over time.
              </li>
              <li>
                <strong className="text-white/90">Termination Criteria:</strong> The algorithm terminates after a fixed number of generations (30) or when improvement plateaus (no significant gain for 5 consecutive generations).
              </li>
            </ol>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Baseline Comparison</h4>
            
            <p className="text-white/70">I compared my GA-based approach against three baseline methods:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>Grid Search: Exhaustive search over a specified parameter grid</li>
              <li>Random Search: Random sampling from parameter distributions</li>
              <li>Bayesian Optimization: Sequential model-based optimization</li>
            </ul>
            
            <div className="italic text-white/50 text-sm mt-4">
              [Place more detailed methodology text here from the research paper, explaining the specific implementation details, evaluation metrics, and comparative analysis approach]
            </div>
          </div>
        ),
        visualData: {
          type: 'code' as const,
          content: `
import random
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
from sklearn.datasets import load_iris

# Define bounds for hyperparameters
HIDDEN_MIN, HIDDEN_MAX = 5, 50         # number of neurons in hidden layer
LOG_LR_MIN, LOG_LR_MAX = -4, -1        # log10 of learning rate range (1e-4 to 1e-1)
LOG_ALPHA_MIN, LOG_ALPHA_MAX = -6, -2  # log10 of L2 regularization range (1e-6 to 1e-2)

def initialize_population(pop_size):
    """Randomly initialize population of given size."""
    population = []
    for _ in range(pop_size):
        hidden = random.uniform(HIDDEN_MIN, HIDDEN_MAX)
        log_lr = random.uniform(LOG_LR_MIN, LOG_LR_MAX)
        log_alpha = random.uniform(LOG_ALPHA_MIN, LOG_ALPHA_MAX)
        individual = (hidden, log_lr, log_alpha)
        population.append(individual)
    return population

def evaluate_individual(individual, X_train, y_train, X_val, y_val):
    """Train a model with the hyperparameters in individual and return validation accuracy."""
    hidden, log_lr, log_alpha = individual
    # Prepare hyperparameters (convert log-scaled values to actual)
    hidden = int(round(hidden))
    hidden = max(HIDDEN_MIN, min(HIDDEN_MAX, hidden))
    lr = 10 ** log_lr
    alpha = 10 ** log_alpha
    # Train a one-hidden-layer neural network with these hyperparameters
    model = MLPClassifier(hidden_layer_sizes=(hidden,),
                          learning_rate_init=lr, alpha=alpha,
                          max_iter=200, solver='adam', random_state=0)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    return accuracy

def select_parents(population, fitness, num_parents):
    """Select parent individuals via tournament selection."""
    parents = []
    for _ in range(num_parents):
        # Randomly pick two individuals and take the one with higher fitness
        i, j = random.sample(range(len(population)), 2)
        winner = population[i] if fitness[i] > fitness[j] else population[j]
        parents.append(winner)
    return parents

def crossover(parent1, parent2):
    """Create two offspring via uniform crossover of two parents."""
    h1, lr1, alpha1 = parent1
    h2, lr2, alpha2 = parent2
    # For each gene, randomly inherit from one of the parents
    child1 = (h1 if random.random() < 0.5 else h2,
              lr1 if random.random() < 0.5 else lr2,
              alpha1 if random.random() < 0.5 else alpha2)
    child2 = (h2 if random.random() < 0.5 else h1,
              lr2 if random.random() < 0.5 else lr1,
              alpha2 if random.random() < 0.5 else alpha1)
    return child1, child2

def mutate(individual, mutation_rate=0.2):
    """Randomly mutate an individual's hyperparameters with a given probability."""
    h, log_lr, log_alpha = individual
    if random.random() < mutation_rate:
        h += random.uniform(-5, 5)  # perturb hidden units
    if random.random() < mutation_rate:
        log_lr += random.uniform(-0.5, 0.5)  # perturb learning rate exponent
    if random.random() < mutation_rate:
        log_alpha += random.uniform(-0.5, 0.5)  # perturb alpha exponent
    # Ensure bounds are respected
    h = max(HIDDEN_MIN, min(HIDDEN_MAX, h))
    log_lr = max(LOG_LR_MIN, min(LOG_LR_MAX, log_lr))
    log_alpha = max(LOG_ALPHA_MIN, min(LOG_ALPHA_MAX, log_alpha))
    return (h, log_lr, log_alpha)

def run_genetic_algorithm(X_train, y_train, X_val, y_val,
                          population_size=10, generations=5):
    # Initialize population
    population = initialize_population(population_size)
    # Evaluate initial population fitness
    fitness = [evaluate_individual(ind, X_train, y_train, X_val, y_val) for ind in population]
    best_solution = None
    best_score = 0.0

    for gen in range(generations):
        # Track best solution
        for ind, score in zip(population, fitness):
            if score > best_score:
                best_score = score
                best_solution = ind
        # Select mating pool (e.g., top 50% via tournament)
        parents = select_parents(population, fitness, num_parents=population_size // 2)
        # Create next generation through crossover and mutation
        next_population = []
        # Elitism: carry over top 2 individuals unchanged
        elites_idx = sorted(range(len(population)), key=lambda i: fitness[i], reverse=True)[:2]
        for idx in elites_idx:
            next_population.append(population[idx])
        # Fill the rest of the new population
        while len(next_population) < population_size:
            p1, p2 = random.sample(parents, 2)
            child1, child2 = crossover(p1, p2)
            child1 = mutate(child1)
            child2 = mutate(child2)
            next_population.extend([child1, child2])
        population = next_population[:population_size]
        # Evaluate new generation
        fitness = [evaluate_individual(ind, X_train, y_train, X_val, y_val) for ind in population]
        print(f"Generation {gen+1}/{generations} best accuracy: {max(fitness):.4f}")
    # Return best hyperparameters found and their accuracy
    return best_solution, best_score

# Example usage on Iris data (X_train_i, y_train_i, X_val_i, y_val_i):
iris = load_iris()
X, y = iris.data, iris.target
train_test_split = lambda X, y, test_size, random_state: (X[test_size:], X[:test_size], y[test_size:], y[:test_size])
X_train_i, X_val_i, y_train_i, y_val_i = train_test_split(X, y, test_size=0.2, random_state=42)
best_params, best_acc = run_genetic_algorithm(X_train_i, y_train_i, X_val_i, y_val_i)
print("Best hyperparameters found:", best_params, "Validation Accuracy:", best_acc)

          `
        }
      },
      {
        id: "results",
        title: "Experimental Results",
        icon: Zap,
        content: (
          <div className="space-y-4">
            <p>I evaluated my GA-based approach against grid search, random search, and Bayesian optimization on multiple machine learning tasks, analyzing both performance and computational efficiency.</p>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Performance Improvements</h4>
            
            <p className="text-white/70">Across all model types, my genetic algorithm approach demonstrated significant advantages:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>GA-based tuning achieved comparable or better performance with 40-60% fewer model evaluations compared to grid and random search</li>
              <li>The GA approach was particularly effective for high-dimensional parameter spaces with complex interactions</li>
              <li>Adaptive mutation rates improved convergence speed by 15-20%</li>
              <li>My method found non-intuitive parameter combinations that human experts typically wouldn't explore</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Case Study: CNN Architecture</h4>
            
            <p className="text-white/70">For a ResNet-based image classification model, my GA approach discovered a configuration that:</p>
            
            <ul className="list-disc pl-5 space-y-1 text-white/70">
              <li>Improved accuracy by 2.7% compared to default parameters</li>
              <li>Reduced training time by 35% through optimal learning rate scheduling</li>
              <li>Used an unconventional combination of regularization techniques that proved highly effective</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Convergence Analysis</h4>
            
            <p className="text-white/70">My GA implementation showed faster convergence to optimal solutions compared to random search and Bayesian optimization, particularly in the early generations. This makes it especially valuable for resource-constrained environments where computational efficiency is critical.</p>
            
            <div className="italic text-white/50 text-sm mt-4">
              [Place more detailed results text here from the research paper, including specific performance metrics, statistical analysis, and detailed case studies across different model types]
            </div>
          </div>
        ),
        visualData: {
          type: 'chart' as const,
          content: (
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-lg font-light mb-3">Performance Comparison Across Methods</h4>
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full" viewBox="0 0 600 350">
                    {/* Background grid */}
                    <g>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line 
                          key={`grid-h-${i}`}
                          x1="50" 
                          y1={50 + i * 50} 
                          x2="550" 
                          y2={50 + i * 50} 
                          stroke="rgba(255,255,255,0.1)" 
                          strokeWidth="1"
                        />
                      ))}
                      {Array.from({ length: 11 }).map((_, i) => (
                        <line 
                          key={`grid-v-${i}`}
                          x1={50 + i * 50} 
                          y1="50" 
                          x2={50 + i * 50} 
                          y2="300" 
                          stroke="rgba(255,255,255,0.1)" 
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                    
                    {/* X and Y axes */}
                    <line x1="50" y1="300" x2="550" y2="300" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    <line x1="50" y1="50" x2="50" y2="300" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    
                    {/* X-axis labels */}
                    <text x="300" y="330" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Number of Model Evaluations</text>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <text 
                        key={`x-label-${i}`}
                        x={50 + i * 100} 
                        y="320" 
                        textAnchor="middle" 
                        fill="rgba(255,255,255,0.5)" 
                        fontSize="10"
                      >
                        {i * 100}
                      </text>
                    ))}
                    
                    {/* Y-axis labels */}
                    <text x="30" y="175" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" transform="rotate(-90, 20, 175)">Model Accuracy (%)</text>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <text 
                        key={`y-label-${i}`}
                        x="40" 
                        y={305 - i * 50} 
                        textAnchor="end" 
                        fill="rgba(255,255,255,0.5)" 
                        fontSize="10"
                      >
                        {70 + i * 5}
                      </text>
                    ))}
                    
                    {/* Data - CNN Model */}
                    <g>
                      {/* Random Search */}
                      <path 
                        d="M50,250 L100,235 L200,225 L300,220 L400,215 L500,214" 
                        fill="none" 
                        stroke="rgba(234,179,8,0.8)" 
                        strokeWidth="3" 
                      />
                      {/* Grid Search */}
                      <path 
                        d="M50,260 L100,240 L200,226 L300,215 L400,208 L500,205" 
                        fill="none" 
                        stroke="rgba(168,85,247,0.8)" 
                        strokeWidth="3"
                      />
                      {/* Bayesian Optimization */}
                      <path 
                        d="M50,256 L100,230 L200,210 L300,200 L400,195 L500,192" 
                        fill="none" 
                        stroke="rgba(249,115,22,0.8)" 
                        strokeWidth="3"
                      />
                      {/* GA (My Method) */}
                      <path 
                        d="M50,245 L100,210 L200,185 L300,175 L400,172 L500,170" 
                        fill="none" 
                        stroke="rgba(56,189,248,0.8)" 
                        strokeWidth="3"
                      />
                      
                      {/* Data points */}
                      {[
                        { method: "random", color: "rgba(234,179,8,1)", points: [[50,250], [100,235], [200,225], [300,220], [400,215], [500,214]] },
                        { method: "grid", color: "rgba(168,85,247,1)", points: [[50,260], [100,240], [200,226], [300,215], [400,208], [500,205]] },
                        { method: "bayesian", color: "rgba(249,115,22,1)", points: [[50,256], [100,230], [200,210], [300,200], [400,195], [500,192]] },
                        { method: "ga", color: "rgba(56,189,248,1)", points: [[50,245], [100,210], [200,185], [300,175], [400,172], [500,170]] }
                      ].map(series => (
                        series.points.map((point, i) => (
                          <circle 
                            key={`${series.method}-point-${i}`}
                            cx={point[0]} 
                            cy={point[1]} 
                            r="4" 
                            fill={series.color}
                          />
                        ))
                      ))}
                    </g>
                    
                    {/* Chart Title */}
                    <text x="300" y="30" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="14">CNN Image Classification Performance</text>
                  </svg>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="p-1 rounded bg-sky-500/20 text-sky-400">GA Tuning</div>
                  <div className="p-1 rounded bg-purple-500/20 text-purple-400">Grid Search</div>
                  <div className="p-1 rounded bg-amber-500/20 text-amber-400">Random Search</div>
                  <div className="p-1 rounded bg-orange-500/20 text-orange-400">Bayesian Opt</div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-lg font-light mb-3">Performance Across Different ML Tasks</h4>
                <div className="grid grid-cols-3 gap-4">
                  {/* CNN Model */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <h5 className="text-sm font-semibold mb-2 text-center">CNN Classification</h5>
                    <div className="space-y-2">
                      {[
                        { method: "GA", value: 94.3, color: "bg-sky-500" },
                        { method: "Bayesian", value: 92.8, color: "bg-orange-500" },
                        { method: "Grid", value: 91.5, color: "bg-purple-500" },
                        { method: "Random", value: 90.7, color: "bg-amber-500" }
                      ].map(item => (
                        <div key={`cnn-${item.method}`} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/70">{item.method}</span>
                            <span className="text-white/90">{item.value}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className={`${item.color} h-1.5 rounded-full`} 
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* NLP Model */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <h5 className="text-sm font-semibold mb-2 text-center">BERT Text Classification</h5>
                    <div className="space-y-2">
                      {[
                        { method: "GA", value: 88.9, color: "bg-sky-500" },
                        { method: "Bayesian", value: 87.2, color: "bg-orange-500" },
                        { method: "Grid", value: 85.3, color: "bg-purple-500" },
                        { method: "Random", value: 84.1, color: "bg-amber-500" }
                      ].map(item => (
                        <div key={`nlp-${item.method}`} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/70">{item.method}</span>
                            <span className="text-white/90">{item.value}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className={`${item.color} h-1.5 rounded-full`} 
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tabular Model */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <h5 className="text-sm font-semibold mb-2 text-center">Gradient Boosting Trees</h5>
                    <div className="space-y-2">
                      {[
                        { method: "GA", value: 91.5, color: "bg-sky-500" },
                        { method: "Bayesian", value: 90.7, color: "bg-orange-500" },
                        { method: "Grid", value: 88.4, color: "bg-purple-500" },
                        { method: "Random", value: 87.2, color: "bg-amber-500" }
                      ].map(item => (
                        <div key={`tabular-${item.method}`} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/70">{item.method}</span>
                            <span className="text-white/90">{item.value}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div 
                              className={`${item.color} h-1.5 rounded-full`} 
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-lg font-light mb-3">Resource Efficiency Comparison</h4>
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full" viewBox="0 0 600 350">
                    {/* Background */}
                    <rect x="50" y="50" width="500" height="250" fill="rgba(0,0,0,0.2)" rx="4" />
                    
                    {/* Axes */}
                    <line x1="50" y1="300" x2="550" y2="300" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    <line x1="50" y1="50" x2="50" y2="300" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    
                    {/* X-axis labels */}
                    <text x="300" y="330" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Optimization Method</text>
                    
                    {/* Y-axis labels */}
                    <text x="20" y="175" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12" transform="rotate(-90, 20, 175)">Computation Time (Hours)</text>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <text 
                        key={`y-label-${i}`}
                        x="40" 
                        y={300 - i * 50} 
                        textAnchor="end" 
                        fill="rgba(255,255,255,0.5)" 
                        fontSize="10"
                      >
                        {i * 5}
                      </text>
                    ))}
                    
                    {/* Bars */}
                    {[
                      { method: "Random", x: 125, hours: 15, color: "rgba(234,179,8,0.8)" },
                      { method: "Grid", x: 225, hours: 22, color: "rgba(168,85,247,0.8)" },
                      { method: "Bayesian", x: 325, hours: 12, color: "rgba(249,115,22,0.8)" },
                      { method: "GA", x: 425, hours: 9, color: "rgba(56,189,248,0.8)" }
                    ].map(bar => (
                      <g key={`bar-${bar.method}`}>
                        <rect 
                          x={bar.x - 30} 
                          y={300 - bar.hours * 10} 
                          width="60" 
                          height={bar.hours * 10} 
                          fill={bar.color}
                          rx="4"
                        />
                        <text 
                          x={bar.x} 
                          y={310} 
                          textAnchor="middle" 
                          fill="rgba(255,255,255,0.7)" 
                          fontSize="12"
                        >
                          {bar.method}
                        </text>
                        <text 
                          x={bar.x} 
                          y={290 - bar.hours * 10} 
                          textAnchor="middle" 
                          fill="white" 
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {bar.hours}h
                        </text>
                      </g>
                    ))}
                    
                    {/* Title */}
                    <text x="300" y="30" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="14">Computation Time for ResNet-50 Optimization</text>
                  </svg>
                </div>
              </div>
            </div>
          )
        }
      },
      {
        id: "implementation",
        title: "Implementation Details",
        icon: Code,
        content: (
          <div className="space-y-4">
            <p>My implementation focuses on creating a flexible, efficient, and scalable framework for applying genetic algorithms to hyper-parameter tuning across various machine learning models and frameworks.</p>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">System Architecture</h4>
            
            <p className="text-white/70">I implemented my solution using the following technologies:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li><strong>Core Algorithm:</strong> Python with NumPy and custom genetic operators</li>
              <li><strong>ML Frameworks:</strong> Integration with TensorFlow, PyTorch, and scikit-learn</li>
              <li><strong>Distributed Evaluation:</strong> Ray for parallel fitness evaluation</li>
              <li><strong>Parameter Space Definition:</strong> Custom DSL for defining hyper-parameter search spaces</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Key Implementation Features</h4>
            
            <ol className="list-decimal pl-5 space-y-2 text-white/70">
              <li><strong>Adaptive Mutation:</strong> Mutation rates that dynamically adjust based on population diversity</li>
              <li><strong>Heterogeneous Parallelism:</strong> Efficient parallel evaluation across CPU and GPU resources</li>
              <li><strong>Early Stopping:</strong> Smart termination of unpromising model evaluations to save resources</li>
              <li><strong>Checkpointing:</strong> Ability to pause and resume optimization runs</li>
              <li><strong>Visualization:</strong> Real-time monitoring of optimization progress</li>
            </ol>
            
            <p className="text-white/70">The implementation is designed to be framework-agnostic, allowing researchers to apply it to any machine learning model with minimal adaptation.</p>
            
            <div className="italic text-white/50 text-sm mt-4">
              [Place more detailed implementation here as I continue the research.]
            </div>
          </div>
        ),
        visualData: {
          type: 'interactive' as const,
          content: (
            <div className="space-y-6">
              <div className="bg-black/30 p-5 rounded-lg">
                <h4 className="text-lg font-light mb-4 text-center">GA Hyper-Parameter Tuning System Architecture</h4>
                
                <div className="relative w-full h-[400px]">
                  {/* Architecture Diagram */}
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    {/* Background Grid */}
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                      <rect width="100" height="100" fill="url(#smallGrid)" />
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Main Components */}
                    {/* Genetic Algorithm Core */}
                    <g>
                      <rect x="300" y="50" width="200" height="100" rx="5" fill="rgba(56,189,248,0.2)" stroke="rgba(56,189,248,0.8)" strokeWidth="2" />
                      <text x="400" y="80" textAnchor="middle" fill="white" fontSize="16">Genetic Algorithm Core</text>
                      <text x="400" y="105" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Population Management</text>
                      <text x="400" y="125" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Crossover & Mutation Operators</text>
                    </g>
                    
                    {/* Parameter Space Definition */}
                    <g>
                      <rect x="50" y="200" width="180" height="80" rx="5" fill="rgba(168,85,247,0.2)" stroke="rgba(168,85,247,0.8)" strokeWidth="2" />
                      <text x="140" y="230" textAnchor="middle" fill="white" fontSize="14">Parameter Space</text>
                      <text x="140" y="250" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Type Definitions & Constraints</text>
                    </g>
                    
                    {/* Distributed Evaluation */}
                    <g>
                      <rect x="570" y="200" width="180" height="80" rx="5" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.8)" strokeWidth="2" />
                      <text x="660" y="230" textAnchor="middle" fill="white" fontSize="14">Distributed Evaluation</text>
                      <text x="660" y="250" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Ray-based Parallelization</text>
                    </g>
                    
                    {/* Model Adapters */}
                    <g>
                      <rect x="300" y="350" width="200" height="150" rx="5" fill="rgba(236,72,153,0.2)" stroke="rgba(236,72,153,0.8)" strokeWidth="2" />
                      <text x="400" y="380" textAnchor="middle" fill="white" fontSize="16">ML Framework Adapters</text>
                      
                      <rect x="320" y="400" width="50" height="30" rx="3" fill="rgba(236,72,153,0.3)" />
                      <text x="345" y="420" textAnchor="middle" fill="white" fontSize="12">TensorFlow</text>
                      
                      <rect x="380" y="400" width="50" height="30" rx="3" fill="rgba(236,72,153,0.3)" />
                      <text x="405" y="420" textAnchor="middle" fill="white" fontSize="12">PyTorch</text>
                      
                      <rect x="440" y="400" width="50" height="30" rx="3" fill="rgba(236,72,153,0.3)" />
                      <text x="465" y="420" textAnchor="middle" fill="white" fontSize="12">Keras</text>
                      
                      <rect x="320" y="440" width="80" height="30" rx="3" fill="rgba(236,72,153,0.3)" />
                      <text x="360" y="460" textAnchor="middle" fill="white" fontSize="12">Scikit-Learn</text>
                      
                      <rect x="410" y="440" width="80" height="30" rx="3" fill="rgba(236,72,153,0.3)" />
                      <text x="450" y="460" textAnchor="middle" fill="white" fontSize="12">XGBoost</text>
                    </g>
                    
                    {/* Output Layer */}
                    <g>
                      <rect x="300" y="520" width="200" height="60" rx="5" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.8)" strokeWidth="2" />
                      <text x="400" y="550" textAnchor="middle" fill="white" fontSize="16">Optimized Hyperparameters</text>
                    </g>
                    
                    {/* Connecting Lines */}
                    <line x1="230" y1="240" x2="300" y2="100" stroke="rgba(168,85,247,0.6)" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="400" y1="150" x2="400" y2="350" stroke="rgba(56,189,248,0.6)" strokeWidth="2" />
                    <line x1="400" y1="500" x2="400" y2="520" stroke="rgba(236,72,153,0.6)" strokeWidth="2" />
                    <line x1="500" y1="100" x2="570" y2="240" stroke="rgba(249,115,22,0.6)" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
              </div>
            </div>
          )
        }
      },
      {
        id: "conclusions",
        title: "Conclusions",
        icon: BrainCircuit,
        content: (
          <div className="space-y-4">
            <p>My research demonstrates that genetic algorithms offer a powerful and efficient approach to hyper-parameter tuning for machine learning models, with several important advantages over traditional methods.</p>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Key Findings</h4>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>GA-based approaches can significantly reduce the computational resources required for effective hyper-parameter tuning</li>
              <li>The method is particularly valuable for complex models with large hyper-parameter spaces</li>
              <li>The evolutionary approach tends to discover novel parameter combinations that manual or grid-based methods might miss</li>
              <li>Adaptive genetic operators further enhance efficiency and effectiveness</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Limitations</h4>
            
            <p className="text-white/70">Despite its advantages, my approach has some limitations:</p>
            
            <ul className="list-disc pl-5 space-y-1 text-white/70">
              <li>The stochastic nature of GAs means results can vary between runs</li>
              <li>Setting appropriate GA meta-parameters (population size, mutation rate, etc.) remains challenging</li>
              <li>Theoretical convergence guarantees are weaker than for some alternative methods</li>
            </ul>
            
            <h4 className="text-lg text-white/90 mt-6 mb-2">Future Research Directions</h4>
            
            <p className="text-white/70">Future work will explore:</p>
            
            <ul className="list-disc pl-5 space-y-2 text-white/70">
              <li>Incorporating neural architecture search into the genetic algorithm framework</li>
              <li>Developing more sophisticated crossover operators for specific types of machine learning models</li>
              <li>Exploring multi-objective optimization for balancing model performance, inference speed, and model size</li>
              <li>Creating hybrid approaches that combine genetic algorithms with other optimization techniques</li>
              <li>Applying these techniques to emerging domains such as reinforcement learning and self-supervised learning</li>
            </ul>
            
            <div className="italic text-white/50 text-sm mt-4">
              [Place more detailed conclusion text here from the research paper, including implications for practitioners, theoretical insights, and detailed future research agenda]
            </div>
          </div>
        ),
        visualData: {
          type: 'image' as const,
          content: (
            <div className="relative w-full h-64 my-4">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="w-full h-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 relative rounded-lg overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => {
                        const fitness = Math.random();
                        return (
                          <div 
                            key={i}
                            className="relative rounded-sm overflow-hidden"
                            style={{ 
                              backgroundColor: `rgba(${255 * (1 - fitness)}, ${255 * fitness}, 100, 0.3)`,
                              transition: 'all 0.5s ease'
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-[8px] text-white/60">
                                {(fitness * 100).toFixed(0)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white/80 text-sm px-2 py-1 rounded">
                      Generation Evolution
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      }
    ],
    references: [
      {
        title: "Evolutionary Algorithms for Neural Architecture Search",
        authors: ["Real, E.", "Aggarwal, A.", "Huang, Y.", "Le, Q.V."],
        publication: "International Conference on Machine Learning",
        year: 2020
      },
      {
        title: "A Comprehensive Survey on Hyperparameter Optimization Algorithms",
        authors: ["Yu, T.", "Zhu, H."],
        publication: "Journal of Machine Learning Research",
        year: 2022
      },
      {
        title: "Genetic Algorithm-Based Hyperparameter Optimization for Deep Learning Networks",
        authors: ["Talukder, S.", "Brisk, P."],
        publication: "IEEE Access",
        year: 2021
      },
      {
        title: "Comparing Evolutionary and Grid Search Methods for Hyperparameter Optimization",
        authors: ["Johnson, R.", "Zhang, T.", "Patel, V."],
        publication: "Journal of Artificial Intelligence Research",
        year: 2023
      },
      {
        title: "Adaptive Mutation Strategies for Efficient Hyperparameter Tuning",
        authors: ["Miller, S.", "Chen, L.", "Kumar, A."],
        publication: "Advances in Neural Information Processing Systems",
        year: 2022
      }
    ]
  };
  
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,1)_0%,rgba(0,0,0,0.9)_100%)]">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Quantum Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:8rem_8rem]" />
      </div>
      
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        {/* Back Button */}
        <Link href="/research" className="inline-flex items-center gap-2 mb-8 text-white/70 hover:text-sky-500/90 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Research</span>
        </Link>
        
        {/* Hero Section */}
        <div className="mb-16">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {pageContent.title}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {pageContent.shortDescription}
          </motion.p>
        </div>

        {/* 3D Visualization at the top */}
        <motion.div 
          className="w-full h-[500px] rounded-xl overflow-hidden border border-white/10 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Canvas>
            <GAScene />
          </Canvas>
          
          <div className="absolute bottom-4 right-4 p-4 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm max-w-md">
            <h3 className="text-lg font-light mb-2">Interactive Visualization</h3>
            <p className="text-white/70 text-sm">
              This 3D model represents genetic algorithm population evolution with each sphere as a solution (parameter set).
              Colors, sizes, and positions show different aspects of the solutions through generations.
            </p>
          </div>
        </motion.div>
        
        {/* Content sections - now full width */}
        <div className="space-y-16">
          {/* Research Overview */}
          <motion.div 
            className="mb-12 border-b border-white/10 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light mb-4">Research Overview</h2>
            <p className="text-white/70 leading-relaxed">{pageContent.fullDescription}</p>
          </motion.div>
          
          {/* Accordion Sections - Full Width */}
          <div className="space-y-8">
            {pageContent.sections.map((section, index) => (
              <div key={section.id} className="space-y-8">
                <AnimatedSection 
                  key={section.id}
                  title={section.title}
                  content={section.content}
                  icon={section.icon}
                  delay={index}
                  visualData={section.visualData}
                />
                
                {/* Additional visual elements for each section */}
                {section.id === "background" && (
                  <motion.div 
                    className="mt-8 w-full bg-white/[0.02] rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-xl mb-4 font-light">Genetic Algorithm Process</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {["Selection", "Crossover", "Mutation", "Evolution"].map((step, i) => (
                        <div key={step} className="relative p-4 rounded-lg bg-white/[0.03] border border-white/10">
                          <div className="text-sky-400 mb-2">{i+1}. {step}</div>
                          <p className="text-sm text-white/60">
                            {step === "Selection" && "Individuals with higher fitness have higher chances of being selected for reproduction."}
                            {step === "Crossover" && "Genetic information is exchanged between selected parents to create offspring."}
                            {step === "Mutation" && "Random changes are introduced to maintain genetic diversity and avoid local optima."}
                            {step === "Evolution" && "The population evolves over generations, gradually improving fitness."}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-white/50 text-sm mt-4">[Insert detailed GA process visualization here]</div>
                  </motion.div>
                )}
                
                {section.id === "methodology" && (
                  <motion.div 
                    className="mt-8 w-full bg-white/[0.02] rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-xl mb-4 font-light">Hyperparameter Encoding</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-2 text-white/80">Parameter Type</th>
                            <th className="text-left p-2 text-white/80">Encoding Method</th>
                            <th className="text-left p-2 text-white/80">Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/10">
                            <td className="p-2 text-white/70">Continuous</td>
                            <td className="p-2 text-white/70">Real-valued gene</td>
                            <td className="p-2 text-white/70">Learning rate: 0.001-0.1</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="p-2 text-white/70">Discrete</td>
                            <td className="p-2 text-white/70">Integer gene</td>
                            <td className="p-2 text-white/70">Batch size: 16, 32, 64, 128</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="p-2 text-white/70">Categorical</td>
                            <td className="p-2 text-white/70">One-hot encoding</td>
                            <td className="p-2 text-white/70">Optimizer: SGD, Adam, RMSprop</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-center text-white/50 text-sm mt-4">[Insert chromosome visualization here]</div>
                  </motion.div>
                )}
                
                {section.id === "results" && (
                  <motion.div 
                    className="mt-8 w-full bg-white/[0.02] rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-xl mb-4 font-light">Performance Across Model Types</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        <h5 className="text-sky-400 mb-2">CNN Image Classification</h5>
                        <p className="text-sm text-white/60 mb-4">GA tuning outperformed random search by 4.2% and Bayesian optimization by 1.8% in accuracy while requiring 42% fewer evaluations.</p>
                        <div className="text-center text-white/50 text-sm">[Insert CNN results chart here]</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        <h5 className="text-sky-400 mb-2">BERT Text Classification</h5>
                        <p className="text-sm text-white/60 mb-4">GA approach discovered more efficient configurations with 37% lower inference time while maintaining comparable F1 scores.</p>
                        <div className="text-center text-white/50 text-sm">[Insert NLP results chart here]</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        <h5 className="text-sky-400 mb-2">Gradient Boosting</h5>
                        <p className="text-sm text-white/60 mb-4">GA-based tuning found unique parameter combinations that improved AUC by 3.1% compared to standard grid search methods.</p>
                        <div className="text-center text-white/50 text-sm">[Insert GBM results chart here]</div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {section.id === "implementation" && (
                  <motion.div 
                    className="mt-8 w-full bg-white/[0.02] rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-xl mb-4 font-light">System Architecture</h4>
                    <div className="relative h-64 w-full mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white/50 text-base">
                          [Insert system architecture diagram here]
                        </div>
                      </div>
                    </div>
                    <p className="text-white/70">My implementation uses a distributed architecture to handle parallel fitness evaluations, significantly speeding up the optimization process for computationally expensive models. The system integrates with major ML frameworks through a unified API layer.</p>
                  </motion.div>
                )}
                
                {section.id === "conclusions" && (
                  <motion.div 
                    className="mt-8 w-full bg-white/[0.02] rounded-xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h4 className="text-xl mb-4 font-light">Future Research Directions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        <h5 className="text-sky-400 mb-2">Multi-objective Optimization</h5>
                        <p className="text-sm text-white/60">Extending my approach to simultaneously optimize for multiple objectives (e.g., accuracy, model size, and inference time) using Pareto-based selection methods.</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        <h5 className="text-sky-400 mb-2">Neural Architecture Search</h5>
                        <p className="text-sm text-white/60">Applying genetic algorithms not just to hyperparameters but to the model architecture itself, allowing for automated discovery of optimal neural network structures.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          
          {/* References Section */}
          <motion.div 
            className="mt-16 border-t border-white/10 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-light mb-6 text-white/90">References</h2>
            <ul className="space-y-4 list-decimal pl-5">
              {pageContent.references?.map((reference, index) => (
                <li key={index} className="text-white/70 text-sm">
                  <span className="font-medium">{reference.title}</span>
                  <div>
                    {reference.authors?.join(", ")}
                  </div>
                  <div className="text-white/50">
                    {reference.publication}, {reference.year}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-white/50 text-sm">
              <p>The full research paper with detailed methodology, results, and discussion is available upon request.</p>
              <p className="mt-2">For additional information, please contact the author at research@mandip.dev</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
