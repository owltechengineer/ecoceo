"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientKnowledgeQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientKnowledge } from '@/types/clientArea';
import KnowledgeCard from '../KnowledgeCard';

const KnowledgeTab: React.FC = () => {
  const [knowledge, setKnowledge] = useState<ClientKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('order');

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const knowledgeData = await safeFetch(clientKnowledgeQuery);
        setKnowledge(knowledgeData || []);
      } catch (error) {
        console.error('Error fetching knowledge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  const filteredAndSortedKnowledge = knowledge
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filter === 'all' || item.categories?.includes(filter);
      const matchesDifficulty = difficulty === 'all' || item.difficulty === difficulty;
      
      return matchesSearch && matchesFilter && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
        case 'readTime':
          return (a.estimatedReadTime || 0) - (b.estimatedReadTime || 0);
        default:
          return a.order - b.order;
      }
    });

  const categories = Array.from(new Set(knowledge.flatMap(item => item.categories || [])));
  const difficulties = Array.from(new Set(knowledge.map(item => item.difficulty).filter(Boolean)));

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Base di Conoscenza</h2>
        <p className="text-gray-600">
          Esplora guide dettagliate, FAQ, best practices e tutto quello che ti serve per sfruttare al meglio i nostri servizi.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Cerca nelle nozioni..."
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

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tutti i livelli</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'beginner' ? 'Principiante' : 
                 diff === 'intermediate' ? 'Intermedio' : 'Avanzato'}
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
            <option value="difficulty">Per difficoltà</option>
            <option value="readTime">Tempo di lettura</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tempo medio lettura</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.round(knowledge.reduce((sum, item) => sum + (item.estimatedReadTime || 0), 0) / knowledge.length)} min
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Articoli disponibili</p>
              <p className="text-lg font-bold text-gray-900">{knowledge.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Categorie</p>
              <p className="text-lg font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        {filteredAndSortedKnowledge.length} articoli trovati
      </div>

      {/* Knowledge Grid */}
      {filteredAndSortedKnowledge.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedKnowledge.map((item) => (
            <KnowledgeCard
              key={item._id}
              knowledge={item}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun articolo trovato</h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all' || difficulty !== 'all'
              ? 'Prova a modificare i filtri di ricerca'
              : 'Non ci sono articoli disponibili al momento'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeTab;
