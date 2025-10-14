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
    <div className="space-y-12 lg:space-y-16">
      {/* Hero Welcome Section */}
      <section className="text-center py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              🎉 Benvenuto nell'Area Clienti
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Il tuo spazio esclusivo per accedere a contenuti premium, strumenti avanzati e risorse riservate
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-12">
            {statsData.slice(0, 4).map((stat, index) => (
              <div key={index} className="text-center p-4 lg:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className={`inline-flex p-3 ${stat.color} rounded-xl mb-3`}>
                  <span className="text-2xl lg:text-3xl">{stat.icon}</span>
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm lg:text-base text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Stats Section */}
      <section>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">
            📊 Panoramica Contenuti
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="group p-6 lg:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`p-4 ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{stat.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg lg:text-xl font-semibold text-white mb-2">{stat.label}</h4>
                    <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm lg:text-base text-white/70">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-8">
            ✨ Cosa troverai qui
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 lg:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className={`text-lg lg:text-xl font-semibold ${feature.color} mb-2`}>
                  {feature.text}
                </h4>
                <p className="text-white/70 text-sm lg:text-base">
                  {index === 0 && "Contenuti sempre aggiornati e all'avanguardia"}
                  {index === 1 && "Accesso sicuro e riservato ai nostri clienti"}
                  {index === 2 && "Supporto dedicato e assistenza personalizzata"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
            🚀 Inizia a Esplorare
          </h3>
          <p className="text-lg lg:text-xl text-white/90 mb-8">
            Naviga tra le sezioni per scoprire tutti i contenuti disponibili
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-blue-600/20 border border-blue-400/30 rounded-xl text-blue-300 font-medium">
              📄 Documenti
            </div>
            <div className="px-6 py-3 bg-green-600/20 border border-green-400/30 rounded-xl text-green-300 font-medium">
              🧠 Conoscenza
            </div>
            <div className="px-6 py-3 bg-purple-600/20 border border-purple-400/30 rounded-xl text-purple-300 font-medium">
              🤖 Matematica & Robotica
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientAreaContent;
