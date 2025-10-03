'use client';

import React, { useState, useEffect } from 'react';
import ThreeJSAnimation from './ThreeJSAnimation';
import AdvancedMathVisualization from './AdvancedMathVisualization';
import RoboticsApplications from './RoboticsApplications';
import ProductionLineSimulation from './ProductionLineSimulation';

export default function MathRoboticsDemo() {
  const [currentView, setCurrentView] = useState<'basic' | 'advanced' | 'robotics' | 'production'>('advanced');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Caricamento dimostrazione matematica e robotica...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Selettore di vista */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/20">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('basic')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'basic'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📐 Parabola
            </button>
            <button
              onClick={() => setCurrentView('advanced')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'advanced'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🧮 Funzioni 2D/3D
            </button>
            <button
              onClick={() => setCurrentView('robotics')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'robotics'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🤖 Robotica
            </button>
            <button
              onClick={() => setCurrentView('production')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'production'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🏭 Produzione
            </button>
          </div>
        </div>
      </div>

      {/* Descrizione della vista corrente */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/20 max-w-md">
          <div className="text-white text-center">
            {currentView === 'basic' ? (
              <div>
                <h3 className="text-lg font-bold mb-1">📐 Visualizzazione Parabola Base</h3>
                <p className="text-sm text-gray-300">
                  Funzione quadratica y = ax² + bx + c con controlli interattivi
                </p>
              </div>
            ) : currentView === 'advanced' ? (
              <div>
                <h3 className="text-lg font-bold mb-1">🧮 Funzioni Matematiche Avanzate</h3>
                <p className="text-sm text-gray-300">
                  Funzioni 2D/3D, superfici matematiche e visualizzazioni complesse
                </p>
              </div>
            ) : currentView === 'robotics' ? (
              <div>
                <h3 className="text-lg font-bold mb-1">🤖 Applicazioni Robotiche</h3>
                <p className="text-sm text-gray-300">
                  Cinematica, path planning e algoritmi di controllo
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-1">🏭 Simulazione Catena di Produzione</h3>
                <p className="text-sm text-gray-300">
                  Robot industriali, catene di montaggio e controllo produzione
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenuto principale */}
      <div className="w-full h-full">
        {currentView === 'basic' ? (
          <ThreeJSAnimation />
        ) : currentView === 'advanced' ? (
          <AdvancedMathVisualization />
        ) : currentView === 'robotics' ? (
          <RoboticsApplications />
        ) : (
          <ProductionLineSimulation />
        )}
      </div>

      {/* Informazioni aggiuntive */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-sm">
          <h3 className="text-lg font-bold text-white mb-2">🎓 Applicazioni Didattiche</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Matematica:</strong> Calcolo differenziale, geometria analitica</p>
            <p><strong>Fisica:</strong> Meccanica, onde, campi elettromagnetici</p>
            <p><strong>Robotica:</strong> Cinematica, controllo, traiettorie</p>
            <p><strong>Ingegneria:</strong> Ottimizzazione, simulazione, CAD</p>
          </div>
        </div>
      </div>

      {/* Controlli di navigazione */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-2">🎮 Controlli</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>🖱️ <strong>Mouse:</strong> Ruota, zoom, pan</p>
            <p>⌨️ <strong>Click:</strong> Seleziona funzioni</p>
            <p>🎛️ <strong>Slider:</strong> Modifica parametri</p>
            <p>📱 <strong>Touch:</strong> Controlli touch su mobile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
