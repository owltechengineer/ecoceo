'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { supabaseHelpers } from '@/lib/supabase';
import { businessPlanHelpers } from '@/lib/business-plan-helpers';
import BusinessPlanDiagnostic from './BusinessPlanDiagnostic';
import { dashboardInfo } from './dashboardInfo';

// Tipi per il Business Plan
interface ExecutiveSummary {
  id: string;
  content: string;
  pitch: string;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'excel';
  }>;
}

interface MarketAnalysis {
  id: string;
  demographics: Array<{
    segment: string;
    size: number;
    percentage: number;
    growth: number;
  }>;
  competitors: Array<{
    name: string;
    marketShare: number;
    strength: 'high' | 'medium' | 'low';
  }>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface MarketingStrategy {
  id: string;
  strategies: Array<{
    id: string;
    name: string;
    description: string;
    budget?: number;
  }>;
  timeline: Array<{
    id: string;
    activity: string;
    startDate: string;
    endDate: string;
    status: 'planned' | 'in-progress' | 'completed';
    responsible: string;
  }>;
  customer_journey: {
    awareness: string;
    consideration: string;
    decision: string;
    retention: string;
  };
}

interface OperationalPlan {
  id: string;
  processes: Array<{
    id: string;
    name: string;
    description: string;
    steps: string[];
    responsible: string;
  }>;
  team: Array<{
    id: string;
    role: string;
    name: string;
    responsibilities: string[];
  }>;
  milestones: Array<{
    id: string;
    name: string;
    date: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
}

interface FinancialPlan {
  id: string;
  projections: Array<{
    year: number;
    revenue: number;
    costs: number;
    profit: number;
    roi: number;
  }>;
  breakEvenPoint: number;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    type: 'excel' | 'csv' | 'pdf';
  }>;
}

interface BusinessModel {
  id: string;
  canvas: {
    keyPartners: string[];
    keyActivities: string[];
    valuePropositions: string[];
    customerRelationships: string[];
    customerSegments: string[];
    keyResources: string[];
    channels: string[];
    costStructure: string[];
    revenueStreams: string[];
  };
}

interface Roadmap {
  id: string;
  objectives: Array<{
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    kpis: Array<{
      name: string;
      target: number;
      current: number;
      unit: string;
    }>;
  }>;
}

interface Documentation {
  id: string;
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'excel' | 'image';
    category: string;
    uploadDate: string;
  }>;
  externalLinks: Array<{
    id: string;
    title: string;
    url: string;
    platform: 'google-drive' | 'dropbox' | 'onedrive' | 'other';
  }>;
}

