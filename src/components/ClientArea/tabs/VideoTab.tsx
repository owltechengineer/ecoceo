"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientVideosQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientVideo } from '@/types/clientArea';
import VideoCard from '../VideoCard';
import VideoModal from '../VideoModal';

const VideoTab: React.FC = () => {
  const [videos, setVideos] = useState<ClientVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<ClientVideo | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosData = await safeFetch(clientVideosQuery);
        setVideos(videosData || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || video.categories?.includes(filter);
    
    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(videos.flatMap(video => video.categories || [])));

  const handleVideoPlay = (video: ClientVideo) => {
    setSelectedVideo(video);
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
      <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎥 Video Tutorial e Guide</h2>
        <p className="text-gray-300">
          Esplora la nostra collezione di video tutorial, presentazioni e guide per massimizzare l'utilizzo dei nostri servizi.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cerca video..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tutte le categorie</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-300">
        {filteredVideos.length} video trovati
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onPlay={handleVideoPlay}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center border border-gray-700">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">Nessun video trovato</h3>
          <p className="text-gray-300">
            {searchTerm || filter !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Non ci sono video disponibili al momento'
            }
          </p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default VideoTab;
