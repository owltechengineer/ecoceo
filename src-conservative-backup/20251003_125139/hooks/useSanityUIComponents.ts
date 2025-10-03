import { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';

interface SanityComponent {
  _id: string;
  name: string;
  type: string;
  styles?: any;
  typography?: any;
  animations?: any;
  responsive?: any;
}

export const useSanityUIComponents = () => {
  const [components, setComponents] = useState<Record<string, SanityComponent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const result = await safeFetch(`
          *[_type == "uiComponents" && isActive == true] {
            _id,
            name,
            type,
            styles,
            typography,
            animations,
            responsive
          }
        `);
        
        if (result && Array.isArray(result)) {
          const componentsMap: Record<string, SanityComponent> = {};
          result.forEach((component: SanityComponent) => {
            componentsMap[component.name] = component;
          });
          setComponents(componentsMap);
        }
      } catch (error) {
        console.error('Error fetching UI components:', error);
        setComponents({});
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  const getComponent = (componentName: string): SanityComponent | null => {
    return components[componentName] || null;
  };

  const getComponentsByType = (type: string): SanityComponent[] => {
    return Object.values(components).filter(component => component.type === type);
  };

  const getAllComponents = (): SanityComponent[] => {
    return Object.values(components);
  };

  return {
    components,
    loading,
    getComponent,
    getComponentsByType,
    getAllComponents,
  };
};
