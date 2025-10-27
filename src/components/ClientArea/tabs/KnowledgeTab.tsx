"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientKnowledgeQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientKnowledge } from '@/types/clientArea';
import KnowledgeCard from '../KnowledgeCard';
import ContentSectionLayout from '../ContentSectionLayout';

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

  const stats = [
    {
      label: 'Tempo medio lettura',
      value: knowledge.length > 0 ? `${Math.round(knowledge.reduce((sum, item) => sum + (item.estimatedReadTime || 0), 0) / knowledge.length)} min` : '0 min',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      label: 'Articoli disponibili',
      value: knowledge.length,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      label: 'Categorie',
      value: categories.length,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      ),
      color: 'bg-purple-100'
    }
  ];

  const filters = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Search */}
      <div className="lg:col-span-2">
        <input
          type="text"
          placeholder="Cerca nelle nozioni..."
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

      {/* Difficulty Filter */}
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
      >
        <option value="all">Tutti i livelli</option>
        {difficulties.map(diff => (
          <option key={diff} value={diff} className="bg-gray-800">
            {diff === 'beginner' ? 'Principiante' : 
             diff === 'intermediate' ? 'Intermedio' : 'Avanzato'}
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
        <option value="difficulty" className="bg-gray-800">Per difficoltà</option>
        <option value="readTime" className="bg-gray-800">Tempo di lettura</option>
      </select>
    </div>
  );

  return (
    <ContentSectionLayout
      icon="🧠"
      title="Conoscenza"
      description="Base di conoscenza"
      loading={loading}
      stats={stats}
      filters={filters}
      resultsCount={filteredAndSortedKnowledge.length}
      resultsLabel="articoli trovati"
      emptyMessage={searchTerm || filter !== 'all' || difficulty !== 'all' ? 'Prova a modificare i filtri di ricerca' : 'Non ci sono articoli disponibili al momento'}
    >
      {filteredAndSortedKnowledge.map((item) => (
        <KnowledgeCard
          key={item._id}
          knowledge={item}
        />
      ))}
    </ContentSectionLayout>
  );
};

export default KnowledgeTab;
