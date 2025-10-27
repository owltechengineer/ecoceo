'use client';

import { useState } from 'react';

export default function ProjectImprovementsDemo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'benefits'>('overview');

  const improvements = [
    {
      title: '🎯 Card Unificata',
      description: 'Creazione e modifica in un unico componente',
      details: 'Eliminata la duplicazione di codice tra form di creazione e modifica'
    },
    {
      title: '✨ UI Migliorata',
      description: 'Design moderno con glassmorphism e animazioni',
      details: 'Interfaccia più pulita e professionale con feedback visivi'
    },
    {
      title: '🔍 Filtri Avanzati',
      description: 'Ricerca, ordinamento e visualizzazione flessibile',
      details: 'Possibilità di filtrare per stato, ordinare per diversi criteri e scegliere vista griglia/lista'
    },
    {
      title: '📊 Statistiche in Tempo Reale',
      description: 'Dashboard con metriche aggregate',
      details: 'Visualizzazione immediata di totali, budget e progressi'
    },
    {
      title: '✅ Validazione Form',
      description: 'Controlli di validazione in tempo reale',
      details: 'Prevenzione errori con feedback immediato all\'utente'
    },
    {
      title: '🔄 Gestione Stati',
      description: 'Sincronizzazione automatica con Sanity',
      details: 'Aggiornamento automatico dei dati e gestione degli errori'
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Performance',
      description: 'Componenti ottimizzati per ridurre i re-render e migliorare le performance'
    },
    {
      icon: '🎨',
      title: 'UX Migliorata',
      description: 'Interfaccia più intuitiva con feedback visivi e transizioni fluide'
    },
    {
      icon: '🔧',
      title: 'Manutenibilità',
      description: 'Codice più pulito e modulare, più facile da mantenere ed estendere'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Design completamente responsive per tutti i dispositivi'
    },
    {
      icon: '🛡️',
      title: 'Robustezza',
      description: 'Gestione errori migliorata e validazione dei dati'
    },
    {
      icon: '🚀',
      title: 'Scalabilità',
      description: 'Architettura modulare che supporta facilmente nuove funzionalità'
    }
  ];

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 Miglioramenti Sezione Progetti
        </h2>
        <p className="text-gray-600 text-lg">
          Unificazione e miglioramento delle card di creazione e modifica progetti
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white/50 rounded-lg p-1 border border-white/30">
          {[
            { id: 'overview', label: '📋 Panoramica', icon: '📋' },
            { id: 'features', label: '✨ Funzionalità', icon: '✨' },
            { id: 'benefits', label: '🎯 Benefici', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Obiettivo Raggiunto
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Ho unificato le card di creazione e modifica progetti in un singolo componente <code className="bg-white/50 px-2 py-1 rounded text-sm">UnifiedProjectCard</code> 
                che gestisce sia la creazione di nuovi progetti che la modifica di quelli esistenti. Questo elimina la duplicazione di codice 
                e fornisce un'esperienza utente più coerente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/50 rounded-lg p-6 border border-white/30">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🔧</span>
                  Prima
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Card separate per creazione e modifica</li>
                  <li>• Codice duplicato</li>
                  <li>• UI inconsistente</li>
                  <li>• Gestione stati complessa</li>
                </ul>
              </div>

              <div className="bg-white/50 rounded-lg p-6 border border-white/30">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">✨</span>
                  Dopo
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Card unificata per entrambe le operazioni</li>
                  <li>• Codice DRY e modulare</li>
                  <li>• UI consistente e moderna</li>
                  <li>• Gestione stati semplificata</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {improvements.map((improvement, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-6 border border-white/30 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {improvement.title}
                </h3>
                <p className="text-gray-700 mb-3">
                  {improvement.description}
                </p>
                <p className="text-sm text-gray-600">
                  {improvement.details}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-6 border border-white/30 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8 pt-6 border-t border-white/30">
        <p className="text-gray-600 mb-4">
          I miglioramenti sono già implementati e pronti per l'uso!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span className="mr-2">🚀</span>
            Vai al Dashboard
          </a>
          <a
            href="/studio/desk/project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            <span className="mr-2">🎨</span>
            Sanity Studio
          </a>
        </div>
      </div>
    </div>
  );
}
