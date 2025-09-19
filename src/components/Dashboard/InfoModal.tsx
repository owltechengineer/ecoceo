'use client';

import { useInfoModal } from '@/contexts/InfoModalContext';

export default function InfoModal() {
  const { isOpen, modalContent, closeInfo } = useInfoModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{modalContent.title}</h2>
          <button
            onClick={closeInfo}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {modalContent.content}
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={closeInfo}
            className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente pulsante info
export function InfoButton({ 
  onClick, 
  className = "text-blue-600 hover:text-blue-800 ml-2" 
}: { 
  onClick: () => void; 
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors ${className}`}
      title="Informazioni"
    >
      <span className="text-sm font-bold text-blue-600">ℹ️</span>
    </button>
  );
}
