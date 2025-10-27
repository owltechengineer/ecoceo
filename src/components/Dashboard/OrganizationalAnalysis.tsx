'use client';

import { useState } from 'react';

interface OrganizationalSection {
  id: string;
  title: string;
  icon: string;
  objective: string;
  questions: string[];
  example: string;
  currentState: string;
  priority: 'high' | 'medium' | 'low';
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
}

export default function OrganizationalAnalysis() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sections, setSections] = useState<OrganizationalSection[]>([
    {
      id: 'personality-values',
      title: 'Personalità e Valori Aziendali',
      icon: '🎭',
      objective: 'Definire il carattere dell\'azienda e i valori guida nella gestione interna ed esterna.',
      questions: [
        'Qual è lo "stile" comportamentale dell\'azienda? (es. flessibile, gerarchica, diretta, prudente...)',
        'Quali valori guida le decisioni e i comportamenti?',
        'I valori sono condivisi e vissuti realmente nel team?'
      ],
      example: 'La nostra cultura è orientata alla trasparenza e all\'iniziativa personale. Valorizziamo l\'affidabilità più della velocità.',
      currentState: '',
      priority: 'high',
      status: 'needs_improvement'
    },
    {
      id: 'organizational-identity',
      title: 'Identità Organizzativa',
      icon: '🪞',
      objective: 'Chiarire "chi è" l\'azienda, a cosa aspira, come si distingue.',
      questions: [
        'Qual è la missione reale dell\'impresa?',
        'Qual è il posizionamento percepito da clienti, partner e collaboratori?',
        'C\'è coerenza tra identità interna e comunicazione esterna?'
      ],
      example: 'Ci percepiamo come un laboratorio artigianale digitale, ma molti clienti ci vedono ancora solo come un fornitore tecnico.',
      currentState: '',
      priority: 'high',
      status: 'needs_improvement'
    },
    {
      id: 'emotions-stress',
      title: 'Emozioni e Stress Organizzativo',
      icon: '💥',
      objective: 'Monitorare il clima interno, i carichi di lavoro, i momenti di crisi o euforia.',
      questions: [
        'Come si sente il team in questo periodo?',
        'Ci sono segnali di stress organizzativo (confusione, ritardi, conflitti)?',
        'Come reagisce l\'azienda nei momenti di pressione?'
      ],
      example: 'Negli ultimi mesi il clima è stato teso per via dei carichi disorganizzati. Le scadenze non sono sempre chiare.',
      currentState: '',
      priority: 'medium',
      status: 'good'
    },
    {
      id: 'perception',
      title: 'Percezione Aziendale',
      icon: '👁️',
      objective: 'Analizzare come l\'impresa percepisce se stessa e come viene percepita.',
      questions: [
        'Come percepiamo le nostre capacità reali?',
        'C\'è disallineamento tra come ci vediamo e come ci vedono?',
        'Siamo consapevoli dei nostri limiti o tendiamo a sovrastimarci?'
      ],
      example: 'Crediamo di essere molto orientati al cliente, ma dai feedback emerge che spesso comunichiamo in modo troppo tecnico.',
      currentState: '',
      priority: 'medium',
      status: 'needs_improvement'
    },
    {
      id: 'decision-making',
      title: 'Processo Decisionale',
      icon: '🎯',
      objective: 'Mappare come vengono prese le decisioni in azienda.',
      questions: [
        'Chi prende le decisioni operative e strategiche?',
        'Le decisioni sono condivise o verticali?',
        'Esiste un processo strutturato o si va "a istinto"?'
      ],
      example: 'Le decisioni strategiche sono prese dal titolare, ma mancano momenti strutturati di confronto.',
      currentState: '',
      priority: 'high',
      status: 'needs_improvement'
    },
    {
      id: 'internal-motivation',
      title: 'Motivazione Interna',
      icon: '⚡',
      objective: 'Capire cosa motiva (o demotiva) i membri dell\'organizzazione.',
      questions: [
        'Cosa dà energia e motivazione al team?',
        'Cosa genera frustrazione?',
        'Esistono sistemi di riconoscimento, crescita, coinvolgimento?'
      ],
      example: 'Il team è motivato quando vede l\'impatto concreto del proprio lavoro. I rallentamenti tecnici invece demoralizzano.',
      currentState: '',
      priority: 'high',
      status: 'good'
    },
    {
      id: 'communication',
      title: 'Comunicazione Interna ed Esterna',
      icon: '🗣️',
      objective: 'Valutare l\'efficacia della comunicazione nei processi e nei rapporti.',
      questions: [
        'Le informazioni circolano bene?',
        'I feedback sono chiari e frequenti?',
        'Ci sono barriere comunicative o silenzi dannosi?'
      ],
      example: 'Le riunioni settimanali funzionano, ma manca una comunicazione documentata per evitare incomprensioni.',
      currentState: '',
      priority: 'medium',
      status: 'good'
    },
    {
      id: 'group-dynamics',
      title: 'Dinamiche di Gruppo',
      icon: '👥',
      objective: 'Osservare le relazioni interne, i ruoli informali, i conflitti e le sinergie.',
      questions: [
        'I ruoli sono chiari?',
        'Ci sono dinamiche disfunzionali (es. leader occulti, esclusioni)?',
        'Il team collabora in modo efficace?'
      ],
      example: 'C\'è un forte spirito di gruppo, ma i nuovi arrivati faticano a integrarsi per via dei meccanismi consolidati.',
      currentState: '',
      priority: 'medium',
      status: 'good'
    },
    {
      id: 'leadership',
      title: 'Leadership',
      icon: '👑',
      objective: 'Descrivere lo stile di leadership presente e valutarne efficacia e limiti.',
      questions: [
        'Lo stile di leadership è più direttivo, partecipativo o delegante?',
        'Come viene percepita la figura del leader?',
        'Esiste una leadership distribuita?'
      ],
      example: 'La leadership è molto centrale e operativa. Si sta lavorando per delegare più responsabilità.',
      currentState: '',
      priority: 'high',
      status: 'needs_improvement'
    },
    {
      id: 'networks-social',
      title: 'Reti e Social Network Professionali',
      icon: '🌐',
      objective: 'Mappare le connessioni esterne (clienti, partner, community) e l\'uso dei social.',
      questions: [
        'L\'azienda ha relazioni esterne attive e utili?',
        'Come utilizza i social media (se li usa)?',
        'Quali reti o community supportano la crescita dell\'impresa?'
      ],
      example: 'Siamo presenti su LinkedIn ma senza una strategia. I contatti con clienti storici sono solidi ma non coltiviamo nuove reti.',
      currentState: '',
      priority: 'low',
      status: 'needs_improvement'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Eccellente';
      case 'good': return 'Buono';
      case 'needs_improvement': return 'Da Migliorare';
      case 'critical': return 'Critico';
      default: return 'Non Valutato';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-white/300';
    }
  };

  const updateSection = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const saveSection = (id: string) => {
    setEditingSection(null);
    // Qui potresti aggiungere la logica per salvare nel database
    console.log('Sezione salvata:', id);
  };

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏢 Analisi Organizzativa</h1>
            <p className="text-gray-600 mt-1">Valutazione completa della cultura e dinamiche aziendali</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Ultimo aggiornamento</p>
              <p className="text-sm font-medium">{new Date().toLocaleDateString('it-IT')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-white/30 backdrop-blur/30 backdrop-blurbg-opacity-20 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium opacity-90">Sezioni Analizzate</p>
              <p className="text-2xl font-bold">{sections.length}</p>
              <p className="text-xs opacity-75">Su 10 totali</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-white/30 backdrop-blur/30 backdrop-blurbg-opacity-20 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium opacity-90">Stato Buono/Eccellente</p>
              <p className="text-2xl font-bold">{sections.filter(s => s.status === 'good' || s.status === 'excellent').length}</p>
              <p className="text-xs opacity-75">Sezioni positive</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-white/30 backdrop-blur/30 backdrop-blurbg-opacity-20 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium opacity-90">Da Migliorare</p>
              <p className="text-2xl font-bold">{sections.filter(s => s.status === 'needs_improvement').length}</p>
              <p className="text-xs opacity-75">Aree critiche</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center">
            <div className="p-2 bg-white/30 backdrop-blur/30 backdrop-blurbg-opacity-20 rounded-lg">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium opacity-90">Priorità Alta</p>
              <p className="text-2xl font-bold">{sections.filter(s => s.priority === 'high').length}</p>
              <p className="text-xs opacity-75">Azioni urgenti</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{section.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(section.status)}`}>
                        {getStatusText(section.status)}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(section.priority)}`}></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {activeSection === section.id ? '−' : '+'}
                </button>
              </div>

              {/* Objective */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">🎯 Obiettivo</h4>
                <p className="text-sm text-gray-600">{section.objective}</p>
              </div>

              {/* Questions */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">❓ Domande Guida</h4>
                <ul className="space-y-1">
                  {section.questions.map((question, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 Esempio</h4>
                <div className="bg-white/30rounded-lg p-3">
                  <p className="text-sm text-gray-700 italic">"{section.example}"</p>
                </div>
              </div>

              {/* Current State */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">📝 Stato Attuale</h4>
                {editingSection === section.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={section.currentState}
                      onChange={(e) => updateSection(section.id, 'currentState', e.target.value)}
                      placeholder="Descrivi lo stato attuale di questa area..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveSection(section.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        💾 Salva
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="bg-white/300 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                      >
                        ❌ Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {section.currentState ? (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{section.currentState}</p>
                      </div>
                    ) : (
                      <div className="bg-white/30rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-500">Nessuna valutazione inserita</p>
                      </div>
                    )}
                    <button
                      onClick={() => setEditingSection(section.id)}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      ✏️ {section.currentState ? 'Modifica' : 'Aggiungi valutazione'}
                    </button>
                  </div>
                )}
              </div>

              {/* Status and Priority Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Stato</label>
                  <select
                    value={section.status}
                    onChange={(e) => updateSection(section.id, 'status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="excellent">Eccellente</option>
                    <option value="good">Buono</option>
                    <option value="needs_improvement">Da Migliorare</option>
                    <option value="critical">Critico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">⚡ Priorità</label>
                  <select
                    value={section.priority}
                    onChange={(e) => updateSection(section.id, 'priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Bassa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Plan */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Piano d'Azione Suggerito</h3>
        <div className="space-y-4">
          {sections
            .filter(s => s.status === 'needs_improvement' || s.status === 'critical')
            .sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .map((section) => (
              <div key={section.id} className="flex items-center justify-between p-4 bg-white/30rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{section.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    <p className="text-sm text-gray-600">Priorità: {section.priority === 'high' ? 'Alta' : section.priority === 'medium' ? 'Media' : 'Bassa'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(section.status)}`}>
                    {getStatusText(section.status)}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    🎯 Pianifica Azione
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
