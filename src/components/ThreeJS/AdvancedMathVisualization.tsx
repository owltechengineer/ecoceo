'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Componente per visualizzare funzioni a 2 variabili (superfici)
function SurfaceFunction({ 
  func, 
  color = '#4ecdc4', 
  wireframe = false, 
  resolution = 50,
  range = 5 
}: {
  func: (x: number, y: number) => number;
  color?: string;
  wireframe?: boolean;
  resolution?: number;
  range?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const points: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = (i / (resolution - 1) - 0.5) * 2 * range;
        const y = (j / (resolution - 1) - 0.5) * 2 * range;
        const z = func(x, y);
        
        points.push(x, y, z);
        
        // Colore basato sull'altezza
        const normalizedZ = (z + range) / (2 * range);
        colors.push(normalizedZ, 1 - normalizedZ, 0.5);
        
        // Indici per triangoli
        if (i < resolution - 1 && j < resolution - 1) {
          const a = i * resolution + j;
          const b = (i + 1) * resolution + j;
          const c = i * resolution + (j + 1);
          const d = (i + 1) * resolution + (j + 1);
          
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    setGeometry(geometry);
  }, [func, resolution, range]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
        vertexColors={!wireframe}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// Componente per visualizzare funzioni a 3 variabili (volumi)
function VolumeFunction({
  func,
  color = '#ff6b6b',
  resolution = 20,
  range = 3,
  threshold = 0.5
}: {
  func: (x: number, y: number, z: number) => number;
  color?: string;
  resolution?: number;
  range?: number;
  threshold?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    const points: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    // Marching Cubes semplificato per visualizzare volumi
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        for (let k = 0; k < resolution; k++) {
          const x = (i / (resolution - 1) - 0.5) * 2 * range;
          const y = (j / (resolution - 1) - 0.5) * 2 * range;
          const z = (k / (resolution - 1) - 0.5) * 2 * range;
          
          const value = func(x, y, z);
          
          if (Math.abs(value) < threshold) {
            points.push(x, y, z);
            
            // Colore basato sul valore della funzione
            const normalizedValue = (value + threshold) / (2 * threshold);
            colors.push(normalizedValue, 1 - normalizedValue, 0.3);
          }
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    setGeometry(geometry);
  }, [func, resolution, range, threshold]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  if (!geometry) return null;

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial size={0.1} vertexColors />
    </points>
  );
}

// Componente per robotica - Cinematica diretta
function RobotArm({
  joints,
  links,
  endEffector
}: {
  joints: { x: number; y: number; z: number }[];
  links: number[];
  endEffector: { x: number; y: number; z: number };
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base del robot */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Giunti e link */}
      {joints.map((joint, index) => (
        <group key={index}>
          {/* Giunto */}
          <mesh position={[joint.x, joint.y, joint.z]}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
          
          {/* Link */}
          {index < links.length && (
            <mesh position={[joint.x / 2, joint.y / 2, joint.z / 2]}>
              <cylinderGeometry args={[0.05, 0.05, links[index]]} />
              <meshStandardMaterial color="#4ecdc4" />
            </mesh>
          )}
        </group>
      ))}

      {/* End effector */}
      <mesh position={[endEffector.x, endEffector.y, endEffector.z]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#ffd93d" />
      </mesh>
    </group>
  );
}

// Componente per traiettorie robotiche
function RobotTrajectory({
  trajectory,
  color = '#ff6b6b'
}: {
  trajectory: { x: number; y: number; z: number }[];
  color?: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    return trajectory.map(point => new THREE.Vector3(point.x, point.y, point.z));
  }, [trajectory]);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={3} />
    </line>
  );
}

