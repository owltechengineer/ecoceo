"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientDocumentsQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientDocument } from '@/types/clientArea';
import DocumentCard from '../DocumentCard';
import ContentSectionLayout from '../ContentSectionLayout';

const DocumentsTab: React.FC = () => {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documentsData = await safeFetch(clientDocumentsQuery);
        setDocuments(documentsData || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filter === 'all' || doc.categories?.includes(filter);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        default:
          return a.order - b.order;
      }
    });

  const categories = Array.from(new Set(documents.flatMap(doc => doc.categories || [])));

  const handleDownload = async (document: ClientDocument) => {
    try {
      // In a real app, you might want to track downloads
      // await trackDownload(document._id);
      
      const link = document.createElement('a');
      link.href = document.file.asset.url;
      link.download = document.file.asset.originalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const stats = [
    {
      label: 'Documenti disponibili',
      value: documents.length,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      label: 'Categorie',
      value: categories.length,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      label: 'Totale download',
      value: documents.reduce((sum, doc) => sum + doc.downloadCount, 0),
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      color: 'bg-purple-100'
    }
  ];

  const filters = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div className="lg:col-span-2">
        <input
          type="text"
          placeholder="Cerca documenti..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/60"
        />
      </div>

      {/* Category Filter */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
      >
        <option value="all">Tutte le categorie</option>
        {categories.map(category => (
          <option key={category} value={category} className="bg-gray-800">
            {category}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
      >
        <option value="order" className="bg-gray-800">Ordine predefinito</option>
        <option value="title" className="bg-gray-800">Nome A-Z</option>
        <option value="date" className="bg-gray-800">Più recenti</option>
        <option value="downloads" className="bg-gray-800">Più scaricati</option>
      </select>
    </div>
  );

  return (
    <ContentSectionLayout
      icon="📄"
      title="Documenti"
      description="Documenti e risorse"
      loading={loading}
      stats={stats}
      filters={filters}
      resultsCount={filteredAndSortedDocuments.length}
      resultsLabel="documenti trovati"
      emptyMessage={searchTerm || filter !== 'all' ? 'Prova a modificare i filtri di ricerca' : 'Non ci sono documenti disponibili al momento'}
    >
      {filteredAndSortedDocuments.map((document) => (
        <DocumentCard
          key={document._id}
          document={document}
          onDownload={handleDownload}
        />
      ))}
    </ContentSectionLayout>
  );
};

export default DocumentsTab;
