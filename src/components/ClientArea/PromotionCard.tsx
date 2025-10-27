"use client";

import React from 'react';
import Image from 'next/image';
import { ClientPromotion } from '@/types/clientArea';
import { getImageUrl } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

interface PromotionCardProps {
  promotion: ClientPromotion;
  onLearnMore?: (promotion: ClientPromotion) => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, onLearnMore }) => {
  const isExpired = new Date(promotion.endDate) < new Date();
  const isStartingSoon = new Date(promotion.startDate) > new Date();
  
  const getDaysRemaining = () => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore(promotion);
    } else if (promotion.ctaUrl) {
      window.open(promotion.ctaUrl, '_blank');
    }
  };

  return (
    <div className={`bg-white/20rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-200 ${
      promotion.isFeatured ? 'ring-2 ring-blue-500' : ''
    }`}>
      {/* Featured Badge */}
      {promotion.isFeatured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            ⭐ In Evidenza
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        {isExpired ? (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Scaduta
          </span>
        ) : isStartingSoon ? (
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Arrivo
          </span>
        ) : (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Attiva
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-video bg-gray-200">
        <Image
          src={getImageUrl(promotion.image)}
          alt={promotion.image.alt || promotion.title}
          fill
          className="object-cover"
        />
        
        {/* Discount Overlay */}
        {(promotion.discountPercentage || promotion.discountAmount) && (
          <div className="absolute bottom-2 left-2">
            <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              {promotion.discountPercentage ? `-${promotion.discountPercentage}%` : `-€${promotion.discountAmount}`}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
          {promotion.title}
        </h3>
        
        {promotion.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {promotion.description}
          </p>
        )}

        {/* Content Preview */}
        {promotion.content && (
          <div className="mb-4">
            <div className="prose prose-sm max-w-none line-clamp-2">
              <PortableText value={promotion.content.slice(0, 2)} />
            </div>
          </div>
        )}

        {/* Promo Code */}
        {promotion.promoCode && (
          <div className="bg-gray-100 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Codice Promo:</span>
              <code className="bg-white/20px-2 py-1 rounded border text-sm font-mono text-blue-600">
                {promotion.promoCode}
              </code>
            </div>
          </div>
        )}

        {/* Target Audience */}
        {promotion.targetAudience && promotion.targetAudience.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {promotion.targetAudience.map((audience, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
              >
                {audience}
              </span>
            ))}
          </div>
        )}

        {/* Categories */}
        {promotion.categories && promotion.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {promotion.categories.map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Dates */}
        <div className="text-xs text-gray-500 mb-3">
          <div className="flex justify-between">
            <span>Dal: {formatDate(promotion.startDate)}</span>
            <span>Al: {formatDate(promotion.endDate)}</span>
          </div>
          {!isExpired && !isStartingSoon && (
            <div className="text-center mt-1">
              <span className="font-medium text-orange-600">
                {getDaysRemaining() > 0 ? `${getDaysRemaining()} giorni rimasti` : 'Ultimo giorno!'}
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleLearnMore}
          disabled={isExpired}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
            isExpired 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {promotion.ctaText || 'Scopri di più'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PromotionCard;
