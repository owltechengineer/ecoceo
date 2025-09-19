import { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';

interface SanityStyles {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  shadow?: string;
}

interface SanityTypography {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
}

interface SanityAnimations {
  entranceAnimation?: string;
  animationDuration?: string;
  animationDelay?: string;
}

interface SanityResponsive {
  mobileStyles?: {
    padding?: string;
    fontSize?: string;
  };
  tabletStyles?: {
    padding?: string;
    fontSize?: string;
  };
}

export interface SanityComponent {
  styles?: SanityStyles;
  typography?: SanityTypography;
  animations?: SanityAnimations;
  responsive?: SanityResponsive;
}

export const useSanityStyles = (component: SanityComponent | null | undefined, componentName?: string) => {
  const styles = useMemo(() => {
    // If no component is provided, return empty styling (no purple styling)
    if (!component) {
      return {
        style: {},
        className: '',
        isUndefined: false,
      };
    }

    const baseStyles: React.CSSProperties = {};
    const cssClasses: string[] = [];

    // Apply base styles
    if (component.styles) {
      if (component.styles.backgroundColor) {
        baseStyles.backgroundColor = component.styles.backgroundColor;
      }
      if (component.styles.textColor) {
        baseStyles.color = component.styles.textColor;
      }
      if (component.styles.borderColor) {
        baseStyles.borderColor = component.styles.borderColor;
        baseStyles.borderWidth = '1px';
        baseStyles.borderStyle = 'solid';
      }
      if (component.styles.borderRadius) {
        baseStyles.borderRadius = component.styles.borderRadius;
      }
      if (component.styles.padding) {
        baseStyles.padding = component.styles.padding;
      }
      if (component.styles.margin) {
        baseStyles.margin = component.styles.margin;
      }
      if (component.styles.shadow && component.styles.shadow !== 'none') {
        baseStyles.boxShadow = component.styles.shadow;
      }
    }

    // Apply typography
    if (component.typography) {
      if (component.typography.fontFamily) {
        baseStyles.fontFamily = component.typography.fontFamily;
      }
      if (component.typography.fontSize) {
        baseStyles.fontSize = component.typography.fontSize;
      }
      if (component.typography.fontWeight) {
        baseStyles.fontWeight = component.typography.fontWeight;
      }
      if (component.typography.lineHeight) {
        baseStyles.lineHeight = component.typography.lineHeight;
      }
    }

    // Apply animations
    if (component.animations) {
      if (component.animations.entranceAnimation && component.animations.entranceAnimation !== 'none') {
        cssClasses.push(`animate-${component.animations.entranceAnimation}`);
      }
      if (component.animations.animationDuration) {
        baseStyles.animationDuration = component.animations.animationDuration;
      }
      if (component.animations.animationDelay) {
        baseStyles.animationDelay = component.animations.animationDelay;
      }
    }

    return {
      style: baseStyles,
      className: cssClasses.join(' '),
      isUndefined: false,
    };
  }, [component]);

  return styles;
};

// Hook to get component by name from Sanity
export const useSanityComponent = (componentName: string) => {
  const [component, setComponent] = useState<SanityComponent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const result = await safeFetch(`
          *[_type == "uiComponents" && name == $componentName && isActive == true][0] {
            _id,
            name,
            type,
            styles,
            typography,
            animations,
            responsive
          }
        `, { componentName });
        
        setComponent(result);
      } catch (error) {
        console.error(`Error fetching component ${componentName}:`, error);
        setComponent(null);
      } finally {
        setLoading(false);
      }
    };

    if (componentName) {
      fetchComponent();
    }
  }, [componentName]);

  return { component, loading };
};

// Helper function to generate CSS variables for theme
export const generateThemeCSS = (theme: any) => {
  if (!theme) return '';

  const cssVars = [
    theme.primaryColor && `--primary-color: ${theme.primaryColor};`,
    theme.secondaryColor && `--secondary-color: ${theme.secondaryColor};`,
    theme.accentColor && `--accent-color: ${theme.accentColor};`,
    theme.backgroundColor && `--background-color: ${theme.backgroundColor};`,
    theme.textColor && `--text-color: ${theme.textColor};`,
  ].filter(Boolean);

  return cssVars.length > 0 ? `:root { ${cssVars.join(' ')} }` : '';
};

// Helper function to generate button styles
export const generateButtonStyles = (buttonConfig: any, type: 'primary' | 'secondary') => {
  if (!buttonConfig) return {};

  const styles: React.CSSProperties = {};

  if (buttonConfig.backgroundColor) {
    styles.backgroundColor = buttonConfig.backgroundColor;
  }
  if (buttonConfig.textColor) {
    styles.color = buttonConfig.textColor;
  }
  if (buttonConfig.borderRadius) {
    styles.borderRadius = buttonConfig.borderRadius;
  }
  if (buttonConfig.padding) {
    styles.padding = buttonConfig.padding;
  }

  return styles;
};

// Helper function to get responsive styles
export const getResponsiveStyles = (component: SanityComponent, breakpoint: 'mobile' | 'tablet') => {
  const responsive = component.responsive;
  if (!responsive) return {};

  const styles: React.CSSProperties = {};

  if (breakpoint === 'mobile' && responsive.mobileStyles) {
    if (responsive.mobileStyles.padding) {
      styles.padding = responsive.mobileStyles.padding;
    }
    if (responsive.mobileStyles.fontSize) {
      styles.fontSize = responsive.mobileStyles.fontSize;
    }
  }

  if (breakpoint === 'tablet' && responsive.tabletStyles) {
    if (responsive.tabletStyles.padding) {
      styles.padding = responsive.tabletStyles.padding;
    }
    if (responsive.tabletStyles.fontSize) {
      styles.fontSize = responsive.tabletStyles.fontSize;
    }
  }

  return styles;
};
