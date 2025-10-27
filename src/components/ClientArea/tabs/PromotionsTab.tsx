"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientPromotionsQuery, featuredPromotionsQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientPromotion } from '@/types/clientArea';
import PromotionCard from '../PromotionCard';
import ContentSectionLayout from '../ContentSectionLayout';

const PromotionsTab: React.FC = () => {
  const [promotions, setPromotions] = useState<ClientPromotion[]>([]);
  const [featuredPromotions, setFeaturedPromotions] = useState<ClientPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const [promotionsData, featuredData] = await Promise.all([
          safeFetch(clientPromotionsQuery),
          safeFetch(featuredPromotionsQuery)
        ]);
        setPromotions(promotionsData || []);
        setFeaturedPromotions(featuredData || []);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || promo.categories?.includes(filter);
    
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    
    const matchesStatus = status === 'all' || 
                         (status === 'active' && startDate <= now && endDate >= now) ||
                         (status === 'upcoming' && startDate > now) ||
                         (status === 'expired' && endDate < now);
    
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const categories = Array.from(new Set(promotions.flatMap(promo => promo.categories || [])));

  const getStatusStats = () => {
    const now = new Date();
    return {
      active: promotions.filter(p => new Date(p.startDate) <= now && new Date(p.endDate) >= now).length,
      upcoming: promotions.filter(p => new Date(p.startDate) > now).length,
      expired: promotions.filter(p => new Date(p.endDate) < now).length,
      featured: featuredPromotions.length
    };
  };

  const statusStats = getStatusStats();

  const stats = [
    {
      label: 'Attive',
      value: statusStats.active,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      label: 'In Arrivo',
      value: statusStats.upcoming,
      icon: (
        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'bg-yellow-100'
    },
    {
      label: 'Scadute',
      value: statusStats.expired,
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      ),
      color: 'bg-red-100'
    },
    {
      label: 'In Evidenza',
      value: statusStats.featured,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ),
      color: 'bg-blue-100'
    }
  ];

  const filters = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div className="lg:col-span-2">
        <input
          type="text"
          placeholder="Cerca promozioni..."
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

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
      >
        <option value="all" className="bg-gray-800">Tutte</option>
        <option value="active" className="bg-gray-800">Attive</option>
        <option value="upcoming" className="bg-gray-800">In Arrivo</option>
        <option value="expired" className="bg-gray-800">Scadute</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Featured Promotions */}
      {featuredPromotions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Promozioni in Evidenza
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPromotions.map((promo) => (
              <PromotionCard
                key={promo._id}
                promotion={promo}
              />
            ))}
          </div>
        </div>
      )}

      <ContentSectionLayout
        icon="🎯"
        title="Promozioni"
        description="Offerte speciali"
        loading={loading}
        stats={stats}
        filters={filters}
        resultsCount={filteredPromotions.length}
        resultsLabel="promozioni trovate"
        emptyMessage={searchTerm || filter !== 'all' || status !== 'all' ? 'Prova a modificare i filtri di ricerca' : 'Non ci sono promozioni disponibili al momento'}
      >
        {filteredPromotions.map((promotion) => (
          <PromotionCard
            key={promotion._id}
            promotion={promotion}
          />
        ))}
      </ContentSectionLayout>
    </div>
  );
};

export default PromotionsTab;
