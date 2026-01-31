
import React from 'react';
import { User } from '../types';
import { formatMXN } from '../utils/formatters';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                MH
              </div>
              <span className="ml-3 text-xl font-bold text-blue-900 hidden sm:block">MexiHaiti</span>
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 font-medium">Saldo Disponible</p>
                  <p className="text-sm font-bold text-emerald-600">{formatMXN(user.balance)}</p>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-700">{user.firstName} {user.lastName}</span>
                  <span className="text-[10px] text-slate-400">ID: {user.id.slice(0, 8)}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">© 2024 MexiHaiti. Transferencias rápidas y seguras.</p>
          <p className="text-xs text-slate-400 mt-2">Solo para remesas México - Haití.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
