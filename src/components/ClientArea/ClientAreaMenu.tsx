"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useClientAreaAuth } from '@/contexts/ClientAreaAuthContext';

interface ClientAreaMenuProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const ClientAreaMenu: React.FC<ClientAreaMenuProps> = ({ activeTab = 'documents', onTabChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useClientAreaAuth();

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
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-black/20 backdrop-blur-md rounded-xl shadow-xl border border-white/20 hover:bg-black/30 transition-all duration-200"
        >
          <span className="text-white text-xl">
            {isMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Menu Sidebar */}
      <div className={`transition-all duration-300 ${
        isMenuOpen 
          ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto transform translate-x-0' 
          : 'hidden lg:block transform -translate-x-full lg:translate-x-0'
      }`}>
        <div className="bg-black/20 backdrop-blur-md rounded-r-2xl lg:rounded-xl shadow-2xl border border-white/20 overflow-hidden h-screen flex flex-col w-64">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Area Clienti</h1>
                  <p className="text-white/70 text-xs">LEM Solutions</p>
                </div>
              </div>
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
                      ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30 text-white border border-red-400/50'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-md transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-red-500/40 to-orange-500/40'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className="ml-3 text-left">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-white/60">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/20 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center p-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 text-sm"
            >
              <span className="mr-2">🏠</span>
              Torna al Sito
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 text-white/80 hover:bg-red-500/20 hover:text-white rounded-lg transition-all duration-200 text-sm"
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
