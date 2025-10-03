'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InfoModalContextType {
  openInfo: (title: string, content: ReactNode) => void;
  closeInfo: () => void;
  isOpen: boolean;
  modalContent: { title: string; content: ReactNode };
}

const InfoModalContext = createContext<InfoModalContextType | undefined>(undefined);

export function InfoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: ReactNode }>({
    title: '',
    content: null
  });

  const openInfo = (title: string, content: ReactNode) => {
    setModalContent({ title, content });
    setIsOpen(true);
  };

  const closeInfo = () => {
    setIsOpen(false);
  };

  return (
    <InfoModalContext.Provider value={{ isOpen, modalContent, openInfo, closeInfo }}>
      {children}
    </InfoModalContext.Provider>
  );
}

export function useInfoModal() {
  const context = useContext(InfoModalContext);
  if (context === undefined) {
    throw new Error('useInfoModal must be used within an InfoModalProvider');
  }
  return context;
}
