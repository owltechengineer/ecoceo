import React from 'react';
import Link from 'next/link';

interface SanityLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const SanityLink: React.FC<SanityLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  style = {}, 
  ...props 
}) => {
  return (
    <Link 
      href={href} 
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Link>
  );
};

export default SanityLink;
