"use client";

import React, { useState, useEffect } from 'react';
import { ClientAreaAuthProvider, useClientAreaAuth } from '@/contexts/ClientAreaAuthContext';
import LoginForm from '@/components/ClientArea/LoginForm';
import ClientAreaContent from '@/components/ClientArea/ClientAreaContent';

const ClientAreaPage = () => {
  return (
    <ClientAreaAuthProvider>
      <ClientAreaPageContent />
    </ClientAreaAuthProvider>
  );
};

const ClientAreaPageContent = () => {
  const { isAuthenticated, isLoading } = useClientAreaAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <ClientAreaContent />;
};

export default ClientAreaPage;
