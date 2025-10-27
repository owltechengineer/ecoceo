"use client";

import React from 'react';

interface ContentSectionLayoutProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }>;
  filters?: React.ReactNode;
  resultsCount?: number;
  resultsLabel?: string;
}

const ContentSectionLayout: React.FC<ContentSectionLayoutProps> = ({
  icon,
  title,
  description,
  children,
  loading = false,
  emptyMessage = "Nessun contenuto disponibile al momento",
  emptyIcon,
  stats = [],
  filters,
  resultsCount,
  resultsLabel = "elementi trovati"
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <span className="text-3xl">{icon}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-white/70">{stat.label}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters Section */}
      {filters && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          {filters}
        </div>
      )}

      {/* Results Count */}
      {resultsCount !== undefined && (
        <div className="text-white/80 text-sm">
          {resultsCount} {resultsLabel}
        </div>
      )}

      {/* Content Section */}
      {React.Children.count(children) > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
          {emptyIcon || (
            <div className="mx-auto h-12 w-12 text-white/40 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          )}
          <h3 className="text-lg font-medium text-white mb-2">Nessun contenuto trovato</h3>
          <p className="text-white/70">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ContentSectionLayout;
