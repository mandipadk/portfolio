import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// Types for population data
interface HyperParameters {
  learningRate: string;
  batchSize: number;
  dropout: string;
  activation: string;
}

interface IndividualData {
  id: number;
  position: [number, number, number];
  fitness: number;
  color: THREE.Color;
  generation: number;
  hyperparams: HyperParameters;
}

interface ConnectionData {
  start: [number, number, number];
  end: [number, number, number];
  selected: boolean;
}

// Generate a mock population of individuals
const generatePopulation = (size = 20): IndividualData[] => {
  return Array.from({ length: size }, (_, i) => {
    // Random position in 3D space
    const x = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    
    // Generate fitness based on a landscape (for visualization)
    // This creates a simple "mountain" landscape where fitness is higher in the center
    const distFromCenter = Math.sqrt(x * x + z * z);
    const fitness = Math.max(0, 1 - (distFromCenter / 8)) + Math.random() * 0.2;
    
    // Generate slightly different y-position based on fitness
    const y = fitness * 4;
    
    // Random hyperparameters
    const learningRate = (Math.random() * 0.1).toFixed(4);
    const batchSize = Math.floor(Math.random() * 8) * 8 + 8; // 8, 16, 24, ... 64
    const dropout = (Math.random() * 0.5).toFixed(2);
    const activation = ["relu", "tanh", "sigmoid"][Math.floor(Math.random() * 3)];
    
    // Color based on fitness (green for high fitness, red for low)
    const r = Math.min(1, 2 - 2 * fitness);
    const g = Math.min(1, 2 * fitness);
    const b = 0.3;
    
    return {
      id: i,
      position: [x, y, z],
      fitness: fitness,
      color: new THREE.Color(r, g, b),
      generation: 1,
      hyperparams: {
        learningRate,
        batchSize,
        dropout,
        activation
      }
    };
  });
};

interface IndividualProps {
  position: [number, number, number];
  color: THREE.Color;
  size: number;
  selected: boolean;
  onClick: (id: number) => void;
  id: number;
}

// Individual sphere component
const Individual: React.FC<IndividualProps> = ({ position, color, size, selected, onClick, id }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animation for selected individual
  const { scale } = useSpring({
    scale: selected ? 1.5 : 1,
    config: { tension: 300, friction: 10 }
  });
  
  // Pulse animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = selected ? Math.sin(clock.getElapsedTime() * 4) * 0.1 + 1 : 1;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  
  return (
    <animated.mesh 
      position={position} 
      ref={meshRef}
      onClick={(e: any) => {
        if (e.stopPropagation) e.stopPropagation();
        onClick(id);
      }}
      scale={[scale.get(), scale.get(), scale.get()]}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </animated.mesh>
  );
};

interface PopulationConnectionsProps {
  population: IndividualData[];
  selectedId: number | null;
}

