"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ClientDocument } from '@/types/clientArea';
import { getImageUrl } from '@/sanity/lib/image';

interface DocumentCardProps {
  document: ClientDocument;
  onDownload?: (document: ClientDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDownload }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
        );
      case 'doc':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
        );
      case 'xls':
        return (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
        );
      case 'ppt':
        return (
          <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
          </svg>
        );
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(document);
    } else {
      setIsDownloading(true);
      try {
        // Direct download
        const link = document.createElement('a');
        link.href = document.file.asset.url;
        link.download = document.file.asset.originalFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="bg-white/20rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-blue-200">
      {/* Preview Image or File Icon */}
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {document.previewImage ? (
          <Image
            src={getImageUrl(document.previewImage)}
            alt={document.previewImage.alt || document.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            {getFileIcon(document.fileType)}
            <span className="text-xs text-gray-500 mt-2 uppercase">
              {document.fileType}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {document.title}
        </h3>
        
        {document.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {document.description}
          </p>
        )}

        {/* File Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{document.file.asset.originalFilename}</span>
          {document.fileSize && (
            <span>{formatFileSize(document.fileSize)}</span>
          )}
        </div>

        {/* Categories */}
        {document.categories && document.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {document.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
            {document.categories.length > 2 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{document.categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Download...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Scarica
            </>
          )}
        </button>

        {/* Download Count */}
        {document.downloadCount > 0 && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Scaricato {document.downloadCount} volte
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
