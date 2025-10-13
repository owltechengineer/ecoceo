"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientDocumentsQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientDocument } from '@/types/clientArea';
import DocumentCard from '../DocumentCard';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Documenti e Risorse</h2>
        <p className="text-gray-600">
          Scarica manuali, contratti, moduli e tutte le risorse documentali necessarie per i nostri servizi.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Cerca documenti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tutte le categorie</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="order">Ordine predefinito</option>
            <option value="title">Nome A-Z</option>
            <option value="date">Più recenti</option>
            <option value="downloads">Più scaricati</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          {filteredAndSortedDocuments.length} documenti trovati
        </div>
        <div className="text-sm text-gray-500">
          Totale download: {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredAndSortedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDocuments.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun documento trovato</h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Non ci sono documenti disponibili al momento'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
