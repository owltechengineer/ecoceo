'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Componente per braccio robotico con cinematica diretta
function RobotArm({
  jointAngles,
  linkLengths,
  showTrajectory = false
}: {
  jointAngles: number[];
  linkLengths: number[];
  showTrajectory?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [endEffectorPos, setEndEffectorPos] = useState({ x: 0, y: 0, z: 0 });

  // Calcolo cinematica diretta
  const calculateForwardKinematics = (angles: number[], lengths: number[]) => {
    let x = 0, y = 0, z = 0;
    let currentAngle = 0;
    
    for (let i = 0; i < angles.length; i++) {
      currentAngle += angles[i];
      x += lengths[i] * Math.cos(currentAngle);
      y += lengths[i] * Math.sin(currentAngle);
    }
    
    return { x, y, z };
  };

  useEffect(() => {
    const pos = calculateForwardKinematics(jointAngles, linkLengths);
    setEndEffectorPos(pos);
  }, [jointAngles, linkLengths]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base del robot */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Giunti e link */}
      {jointAngles.map((angle, index) => {
        const cumulativeAngle = jointAngles.slice(0, index + 1).reduce((sum, a) => sum + a, 0);
        const linkLength = linkLengths[index];
        
        return (
          <group key={index}>
            {/* Giunto */}
            <mesh position={[
              linkLengths.slice(0, index).reduce((sum, len, i) => 
                sum + len * Math.cos(jointAngles.slice(0, i + 1).reduce((s, a) => s + a, 0)), 0
              ),
              linkLengths.slice(0, index).reduce((sum, len, i) => 
                sum + len * Math.sin(jointAngles.slice(0, i + 1).reduce((s, a) => s + a, 0)), 0
              ),
              0
            ]}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
            
            {/* Link */}
            <mesh position={[
              linkLengths.slice(0, index).reduce((sum, len, i) => 
                sum + len * Math.cos(jointAngles.slice(0, i + 1).reduce((s, a) => s + a, 0)), 0
              ) + (linkLength * Math.cos(cumulativeAngle)) / 2,
              linkLengths.slice(0, index).reduce((sum, len, i) => 
                sum + len * Math.sin(jointAngles.slice(0, i + 1).reduce((s, a) => s + a, 0)), 0
              ) + (linkLength * Math.sin(cumulativeAngle)) / 2,
              0
            ]} rotation={[0, 0, cumulativeAngle]}>
              <cylinderGeometry args={[0.03, 0.03, linkLength]} />
              <meshStandardMaterial color="#4ecdc4" />
            </mesh>
          </group>
        );
      })}

      {/* End effector */}
      <mesh position={[endEffectorPos.x, endEffectorPos.y, endEffectorPos.z]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffd93d" />
      </mesh>

      {/* Traiettoria */}
      {showTrajectory && (
        <TrajectoryPath endEffectorPos={endEffectorPos} />
      )}
    </group>
  );
}

// Componente per traiettoria del robot
function TrajectoryPath({ endEffectorPos }: { endEffectorPos: { x: number; y: number; z: number } }) {
  const lineRef = useRef<THREE.Line>(null);
  const [trajectory, setTrajectory] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    setTrajectory(prev => [...prev, new THREE.Vector3(endEffectorPos.x, endEffectorPos.y, endEffectorPos.z)]);
  }, [endEffectorPos]);

  if (trajectory.length < 2) return null;

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={trajectory.length}
          array={new Float32Array(trajectory.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffd93d" linewidth={2} />
    </line>
  );
}

