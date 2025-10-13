"use client";

import React from 'react';
import { ClientVideo } from '@/types/clientArea';

interface VideoModalProps {
  video: ClientVideo;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
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

  const embedUrl = getVideoEmbedUrl();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-blue-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
          <button
            onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Video Content */}
        <div className="p-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            {video.videoType === 'file' && video.videoFile ? (
              <video
                controls
                className="w-full h-full"
                poster={video.thumbnail?.asset.url}
              >
                <source src={video.videoFile.asset.url} type="video/mp4" />
                Il tuo browser non supporta la riproduzione video.
              </video>
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <p>Video non disponibile</p>
              </div>
            )}
          </div>

          {/* Description */}
          {video.description && (
            <div className="mb-4">
                  <p className="text-gray-600">{video.description}</p>
            </div>
          )}

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2">
            {video.categories?.map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {video.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
