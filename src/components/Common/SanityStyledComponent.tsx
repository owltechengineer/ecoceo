"use client";

import React from 'react';
import { useSanityStyles, SanityComponent } from '@/hooks/useSanityStyles';

interface SanityStyledComponentProps {
  component: SanityComponent | null | undefined;
  componentName: string;
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const SanityStyledComponent: React.FC<SanityStyledComponentProps> = ({
  component,
  componentName,
  as,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { style: sanityStyle, className: sanityClassName } = useSanityStyles(component, componentName);

  // Default to 'div' if 'as' is undefined or invalid
  let Component: React.ElementType = 'div';
  
  try {
    if (as) {
      Component = as;
    }
  } catch (error) {
    console.warn(`Invalid 'as' prop for component ${componentName}:`, as);
    Component = 'div';
  }

  // Merge styles: Sanity styles take precedence over passed styles
  const mergedStyle = { ...style, ...sanityStyle };
  
  // Merge classes: passed className takes precedence over Sanity classes
  const mergedClassName = sanityClassName ? `${sanityClassName} ${className}`.trim() : className;

  // Validate that Component is a valid React element type
  if (typeof Component !== 'string' && typeof Component !== 'function') {
    console.error(`Invalid component type for ${componentName}:`, Component);
    Component = 'div';
  }

  return (
    <Component
      className={mergedClassName}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Component>
  );
};

export default SanityStyledComponent;