// Componente per campo di potenziale (path planning)
function PotentialField({
  obstacles,
  goal,
  showField = false
}: {
  obstacles: { x: number; y: number; radius: number }[];
  goal: { x: number; y: number };
  showField?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const [fieldPoints, setFieldPoints] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    if (!showField) return;

    const points: THREE.Vector3[] = [];
    const resolution = 20;
    
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = (i / resolution - 0.5) * 10;
        const y = (j / resolution - 0.5) * 10;
        
        // Calcola potenziale repulsivo dagli ostacoli
        let repulsivePotential = 0;
        obstacles.forEach(obs => {
          const dist = Math.sqrt((x - obs.x) ** 2 + (y - obs.y) ** 2);
          if (dist < obs.radius * 2) {
            repulsivePotential += (obs.radius * 2 - dist) ** 2;
          }
        });
        
        // Calcola potenziale attrattivo verso il goal
        const goalDist = Math.sqrt((x - goal.x) ** 2 + (y - goal.y) ** 2);
        const attractivePotential = goalDist ** 2;
        
        const totalPotential = repulsivePotential + attractivePotential;
        const z = Math.min(totalPotential / 10, 2);
        
        points.push(new THREE.Vector3(x, y, z));
      }
    }
    
    setFieldPoints(points);
  }, [obstacles, goal, showField]);

  if (!showField || fieldPoints.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={fieldPoints.length}
          array={new Float32Array(fieldPoints.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ff6b6b" />
    </points>
  );
}

// Componente per visualizzazione di algoritmi di controllo
function ControlAlgorithm({
  algorithm,
  parameters
}: {
  algorithm: 'PID' | 'LQR' | 'MPC';
  parameters: any;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const [response, setResponse] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    const points: THREE.Vector3[] = [];
    const timeSteps = 100;
    
    for (let t = 0; t < timeSteps; t++) {
      const time = t / timeSteps * 10;
      let output = 0;
      
      switch (algorithm) {
        case 'PID':
          // Simulazione PID controller
          const error = Math.sin(time) - (output || 0);
          output = parameters.kp * error + parameters.ki * error * time + parameters.kd * error;
          break;
        case 'LQR':
          // Simulazione LQR controller
          output = Math.exp(-parameters.alpha * time) * Math.sin(parameters.omega * time);
          break;
        case 'MPC':
          // Simulazione MPC controller
          output = Math.sin(time) * Math.exp(-time / parameters.horizon);
          break;
      }
      
      points.push(new THREE.Vector3(time, output, 0));
    }
    
    setResponse(points);
  }, [algorithm, parameters]);

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={response.length}
          array={new Float32Array(response.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4ecdc4" linewidth={3} />
    </line>
  );
}

// Componente principale della scena robotica
function RoboticsScene({
  selectedApplication,
  showTrajectory,
  showPotentialField,
  jointAngles,
  linkLengths,
  obstacles,
  goal,
  controlAlgorithm,
  controlParameters
}: {
  selectedApplication: string;
  showTrajectory: boolean;
  showPotentialField: boolean;
  jointAngles: number[];
  linkLengths: number[];
  obstacles: { x: number; y: number; radius: number }[];
  goal: { x: number; y: number };
  controlAlgorithm: string;
  controlParameters: any;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(8, 6, 8);
  }, [camera]);

  return (
    <>
      {/* Illuminazione */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Griglia di riferimento */}
      <Grid args={[20, 20]} position={[0, -3, 0]} />

      {/* Applicazioni robotiche */}
      {selectedApplication === 'kinematics' && (
        <RobotArm
          jointAngles={jointAngles}
          linkLengths={linkLengths}
          showTrajectory={showTrajectory}
        />
      )}

      {selectedApplication === 'pathplanning' && (
        <>
          <PotentialField
            obstacles={obstacles}
            goal={goal}
            showField={showPotentialField}
          />
          {/* Ostacoli */}
          {obstacles.map((obs, index) => (
            <mesh key={index} position={[obs.x, obs.y, 0]}>
              <cylinderGeometry args={[obs.radius, obs.radius, 0.2]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
          ))}
          {/* Goal */}
          <mesh position={[goal.x, goal.y, 0]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial color="#4ecdc4" />
          </mesh>
        </>
      )}

      {selectedApplication === 'control' && (
        <ControlAlgorithm
          algorithm={controlAlgorithm as 'PID' | 'LQR' | 'MPC'}
          parameters={controlParameters}
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
        {selectedApplication.toUpperCase()}
      </Text>

      <Text
        position={[0, -4, 0]}
        fontSize={0.3}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Applicazioni Robotiche Avanzate
      </Text>
    </>
  );
}

// Componente principale
export default function RoboticsApplications() {
  const [selectedApplication, setSelectedApplication] = useState('kinematics');
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showPotentialField, setShowPotentialField] = useState(true);
  const [jointAngles, setJointAngles] = useState([Math.PI / 4, Math.PI / 6, Math.PI / 8]);
  const [linkLengths, setLinkLengths] = useState([2, 1.5, 1]);
  const [obstacles, setObstacles] = useState([
    { x: 2, y: 1, radius: 0.5 },
    { x: -1, y: 2, radius: 0.3 }
  ]);
  const [goal, setGoal] = useState({ x: 3, y: 2 });
  const [controlAlgorithm, setControlAlgorithm] = useState('PID');
  const [controlParameters, setControlParameters] = useState({
    kp: 1, ki: 0.1, kd: 0.05, alpha: 0.5, omega: 2, horizon: 5
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const applications = [
    { id: 'kinematics', name: 'Cinematica', description: 'Cinematica diretta del braccio robotico' },
    { id: 'pathplanning', name: 'Path Planning', description: 'Pianificazione del percorso con campi di potenziale' },
    { id: 'control', name: 'Controllo', description: 'Algoritmi di controllo (PID, LQR, MPC)' }
  ];

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Caricamento applicazioni robotiche...
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
        <RoboticsScene
          selectedApplication={selectedApplication}
          showTrajectory={showTrajectory}
          showPotentialField={showPotentialField}
          jointAngles={jointAngles}
          linkLengths={linkLengths}
          obstacles={obstacles}
          goal={goal}
          controlAlgorithm={controlAlgorithm}
          controlParameters={controlParameters}
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
          <h3 className="text-lg font-bold mb-4">Controlli Robotica</h3>
          
          {/* Selezione applicazione */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-blue-300">Applicazioni</h4>
            <div className="space-y-2">
              {applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApplication(app.id)}
                  className={`w-full px-3 py-2 rounded text-sm transition-all ${
                    selectedApplication === app.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title={app.description}
                >
                  {app.name}
                </button>
              ))}
            </div>
          </div>

          {/* Controlli specifici per cinematica */}
          {selectedApplication === 'kinematics' && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-green-300">Cinematica</h4>
              <div className="space-y-2">
                {jointAngles.map((angle, index) => (
                  <div key={index}>
                    <label className="text-xs">Giunto {index + 1}: {(angle * 180 / Math.PI).toFixed(0)}°</label>
                    <input
                      type="range"
                      min="-Math.PI"
                      max="Math.PI"
                      step="0.1"
                      value={angle}
                      onChange={(e) => {
                        const newAngles = [...jointAngles];
                        newAngles[index] = parseFloat(e.target.value);
                        setJointAngles(newAngles);
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
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
          )}

          {/* Controlli per path planning */}
          {selectedApplication === 'pathplanning' && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-red-300">Path Planning</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPotentialField}
                    onChange={(e) => setShowPotentialField(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Mostra Campo di Potenziale</span>
                </label>
                <div>
                  <label className="text-xs">Goal X: {goal.x.toFixed(1)}</label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={goal.x}
                    onChange={(e) => setGoal({...goal, x: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs">Goal Y: {goal.y.toFixed(1)}</label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={goal.y}
                    onChange={(e) => setGoal({...goal, y: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Controlli per controllo */}
          {selectedApplication === 'control' && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-yellow-300">Controllo</h4>
              <div className="space-y-2">
                <select
                  value={controlAlgorithm}
                  onChange={(e) => setControlAlgorithm(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                >
                  <option value="PID">PID Controller</option>
                  <option value="LQR">LQR Controller</option>
                  <option value="MPC">MPC Controller</option>
                </select>
                {controlAlgorithm === 'PID' && (
                  <div className="space-y-1">
                    <div>
                      <label className="text-xs">Kp: {controlParameters.kp.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={controlParameters.kp}
                        onChange={(e) => setControlParameters({...controlParameters, kp: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Ki: {controlParameters.ki.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.01"
                        value={controlParameters.ki}
                        onChange={(e) => setControlParameters({...controlParameters, ki: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Kd: {controlParameters.kd.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="0.2"
                        step="0.01"
                        value={controlParameters.kd}
                        onChange={(e) => setControlParameters({...controlParameters, kd: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informazioni tecniche */}
      <div className="absolute bottom-4 right-4 text-white z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-[400px]">
          <h3 className="text-lg font-bold mb-2">Informazioni Tecniche</h3>
          <div className="text-sm space-y-2">
            <p><strong>Cinematica:</strong> Calcolo posizione end-effector</p>
            <p><strong>Path Planning:</strong> Evitamento ostacoli con campi di potenziale</p>
            <p><strong>Controllo:</strong> Algoritmi di controllo feedback</p>
            <p><strong>Applicazioni:</strong> Manifattura, chirurgia, esplorazione</p>
          </div>
        </div>
      </div>
    </div>
  );
}
