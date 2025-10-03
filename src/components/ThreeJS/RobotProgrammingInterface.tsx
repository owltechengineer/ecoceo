'use client';

import React, { useState, useEffect } from 'react';

// Interfaccia per comandi robot
interface RobotCommand {
  id: string;
  type: 'move' | 'grip' | 'release' | 'wait' | 'rotate';
  parameters: {
    x?: number;
    y?: number;
    z?: number;
    angle?: number;
    duration?: number;
    speed?: number;
  };
  executed: boolean;
}

// Interfaccia per sequenze di programmazione
interface RobotProgram {
  id: string;
  name: string;
  commands: RobotCommand[];
  isRunning: boolean;
  currentStep: number;
}

export default function RobotProgrammingInterface({
  onExecuteCommand,
  onExecuteProgram,
  isConnected
}: {
  onExecuteCommand: (command: RobotCommand) => void;
  onExecuteProgram: (program: RobotProgram) => void;
  isConnected: boolean;
}) {
  const [programs, setPrograms] = useState<RobotProgram[]>([
    {
      id: 'program1',
      name: 'Pick and Place',
      commands: [
        {
          id: 'cmd1',
          type: 'move',
          parameters: { x: 2, y: 2, z: 1, speed: 0.5 },
          executed: false
        },
        {
          id: 'cmd2',
          type: 'grip',
          parameters: { duration: 1 },
          executed: false
        },
        {
          id: 'cmd3',
          type: 'move',
          parameters: { x: -2, y: -2, z: 1, speed: 0.5 },
          executed: false
        },
        {
          id: 'cmd4',
          type: 'release',
          parameters: { duration: 1 },
          executed: false
        }
      ],
      isRunning: false,
      currentStep: 0
    },
    {
      id: 'program2',
      name: 'Assembly Sequence',
      commands: [
        {
          id: 'cmd5',
          type: 'move',
          parameters: { x: 0, y: 3, z: 0.5, speed: 0.3 },
          executed: false
        },
        {
          id: 'cmd6',
          type: 'grip',
          parameters: { duration: 2 },
          executed: false
        },
        {
          id: 'cmd7',
          type: 'rotate',
          parameters: { angle: 90, speed: 0.2 },
          executed: false
        },
        {
          id: 'cmd8',
          type: 'move',
          parameters: { x: 1, y: 1, z: 0.8, speed: 0.3 },
          executed: false
        },
        {
          id: 'cmd9',
          type: 'release',
          parameters: { duration: 1 },
          executed: false
        }
      ],
      isRunning: false,
      currentStep: 0
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState<string>('program1');
  const [newCommand, setNewCommand] = useState<Partial<RobotCommand>>({
    type: 'move',
    parameters: { x: 0, y: 0, z: 0, speed: 0.5 }
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordedCommands, setRecordedCommands] = useState<RobotCommand[]>([]);

  const executeProgram = async (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) return;

    setPrograms(prev => prev.map(p => 
      p.id === programId ? { ...p, isRunning: true, currentStep: 0 } : p
    ));

    for (let i = 0; i < program.commands.length; i++) {
      const command = program.commands[i];
      
      // Aggiorna stato comando corrente
      setPrograms(prev => prev.map(p => 
        p.id === programId ? { ...p, currentStep: i } : p
      ));

      // Esegui comando
      onExecuteCommand(command);
      
      // Attendi durata comando
      await new Promise(resolve => setTimeout(resolve, (command.parameters.duration || 1) * 1000));
      
      // Marca comando come eseguito
      setPrograms(prev => prev.map(p => 
        p.id === programId 
          ? {
              ...p,
              commands: p.commands.map(cmd => 
                cmd.id === command.id ? { ...cmd, executed: true } : cmd
              )
            }
          : p
      ));
    }

    // Completa programma
    setPrograms(prev => prev.map(p => 
      p.id === programId ? { ...p, isRunning: false } : p
    ));
  };

  const addCommand = () => {
    if (!newCommand.type) return;

    const command: RobotCommand = {
      id: `cmd_${Date.now()}`,
      type: newCommand.type,
      parameters: newCommand.parameters || {},
      executed: false
    };

    setPrograms(prev => prev.map(p => 
      p.id === selectedProgram 
        ? { ...p, commands: [...p.commands, command] }
        : p
    ));

    // Reset form
    setNewCommand({
      type: 'move',
      parameters: { x: 0, y: 0, z: 0, speed: 0.5 }
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedCommands([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Crea nuovo programma con comandi registrati
    const newProgram: RobotProgram = {
      id: `program_${Date.now()}`,
      name: `Recorded Program ${programs.length + 1}`,
      commands: recordedCommands,
      isRunning: false,
      currentStep: 0
    };

    setPrograms(prev => [...prev, newProgram]);
  };

  const deleteCommand = (programId: string, commandId: string) => {
    setPrograms(prev => prev.map(p => 
      p.id === programId 
        ? { ...p, commands: p.commands.filter(cmd => cmd.id !== commandId) }
        : p
    ));
  };

  const resetProgram = (programId: string) => {
    setPrograms(prev => prev.map(p => 
      p.id === programId 
        ? {
            ...p,
            commands: p.commands.map(cmd => ({ ...cmd, executed: false })),
            currentStep: 0,
            isRunning: false
          }
        : p
    ));
  };

  const selectedProgramData = programs.find(p => p.id === selectedProgram);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 min-w-[400px] max-h-[600px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-white">Interfaccia di Programmazione Robot</h3>
      
      {/* Stato connessione */}
      <div className="mb-4">
        <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'CONNESSO' : 'DISCONNESSO'}
          </span>
        </div>
      </div>

      {/* Selezione programma */}
      <div className="mb-4">
        <label className="text-sm font-semibold mb-2 block text-white">Programma Selezionato</label>
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white text-sm"
        >
          {programs.map(program => (
            <option key={program.id} value={program.id}>
              {program.name} ({program.commands.length} comandi)
            </option>
          ))}
        </select>
      </div>

      {/* Controlli programma */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-blue-300">Controlli Programma</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => executeProgram(selectedProgram)}
            disabled={!isConnected || selectedProgramData?.isRunning}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-medium text-white"
          >
            ▶️ ESEGUI
          </button>
          <button
            onClick={() => resetProgram(selectedProgram)}
            disabled={selectedProgramData?.isRunning}
            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-medium text-white"
          >
            🔄 RESET
          </button>
        </div>
      </div>

      {/* Registrazione */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-purple-300">Registrazione</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-medium text-white"
          >
            🔴 REC
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed rounded text-sm font-medium text-white"
          >
            ⏹️ STOP
          </button>
        </div>
        {isRecording && (
          <p className="text-xs text-red-400 mt-1">Registrazione in corso... {recordedCommands.length} comandi</p>
        )}
      </div>

      {/* Aggiunta comando manuale */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-green-300">Aggiungi Comando</h4>
        
        <div className="space-y-2">
          <select
            value={newCommand.type || 'move'}
            onChange={(e) => setNewCommand(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
          >
            <option value="move">Move (Sposta)</option>
            <option value="grip">Grip (Afferra)</option>
            <option value="release">Release (Rilascia)</option>
            <option value="wait">Wait (Attendi)</option>
            <option value="rotate">Rotate (Ruota)</option>
          </select>

          {newCommand.type === 'move' && (
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="X"
                value={newCommand.parameters?.x || 0}
                onChange={(e) => setNewCommand(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, x: parseFloat(e.target.value) }
                }))}
                className="px-2 py-1 rounded bg-gray-700 text-white text-sm"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Y"
                value={newCommand.parameters?.y || 0}
                onChange={(e) => setNewCommand(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, y: parseFloat(e.target.value) }
                }))}
                className="px-2 py-1 rounded bg-gray-700 text-white text-sm"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Z"
                value={newCommand.parameters?.z || 0}
                onChange={(e) => setNewCommand(prev => ({
                  ...prev,
                  parameters: { ...prev.parameters, z: parseFloat(e.target.value) }
                }))}
                className="px-2 py-1 rounded bg-gray-700 text-white text-sm"
                step="0.1"
              />
            </div>
          )}

          {newCommand.type === 'rotate' && (
            <input
              type="number"
              placeholder="Angolo (gradi)"
              value={newCommand.parameters?.angle || 0}
              onChange={(e) => setNewCommand(prev => ({
                ...prev,
                parameters: { ...prev.parameters, angle: parseFloat(e.target.value) }
              }))}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
              step="1"
            />
          )}

          {(newCommand.type === 'grip' || newCommand.type === 'release' || newCommand.type === 'wait') && (
            <input
              type="number"
              placeholder="Durata (secondi)"
              value={newCommand.parameters?.duration || 1}
              onChange={(e) => setNewCommand(prev => ({
                ...prev,
                parameters: { ...prev.parameters, duration: parseFloat(e.target.value) }
              }))}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
              step="0.1"
              min="0.1"
            />
          )}

          <button
            onClick={addCommand}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white"
          >
            ➕ AGGIUNGI COMANDO
          </button>
        </div>
      </div>

      {/* Lista comandi */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 text-yellow-300">
          Comandi ({selectedProgramData?.commands.length || 0})
        </h4>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {selectedProgramData?.commands.map((command, index) => (
            <div
              key={command.id}
              className={`flex items-center justify-between p-2 rounded text-sm ${
                index === selectedProgramData.currentStep
                  ? 'bg-blue-600'
                  : command.executed
                  ? 'bg-green-600'
                  : 'bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono">{index + 1}</span>
                <span className="font-medium">{command.type.toUpperCase()}</span>
                {command.type === 'move' && (
                  <span className="text-xs">
                    ({command.parameters.x?.toFixed(1)}, {command.parameters.y?.toFixed(1)}, {command.parameters.z?.toFixed(1)})
                  </span>
                )}
                {command.type === 'rotate' && (
                  <span className="text-xs">{command.parameters.angle}°</span>
                )}
                {(command.type === 'grip' || command.type === 'release' || command.type === 'wait') && (
                  <span className="text-xs">{command.parameters.duration}s</span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {index === selectedProgramData.currentStep && (
                  <span className="text-xs">▶️</span>
                )}
                {command.executed && (
                  <span className="text-xs">✅</span>
                )}
                <button
                  onClick={() => deleteCommand(selectedProgram, command.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiche */}
      <div className="text-xs text-gray-400">
        <p>Comandi eseguiti: {selectedProgramData?.commands.filter(cmd => cmd.executed).length || 0}</p>
        <p>Comandi rimanenti: {selectedProgramData?.commands.filter(cmd => !cmd.executed).length || 0}</p>
        <p>Stato: {selectedProgramData?.isRunning ? 'IN ESECUZIONE' : 'FERMO'}</p>
      </div>
    </div>
  );
}
