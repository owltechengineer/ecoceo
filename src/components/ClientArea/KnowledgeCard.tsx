"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ClientKnowledge } from '@/types/clientArea';
import { getImageUrl } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

interface KnowledgeCardProps {
  knowledge: ClientKnowledge;
  onReadMore?: (knowledge: ClientKnowledge) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ knowledge, onReadMore }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzato';
      default:
        return 'Generale';
    }
  };

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore(knowledge);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="bg-white/20rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-blue-200">
      {/* Featured Image */}
      {knowledge.featuredImage && (
        <div className="aspect-video bg-gray-200">
          <Image
            src={getImageUrl(knowledge.featuredImage)}
            alt={knowledge.featuredImage.alt || knowledge.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {knowledge.title}
        </h3>
        
        {knowledge.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {knowledge.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          {knowledge.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(knowledge.difficulty)}`}>
              {getDifficultyLabel(knowledge.difficulty)}
            </span>
          )}
          {knowledge.estimatedReadTime && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {knowledge.estimatedReadTime} min
            </span>
          )}
        </div>

        {/* Categories */}
        {knowledge.categories && knowledge.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {knowledge.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {knowledge.categories.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{knowledge.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Content Preview */}
        {knowledge.content && !knowledge.useMarkdown && (
          <div className="mb-4">
            {isExpanded ? (
              <div className="prose prose-sm max-w-none">
                <PortableText value={knowledge.content} />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none line-clamp-3">
                <PortableText 
                  value={knowledge.content.slice(0, 2)} 
                />
              </div>
            )}
          </div>
        )}

        {knowledge.markdownContent && knowledge.useMarkdown && (
          <div className="mb-4">
            {isExpanded ? (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: knowledge.markdownContent.replace(/\n/g, '<br/>') 
                }} />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none line-clamp-3">
                <p>{knowledge.markdownContent.slice(0, 200)}...</p>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {knowledge.tags && knowledge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {knowledge.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {knowledge.tags.length > 4 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{knowledge.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Read More Button */}
        <button
          onClick={handleReadMore}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isExpanded ? 'Mostra meno' : 'Leggi tutto'}
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default KnowledgeCard;
