import { useState, useEffect } from 'react';

export interface SectionConfig {
  name: string;
  enabled: boolean;
  description: string;
  tables: string[];
  path: string;
  icon: string;
}

export const useSections = () => {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = () => {
    const allSections: SectionConfig[] = [
      {
        name: 'Dashboard',
        enabled: process.env.NEXT_PUBLIC_ENABLE_DASHBOARD === 'true' || process.env.NEXT_PUBLIC_ENABLE_DASHBOARD === undefined,
        description: 'Panoramica generale del sistema',
        tables: ['dashboard_data', 'quick_tasks', 'recurring_activities'],
        path: '/dashboard',
        icon: '📊'
      },
      {
        name: 'Task e Calendario',
        enabled: process.env.NEXT_PUBLIC_ENABLE_TASKS === 'true' || process.env.NEXT_PUBLIC_ENABLE_TASKS === undefined,
        description: 'Gestione attività e calendario',
        tables: ['task_calendar_tasks', 'task_calendar_appointments', 'quick_tasks'],
        path: '/dashboard?section=tasks',
        icon: '📅'
      },
      {
        name: 'Marketing',
        enabled: process.env.NEXT_PUBLIC_ENABLE_MARKETING === 'true' || process.env.NEXT_PUBLIC_ENABLE_MARKETING === undefined,
        description: 'Gestione marketing e campagne',
        tables: ['marketing_campaigns', 'marketing_leads', 'marketing_budgets'],
        path: '/dashboard?section=marketing',
        icon: '📈'
      },
      {
        name: 'Progetti',
        enabled: process.env.NEXT_PUBLIC_ENABLE_PROJECTS === 'true' || process.env.NEXT_PUBLIC_ENABLE_PROJECTS === undefined,
        description: 'Gestione progetti unificata',
        tables: ['projects'],
        path: '/dashboard?section=projects',
        icon: '🚀'
      },
      {
        name: 'Magazzino',
        enabled: process.env.NEXT_PUBLIC_ENABLE_WAREHOUSE === 'true' || process.env.NEXT_PUBLIC_ENABLE_WAREHOUSE === undefined,
        description: 'Gestione inventario e preventivi',
        tables: ['warehouse_items', 'quotes', 'quote_items'],
        path: '/dashboard?section=warehouse',
        icon: '📦'
      },
      {
        name: 'Finanziario',
        enabled: process.env.NEXT_PUBLIC_ENABLE_FINANCIAL === 'true' || process.env.NEXT_PUBLIC_ENABLE_FINANCIAL === undefined,
        description: 'Gestione finanziaria',
        tables: ['financial_revenues', 'financial_fixed_costs', 'financial_variable_costs'],
        path: '/dashboard?section=financial',
        icon: '💰'
      },
      {
        name: 'Business Plan',
        enabled: process.env.NEXT_PUBLIC_ENABLE_BUSINESS_PLAN === 'true' || process.env.NEXT_PUBLIC_ENABLE_BUSINESS_PLAN === undefined,
        description: 'Piano aziendale',
        tables: ['business_plan_executive_summary', 'business_plan_market_analysis'],
        path: '/dashboard?section=business-plan',
        icon: '📋'
      }
    ];

    // Filtra solo le sezioni abilitate (default: tutte abilitate se non specificato)
    const enabledSections = allSections.filter(section => section.enabled);
    
    setSections(enabledSections);
    setLoading(false);
  };

  const getSectionByName = (name: string): SectionConfig | undefined => {
    return sections.find(section => section.name.toLowerCase() === name.toLowerCase());
  };

  const isSectionEnabled = (name: string): boolean => {
    const section = getSectionByName(name);
    return section?.enabled || false;
  };

  const getEnabledSections = (): SectionConfig[] => {
    return sections.filter(section => section.enabled);
  };

  return {
    sections,
    loading,
    getSectionByName,
    isSectionEnabled,
    getEnabledSections,
    reload: loadSections
  };
};
