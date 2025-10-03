'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Componente per la parabola matematica
function Parabola({ a = 0.1, b = 0, c = 0 }: { a?: number, b?: number, c?: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [parabolaPoints, setParabolaPoints] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    // Genera punti per la parabola y = ax² + bx + c
    const parabolaPoints: THREE.Vector3[] = [];
    const pointCount = 100;
    
    for (let i = 0; i < pointCount; i++) {
      const x = (i / pointCount - 0.5) * 10; // Range da -5 a 5
      const y = a * x * x + b * x + c;
      const z = 0;
      parabolaPoints.push(new THREE.Vector3(x, y, z));
    }
    
    setParabolaPoints(parabolaPoints);
    
    // Genera punti per la visualizzazione
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 20; i++) {
      const x = (i / 20 - 0.5) * 10;
      const y = a * x * x + b * x + c;
      points.push(new THREE.Vector3(x, y, 0));
    }
    setPoints(points);
  }, [a, b, c]);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Linea della parabola */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={parabolaPoints.length}
            array={new Float32Array(parabolaPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff6b6b" linewidth={3} />
      </line>
      
      {/* Punti sulla parabola */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#4ecdc4" />
      </points>
    </group>
  );
}

// Componente per punti che seguono la parabola
function ParabolaPoint({ x, a, b, c, color }: { x: number, a: number, b: number, c: number, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const y = a * x * x + b * x + c;
      meshRef.current.position.set(x, y, 0);
      meshRef.current.rotation.y += 0.02;
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
      />
    </mesh>
  );
}

// Componente per gli assi cartesiani
function CartesianAxes() {
  const xAxisRef = useRef<THREE.Line>(null);
  const yAxisRef = useRef<THREE.Line>(null);
  const zAxisRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (xAxisRef.current) {
      xAxisRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group>
      {/* Asse X - Rosso */}
      <line ref={xAxisRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-8, 0, 0, 8, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff0000" linewidth={2} />
      </line>
      
      {/* Asse Y - Verde */}
      <line ref={yAxisRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -5, 0, 0, 8, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ff00" linewidth={2} />
      </line>
      
      {/* Asse Z - Blu */}
      <line ref={zAxisRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -5, 0, 0, 5])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0000ff" linewidth={2} />
      </line>
    </group>
  );
}

// Componente per griglia di riferimento
function Grid() {
  const gridRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <gridHelper 
      ref={gridRef}
      args={[20, 20, '#444444', '#222222']} 
      position={[0, 0, 0]}
    />
  );
}

// Componente per particelle fluttuanti
function FloatingParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  });

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" />
    </points>
  );
}

// Componente per il testo 3D
function FloatingText({ text, position }: { text: string, position: [number, number, number] }) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={1}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
}

// Componente principale della scena
function Scene({ parabolaParams }: { parabolaParams: { a: number, b: number, c: number } }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(8, 6, 8);
  }, [camera]);

  return (
    <>
      {/* Illuminazione */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-5, 5, 5]} color="#ff6b6b" intensity={0.8} />
      <pointLight position={[5, 5, -5]} color="#4ecdc4" intensity={0.8} />
      
      {/* Griglia di riferimento */}
      <Grid />
      
      {/* Assi cartesiani */}
      <CartesianAxes />
      
      {/* Parabola matematica */}
      <Parabola a={parabolaParams.a} b={parabolaParams.b} c={parabolaParams.c} />
      
      {/* Punti che seguono la parabola */}
      <ParabolaPoint x={-3} a={parabolaParams.a} b={parabolaParams.b} c={parabolaParams.c} color="#ff6b6b" />
      <ParabolaPoint x={-1.5} a={parabolaParams.a} b={parabolaParams.b} c={parabolaParams.c} color="#4ecdc4" />
      <ParabolaPoint x={0} a={parabolaParams.a} b={parabolaParams.b} c={parabolaParams.c} color="#45b7d1" />
      <ParabolaPoint x={1.5} a={parabolaParams.a} b={parabolaParams.b} c={parabolaParams.c} color="#f9ca24" />
      <ParabolaPoint x={3} a={parabolaParams.a} b={parabolaParams.b} c={parabolaParams.c} color="#ff9ff3" />
      
      {/* Particelle fluttuanti */}
      <FloatingParticles count={100} />
      
      {/* Testo 3D */}
      <FloatingText text="Parabola Matematica" position={[0, 4, 0]} />
      <FloatingText text={`y = ${parabolaParams.a.toFixed(2)}x² + ${parabolaParams.b.toFixed(1)}x + ${parabolaParams.c.toFixed(1)}`} position={[0, 3, 0]} />
    </>
  );
}

// Componente principale
export default function ThreeJSAnimation() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [parabolaParams, setParabolaParams] = useState({ a: 0.1, b: 0, c: 0 });
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Caricamento animazione matematica...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Canvas Three.js */}
      <Canvas
        camera={{ position: [8, 6, 8], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene parabolaParams={parabolaParams} />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0.3}
        />
        <Environment preset="night" />
      </Canvas>
      
      {/* Overlay con informazioni */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h2 className="text-xl font-bold mb-2">📐 Parabola Matematica 3D</h2>
          <p className="text-sm opacity-80 mb-2">
            Equazione: y = ax² + bx + c
          </p>
          <p className="text-xs opacity-60">
            Interagisci con la scena usando il mouse
          </p>
        </div>
      </div>
      
      {/* Controlli parametri parabola */}
      {showControls && (
        <div className="absolute top-4 right-4 text-white z-10">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 min-w-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">🎛️ Controlli Parabola</h3>
              <button
                onClick={() => setShowControls(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Parametro a */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Coefficiente a: {parabolaParams.a}
                </label>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.01"
                  value={parabolaParams.a}
                  onChange={(e) => setParabolaParams({...parabolaParams, a: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Parametro b */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Coefficiente b: {parabolaParams.b}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={parabolaParams.b}
                  onChange={(e) => setParabolaParams({...parabolaParams, b: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Parametro c */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Costante c: {parabolaParams.c}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={parabolaParams.c}
                  onChange={(e) => setParabolaParams({...parabolaParams, c: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Pulsanti preset */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Preset:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setParabolaParams({a: 0.1, b: 0, c: 0})}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setParabolaParams({a: -0.1, b: 0, c: 2})}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                  >
                    Inversa
                  </button>
                  <button
                    onClick={() => setParabolaParams({a: 0.2, b: -1, c: 1})}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
                  >
                    Spostata
                  </button>
                  <button
                    onClick={() => setParabolaParams({a: 0, b: 1, c: 0})}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs"
                  >
                    Lineare
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Controlli base */}
      <div className="absolute bottom-4 right-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-lg font-bold mb-2">🎮 Controlli</h3>
          <ul className="text-sm space-y-1 opacity-80">
            <li>🖱️ Rotazione: Trascina</li>
            <li>🔍 Zoom: Rotella mouse</li>
            <li>📱 Pan: Click destro + trascina</li>
            <li>🎛️ Parametri: Pannello in alto</li>
          </ul>
        </div>
      </div>
      
      {/* Pulsanti di controllo */}
      <div className="absolute bottom-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-200"
        >
          {showControls ? '🎛️ Nascondi Controlli' : '🎛️ Mostra Controlli'}
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-200"
        >
          ← Torna indietro
        </button>
      </div>
    </div>
  );
}
