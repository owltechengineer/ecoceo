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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Menu Sidebar */}
      <ClientAreaMenu activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 bg-gray-100">

        {/* Content Header */}
        <div className="bg-white shadow-sm border-b border-blue-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'overview' && '📊 Panoramica'}
              {activeTab === 'documents' && '📄 Documenti'}
              {activeTab === 'knowledge' && '🧠 Conoscenza'}
              {activeTab === 'promotions' && '🎯 Promozioni'}
              {activeTab === 'videos' && '🎥 Video'}
              {activeTab === 'math' && '🔢 Matematica'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {activeTab === 'overview' && 'Statistiche e riepilogo dei contenuti disponibili'}
              {activeTab === 'documents' && 'Documenti e risorse per i nostri clienti'}
              {activeTab === 'knowledge' && 'Base di conoscenza e guide'}
              {activeTab === 'promotions' && 'Offerte speciali e promozioni'}
              {activeTab === 'videos' && 'Tutorial e guide video'}
              {activeTab === 'math' && 'Strumenti matematici e calcolatori'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderTabContent()
          )}
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
        <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">🎥 Video</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalVideos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">📄 Documenti</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalDocuments || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">📚 Nozioni</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalKnowledge || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">🎁 Promozioni</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activePromotions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">🔢 Matematica</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalMath || 0}</p>
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
