'use client';

import { useAuth } from '../../hooks/useAuth';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Sei sicuro di voler uscire dalla dashboard?')) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${className}`}
      title="Esci dalla dashboard"
    >
      <span className="text-lg">🚪</span>
      <span className="font-medium">Logout</span>
    </button>
  );
}
