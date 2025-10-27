"use client";

import React, { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { clientVideosQuery } from '@/sanity/lib/clientAreaQueries';
import { ClientVideo } from '@/types/clientArea';
import VideoCard from '../VideoCard';
import VideoModal from '../VideoModal';
import ContentSectionLayout from '../ContentSectionLayout';

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

  const stats = [
    {
      label: 'Video disponibili',
      value: videos.length,
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      label: 'Categorie',
      value: categories.length,
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      label: 'Durata totale',
      value: videos.length > 0 ? `${Math.round(videos.reduce((sum, video) => sum + (video.duration || 0), 0) / 60)} min` : '0 min',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'bg-purple-100'
    }
  ];

  const filters = (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Cerca video..."
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
    </div>
  );

  return (
    <>
      <ContentSectionLayout
        icon="🎥"
        title="Video"
        description="Tutorial e guide"
        loading={loading}
        stats={stats}
        filters={filters}
        resultsCount={filteredVideos.length}
        resultsLabel="video trovati"
        emptyMessage={searchTerm || filter !== 'all' ? 'Prova a modificare i filtri di ricerca' : 'Non ci sono video disponibili al momento'}
      >
        {filteredVideos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            onPlay={handleVideoPlay}
          />
        ))}
      </ContentSectionLayout>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default VideoTab;
