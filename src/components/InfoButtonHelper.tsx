'use client';

import { InfoButton } from './InfoModal';
import { useInfoModal } from '@/contexts/InfoModalContext';
import { dashboardInfo } from './dashboardInfo';

interface InfoButtonHelperProps {
  section: keyof typeof dashboardInfo;
  className?: string;
}

export function InfoButtonHelper({ section, className }: InfoButtonHelperProps) {
  const { openInfo } = useInfoModal();
  
  return (
    <InfoButton 
      onClick={() => openInfo(dashboardInfo[section].title, dashboardInfo[section].content)}
      className={className}
    />
  );
}

// Componente per titoli con info button
export function SectionTitle({ 
  title, 
  description, 
  section 
}: { 
  title: string; 
  description: string; 
  section: keyof typeof dashboardInfo;
}) {
  const { openInfo } = useInfoModal();
  
  return (
    <div className="flex items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <InfoButton 
        onClick={() => openInfo(dashboardInfo[section].title, dashboardInfo[section].content)}
        className="ml-4"
      />
    </div>
  );
}
