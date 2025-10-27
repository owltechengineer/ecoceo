"use client";

import React from 'react';
import Image from 'next/image';
import { ClientVideo } from '@/types/clientArea';
import { getImageUrl } from '@/sanity/lib/image';

interface VideoCardProps {
  video: ClientVideo;
  onPlay?: (video: ClientVideo) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const getVideoEmbedUrl = () => {
    if (video.videoType === 'youtube' && video.videoUrl) {
      const videoId = video.videoUrl.split('v=')[1]?.split('&')[0] || 
                     video.videoUrl.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (video.videoType === 'vimeo' && video.videoUrl) {
      const videoId = video.videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(video);
    }
  };

  return (
    <div className="bg-white/20rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-blue-200">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        {video.thumbnail ? (
          <Image
            src={getImageUrl(video.thumbnail)}
            alt={video.thumbnail.alt || video.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12l-4-4h8l-4 4z"/>
            </svg>
          </div>
        )}
        
        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 group"
        >
          <div className="w-16 h-16 bg-white/20bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l8-5-8-5z"/>
            </svg>
          </div>
        </button>

        {/* Video Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {video.videoType === 'youtube' ? 'YouTube' : 
             video.videoType === 'vimeo' ? 'Vimeo' : 'File'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        {video.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
        )}

        {/* Categories */}
        {video.categories && video.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {video.categories.length > 2 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{video.categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