// Componente principale della scena
function MathRoboticsScene({ 
  selectedFunction, 
  showRobot, 
  showTrajectory 
}: {
  selectedFunction: string;
  showRobot: boolean;
  showTrajectory: boolean;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(8, 6, 8);
  }, [camera]);

  // Funzioni matematiche a 2 variabili
  const functions2D = {
    paraboloid: (x: number, y: number) => x * x + y * y,
    hyperbolic: (x: number, y: number) => x * x - y * y,
    sine: (x: number, y: number) => Math.sin(x) * Math.cos(y),
    gaussian: (x: number, y: number) => Math.exp(-(x * x + y * y) / 2),
    saddle: (x: number, y: number) => x * y,
    wave: (x: number, y: number) => Math.sin(Math.sqrt(x * x + y * y)),
    ripples: (x: number, y: number) => Math.sin(x) * Math.sin(y),
    spiral: (x: number, y: number) => {
      const r = Math.sqrt(x * x + y * y);
      return Math.sin(r * 2) / (r + 0.1);
    }
  };

  // Funzioni matematiche a 3 variabili
  const functions3D = {
    sphere: (x: number, y: number, z: number) => x * x + y * y + z * z - 1,
    torus: (x: number, y: number, z: number) => {
      const R = 2;
      const r = 0.5;
      return Math.pow(Math.sqrt(x * x + y * y) - R, 2) + z * z - r * r;
    },
    hyperboloid: (x: number, y: number, z: number) => x * x + y * y - z * z - 1,
    ellipsoid: (x: number, y: number, z: number) => x * x / 4 + y * y / 2 + z * z / 3 - 1,
    wave3d: (x: number, y: number, z: number) => Math.sin(x) + Math.cos(y) + Math.sin(z),
    gaussian3d: (x: number, y: number, z: number) => Math.exp(-(x * x + y * y + z * z) / 2) - 0.5
  };

  // Configurazione robotica
  const robotJoints = [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 2, y: 2, z: 0 },
    { x: 3, y: 2.5, z: 0 }
  ];

  const robotLinks = [1.4, 1.4, 0.7];

  const endEffector = { x: 3, y: 2.5, z: 0 };

  // Traiettoria robotica (spirale)
  const robotTrajectory = useMemo(() => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 4;
      const r = 2 + Math.sin(t * 2) * 0.5;
      points.push({
        x: Math.cos(t) * r,
        y: Math.sin(t) * r,
        z: Math.sin(t * 3) * 0.5
      });
    }
    return points;
  }, []);

  return (
    <>
      {/* Illuminazione */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Griglia di riferimento */}
      <Grid args={[20, 20]} position={[0, -3, 0]} />

      {/* Funzioni a 2 variabili */}
      {selectedFunction in functions2D && (
        <SurfaceFunction
          func={functions2D[selectedFunction as keyof typeof functions2D]}
          color="#4ecdc4"
          resolution={60}
          range={4}
        />
      )}

      {/* Funzioni a 3 variabili */}
      {selectedFunction in functions3D && (
        <VolumeFunction
          func={functions3D[selectedFunction as keyof typeof functions3D]}
          color="#ff6b6b"
          resolution={25}
          range={3}
          threshold={0.3}
        />
      )}

      {/* Robot */}
      {showRobot && (
        <RobotArm
          joints={robotJoints}
          links={robotLinks}
          endEffector={endEffector}
        />
      )}

      {/* Traiettoria robotica */}
      {showTrajectory && (
        <RobotTrajectory
          trajectory={robotTrajectory}
          color="#ffd93d"
        />
      )}

      {/* Testi informativi */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {selectedFunction.toUpperCase()}
      </Text>

      <Text
        position={[0, -4, 0]}
        fontSize={0.3}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Funzioni Matematiche e Robotica
      </Text>
    </>
  );
}

