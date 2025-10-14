"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useClientAreaAuth } from '@/contexts/ClientAreaAuthContext';

interface ClientAreaMenuProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const ClientAreaMenu: React.FC<ClientAreaMenuProps> = ({ activeTab = 'documents', onTabChange }) => {
  const { logout } = useClientAreaAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'documents',
      name: 'Documenti',
      icon: '📄',
      description: 'Documenti e risorse'
    },
    {
      id: 'knowledge',
      name: 'Conoscenza',
      icon: '🧠',
      description: 'Base di conoscenza'
    },
    {
      id: 'promotions',
      name: 'Promozioni',
      icon: '🎯',
      description: 'Offerte speciali'
    },
    {
      id: 'videos',
      name: 'Video',
      icon: '🎥',
      description: 'Tutorial e guide'
    }
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-blue-600/90 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/50 hover:bg-blue-700 transition-all duration-200"
        >
          <span className="text-white text-xl">
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu Sidebar */}
      <div className={`transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto transform translate-x-0' 
          : 'hidden lg:block transform -translate-x-full lg:translate-x-0'
      } w-64 lg:w-72`}>
        <div className="bg-white/95 backdrop-blur-md rounded-r-2xl lg:rounded-xl shadow-2xl border border-white/50 overflow-hidden h-screen flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">🏠</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Area Clienti</h1>
                  <p className="text-blue-100 text-xs">Contenuti esclusivi</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
              >
                <span className="text-white text-sm">✕</span>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <div className={`p-2 rounded-md transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-200'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="ml-3 text-left">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200/50 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">🏠</span>
              Torna al Sito
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">🚪</span>
              Esci
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAreaMenu;
