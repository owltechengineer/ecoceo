'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Environment, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import RobotProgrammingInterface from './RobotProgrammingInterface';

// Interfaccia per oggetti sulla catena di montaggio
interface ProductionObject {
  id: string;
  position: { x: number; y: number; z: number };
  type: 'box' | 'cylinder' | 'sphere';
  color: string;
  status: 'raw' | 'processed' | 'packaged';
  progress: number;
}

// Componente per il braccio robotico industriale
function IndustrialRobotArm({
  basePosition,
  jointAngles,
  linkLengths,
  isActive,
  targetPosition,
  onReachTarget
}: {
  basePosition: { x: number; y: number; z: number };
  jointAngles: number[];
  linkLengths: number[];
  isActive: boolean;
  targetPosition: { x: number; y: number; z: number };
  onReachTarget: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [endEffectorPos, setEndEffectorPos] = useState({ x: 0, y: 0, z: 0 });
  const [isMoving, setIsMoving] = useState(false);

  // Calcolo cinematica diretta per braccio industriale
  const calculateForwardKinematics = (angles: number[], lengths: number[]) => {
    let x = 0, y = 0, z = 0;
    let currentAngle = 0;
    
    // Base height
    z = 0.5;
    
    for (let i = 0; i < angles.length; i++) {
      currentAngle += angles[i];
      
      if (i === 0) {
        // Primo giunto - rotazione base
        x = 0;
        y = 0;
        z = 0.5;
      } else if (i === 1) {
        // Secondo giunto - movimento orizzontale
        x = lengths[i] * Math.cos(currentAngle);
        y = lengths[i] * Math.sin(currentAngle);
        z = 0.5;
      } else {
        // Giunti successivi
        x += lengths[i] * Math.cos(currentAngle);
        y += lengths[i] * Math.sin(currentAngle);
        z += (i === 2) ? lengths[i] * 0.3 : 0; // Terzo giunto con movimento verticale
      }
    }
    
    return { x, y, z };
  };

  useEffect(() => {
    const pos = calculateForwardKinematics(jointAngles, linkLengths);
    setEndEffectorPos(pos);
    
    // Controlla se ha raggiunto il target
    const distance = Math.sqrt(
      Math.pow(pos.x - targetPosition.x, 2) +
      Math.pow(pos.y - targetPosition.y, 2) +
      Math.pow(pos.z - targetPosition.z, 2)
    );
    
    if (distance < 0.2 && isActive) {
      onReachTarget();
    }
  }, [jointAngles, linkLengths, targetPosition, isActive, onReachTarget]);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      // Animazione di movimento quando attivo
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[basePosition.x, basePosition.y, basePosition.z]}>
      {/* Base del robot industriale */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      {/* Giunto base */}
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color={isActive ? "#e74c3c" : "#7f8c8d"} />
      </mesh>

      {/* Link 1 - Braccio principale */}
      <mesh 
        position={[
          linkLengths[1] * Math.cos(jointAngles[1]) / 2,
          linkLengths[1] * Math.sin(jointAngles[1]) / 2,
          0.5
        ]}
        rotation={[0, 0, jointAngles[1]]}
      >
        <boxGeometry args={[linkLengths[1], 0.2, 0.2]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Giunto 2 */}
      <mesh position={[
        linkLengths[1] * Math.cos(jointAngles[1]),
        linkLengths[1] * Math.sin(jointAngles[1]),
        0.5
      ]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color={isActive ? "#e74c3c" : "#7f8c8d"} />
      </mesh>

      {/* Link 2 - Avambraccio */}
      <mesh 
        position={[
          linkLengths[1] * Math.cos(jointAngles[1]) + linkLengths[2] * Math.cos(jointAngles[1] + jointAngles[2]) / 2,
          linkLengths[1] * Math.sin(jointAngles[1]) + linkLengths[2] * Math.sin(jointAngles[1] + jointAngles[2]) / 2,
          0.5 + linkLengths[2] * 0.3
        ]}
        rotation={[0, 0, jointAngles[1] + jointAngles[2]]}
      >
        <boxGeometry args={[linkLengths[2], 0.15, 0.15]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* End effector */}
      <mesh position={[endEffectorPos.x, endEffectorPos.y, endEffectorPos.z]}>
        <boxGeometry args={[0.2, 0.2, 0.3]} />
        <meshStandardMaterial color={isActive ? "#f39c12" : "#95a5a6"} />
      </mesh>

      {/* Gripper */}
      <mesh position={[endEffectorPos.x, endEffectorPos.y, endEffectorPos.z - 0.2]}>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#e67e22" />
      </mesh>

      {/* Target indicator */}
      <mesh position={[targetPosition.x, targetPosition.y, targetPosition.z]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#e74c3c" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Componente per la catena di montaggio
function ConveyorBelt({
  position,
  length,
  width,
  speed,
  objects,
  onObjectProcessed
}: {
  position: { x: number; y: number; z: number };
  length: number;
  width: number;
  speed: number;
  objects: ProductionObject[];
  onObjectProcessed: (objectId: string) => void;
}) {
  const beltRef = useRef<THREE.Group>(null);
  const [beltOffset, setBeltOffset] = useState(0);

  useFrame((state) => {
    if (beltRef.current) {
      // Animazione della cinghia
      setBeltOffset(prev => (prev + speed * 0.01) % 1);
      
      // Muovi oggetti sulla cinghia
      objects.forEach(obj => {
        if (obj.status === 'raw') {
          obj.position.x += speed * 0.01;
          if (obj.position.x > length / 2) {
            onObjectProcessed(obj.id);
          }
        }
      });
    }
  });

  return (
    <group ref={beltRef} position={[position.x, position.y, position.z]}>
      {/* Base della cinghia */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[length, width, 0.2]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      
      {/* Cinghia in movimento */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, width, 0.05]} />
        <meshStandardMaterial 
          color="#95a5a6"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Linee della cinghia */}
      {Array.from({ length: Math.floor(length) }).map((_, i) => (
        <mesh key={i} position={[i - length/2 + beltOffset, 0, 0.03]}>
          <boxGeometry args={[0.1, width, 0.02]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      ))}

      {/* Oggetti sulla cinghia */}
      {objects.map(obj => (
        <mesh key={obj.id} position={[obj.position.x, obj.position.y, obj.position.z + 0.1]}>
          {obj.type === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
          {obj.type === 'cylinder' && <cylinderGeometry args={[0.15, 0.15, 0.3]} />}
          {obj.type === 'sphere' && <sphereGeometry args={[0.15]} />}
          <meshStandardMaterial color={obj.color} />
        </mesh>
      ))}
    </group>
  );
}

// Componente per stazioni di lavoro
function WorkStation({
  position,
  type,
  isActive,
  progress
}: {
  position: { x: number; y: number; z: number };
  type: 'processing' | 'packaging' | 'quality';
  isActive: boolean;
  progress: number;
}) {
  const stationRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stationRef.current && isActive) {
      // Animazione della stazione quando attiva
      stationRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const getStationColor = () => {
    switch (type) {
      case 'processing': return isActive ? "#e74c3c" : "#c0392b";
      case 'packaging': return isActive ? "#f39c12" : "#e67e22";
      case 'quality': return isActive ? "#27ae60" : "#229954";
      default: return "#7f8c8d";
    }
  };

  return (
    <group ref={stationRef} position={[position.x, position.y, position.z]}>
      {/* Base della stazione */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      
      {/* Torre della stazione */}
      <mesh position={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial color={getStationColor()} />
      </mesh>

      {/* Indicatore di progresso */}
      <mesh position={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.1, 0.1, progress * 0.5]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>

      {/* Luce di stato */}
      <mesh position={[0, 0, 1.8]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color={isActive ? "#f1c40f" : "#7f8c8d"}
          emissive={isActive ? "#f1c40f" : "#000000"}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
}

// Componente per sensori
function Sensor({
  position,
  type,
  isActive,
  range
}: {
  position: { x: number; y: number; z: number };
  type: 'proximity' | 'vision' | 'weight';
  isActive: boolean;
  range: number;
}) {
  const sensorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sensorRef.current && isActive) {
      // Animazione del sensore
      sensorRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  const getSensorColor = () => {
    switch (type) {
      case 'proximity': return "#3498db";
      case 'vision': return "#9b59b6";
      case 'weight': return "#e67e22";
      default: return "#7f8c8d";
    }
  };

  return (
    <group ref={sensorRef} position={[position.x, position.y, position.z]}>
      {/* Base del sensore */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      {/* Testa del sensore */}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color={getSensorColor()}
          emissive={isActive ? getSensorColor() : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>

      {/* Campo di rilevamento */}
      {isActive && (
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[range]} />
          <meshStandardMaterial 
            color={getSensorColor()}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

// Componente principale della scena
function ProductionLineScene({
  robots,
  conveyors,
  workStations,
  sensors,
  productionObjects,
  onRobotReachTarget,
  onObjectProcessed,
  simulationSpeed
}: {
  robots: any[];
  conveyors: any[];
  workStations: any[];
  sensors: any[];
  productionObjects: ProductionObject[];
  onRobotReachTarget: (robotId: string) => void;
  onObjectProcessed: (objectId: string) => void;
  simulationSpeed: number;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(15, 10, 15);
  }, [camera]);

  return (
    <>
      {/* Illuminazione industriale */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 20, 10]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#f1c40f" />
      <pointLight position={[10, 5, 0]} intensity={0.5} color="#e74c3c" />
      <pointLight position={[-10, 5, 0]} intensity={0.5} color="#3498db" />

      {/* Pavimento industriale */}
      <Grid args={[50, 50]} position={[0, -0.5, 0]} />

      {/* Robot industriali */}
      {robots.map(robot => (
        <IndustrialRobotArm
          key={robot.id}
          basePosition={robot.position}
          jointAngles={robot.jointAngles}
          linkLengths={robot.linkLengths}
          isActive={robot.isActive}
          targetPosition={robot.targetPosition}
          onReachTarget={() => onRobotReachTarget(robot.id)}
        />
      ))}

      {/* Catene di montaggio */}
      {conveyors.map(conveyor => (
        <ConveyorBelt
          key={conveyor.id}
          position={conveyor.position}
          length={conveyor.length}
          width={conveyor.width}
          speed={conveyor.speed * simulationSpeed}
          objects={productionObjects.filter(obj => obj.status === 'raw')}
          onObjectProcessed={onObjectProcessed}
        />
      ))}

      {/* Stazioni di lavoro */}
      {workStations.map(station => (
        <WorkStation
          key={station.id}
          position={station.position}
          type={station.type}
          isActive={station.isActive}
          progress={station.progress}
        />
      ))}

      {/* Sensori */}
      {sensors.map(sensor => (
        <Sensor
          key={sensor.id}
          position={sensor.position}
          type={sensor.type}
          isActive={sensor.isActive}
          range={sensor.range}
        />
      ))}

      {/* Testi informativi */}
      <Text
        position={[0, 8, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SIMULAZIONE CATENA DI PRODUZIONE
      </Text>

      <Text
        position={[0, -8, 0]}
        fontSize={0.4}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Controllo Robotico Industriale
      </Text>
    </>
  );
}

// Componente principale
export default function ProductionLineSimulation() {
  const [robots, setRobots] = useState([
    {
      id: 'robot1',
      position: { x: -5, y: 0, z: 0 },
      jointAngles: [0, Math.PI / 4, Math.PI / 6],
      linkLengths: [0, 3, 2],
      isActive: true,
      targetPosition: { x: 2, y: 2, z: 1 }
    },
    {
      id: 'robot2',
      position: { x: 5, y: 0, z: 0 },
      jointAngles: [0, -Math.PI / 4, -Math.PI / 6],
      linkLengths: [0, 3, 2],
      isActive: false,
      targetPosition: { x: -2, y: -2, z: 1 }
    }
  ]);

  const [conveyors, setConveyors] = useState([
    {
      id: 'conveyor1',
      position: { x: 0, y: 0, z: 0 },
      length: 20,
      width: 2,
      speed: 1
    }
  ]);

  const [workStations, setWorkStations] = useState([
    {
      id: 'station1',
      position: { x: -8, y: 0, z: 0 },
      type: 'processing',
      isActive: true,
      progress: 0.7
    },
    {
      id: 'station2',
      position: { x: 8, y: 0, z: 0 },
      type: 'packaging',
      isActive: false,
      progress: 0.3
    },
    {
      id: 'station3',
      position: { x: 0, y: 5, z: 0 },
      type: 'quality',
      isActive: true,
      progress: 0.9
    }
  ]);

  const [sensors, setSensors] = useState([
    {
      id: 'sensor1',
      position: { x: -3, y: 0, z: 1 },
      type: 'proximity',
      isActive: true,
      range: 2
    },
    {
      id: 'sensor2',
      position: { x: 3, y: 0, z: 1 },
      type: 'vision',
      isActive: true,
      range: 3
    },
    {
      id: 'sensor3',
      position: { x: 0, y: 3, z: 1 },
      type: 'weight',
      isActive: false,
      range: 1
    }
  ]);

  const [productionObjects, setProductionObjects] = useState<ProductionObject[]>([
    {
      id: 'obj1',
      position: { x: -8, y: 0, z: 0.2 },
      type: 'box',
      color: '#e74c3c',
      status: 'raw',
      progress: 0
    },
    {
      id: 'obj2',
      position: { x: -5, y: 0, z: 0.2 },
      type: 'cylinder',
      color: '#3498db',
      status: 'raw',
      progress: 0
    },
    {
      id: 'obj3',
      position: { x: -2, y: 0, z: 0.2 },
      type: 'sphere',
      color: '#2ecc71',
      status: 'processed',
      progress: 0.5
    }
  ]);

  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [selectedRobot, setSelectedRobot] = useState('robot1');
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showProgrammingInterface, setShowProgrammingInterface] = useState(false);
  const [isRobotConnected, setIsRobotConnected] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleRobotReachTarget = (robotId: string) => {
    console.log(`Robot ${robotId} ha raggiunto il target`);
    // Logica per quando il robot raggiunge il target
  };

  const handleObjectProcessed = (objectId: string) => {
    setProductionObjects(prev => 
      prev.map(obj => 
        obj.id === objectId 
          ? { ...obj, status: 'processed' as const, progress: 0.5 }
          : obj
      )
    );
  };

  const updateRobotJoint = (robotId: string, jointIndex: number, angle: number) => {
    setRobots(prev => 
      prev.map(robot => 
        robot.id === robotId 
          ? { 
              ...robot, 
              jointAngles: robot.jointAngles.map((a, i) => i === jointIndex ? angle : a)
            }
          : robot
      )
    );
  };

  const executeRobotCommand = (command: any) => {
    console.log('Eseguendo comando robot:', command);
    // Implementa logica per eseguire comandi robot
    // Per ora aggiorna la posizione target del robot selezionato
    if (command.type === 'move' && command.parameters) {
      setRobots(prev => 
        prev.map(robot => 
          robot.id === selectedRobot 
            ? { 
                ...robot, 
                targetPosition: {
                  x: command.parameters.x || robot.targetPosition.x,
                  y: command.parameters.y || robot.targetPosition.y,
                  z: command.parameters.z || robot.targetPosition.z
                }
              }
            : robot
        )
      );
    }
  };

  const toggleRobot = (robotId: string) => {
    setRobots(prev => 
      prev.map(robot => 
        robot.id === robotId 
          ? { ...robot, isActive: !robot.isActive }
          : robot
      )
    );
  };

  const selectedRobotData = robots.find(r => r.id === selectedRobot);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Caricamento simulazione catena di produzione...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
      <Canvas
        camera={{ position: [15, 10, 15], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ProductionLineScene
          robots={robots}
          conveyors={conveyors}
          workStations={workStations}
          sensors={sensors}
          productionObjects={productionObjects}
          onRobotReachTarget={handleRobotReachTarget}
          onObjectProcessed={handleObjectProcessed}
          simulationSpeed={simulationSpeed}
        />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0.3}
        />
        <Environment preset="warehouse" />
      </Canvas>

      {/* Pannello di controllo robot */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 min-w-[300px]">
          <h3 className="text-lg font-bold mb-4">Controllo Robot</h3>
          
          {/* Selezione robot */}
          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">Robot Selezionato</label>
            <select
              value={selectedRobot}
              onChange={(e) => setSelectedRobot(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white text-sm"
            >
              {robots.map(robot => (
                <option key={robot.id} value={robot.id}>
                  {robot.id.toUpperCase()} - {robot.isActive ? 'ATTIVO' : 'INATTIVO'}
                </option>
              ))}
            </select>
          </div>

          {/* Controlli giunti */}
          {selectedRobotData && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-blue-300">Controllo Giunti</h4>
              {selectedRobotData.jointAngles.map((angle, index) => (
                <div key={index} className="mb-2">
                  <label className="text-xs">
                    Giunto {index + 1}: {(angle * 180 / Math.PI).toFixed(0)}°
                  </label>
                  <input
                    type="range"
                    min="-Math.PI"
                    max="Math.PI"
                    step="0.1"
                    value={angle}
                    onChange={(e) => updateRobotJoint(selectedRobot, index, parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Controlli generali */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-green-300">Controlli</h4>
            <div className="space-y-2">
              <button
                onClick={() => toggleRobot(selectedRobot)}
                className={`w-full px-3 py-2 rounded text-sm font-medium ${
                  selectedRobotData?.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedRobotData?.isActive ? 'DISATTIVA' : 'ATTIVA'} ROBOT
              </button>
              
              <button
                onClick={() => setIsSimulationRunning(!isSimulationRunning)}
                className={`w-full px-3 py-2 rounded text-sm font-medium ${
                  isSimulationRunning
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSimulationRunning ? 'PAUSA' : 'AVVIA'} SIMULAZIONE
              </button>
            </div>
          </div>

          {/* Velocità simulazione */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-purple-300">Velocità</h4>
            <div>
              <label className="text-xs">Velocità: {simulationSpeed.toFixed(1)}x</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Interfaccia di programmazione */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-orange-300">Programmazione</h4>
            <button
              onClick={() => setShowProgrammingInterface(!showProgrammingInterface)}
              className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm font-medium text-white"
            >
              {showProgrammingInterface ? 'NASCONDI' : 'MOSTRA'} INTERFACCIA PROGRAMMAZIONE
            </button>
          </div>
        </div>
      </div>

      {/* Interfaccia di programmazione robot */}
      {showProgrammingInterface && (
        <div className="absolute top-4 left-80 z-10">
          <RobotProgrammingInterface
            onExecuteCommand={executeRobotCommand}
            onExecuteProgram={() => {}}
            isConnected={isRobotConnected}
          />
        </div>
      )}

      {/* Pannello stato sistema */}
      <div className="absolute top-4 right-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 min-w-[300px]">
          <h3 className="text-lg font-bold mb-4">Stato Sistema</h3>
          
          {/* Statistiche robot */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-blue-300">Robot</h4>
            <div className="space-y-1">
              {robots.map(robot => (
                <div key={robot.id} className="flex justify-between text-sm">
                  <span>{robot.id}:</span>
                  <span className={robot.isActive ? 'text-green-400' : 'text-red-400'}>
                    {robot.isActive ? 'ATTIVO' : 'INATTIVO'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiche stazioni */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-green-300">Stazioni</h4>
            <div className="space-y-1">
              {workStations.map(station => (
                <div key={station.id} className="flex justify-between text-sm">
                  <span>{station.type}:</span>
                  <span className={station.isActive ? 'text-green-400' : 'text-red-400'}>
                    {station.isActive ? 'ATTIVA' : 'INATTIVA'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiche oggetti */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-yellow-300">Produzione</h4>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Raw:</span>
                <span>{productionObjects.filter(obj => obj.status === 'raw').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processed:</span>
                <span>{productionObjects.filter(obj => obj.status === 'processed').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Packaged:</span>
                <span>{productionObjects.filter(obj => obj.status === 'packaged').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informazioni tecniche */}
      <div className="absolute bottom-4 left-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-[400px]">
          <h3 className="text-lg font-bold mb-2">Informazioni Tecniche</h3>
          <div className="text-sm space-y-2">
            <p><strong>Cinematica:</strong> Controllo giunti in tempo reale</p>
            <p><strong>Catena di Montaggio:</strong> Trasporto automatico oggetti</p>
            <p><strong>Sensori:</strong> Rilevamento prossimità, visione, peso</p>
            <p><strong>Stazioni:</strong> Lavorazione, confezionamento, qualità</p>
          </div>
        </div>
      </div>

      {/* Controlli di navigazione */}
      <div className="absolute bottom-4 right-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-lg font-bold mb-2">Controlli</h3>
          <div className="text-sm space-y-1">
            <p>🖱️ <strong>Mouse:</strong> Ruota, zoom, pan</p>
            <p>🎛️ <strong>Slider:</strong> Controlla giunti robot</p>
            <p>⚡ <strong>Velocità:</strong> Regola simulazione</p>
            <p>🔄 <strong>Real-time:</strong> Aggiornamenti istantanei</p>
          </div>
        </div>
      </div>
    </div>
  );
}
