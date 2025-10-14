"use client";

import React, { useState, useEffect } from 'react';
import { useClientAreaAuth } from '@/contexts/ClientAreaAuthContext';
import { safeFetch } from '@/sanity/lib/client';
import { 
  clientVideosQuery, 
  clientDocumentsQuery, 
  clientKnowledgeQuery, 
  clientPromotionsQuery,
  clientAreaStatsQuery 
} from '@/sanity/lib/clientAreaQueries';
import { 
  ClientVideo, 
  ClientDocument, 
  ClientKnowledge, 
  ClientPromotion, 
  ClientAreaStats 
} from '@/types/clientArea';

// Import dei componenti delle card
import VideoCard from './VideoCard';
import DocumentCard from './DocumentCard';
import KnowledgeCard from './KnowledgeCard';
import PromotionCard from './PromotionCard';

// Import dei componenti delle tab
import VideoTab from './tabs/VideoTab';
import DocumentsTab from './tabs/DocumentsTab';
import KnowledgeTab from './tabs/KnowledgeTab';
import PromotionsTab from './tabs/PromotionsTab';
import MathTab from './tabs/MathTab';
import ClientAreaMenu from './ClientAreaMenu';

const ClientAreaContent: React.FC = () => {
  const { logout } = useClientAreaAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ClientAreaStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await safeFetch(clientAreaStatsQuery);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return <VideoTab />;
      case 'documents':
        return <DocumentsTab />;
      case 'knowledge':
        return <KnowledgeTab />;
      case 'promotions':
        return <PromotionsTab />;
      case 'math':
        return <MathTab />;
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Menu Sidebar */}
      <ClientAreaMenu activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-0">
        {/* Content Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            {activeTab === 'overview' && '📊 Panoramica'}
            {activeTab === 'documents' && '📄 Documenti'}
            {activeTab === 'knowledge' && '🧠 Conoscenza'}
            {activeTab === 'promotions' && '🎯 Promozioni'}
            {activeTab === 'videos' && '🎥 Video'}
            {activeTab === 'math' && '🤖 Matematica & Robotica'}
          </h1>
          <p className="text-white/80 text-sm lg:text-base">
            {activeTab === 'overview' && 'Statistiche e riepilogo dei contenuti disponibili'}
            {activeTab === 'documents' && 'Documenti e risorse per i nostri clienti'}
            {activeTab === 'knowledge' && 'Base di conoscenza e guide'}
            {activeTab === 'promotions' && 'Offerte speciali e promozioni'}
            {activeTab === 'videos' && 'Tutorial e guide video'}
            {activeTab === 'math' && 'Funzioni matematiche e robotica'}
          </p>
        </header>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderTabContent()
          )}
        </section>
      </main>
    </div>
  );
};

// Componente per la panoramica
const OverviewTab: React.FC<{ stats: ClientAreaStats | null }> = ({ stats }) => {
  const statsData = [
    {
      icon: '🎥',
      label: 'Video',
      value: stats?.totalVideos || 0,
      color: 'bg-blue-600',
      description: 'Tutorial e guide video'
    },
    {
      icon: '📄',
      label: 'Documenti',
      value: stats?.totalDocuments || 0,
      color: 'bg-green-600',
      description: 'Risorse e documenti'
    },
    {
      icon: '📚',
      label: 'Nozioni',
      value: stats?.totalKnowledge || 0,
      color: 'bg-purple-600',
      description: 'Base di conoscenza'
    },
    {
      icon: '🎁',
      label: 'Promozioni',
      value: stats?.activePromotions || 0,
      color: 'bg-orange-600',
      description: 'Offerte speciali'
    },
    {
      icon: '🤖',
      label: 'Matematica & Robotica',
      value: stats?.totalMath || 0,
      color: 'bg-indigo-600',
      description: 'Strumenti interattivi'
    }
  ];

  const features = [
    {
      icon: '✅',
      text: 'Contenuti sempre aggiornati',
      color: 'text-green-400'
    },
    {
      icon: '🔒',
      text: 'Accesso sicuro e riservato',
      color: 'text-blue-400'
    },
    {
      icon: '🎯',
      text: 'Supporto dedicato',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Stats Grid */}
      <section>
        <h2 className="text-xl lg:text-2xl font-semibold text-white mb-6">Statistiche Contenuti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="flex items-center p-4 lg:p-6 rounded-lg hover:bg-white/5 transition-colors">
              <div className={`p-3 ${stat.color} rounded-lg mr-4`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/60 truncate">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="text-center py-8 lg:py-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          🎉 Benvenuto nell'Area Clienti
        </h2>
        <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Qui troverai tutti i contenuti esclusivi, documenti, video tutorial e strumenti matematici riservati ai nostri clienti.
        </p>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2 p-4 rounded-lg hover:bg-white/5 transition-colors">
              <span className="text-2xl">{feature.icon}</span>
              <span className={`text-sm lg:text-base font-medium ${feature.color}`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ClientAreaContent;
