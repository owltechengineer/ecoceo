'use client';

import { useState } from 'react';

interface TestResultsDisplayProps {
  title: string;
  results: string;
  isLoading: boolean;
  onTest: () => void;
  buttonText: string;
  loadingText: string;
}

export default function TestResultsDisplay({ 
  title, 
  results, 
  isLoading, 
  onTest, 
  buttonText, 
  loadingText 
}: TestResultsDisplayProps) {
  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6 border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        <button
          onClick={onTest}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg"
        >
          {isLoading ? loadingText : buttonText}
        </button>
        
        <div className="bg-blue-500/20 border-2 border-gray-300 rounded-lg p-4">
          <h4 className="font-bold mb-3 text-gray-900 text-lg">📊 Risultati Test:</h4>
          <div className="bg-black text-green-400 p-4 rounded border-2 border-green-500 font-mono text-sm max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{results || 'Nessun test eseguito'}</pre>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Legenda Colori:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-mono">✅</span>
              <span>Test superato con successo</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-400 font-mono">❌</span>
              <span>Test fallito o errore</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 font-mono">🔧</span>
              <span>Istruzioni per la risoluzione</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-mono">📄</span>
              <span>Dati o informazioni</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
