"use client";

import React, { useState, useEffect } from 'react';
import { useClientAreaAuth } from '@/contexts/ClientAreaAuthContext';
import AnimatedBackground from './AnimatedBackground';
import ClientAreaMenu from './ClientAreaMenu';
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

  const tabs = [
    {
      id: 'overview',
      label: '🏠 Area Clienti',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      count: stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0
    },
    {
      id: 'videos',
      label: '🎥 Area Video',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      ),
      count: stats?.totalVideos || 0
    },
    {
      id: 'documents',
      label: '📄 Area Documenti',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      count: stats?.totalDocuments || 0
    },
    {
      id: 'knowledge',
      label: '📚 Area Conoscenza',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
      count: stats?.totalKnowledge || 0
    },
    {
      id: 'promotions',
      label: '🎁 Area Promozioni',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      ),
      count: stats?.activePromotions || 0
    }
  ];

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
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Client Area Menu */}
      <ClientAreaMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Content Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.icon} {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            <p className="text-white/70">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* Tab Content */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 lg:p-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente per la panoramica
const OverviewTab: React.FC<{ stats: ClientAreaStats | null }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">🎥 Video</p>
              <p className="text-2xl font-bold text-white">{stats?.totalVideos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">📄 Documenti</p>
              <p className="text-2xl font-bold text-white">{stats?.totalDocuments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">📚 Nozioni</p>
              <p className="text-2xl font-bold text-white">{stats?.totalKnowledge || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
          <div className="flex items-center">
            <div className="p-2 bg-orange-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">🎁 Promozioni</p>
              <p className="text-2xl font-bold text-white">{stats?.activePromotions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Benvenuto nell'Area Clienti
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Qui troverai tutti i contenuti esclusivi, documenti, video tutorial e promozioni speciali riservate ai nostri clienti.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Contenuti sempre aggiornati
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Accesso sicuro e riservato
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"/>
              </svg>
              Supporto dedicato
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAreaContent;
