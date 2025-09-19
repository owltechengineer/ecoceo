'use client';

interface HomeButtonProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showText?: boolean;
}

export default function HomeButton({ 
  className = '', 
  variant = 'default',
  showText = true 
}: HomeButtonProps) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'px-3 py-2 text-sm';
      case 'minimal':
        return 'p-2 text-sm';
      default:
        return 'px-4 py-2';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return 'text-base';
      case 'minimal':
        return 'text-sm';
      default:
        return 'text-lg';
    }
  };

  return (
    <button
      onClick={handleGoHome}
      className={`flex items-center space-x-2 font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ${getVariantClasses()} ${className}`}
      title="Torna al sito principale"
    >
      <span className={getIconSize()}>🏠</span>
      {showText && (
        <span className={variant === 'minimal' ? 'text-xs' : ''}>
          {variant === 'compact' ? 'Sito' : 'Torna al Sito'}
        </span>
      )}
    </button>
  );
}