// Connection lines between individuals
const PopulationConnections: React.FC<PopulationConnectionsProps> = ({ population, selectedId }) => {
  const connections: ConnectionData[] = [];
  
  // Create connections between related individuals
  for (let i = 0; i < population.length; i++) {
    const indA = population[i];
    
    // Connect to nearest 2-3 individuals to simulate genetic relationships
    const nearest = population
      .filter(ind => ind.id !== indA.id)
      .sort((a, b) => {
        const distA = distance(indA.position, a.position);
        const distB = distance(indA.position, b.position);
        return distA - distB;
      })
      .slice(0, 2 + Math.floor(Math.random() * 2));
    
    nearest.forEach(indB => {
      if (indB.id > indA.id) { // Avoid duplicate connections
        connections.push({
          start: indA.position,
          end: indB.position,
          selected: indA.id === selectedId || indB.id === selectedId
        });
      }
    });
  }
  
  return (
    <group>
      {connections.map((conn, i) => {
        const points = [
          new THREE.Vector3(...conn.start),
          new THREE.Vector3(...conn.end)
        ];
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    conn.start[0], conn.start[1], conn.start[2],
                    conn.end[0], conn.end[1], conn.end[2]
                  ]), 
                  3
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              attach="material" 
              color={conn.selected ? "#ffffff" : "#334455"} 
              opacity={conn.selected ? 0.8 : 0.3}
              transparent
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
};

// Helper to calculate distance between positions
const distance = (posA: [number, number, number], posB: [number, number, number]): number => {
  return Math.sqrt(
    Math.pow(posA[0] - posB[0], 2) + 
    Math.pow(posA[1] - posB[1], 2) + 
    Math.pow(posA[2] - posB[2], 2)
  );
};

// Grid floor to represent the fitness landscape
const FitnessLandscape: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      <gridHelper 
        args={[20, 20, "#666666", "#222222"]} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]}
      />
      
      {/* Landscape visualization - simplified representation */}
      {Array.from({ length: 10 }).map((_, i) => 
        Array.from({ length: 10 }).map((_, j) => {
          const x = (i - 5) * 2 + 1;
          const z = (j - 5) * 2 + 1;
          const distFromCenter = Math.sqrt(x * x + z * z);
          const height = Math.max(0, 1 - (distFromCenter / 8));
          
          return (
            <mesh 
              key={`landscape-${i}-${j}`} 
              position={[x, height * 0.1, z]}
              scale={[0.3, height * 3, 0.3]}
            >
              <boxGeometry />
              <meshStandardMaterial 
                color={new THREE.Color(0.2, 0.2 + height * 0.5, 0.3)}
                opacity={0.3}
                transparent={true}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
};

// Axis labels
const AxisLabels: React.FC = () => {
  return (
    <group>
      <Text
        position={[11, 0, 0]}
        color="white"
        fontSize={0.5}
        anchorX="left"
      >
        Parameter X
      </Text>
      <Text
        position={[0, 6, 0]}
        color="white"
        fontSize={0.5}
        anchorY="bottom"
      >
        Fitness
      </Text>
      <Text
        position={[0, 0, 11]}
        color="white"
        fontSize={0.5}
        anchorX="left"
      >
        Parameter Y
      </Text>
    </group>
  );
};

// Main Scene Component
const GASceneContent: React.FC = () => {
  const [population, setPopulation] = useState<IndividualData[]>(generatePopulation());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [generation, setGeneration] = useState<number>(1);
  
  // Auto-advance generations
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate a generation advancement
      setGeneration(prev => prev + 1);
      
      // Evolve the population
      setPopulation(prevPop => {
        // Sort by fitness
        const sorted = [...prevPop].sort((a, b) => b.fitness - a.fitness);
        
        // Keep top 50% as parents
        const parents = sorted.slice(0, sorted.length / 2);
        
        // Generate new offspring
        const offspring = parents.map((parent, i) => {
          // Crossover with another random parent
          const otherParent = parents[Math.floor(Math.random() * parents.length)];
          
          // Slightly modified position (simulating genetic inheritance)
          const x = parent.position[0] + (Math.random() - 0.5) * 2;
          const z = parent.position[2] + (Math.random() - 0.5) * 2;
          
          // Fitness based on new position
          const distFromCenter = Math.sqrt(x * x + z * z);
          const fitness = Math.max(0, 1 - (distFromCenter / 8)) + Math.random() * 0.2;
          const y = fitness * 4;
          
          // Modified hyperparameters
          const learningRate = ((parseFloat(parent.hyperparams.learningRate) + 
                               parseFloat(otherParent.hyperparams.learningRate)) / 2 + 
                              (Math.random() - 0.5) * 0.01).toFixed(4);
                              
          const batchSize = Math.floor((parent.hyperparams.batchSize + 
                                     otherParent.hyperparams.batchSize) / 2 + 
                                    (Math.random() - 0.5) * 16);
                                    
          const dropout = ((parseFloat(parent.hyperparams.dropout) + 
                         parseFloat(otherParent.hyperparams.dropout)) / 2 + 
                        (Math.random() - 0.5) * 0.05).toFixed(2);
          
          const activation = Math.random() > 0.8 
            ? ["relu", "tanh", "sigmoid"][Math.floor(Math.random() * 3)]
            : parent.hyperparams.activation;
            
          // Color based on fitness
          const r = Math.min(1, 2 - 2 * fitness);
          const g = Math.min(1, 2 * fitness);
          const b = 0.3;
          
          return {
            id: sorted.length + i,
            position: [x, y, z] as [number, number, number],
            fitness: fitness,
            color: new THREE.Color(r, g, b),
            generation: generation + 1,
            hyperparams: {
              learningRate,
              batchSize,
              dropout,
              activation
            }
          };
        });
        
        // Replace the bottom half with new offspring
        return [...parents, ...offspring.slice(0, parents.length)];
      });
      
    }, 5000); // Advance every 5 seconds
    
    return () => clearInterval(timer);
  }, [generation]);
  
  const handleIndividualClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };
  
  // Find the selected individual
  const selectedIndividual = population.find(ind => ind.id === selectedId);
  
  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <FitnessLandscape />
      <AxisLabels />
      
      <PopulationConnections 
        population={population} 
        selectedId={selectedId} 
      />
      
      {/* Render individuals */}
      {population.map(individual => (
        <Individual
          key={individual.id}
          id={individual.id}
          position={individual.position}
          color={individual.color}
          size={0.3}
          selected={individual.id === selectedId}
          onClick={handleIndividualClick}
        />
      ))}
      
      {/* DOM overlay for information display */}
      <Html position={[0, 0, 0]}>
        <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded-lg text-white text-sm w-72">
          <h3 className="font-bold text-lg mb-2">Generation: {generation}</h3>
          <p>Population size: {population.length}</p>
          <p>Best fitness: {Math.max(...population.map(ind => ind.fitness)).toFixed(3)}</p>
          
          {selectedIndividual && (
            <div className="mt-4 border-t border-white/20 pt-2">
              <h4 className="font-semibold">Selected Individual</h4>
              <p>ID: {selectedIndividual.id}</p>
              <p>Fitness: {selectedIndividual.fitness.toFixed(4)}</p>
              <p>Generation: {selectedIndividual.generation}</p>
              
              <div className="mt-2">
                <h5 className="font-semibold">Hyperparameters:</h5>
                <ul className="pl-2">
                  <li>Learning rate: {selectedIndividual.hyperparams.learningRate}</li>
                  <li>Batch size: {selectedIndividual.hyperparams.batchSize}</li>
                  <li>Dropout: {selectedIndividual.hyperparams.dropout}</li>
                  <li>Activation: {selectedIndividual.hyperparams.activation}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Html>
      
      <OrbitControls enableDamping dampingFactor={0.2} />
    </group>
  );
};

interface HtmlProps {
  children: React.ReactNode;
  position: [number, number, number];
}

// HTML component for overlay display
const Html: React.FC<HtmlProps> = ({ children, position }) => {
  const { camera } = useThree();
  const [pos] = useState(() => new THREE.Vector3());
  
  useFrame(() => {
    pos.set(position[0], position[1], position[2]);
    pos.project(camera);
  });
  
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      {children}
    </div>
  );
};

// Main exported component
export const GAScene: React.FC = () => {
  return (
    <div className="w-full h-96 bg-black/20 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [10, 10, 10], fov: 100 }}>
        <GASceneContent />
      </Canvas>
    </div>
  );
};

export default GAScene; 