export default function BusinessPlanManagement() {
  const { openInfo } = useInfoModal();
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [userId] = useState('default-user'); // Per ora usiamo un ID fisso
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Stato per i dati del business plan
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary>({
    id: '1',
    content: '',
    pitch: '',
    documents: []
  });

  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis>({
    id: '1',
    demographics: [
      { segment: 'Giovani 18-25', size: 15000, percentage: 30, growth: 5 },
      { segment: 'Adulti 26-40', size: 25000, percentage: 50, growth: 3 },
      { segment: 'Senior 41-65', size: 10000, percentage: 20, growth: 2 }
    ],
    competitors: [
      { name: 'Competitor A', marketShare: 35, strength: 'high' },
      { name: 'Competitor B', marketShare: 25, strength: 'medium' },
      { name: 'Competitor C', marketShare: 15, strength: 'low' }
    ],
    swot: {
      strengths: ['Innovazione', 'Team esperto', 'Tecnologia avanzata'],
      weaknesses: ['Budget limitato', 'Mercato competitivo'],
      opportunities: ['Mercato in crescita', 'Nuove tecnologie'],
      threats: ['Concorrenza agguerrita', 'Cambiamenti normativi']
    }
  });

  const [marketingStrategy, setMarketingStrategy] = useState<MarketingStrategy>({
    id: '1',
    strategies: [
      { id: '1', name: 'Digital Marketing', description: '', budget: 0 },
      { id: '2', name: 'Content Marketing', description: '', budget: 0 }
    ],
    timeline: [
      { id: '1', activity: 'SEO Campaign', startDate: '2024-01-01', endDate: '2024-02-28', status: 'planned' as const, responsible: 'Marketing Team' },
      { id: '2', activity: 'Content Marketing', startDate: '2024-02-01', endDate: '2024-03-31', status: 'planned' as const, responsible: 'Content Team' },
      { id: '3', activity: 'Social Media Campaign', startDate: '2024-03-01', endDate: '2024-04-30', status: 'planned' as const, responsible: 'Social Media Team' }
    ],
    customer_journey: {
      awareness: '',
      consideration: '',
      decision: '',
      retention: ''
    }
  });

  const [businessModel, setBusinessModel] = useState<BusinessModel>({
    id: '1',
    canvas: {
      keyPartners: ['Fornitori', 'Partner tecnologici'],
      keyActivities: ['Sviluppo prodotto', 'Marketing', 'Vendite'],
      valuePropositions: ['Qualità', 'Prezzo competitivo', 'Supporto'],
      customerRelationships: ['Assistenza diretta', 'Community'],
      customerSegments: ['B2B', 'B2C'],
      keyResources: ['Team', 'Tecnologia', 'Brand'],
      channels: ['Online', 'Retail', 'Partner'],
      costStructure: ['Personale', 'Marketing', 'Tecnologia'],
      revenueStreams: ['Vendite dirette', 'Abbonamenti', 'Servizi']
    }
  });

  // Stati per Piano Operativo
  const [operationalPlan, setOperationalPlan] = useState({
    roles: [
      { id: '1', role: 'CEO', responsibilities: 'Strategia, Vision, Leadership', skills: 'Management, Strategia' },
      { id: '2', role: 'CTO', responsibilities: 'Tecnologia, Sviluppo', skills: 'Tecnologia, Architettura' },
      { id: '3', role: 'Marketing Manager', responsibilities: 'Marketing, Comunicazione', skills: 'Marketing, Branding' },
      { id: '4', role: 'Sales Manager', responsibilities: 'Vendite, Clienti', skills: 'Vendite, CRM' }
    ],
    milestones: [
      { id: '1', title: 'Q1 2024 - Setup Iniziale', description: 'Configurazione infrastruttura e team', status: 'completed' },
      { id: '2', title: 'Q2 2024 - Lancio MVP', description: 'Rilascio versione minimale del prodotto', status: 'in-progress' },
      { id: '3', title: 'Q3 2024 - Espansione', description: 'Aumento team e funzionalità', status: 'planned' },
      { id: '4', title: 'Q4 2024 - Ottimizzazione', description: 'Miglioramento processi e performance', status: 'planned' }
    ],
    processes: [
      { id: '1', name: 'Processo di Sviluppo', steps: ['Analisi requisiti', 'Progettazione', 'Sviluppo', 'Test', 'Deploy'] },
      { id: '2', name: 'Processo di Supporto', steps: ['Ricezione richiesta', 'Analisi problema', 'Risoluzione', 'Follow-up', 'Documentazione'] }
    ]
  });

  // Stati per Piano Finanziario
  const [financialPlan, setFinancialPlan] = useState({
    revenues: [
      { id: '1', category: 'Vendite Prodotti', amount: 150000 },
      { id: '2', category: 'Servizi', amount: 80000 },
      { id: '3', category: 'Abbonamenti', amount: 60000 }
    ],
    expenses: [
      { id: '1', category: 'Personale', amount: 120000 },
      { id: '2', category: 'Marketing', amount: 40000 },
      { id: '3', category: 'Tecnologia', amount: 25000 },
      { id: '4', category: 'Operativo', amount: 35000 }
    ],
    investments: [
      { id: '1', name: 'Seed Round', amount: 50000, status: 'completed' },
      { id: '2', name: 'Bootstrap', amount: 25000, status: 'completed' },
      { id: '3', name: 'Series A (Q3 2024)', amount: 200000, status: 'planned' },
      { id: '4', name: 'Series B (Q2 2025)', amount: 500000, status: 'planned' }
    ]
  });


  // Funzione per gestire l'upload dei file
  const handleFileUpload = (section: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        id: Date.now().toString(),
        name: file.name,
        url: e.target?.result as string,
        type: (file.type.includes('pdf') ? 'pdf' : 
              file.type.includes('word') ? 'doc' : 
              file.type.includes('excel') || file.type.includes('spreadsheet') ? 'excel' : 'pdf') as 'pdf' | 'doc' | 'excel'
      };

      if (section === 'executive-summary') {
        setExecutiveSummary(prev => ({
          ...prev,
          documents: [...prev.documents, fileData]
        }));
      }
      // Aggiungi altre sezioni se necessario
    };
    reader.readAsDataURL(file);
  };
  

  const saveBusinessPlanSection = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      // Salva nella tabella specifica
      switch (section) {
        case 'executive-summary':
          await businessPlanHelpers.saveExecutiveSummary(userId, data);
          break;
        case 'market-analysis':
          await businessPlanHelpers.saveMarketAnalysis(userId, data);
          break;
        case 'marketing-strategy':
          await supabaseHelpers.saveMarketingStrategy(userId, data);
          break;
        case 'operational-plan':
          await supabaseHelpers.saveOperationalPlan(userId, data);
          break;
        case 'financial-plan':
          await supabaseHelpers.saveFinancialPlan(userId, data);
          break;
        case 'business-model':
          await supabaseHelpers.saveBusinessModel(userId, data);
          break;
        case 'roadmap':
          await supabaseHelpers.saveRoadmap(userId, data);
          break;
        case 'documentation':
          await supabaseHelpers.saveDocumentation(userId, data);
          break;
        default:
          await supabaseHelpers.saveBusinessPlanSection(userId, section, data);
      }
      
      // Salva anche in LocalStorage come backup
      localStorage.setItem(`business-plan-${section}`, JSON.stringify(data));
      
      setLastSaved(new Date());
      console.log(`✅ Sezione ${section} salvata in Supabase e LocalStorage`);
      return true;
    } catch (error) {
      console.error(`❌ Errore nel salvataggio sezione ${section}:`, error);
      
      // Fallback a LocalStorage
      try {
        localStorage.setItem(`business-plan-${section}`, JSON.stringify(data));
        setLastSaved(new Date());
        console.log(`⚠️ Sezione ${section} salvata solo in LocalStorage`);
        return false;
      } catch (localError) {
        console.error(`❌ Errore anche in LocalStorage:`, localError);
        return false;
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Funzione per caricare tutti i dati del business plan
  const loadAllBusinessPlanData = async () => {
    try {
      const [
        executiveData,
        marketData,
        marketingData,
        operationalData,
        financialData,
        businessModelData,
        roadmapData,
        documentationData
      ] = await Promise.all([
        businessPlanHelpers.loadExecutiveSummary(userId),
        businessPlanHelpers.loadMarketAnalysis(userId),
        supabaseHelpers.loadMarketingStrategy(userId),
        supabaseHelpers.loadOperationalPlan(userId),
        supabaseHelpers.loadFinancialPlan(userId),
        supabaseHelpers.loadBusinessModel(userId),
        supabaseHelpers.loadRoadmap(userId),
        supabaseHelpers.loadDocumentation(userId)
      ]);

      // Aggiorna gli stati con i dati caricati
      if (executiveData) {
        setExecutiveSummary({
          id: '1',
          content: executiveData.content || '',
          pitch: executiveData.pitch || '',
          documents: executiveData.documents || []
        });
      }

      if (marketData) {
        setMarketAnalysis({
          id: '1',
          demographics: marketData.demographics || [],
          competitors: marketData.competitors || [],
          swot: marketData.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] }
        });
      }

      if (marketingData) {
        setMarketingStrategy({
          id: '1',
          strategies: marketingData.strategies || [
            { id: '1', name: 'Digital Marketing', description: '', budget: 0 },
            { id: '2', name: 'Content Marketing', description: '', budget: 0 }
          ],
          timeline: marketingData.timeline || [],
          customer_journey: marketingData.customer_journey || {
            awareness: '',
            consideration: '',
            decision: '',
            retention: ''
          }
        });
      }

      if (operationalData) {
        setOperationalPlan({
          roles: operationalData.roles || [],
          milestones: operationalData.milestones || [],
          processes: operationalData.processes || []
        });
      }

      if (financialData) {
        setFinancialPlan({
          revenues: financialData.revenues || [],
          expenses: financialData.expenses || [],
          investments: financialData.investments || []
        });
      }

      if (businessModelData) {
        setBusinessModel({
          id: '1',
          canvas: businessModelData.canvas || {
            keyPartners: [], keyActivities: [], valuePropositions: [],
            customerRelationships: [], customerSegments: [], keyResources: [],
            channels: [], costStructure: [], revenueStreams: []
          }
        });
      }

      console.log('✅ Tutti i dati del Business Plan caricati da Supabase');

    } catch (error) {
      console.error('❌ Errore nel caricamento dati da Supabase:', error);
      
      // Fallback a LocalStorage
      try {
        const savedData = localStorage.getItem('business-plan-complete');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setExecutiveSummary(parsedData.executiveSummary || executiveSummary);
          setMarketAnalysis(parsedData.marketAnalysis || marketAnalysis);
          setMarketingStrategy(parsedData.marketingStrategy || marketingStrategy);
          setBusinessModel(parsedData.businessModel || businessModel);
          console.log('⚠️ Business Plan caricato da LocalStorage (fallback)');
        }
      } catch (localError) {
        console.error('❌ Errore anche nel caricamento LocalStorage:', localError);
      }
    }
  };

  const saveCompleteBusinessPlan = async () => {
    try {
      const completeData = {
        executiveSummary,
        marketAnalysis,
        marketingStrategy,
        businessModel
      };
      
      // Salva ogni sezione separatamente
      await Promise.all([
        saveBusinessPlanSection('executive-summary', executiveSummary),
        saveBusinessPlanSection('market-analysis', marketAnalysis),
        saveBusinessPlanSection('marketing-strategy', marketingStrategy),
        saveBusinessPlanSection('business-model', businessModel)
      ]);
      
      // Salva anche il backup completo
      localStorage.setItem('business-plan-complete', JSON.stringify(completeData));
      console.log('Business Plan completo salvato');
    } catch (error) {
      console.error('Errore nel salvataggio Business Plan completo:', error);
    }
  };


  // Salvataggio automatico quando i dati cambiano (con debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (executiveSummary.content || executiveSummary.pitch) {
        saveBusinessPlanSection('executive-summary', executiveSummary);
      }
    }, 2000); // Salva dopo 2 secondi di inattività

    return () => clearTimeout(timeoutId);
  }, [executiveSummary]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (marketAnalysis.demographics.length > 0 || marketAnalysis.competitors.length > 0) {
        saveBusinessPlanSection('market-analysis', marketAnalysis);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [marketAnalysis]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (marketingStrategy.strategies.length > 0 || marketingStrategy.customer_journey.awareness) {
        saveBusinessPlanSection('marketing-strategy', marketingStrategy);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [marketingStrategy]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (businessModel.canvas.keyPartners.length > 0 || businessModel.canvas.valuePropositions.length > 0) {
        saveBusinessPlanSection('business-model', businessModel);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [businessModel]);

  // Auto-save per Piano Operativo
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (operationalPlan.roles.length > 0 || operationalPlan.milestones.length > 0) {
        saveBusinessPlanSection('operational-plan', operationalPlan);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [operationalPlan]);

  // Auto-save per Piano Finanziario
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (financialPlan.revenues.length > 0 || financialPlan.expenses.length > 0) {
        saveBusinessPlanSection('financial-plan', financialPlan);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [financialPlan]);

  // Carica i dati all'avvio
  useEffect(() => {
    loadAllBusinessPlanData();
  }, []);
  

  const tabs = [
    { id: 'executive-summary', label: 'Executive Summary', icon: '📋' },
    { id: 'market-analysis', label: 'Analisi di Mercato', icon: '📊' },
    { id: 'marketing-strategy', label: 'Strategia Marketing', icon: '🎯' },
    { id: 'operational-plan', label: 'Piano Operativo', icon: '⚙️' },
    { id: 'financial-plan', label: 'Piano Finanziario', icon: '💰' },
    { id: 'business-model', label: 'Modello di Business', icon: '🏗️' },
    { id: 'roadmap', label: 'Roadmap & Obiettivi', icon: '🗺️' },
    { id: 'documentation', label: 'Documentazione', icon: '📁' }
  ];


  const removeDocument = (docId: string) => {
    setExecutiveSummary({
      ...executiveSummary,
      documents: executiveSummary.documents.filter(doc => doc.id !== docId)
    });
  };

  // Wrapper per gestire l'evento di upload
  const handleFileUploadEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        handleFileUpload('executive-summary', file);
      });
    }
  };

  // Funzioni CRUD per Piano Operativo
  const addRole = () => {
    const newRole = {
      id: Date.now().toString(),
      role: 'Nuovo Ruolo',
      responsibilities: 'Descrizione responsabilità',
      skills: 'Competenze richieste'
    };
    setOperationalPlan(prev => ({
      ...prev,
      roles: [...prev.roles, newRole]
    }));
  };

  const updateRole = (id: string, field: string, value: string) => {
    setOperationalPlan(prev => ({
      ...prev,
      roles: prev.roles.map(role => 
        role.id === id ? { ...role, [field]: value } : role
      )
    }));
  };

  const deleteRole = (id: string) => {
    setOperationalPlan(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role.id !== id)
    }));
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      title: 'Nuova Milestone',
      description: 'Descrizione milestone',
      status: 'planned' as 'completed' | 'in-progress' | 'planned'
    };
    setOperationalPlan(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const updateMilestone = (id: string, field: string, value: string) => {
    setOperationalPlan(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone => 
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const deleteMilestone = (id: string) => {
    setOperationalPlan(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }));
  };

  // Funzioni CRUD per Piano Finanziario
  const addRevenue = () => {
    const newRevenue = {
      id: Date.now().toString(),
      category: 'Nuova Categoria',
      amount: 0
    };
    setFinancialPlan(prev => ({
      ...prev,
      revenues: [...prev.revenues, newRevenue]
    }));
  };

  const updateRevenue = (id: string, field: string, value: string | number) => {
    setFinancialPlan(prev => ({
      ...prev,
      revenues: prev.revenues.map(revenue => 
        revenue.id === id ? { ...revenue, [field]: value } : revenue
      )
    }));
  };

  const deleteRevenue = (id: string) => {
    setFinancialPlan(prev => ({
      ...prev,
      revenues: prev.revenues.filter(revenue => revenue.id !== id)
    }));
  };

  const addExpense = () => {
    const newExpense = {
      id: Date.now().toString(),
      category: 'Nuova Categoria',
      amount: 0
    };
    setFinancialPlan(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const updateExpense = (id: string, field: string, value: string | number) => {
    setFinancialPlan(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense => 
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    }));
  };

  const deleteExpense = (id: string) => {
    setFinancialPlan(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  const renderExecutiveSummary = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Executive Summary</h3>
        
        {/* Editor WYSIWYG */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenuto del Business Plan
          </label>
          <textarea
            value={executiveSummary.content}
            onChange={(e) => setExecutiveSummary({...executiveSummary, content: e.target.value})}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Inserisci qui il contenuto completo del tuo business plan..."
          />
          <div className="text-sm text-gray-500 mt-1">
            {executiveSummary.content.length} caratteri
          </div>
        </div>

        {/* Pitch di sintesi */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pitch di Sintesi (max 500 caratteri)
          </label>
          <textarea
            value={executiveSummary.pitch}
            onChange={(e) => setExecutiveSummary({...executiveSummary, pitch: e.target.value})}
            maxLength={500}
            className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            placeholder="Inserisci qui il tuo pitch in poche righe..."
          />
          <div className={`text-sm mt-1 ${executiveSummary.pitch.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
            {executiveSummary.pitch.length}/500 caratteri
          </div>
        </div>

        {/* Upload documenti */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documenti Allegati ({executiveSummary.documents.length})
          </label>
          
          {/* File Upload */}
          <div className="mb-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload('executive-summary', file);
                }
              }}
              className="hidden"
              id="file-upload-executive"
            />
            <label
              htmlFor="file-upload-executive"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              📁 Carica File
            </label>
            <span className="ml-2 text-xs text-gray-500">
              PDF, Word, Excel (max 10MB)
            </span>
          </div>
          
          {/* File List */}
          {executiveSummary.documents.length > 0 && (
            <div className="mb-4 space-y-2">
              {executiveSummary.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">
                      {doc.type === 'pdf' ? '📄' : doc.type === 'doc' ? '📝' : '📊'}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.type.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => window.open(doc.url, '_blank')}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-500 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Trascina qui i file PDF o clicca per selezionare
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileUploadEvent}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90 cursor-pointer inline-block"
            >
              📄 Seleziona File
            </label>
            <p className="text-xs text-gray-500 mt-3">
              PDF, DOC, DOCX, XLS, XLSX (max 10MB)
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={async () => {
              try {
                await saveBusinessPlanSection('executive-summary', executiveSummary);
                alert('Executive Summary salvato con successo!');
              } catch (error) {
                alert('Errore nel salvataggio. Riprova.');
              }
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Executive Summary
          </button>
        </div>
      </div>
    </div>
  );

  const addDemographicSegment = () => {
    const newSegment = {
      segment: 'Nuovo Segmento',
      size: 0,
      percentage: 0,
      growth: 0
    };
    setMarketAnalysis({
      ...marketAnalysis,
      demographics: [...marketAnalysis.demographics, newSegment]
    });
  };

  const updateDemographicSegment = (index: number, field: string, value: string | number) => {
    const updated = [...marketAnalysis.demographics];
    updated[index] = { ...updated[index], [field]: value };
    setMarketAnalysis({ ...marketAnalysis, demographics: updated });
  };

  const removeDemographicSegment = (index: number) => {
    const updated = marketAnalysis.demographics.filter((_, i) => i !== index);
    setMarketAnalysis({ ...marketAnalysis, demographics: updated });
  };

  const addCompetitor = () => {
    const newCompetitor = {
      name: 'Nuovo Competitor',
      marketShare: 0,
      strength: 'low' as 'high' | 'medium' | 'low'
    };
    setMarketAnalysis({
      ...marketAnalysis,
      competitors: [...marketAnalysis.competitors, newCompetitor]
    });
  };

  const updateCompetitor = (index: number, field: string, value: string | number) => {
    const updated = [...marketAnalysis.competitors];
    updated[index] = { ...updated[index], [field]: value };
    setMarketAnalysis({ ...marketAnalysis, competitors: updated });
  };

  const removeCompetitor = (index: number) => {
    const updated = marketAnalysis.competitors.filter((_, i) => i !== index);
    setMarketAnalysis({ ...marketAnalysis, competitors: updated });
  };

  const addSWOTItem = (category: keyof typeof marketAnalysis.swot, item: string) => {
    setMarketAnalysis({
      ...marketAnalysis,
      swot: {
        ...marketAnalysis.swot,
        [category]: [...marketAnalysis.swot[category], item]
      }
    });
  };

  const updateSWOTItem = (category: keyof typeof marketAnalysis.swot, index: number, value: string) => {
    const updated = [...marketAnalysis.swot[category]];
    updated[index] = value;
    setMarketAnalysis({
      ...marketAnalysis,
      swot: {
        ...marketAnalysis.swot,
        [category]: updated
      }
    });
  };

  const removeSWOTItem = (category: keyof typeof marketAnalysis.swot, index: number) => {
    const updated = marketAnalysis.swot[category].filter((_, i) => i !== index);
    setMarketAnalysis({
      ...marketAnalysis,
      swot: {
        ...marketAnalysis.swot,
        [category]: updated
      }
    });
  };

  const renderMarketAnalysis = () => (
    <div className="space-y-6">
      {/* Demografia */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Segmentazione Demografica</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segmento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensione</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentuale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crescita %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marketAnalysis.demographics.map((demo, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={demo.segment}
                      onChange={(e) => updateDemographicSegment(index, 'segment', e.target.value)}
                      className="w-full px-2 py-1 text-sm font-medium text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={demo.size}
                      onChange={(e) => updateDemographicSegment(index, 'size', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={demo.percentage}
                      onChange={(e) => updateDemographicSegment(index, 'percentage', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={demo.growth}
                      onChange={(e) => updateDemographicSegment(index, 'growth', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => removeDemographicSegment(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button 
          onClick={addDemographicSegment}
          className="mt-4 bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          + Aggiungi Segmento
        </button>
      </div>

      {/* Concorrenza */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Analisi Concorrenza</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Quote di Mercato</h4>
            <div className="space-y-3">
              {marketAnalysis.competitors.map((competitor, index) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={competitor.name}
                    onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                    className="w-32 px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          competitor.strength === 'high' ? 'bg-red-500' :
                          competitor.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${competitor.marketShare}%` }}
                      ></div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={competitor.marketShare}
                    onChange={(e) => updateCompetitor(index, 'marketShare', parseInt(e.target.value) || 0)}
                    className="w-12 text-sm text-gray-900 border-none focus:ring-0 bg-transparent"
                  />
                  <select
                    value={competitor.strength}
                    onChange={(e) => updateCompetitor(index, 'strength', e.target.value)}
                    className="ml-2 text-xs border border-gray-300 rounded px-1 py-1"
                  >
                    <option value="low">Basso</option>
                    <option value="medium">Medio</option>
                    <option value="high">Alto</option>
                  </select>
                  <button 
                    onClick={() => removeCompetitor(index)}
                    className="ml-2 text-red-600 hover:text-red-900 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={addCompetitor}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Aggiungi Competitor
            </button>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Grafico a Torta</h4>
            <div className="w-48 h-48 mx-auto">
              {/* Placeholder per grafico a torta */}
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-500">Grafico a Torta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Analisi SWOT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-green-700 mb-2">💪 Punti di Forza</h4>
              <div className="space-y-2">
                {marketAnalysis.swot.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center p-2 bg-green-50 rounded">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => updateSWOTItem('strengths', index, e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-900"
                    />
                    <button 
                      onClick={() => removeSWOTItem('strengths', index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addSWOTItem('strengths', 'Nuovo punto di forza')}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  + Aggiungi
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium text-red-700 mb-2">⚠️ Debolezze</h4>
              <div className="space-y-2">
                {marketAnalysis.swot.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center p-2 bg-red-50 rounded">
                    <input
                      type="text"
                      value={weakness}
                      onChange={(e) => updateSWOTItem('weaknesses', index, e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-gray-900"
                    />
                    <button 
                      onClick={() => removeSWOTItem('weaknesses', index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addSWOTItem('weaknesses', 'Nuova debolezza')}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  + Aggiungi
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-medium text-blue-700 mb-2">🚀 Opportunità</h4>
              <div className="space-y-2">
                {marketAnalysis.swot.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center p-2 bg-blue-50 rounded">
                    <input
                      type="text"
                      value={opportunity}
                      onChange={(e) => updateSWOTItem('opportunities', index, e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-gray-900"
                    />
                    <button 
                      onClick={() => removeSWOTItem('opportunities', index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addSWOTItem('opportunities', 'Nuova opportunità')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Aggiungi
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium text-orange-700 mb-2">⚠️ Minacce</h4>
              <div className="space-y-2">
                {marketAnalysis.swot.threats.map((threat, index) => (
                  <div key={index} className="flex items-center p-2 bg-orange-50 rounded">
                    <input
                      type="text"
                      value={threat}
                      onChange={(e) => updateSWOTItem('threats', index, e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-gray-900"
                    />
                    <button 
                      onClick={() => removeSWOTItem('threats', index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addSWOTItem('threats', 'Nuova minaccia')}
                  className="text-orange-600 hover:text-orange-800 text-sm"
                >
                  + Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={async () => {
              try {
                await saveBusinessPlanSection('market-analysis', marketAnalysis);
                alert('Analisi di Mercato salvata con successo!');
              } catch (error) {
                alert('Errore nel salvataggio. Riprova.');
              }
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Analisi di Mercato
          </button>
        </div>
      </div>
    </div>
  );


  const addMarketingActivity = () => {
    const newActivity = {
      id: Date.now().toString(),
      activity: 'Nuova Attività',
      responsible: 'Team',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'planned' as 'planned' | 'in-progress' | 'completed'
    };
    setMarketingStrategy({
      ...marketingStrategy,
      timeline: [...marketingStrategy.timeline, newActivity]
    });
  };

  const updateMarketingActivity = (id: string, field: string, value: string) => {
    const updated = marketingStrategy.timeline.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    );
    setMarketingStrategy({ ...marketingStrategy, timeline: updated });
  };

  const removeMarketingActivity = (id: string) => {
    const updated = marketingStrategy.timeline.filter(activity => activity.id !== id);
    setMarketingStrategy({ ...marketingStrategy, timeline: updated });
  };

  const renderMarketingStrategy = () => (
    <div className="space-y-6">
      {/* Strategie di Marketing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Strategie di Marketing</h3>
        
        {marketingStrategy.strategies.map((strategy, index) => (
          <div key={strategy.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Strategia
                </label>
                <input
                  type="text"
                  value={strategy.name}
                  onChange={(e) => {
                    const newStrategies = [...marketingStrategy.strategies];
                    newStrategies[index].name = e.target.value;
                    setMarketingStrategy({...marketingStrategy, strategies: newStrategies});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="Es. Digital Marketing, Content Marketing..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (€)
                </label>
                <input
                  type="number"
                  value={strategy.budget || 0}
                  onChange={(e) => {
                    const newStrategies = [...marketingStrategy.strategies];
                    newStrategies[index].budget = parseInt(e.target.value) || 0;
                    setMarketingStrategy({...marketingStrategy, strategies: newStrategies});
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione della Strategia
              </label>
              <textarea
                value={strategy.description}
                onChange={(e) => {
                  const newStrategies = [...marketingStrategy.strategies];
                  newStrategies[index].description = e.target.value;
                  setMarketingStrategy({...marketingStrategy, strategies: newStrategies});
                }}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Descrivi qui i dettagli della strategia..."
              />
              <div className="text-sm text-gray-500 mt-1">
                {strategy.description.length} caratteri
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={() => {
            const newStrategy = {
              id: Date.now().toString(),
              name: '',
              description: '',
              budget: 0
            };
            setMarketingStrategy({
              ...marketingStrategy,
              strategies: [...marketingStrategy.strategies, newStrategy]
            });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Aggiungi Strategia
        </button>
      </div>

      {/* Timeline Gantt */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Timeline Attività Marketing</h3>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Timeline */}
            <div className="grid grid-cols-12 gap-2 mb-4">
              <div className="col-span-3 text-sm font-medium text-gray-700">Attività</div>
              <div className="col-span-2 text-sm font-medium text-gray-700">Responsabile</div>
              <div className="col-span-2 text-sm font-medium text-gray-700">Inizio</div>
              <div className="col-span-2 text-sm font-medium text-gray-700">Fine</div>
              <div className="col-span-2 text-sm font-medium text-gray-700">Stato</div>
              <div className="col-span-1 text-sm font-medium text-gray-700">Azioni</div>
            </div>
            
            {/* Timeline Items */}
            <div className="space-y-3">
              {marketingStrategy.timeline.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => updateMarketingActivity(item.id, 'activity', e.target.value)}
                      className="w-full text-sm text-gray-900 border-none focus:ring-0 bg-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={item.responsible}
                      onChange={(e) => updateMarketingActivity(item.id, 'responsible', e.target.value)}
                      className="w-full text-sm text-gray-600 border-none focus:ring-0 bg-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => updateMarketingActivity(item.id, 'startDate', e.target.value)}
                      className="w-full text-sm text-gray-600 border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="date"
                      value={item.endDate}
                      onChange={(e) => updateMarketingActivity(item.id, 'endDate', e.target.value)}
                      className="w-full text-sm text-gray-600 border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={item.status}
                      onChange={(e) => updateMarketingActivity(item.id, 'status', e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="planned">Pianificato</option>
                      <option value="in-progress">In Corso</option>
                      <option value="completed">Completato</option>
                    </select>
                  </div>
                  <div className="col-span-1 flex space-x-1">
                    <button 
                      onClick={() => removeMarketingActivity(item.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addMarketingActivity}
              className="mt-4 bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              + Aggiungi Attività
            </button>
          </div>
        </div>
      </div>

      {/* Customer Journey Map */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Customer Journey Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Awareness (Consapevolezza)
            </label>
            <textarea
              value={marketingStrategy.customer_journey.awareness}
              onChange={(e) => setMarketingStrategy({
                ...marketingStrategy,
                customer_journey: {
                  ...marketingStrategy.customer_journey,
                  awareness: e.target.value
                }
              })}
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Come il cliente scopre il prodotto..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consideration (Considerazione)
            </label>
            <textarea
              value={marketingStrategy.customer_journey.consideration}
              onChange={(e) => setMarketingStrategy({
                ...marketingStrategy,
                customer_journey: {
                  ...marketingStrategy.customer_journey,
                  consideration: e.target.value
                }
              })}
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Come il cliente valuta il prodotto..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision (Decisione)
            </label>
            <textarea
              value={marketingStrategy.customer_journey.decision}
              onChange={(e) => setMarketingStrategy({
                ...marketingStrategy,
                customer_journey: {
                  ...marketingStrategy.customer_journey,
                  decision: e.target.value
                }
              })}
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Come il cliente decide di acquistare..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention (Fidelizzazione)
            </label>
            <textarea
              value={marketingStrategy.customer_journey.retention}
              onChange={(e) => setMarketingStrategy({
                ...marketingStrategy,
                customer_journey: {
                  ...marketingStrategy.customer_journey,
                  retention: e.target.value
                }
              })}
              className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Come mantenere il cliente..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stage: 'Awareness', description: 'Il cliente scopre il brand', touchpoints: ['Social Media', 'SEO', 'Ads'] },
            { stage: 'Interest', description: 'Mostra interesse per il prodotto', touchpoints: ['Website', 'Blog', 'Email'] },
            { stage: 'Consideration', description: 'Valuta le opzioni disponibili', touchpoints: ['Demo', 'Reviews', 'Comparison'] },
            { stage: 'Purchase', description: 'Effettua l\'acquisto', touchpoints: ['Checkout', 'Payment', 'Confirmation'] },
            { stage: 'Retention', description: 'Diventa cliente fedele', touchpoints: ['Support', 'Upsell', 'Community'] }
          ].map((stage, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{stage.stage}</h4>
              <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
              <div className="space-y-1">
                {stage.touchpoints.map((touchpoint, i) => (
                  <div key={i} className="text-xs bg-white px-2 py-1 rounded text-gray-700">
                    {touchpoint}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={async () => {
              try {
                await saveBusinessPlanSection('marketing-strategy', marketingStrategy);
                alert('Strategia Marketing salvata con successo!');
              } catch (error) {
                alert('Errore nel salvataggio. Riprova.');
              }
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Strategia Marketing
          </button>
        </div>
      </div>
    </div>
  );


  const addCanvasItem = (section: keyof typeof businessModel.canvas, item: string) => {
    setBusinessModel({
      ...businessModel,
      canvas: {
        ...businessModel.canvas,
        [section]: [...businessModel.canvas[section], item]
      }
    });
  };

  const updateCanvasItem = (section: keyof typeof businessModel.canvas, index: number, value: string) => {
    const updated = [...businessModel.canvas[section]];
    updated[index] = value;
    setBusinessModel({
      ...businessModel,
      canvas: {
        ...businessModel.canvas,
        [section]: updated
      }
    });
  };

  const removeCanvasItem = (section: keyof typeof businessModel.canvas, index: number) => {
    const updated = businessModel.canvas[section].filter((_, i) => i !== index);
    setBusinessModel({
      ...businessModel,
      canvas: {
        ...businessModel.canvas,
        [section]: updated
      }
    });
  };

  const renderBusinessModel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🏗️ Business Model Canvas</h3>
        
        {/* Business Model Canvas Grid */}
        <div className="grid grid-cols-9 gap-2 text-xs">
          {/* Row 1 */}
          <div className="col-span-2 bg-blue-100 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Key Partners</h4>
            <div className="space-y-1">
              {businessModel.canvas.keyPartners.map((item, index) => (
                <div key={`keyPartners-${index}`} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('keyPartners', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('keyPartners', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('keyPartners', 'Nuovo partner')}
                className="w-full text-blue-600 hover:text-blue-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-2 bg-green-100 p-3 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Key Activities</h4>
            <div className="space-y-1">
              {businessModel.canvas.keyActivities.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('keyActivities', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('keyActivities', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('keyActivities', 'Nuova attività')}
                className="w-full text-green-600 hover:text-green-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-2 bg-purple-100 p-3 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Value Propositions</h4>
            <div className="space-y-1">
              {businessModel.canvas.valuePropositions.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('valuePropositions', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('valuePropositions', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('valuePropositions', 'Nuova proposta')}
                className="w-full text-purple-600 hover:text-purple-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-2 bg-orange-100 p-3 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Customer Relationships</h4>
            <div className="space-y-1">
              {businessModel.canvas.customerRelationships.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('customerRelationships', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('customerRelationships', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('customerRelationships', 'Nuova relazione')}
                className="w-full text-orange-600 hover:text-orange-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-1 bg-red-100 p-3 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-2">Customer Segments</h4>
            <div className="space-y-1">
              {businessModel.canvas.customerSegments.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('customerSegments', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('customerSegments', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('customerSegments', 'Nuovo segmento')}
                className="w-full text-red-600 hover:text-red-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="col-span-2 bg-indigo-100 p-3 rounded-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">Key Resources</h4>
            <div className="space-y-1">
              {businessModel.canvas.keyResources.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('keyResources', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('keyResources', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('keyResources', 'Nuova risorsa')}
                className="w-full text-indigo-600 hover:text-indigo-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-2 bg-teal-100 p-3 rounded-lg">
            <h4 className="font-semibold text-teal-900 mb-2">Channels</h4>
            <div className="space-y-1">
              {businessModel.canvas.channels.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('channels', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('channels', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('channels', 'Nuovo canale')}
                className="w-full text-teal-600 hover:text-teal-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-2 bg-pink-100 p-3 rounded-lg">
            <h4 className="font-semibold text-pink-900 mb-2">Cost Structure</h4>
            <div className="space-y-1">
              {businessModel.canvas.costStructure.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('costStructure', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('costStructure', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('costStructure', 'Nuovo costo')}
                className="w-full text-pink-600 hover:text-pink-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
          
          <div className="col-span-2 bg-yellow-100 p-3 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Revenue Streams</h4>
            <div className="space-y-1">
              {businessModel.canvas.revenueStreams.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded text-gray-700 flex items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCanvasItem('revenueStreams', index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-gray-900"
                  />
                  <button 
                    onClick={() => removeCanvasItem('revenueStreams', index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCanvasItem('revenueStreams', 'Nuovo ricavo')}
                className="w-full text-yellow-600 hover:text-yellow-800 text-xs"
              >
                + Aggiungi
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Clicca su "+ Aggiungi" per personalizzare ogni sezione del canvas
          </div>
          <button 
            onClick={async () => {
              try {
                await saveBusinessPlanSection('business-model', businessModel);
                alert('Business Model Canvas salvato con successo!');
              } catch (error) {
                alert('Errore nel salvataggio. Riprova.');
              }
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Modello
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6">
      {/* Timeline Obiettivi */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🗺️ Roadmap e Obiettivi</h3>
        
        {/* Timeline Visiva */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          {[
            { 
              period: 'Q1 2024', 
              title: 'Lancio MVP', 
              description: 'Rilascio della prima versione del prodotto',
              status: 'completed',
              kpis: [
                { name: 'Utenti registrati', target: 1000, current: 1200, unit: 'utenti' },
                { name: 'Revenue', target: 10000, current: 15000, unit: '€' }
              ]
            },
            { 
              period: 'Q2 2024', 
              title: 'Espansione Funzionalità', 
              description: 'Aggiunta di nuove funzionalità core',
              status: 'in-progress',
              kpis: [
                { name: 'Utenti attivi', target: 5000, current: 3200, unit: 'utenti' },
                { name: 'Soddisfazione', target: 4.5, current: 4.2, unit: '/5' }
              ]
            },
            { 
              period: 'Q3 2024', 
              title: 'Scalabilità', 
              description: 'Ottimizzazione per la crescita',
              status: 'planned',
              kpis: [
                { name: 'Performance', target: 99.9, current: 0, unit: '%' },
                { name: 'Team size', target: 20, current: 0, unit: 'persone' }
              ]
            },
            { 
              period: 'Q4 2024', 
              title: 'Internazionalizzazione', 
              description: 'Espansione in mercati internazionali',
              status: 'planned',
              kpis: [
                { name: 'Paesi attivi', target: 5, current: 0, unit: 'paesi' },
                { name: 'Revenue internazionale', target: 50000, current: 0, unit: '€' }
              ]
            }
          ].map((milestone, index) => (
            <div key={index} className="relative flex items-start mb-8">
              <div className={`absolute left-3 w-3 h-3 rounded-full border-2 border-white ${
                milestone.status === 'completed' ? 'bg-green-500' :
                milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              
              <div className="ml-8 flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.period}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-900 mt-2">{milestone.title}</h4>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status === 'completed' ? 'Completato' :
                       milestone.status === 'in-progress' ? 'In Corso' : 'Pianificato'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{milestone.description}</p>
                  
                  {/* KPI Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {milestone.kpis.map((kpi, kpiIndex) => (
                      <div key={kpiIndex} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                          <span className="text-sm text-gray-500">
                            {kpi.current.toLocaleString()} / {kpi.target.toLocaleString()} {kpi.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              kpi.current >= kpi.target ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round((kpi.current / kpi.target) * 100)}% completato
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-6 bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90">
          + Aggiungi Obiettivo
        </button>
        
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => {
              localStorage.setItem('business-plan-roadmap', JSON.stringify({}));
              alert('Roadmap salvata con successo!');
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Roadmap
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 KPI Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Revenue Growth', value: '+25%', change: '+5%', trend: 'up', color: 'green' },
            { title: 'Customer Acquisition', value: '1,200', change: '+200', trend: 'up', color: 'blue' },
            { title: 'Churn Rate', value: '3.2%', change: '-0.8%', trend: 'down', color: 'red' }
          ].map((kpi, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{kpi.title}</h4>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className={`text-sm ${
                kpi.color === 'green' ? 'text-green-600' :
                kpi.color === 'blue' ? 'text-blue-600' : 'text-red-600'
              }`}>
                {kpi.change} vs mese scorso
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOperationalPlan = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Piano Operativo</h3>
        
        {/* Diagramma di Flusso */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-4">Diagramma di Flusso Operativo</h4>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-2xl mb-2">📥</div>
                <h5 className="font-semibold text-gray-900">Input</h5>
                <p className="text-sm text-gray-600">Richieste clienti</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <h5 className="font-semibold text-gray-900">Processo</h5>
                <p className="text-sm text-gray-600">Elaborazione</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <div className="text-2xl mb-2">📤</div>
                <h5 className="font-semibold text-gray-900">Output</h5>
                <p className="text-sm text-gray-600">Prodotti/Servizi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ruoli e Responsabilità */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-800">Ruoli e Responsabilità</h4>
            <button
              onClick={addRole}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Aggiungi Ruolo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruolo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsabilità</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competenze</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {operationalPlan.roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={role.role}
                        onChange={(e) => updateRole(role.id, 'role', e.target.value)}
                        className="w-full px-2 py-1 text-sm font-medium text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={role.responsibilities}
                        onChange={(e) => updateRole(role.id, 'responsibilities', e.target.value)}
                        className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={role.skills}
                        onChange={(e) => updateRole(role.id, 'skills', e.target.value)}
                        className="w-full px-2 py-1 text-sm text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestone Operative */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-800">Milestone Operative</h4>
            <button
              onClick={addMilestone}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ Aggiungi Milestone
            </button>
          </div>
          <div className="space-y-4">
            {operationalPlan.milestones.map((milestone) => (
              <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 text-sm font-semibold text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    <input
                      type="text"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 text-sm text-gray-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <select
                      value={milestone.status}
                      onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                      className="px-2 py-1 text-xs font-medium rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="completed">Completato</option>
                      <option value="in-progress">In Corso</option>
                      <option value="planned">Pianificato</option>
                    </select>
                    <button
                      onClick={() => deleteMilestone(milestone.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processi Chiave */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4">Processi Chiave</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">🔄 Processo di Sviluppo</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Analisi requisiti</li>
                <li>• Progettazione</li>
                <li>• Sviluppo</li>
                <li>• Test</li>
                <li>• Deploy</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">📞 Processo di Supporto</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ricezione richiesta</li>
                <li>• Analisi problema</li>
                <li>• Risoluzione</li>
                <li>• Follow-up</li>
                <li>• Documentazione</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pulsante Salva */}
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              try {
                await saveBusinessPlanSection('operational-plan', operationalPlan);
                alert('Piano Operativo salvato con successo!');
              } catch (error) {
                alert('Errore nel salvataggio. Riprova.');
              }
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Piano Operativo
          </button>
        </div>
      </div>
    </div>
  );

  const renderFinancialPlan = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Piano Finanziario</h3>
        
        {/* Bilancio Previsionale */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-4">Bilancio Previsionale 2024</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entrate */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-green-900">📈 Entrate</h5>
                <button
                  onClick={addRevenue}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  ➕
                </button>
              </div>
              <div className="space-y-2">
                {financialPlan.revenues.map((revenue) => (
                  <div key={revenue.id} className="flex items-center justify-between">
                    <input
                      type="text"
                      value={revenue.category}
                      onChange={(e) => updateRevenue(revenue.id, 'category', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm text-green-700 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white mr-2"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-700">€</span>
                      <input
                        type="number"
                        value={revenue.amount}
                        onChange={(e) => updateRevenue(revenue.id, 'amount', Number(e.target.value))}
                        className="w-24 px-2 py-1 text-sm font-medium text-green-900 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      />
                      <button
                        onClick={() => deleteRevenue(revenue.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-green-300 pt-2">
                  <span className="font-semibold text-green-900">Totale Entrate</span>
                  <span className="font-bold text-green-900">
                    €{financialPlan.revenues.reduce((sum, revenue) => sum + revenue.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Uscite */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-red-900">📉 Uscite</h5>
                <button
                  onClick={addExpense}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  ➕
                </button>
              </div>
              <div className="space-y-2">
                {financialPlan.expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <input
                      type="text"
                      value={expense.category}
                      onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm text-red-700 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white mr-2"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-700">€</span>
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                        className="w-24 px-2 py-1 text-sm font-medium text-red-900 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                      />
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-red-300 pt-2">
                  <span className="font-semibold text-red-900">Totale Uscite</span>
                  <span className="font-bold text-red-900">
                    €{financialPlan.expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI e Break Even */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-4">Analisi ROI e Break Even</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                €{(financialPlan.revenues.reduce((sum, revenue) => sum + revenue.amount, 0) - 
                   financialPlan.expenses.reduce((sum, expense) => sum + expense.amount, 0)).toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Utile Netto</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-900 mb-1">
                {(() => {
                  const totalRevenue = financialPlan.revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
                  const totalExpenses = financialPlan.expenses.reduce((sum, expense) => sum + expense.amount, 0);
                  const netProfit = totalRevenue - totalExpenses;
                  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;
                  return `${roi.toFixed(1)}%`;
                })()}
              </div>
              <div className="text-sm text-purple-700">ROI</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-900 mb-1">Mese 8</div>
              <div className="text-sm text-orange-700">Break Even</div>
            </div>
          </div>
        </div>

        {/* Grafici Finanziari */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-800 mb-4">Proiezioni Finanziarie</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              {/* Grafico a barre semplificato */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Q1 2024</span>
                  <span>Q2 2024</span>
                  <span>Q3 2024</span>
                  <span>Q4 2024</span>
                </div>
                <div className="flex items-end space-x-2 h-32">
                  <div className="flex-1 bg-green-400 rounded-t" style={{height: '60%'}}></div>
                  <div className="flex-1 bg-green-500 rounded-t" style={{height: '75%'}}></div>
                  <div className="flex-1 bg-green-600 rounded-t" style={{height: '90%'}}></div>
                  <div className="flex-1 bg-green-700 rounded-t" style={{height: '100%'}}></div>
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">Crescita Entrate per Trimestre</div>
              </div>
            </div>
          </div>
        </div>

        {/* Investimenti e Funding */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-4">Investimenti e Funding</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">💼 Investimenti Attuali</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Seed Round</span>
                  <span className="text-sm font-medium text-gray-900">€50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bootstrap</span>
                  <span className="text-sm font-medium text-gray-900">€25,000</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-900">Totale</span>
                  <span className="font-bold text-gray-900">€75,000</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">🎯 Prossimi Round</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Series A (Q3 2024)</span>
                  <span className="text-sm font-medium text-gray-900">€200,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Series B (Q2 2025)</span>
                  <span className="text-sm font-medium text-gray-900">€500,000</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-900">Totale Futuro</span>
                  <span className="font-bold text-gray-900">€700,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pulsante Salva */}
        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              try {
                await saveBusinessPlanSection('financial-plan', financialPlan);
                alert('Piano Finanziario salvato con successo!');
              } catch (error) {
                alert('Errore nel salvataggio. Riprova.');
              }
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Piano Finanziario
          </button>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 Documentazione e Allegati</h3>
        
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Carica Documenti</h4>
          <p className="text-gray-600 mb-4">
            Trascina qui i file o clicca per selezionare
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90">
              📄 Seleziona File
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:opacity-90">
              📊 Genera Excel
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Supportati: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (max 10MB)
          </p>
        </div>

        {/* File Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { category: 'Business Plan', count: 3, color: 'blue' },
            { category: 'Financial Reports', count: 5, color: 'green' },
            { category: 'Market Research', count: 2, color: 'purple' },
            { category: 'Legal Documents', count: 1, color: 'red' }
          ].map((cat, index) => (
            <div key={index} className={`bg-${cat.color}-50 border border-${cat.color}-200 rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{cat.category}</h4>
                  <p className="text-sm text-gray-600">{cat.count} file</p>
                </div>
                <div className={`w-8 h-8 bg-${cat.color}-100 rounded-full flex items-center justify-center`}>
                  <span className="text-sm">📁</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Lista Documenti</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Upload</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensione</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { name: 'Business_Plan_2024.pdf', type: 'PDF', category: 'Business Plan', date: '2024-01-15', size: '2.3 MB' },
                { name: 'Financial_Projections.xlsx', type: 'Excel', category: 'Financial Reports', date: '2024-01-10', size: '1.8 MB' },
                { name: 'Market_Analysis.docx', type: 'Word', category: 'Market Research', date: '2024-01-08', size: '945 KB' },
                { name: 'Legal_Agreements.pdf', type: 'PDF', category: 'Legal Documents', date: '2024-01-05', size: '3.1 MB' }
              ].map((file, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-lg mr-3">
                        {file.type === 'PDF' ? '📄' : file.type === 'Excel' ? '📊' : file.type === 'Word' ? '📝' : '📁'}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {file.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">👁️</button>
                      <button className="text-green-600 hover:text-green-900">⬇️</button>
                      <button className="text-red-600 hover:text-red-900">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* External Links */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Collegamenti Esterni</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Google Drive - Business Plan', platform: 'Google Drive', url: 'https://drive.google.com/...', description: 'Documenti condivisi del business plan' },
            { title: 'Dropbox - Financial Data', platform: 'Dropbox', url: 'https://dropbox.com/...', description: 'Dati finanziari e report' },
            { title: 'OneDrive - Market Research', platform: 'OneDrive', url: 'https://onedrive.com/...', description: 'Ricerche di mercato e analisi' }
          ].map((link, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{link.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">🌐</span>
                    <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {link.url}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">✏️</button>
                  <button className="text-red-600 hover:text-red-900">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-lg hover:opacity-90">
          + Aggiungi Collegamento
        </button>
        
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => {
              localStorage.setItem('business-plan-documentation', JSON.stringify({}));
              alert('Documentazione salvata con successo!');
            }}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            💾 Salva Documentazione
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'executive-summary':
        return renderExecutiveSummary();
      case 'market-analysis':
        return renderMarketAnalysis();
      case 'marketing-strategy':
        return renderMarketingStrategy();
      case 'operational-plan':
        return renderOperationalPlan();
      case 'financial-plan':
        return renderFinancialPlan();
      case 'business-model':
        return renderBusinessModel();
      case 'roadmap':
        return renderRoadmap();
      case 'documentation':
        return renderDocumentation();
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sezione in Sviluppo</h3>
              <p className="text-gray-600">
                Questa sezione sarà implementata prossimamente. 
                Stiamo lavorando per offrirti la migliore esperienza possibile.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 min-h-full p-6">
      {/* 🔧 DIAGNOSTICA BUSINESS PLAN */}
      <BusinessPlanDiagnostic />
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Business Plan Management</h2>
            <p className="text-gray-600">Gestione completa del business plan aziendale</p>
          </div>
                 <div className="flex items-center space-x-4">
                   {/* Indicatore di salvataggio */}
                   <div className="flex items-center space-x-2">
                     {isSaving && (
                       <div className="flex items-center space-x-2 text-blue-600">
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                         <span className="text-sm">Salvando...</span>
                       </div>
                     )}
                     {lastSaved && !isSaving && (
                       <div className="flex items-center space-x-2 text-green-600">
                         <span className="text-sm">✅ Salvato</span>
                         <span className="text-xs text-gray-500">
                           {lastSaved.toLocaleTimeString()}
                         </span>
                       </div>
                     )}
                   </div>
                   
                   <button 
                     onClick={async () => {
                       try {
                         await saveCompleteBusinessPlan();
                         alert('Business Plan completo salvato con successo!');
                       } catch (error) {
                         alert('Errore nel salvataggio. Riprova.');
                       }
                     }}
                     className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:opacity-90"
                   >
                     💾 Salva Tutto
                   </button>
                   <InfoButton onClick={() => openInfo('Business Plan', 'Gestione completa del business plan aziendale con tutte le sezioni necessarie per la pianificazione strategica.')} />
                 </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