// Componente principale
export default function AdvancedMathVisualization() {
  const [selectedFunction, setSelectedFunction] = useState('paraboloid');
  const [showRobot, setShowRobot] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const functions2D = [
    { id: 'paraboloid', name: 'Paraboloide', description: 'z = x² + y²' },
    { id: 'hyperbolic', name: 'Iperboloide', description: 'z = x² - y²' },
    { id: 'sine', name: 'Onde Sinusoidali', description: 'z = sin(x)cos(y)' },
    { id: 'gaussian', name: 'Gaussiana', description: 'z = e^(-(x²+y²)/2)' },
    { id: 'saddle', name: 'Sella', description: 'z = xy' },
    { id: 'wave', name: 'Onde Circolari', description: 'z = sin(√(x²+y²))' },
    { id: 'ripples', name: 'Incroci', description: 'z = sin(x)sin(y)' },
    { id: 'spiral', name: 'Spirale', description: 'z = sin(r)/r' }
  ];

  const functions3D = [
    { id: 'sphere', name: 'Sfera', description: 'x² + y² + z² = 1' },
    { id: 'torus', name: 'Toro', description: 'Superficie toroidale' },
    { id: 'hyperboloid', name: 'Iperboloide 3D', description: 'x² + y² - z² = 1' },
    { id: 'ellipsoid', name: 'Ellissoide', description: 'x²/4 + y²/2 + z²/3 = 1' },
    { id: 'wave3d', name: 'Onde 3D', description: 'sin(x) + cos(y) + sin(z)' },
    { id: 'gaussian3d', name: 'Gaussiana 3D', description: 'e^(-(x²+y²+z²)/2)' }
  ];

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Caricamento visualizzazione matematica avanzata...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <MathRoboticsScene
          selectedFunction={selectedFunction}
          showRobot={showRobot}
          showTrajectory={showTrajectory}
        />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0.3}
        />
        <Environment preset="night" />
      </Canvas>

      {/* Pannello di controllo */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 min-w-[300px]">
          <h3 className="text-lg font-bold mb-4">Controlli Matematici</h3>
          
          {/* Funzioni a 2 variabili */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-blue-300">Funzioni 2D (Superfici)</h4>
            <div className="grid grid-cols-2 gap-2">
              {functions2D.map((func) => (
                <button
                  key={func.id}
                  onClick={() => setSelectedFunction(func.id)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    selectedFunction === func.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={func.description}
                >
                  {func.name}
                </button>
              ))}
            </div>
          </div>

          {/* Funzioni a 3 variabili */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-red-300">Funzioni 3D (Volumi)</h4>
            <div className="grid grid-cols-2 gap-2">
              {functions3D.map((func) => (
                <button
                  key={func.id}
                  onClick={() => setSelectedFunction(func.id)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    selectedFunction === func.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={func.description}
                >
                  {func.name}
                </button>
              ))}
            </div>
          </div>

          {/* Controlli robotica */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-yellow-300">Robotica</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showRobot}
                  onChange={(e) => setShowRobot(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Mostra Robot</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTrajectory}
                  onChange={(e) => setShowTrajectory(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Mostra Traiettoria</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Informazioni matematiche */}
      <div className="absolute bottom-4 right-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-[400px]">
          <h3 className="text-lg font-bold mb-2">Informazioni Matematiche</h3>
          <div className="text-sm space-y-2">
            <p><strong>Funzioni 2D:</strong> Visualizzano superfici nello spazio 3D</p>
            <p><strong>Funzioni 3D:</strong> Rappresentano volumi e campi scalari</p>
            <p><strong>Robotica:</strong> Cinematica diretta e traiettorie</p>
            <p><strong>Applicazioni:</strong> Controllo robotico, ottimizzazione, simulazione</p>
          </div>
        </div>
      </div>

      {/* Istruzioni */}
      <div className="absolute top-4 right-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-lg font-bold mb-2">Controlli</h3>
          <div className="text-sm space-y-1">
            <p>🖱️ <strong>Mouse:</strong> Ruota, zoom, pan</p>
            <p>⌨️ <strong>Click:</strong> Seleziona funzioni</p>
            <p>🎛️ <strong>Checkbox:</strong> Attiva/disattiva elementi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
