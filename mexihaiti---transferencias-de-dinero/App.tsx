
import React, { useState, useEffect } from 'react';
import { User, Transaction, AppState } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AuthForms from './components/AuthForms';
import TopupForm from './components/TopupForm';
import TransferForm from './components/TransferForm';
import HistoryView from './components/HistoryView';
import ReceiptModal from './components/ReceiptModal';
import AdminPanel from './components/AdminPanel';
import SupportChat from './components/SupportChat';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('mexihaiti_state');
    if (saved) return JSON.parse(saved);
    return {
      currentUser: null,
      transactions: [],
      users: [
        { 
          id: 'admin_123', 
          firstName: 'Administrador', 
          lastName: 'MexiHaiti', 
          email: 'admin@mexihaiti.com', 
          phone: '5215500000000', 
          balance: 0, 
          isAdmin: true 
        }
      ]
    };
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    localStorage.setItem('mexihaiti_state', JSON.stringify(appState));
  }, [appState]);

  const handleLogin = (user: User) => {
    const actualUser = appState.users.find(u => u.id === user.id) || user;
    setAppState(prev => ({ ...prev, currentUser: actualUser }));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setAppState(prev => ({ ...prev, currentUser: null }));
    setCurrentView('auth');
  };

  const handleRegister = (newUser: User) => {
    setAppState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: newUser
    }));
    setCurrentView('dashboard');
  };

  const handleCreateTransaction = (txData: Partial<Transaction>) => {
    const newTx: Transaction = {
      ...txData,
      id: Math.random().toString(36).substr(2, 9),
      userId: appState.currentUser!.id,
      status: 'Pendiente',
      date: new Date().toISOString(),
    } as Transaction;

    setAppState(prev => {
      let updatedUsers = [...prev.users];
      let updatedCurrentUser = { ...prev.currentUser! };

      // LOGIC: Deduct balance only for transfers immediately.
      // Recharges DO NOT change amount until manual approval.
      if (newTx.type === 'Envío') {
        updatedUsers = updatedUsers.map(u => {
          if (u.id === updatedCurrentUser.id) {
            const newBalance = u.balance - newTx.totalMXN;
            updatedCurrentUser = { ...u, balance: newBalance };
            return updatedCurrentUser;
          }
          return u;
        });
      }

      return {
        ...prev,
        transactions: [...prev.transactions, newTx],
        users: updatedUsers,
        currentUser: updatedCurrentUser
      };
    });
    setCurrentView('dashboard');
  };

  const handleAdminUpdateStatus = (txId: string, status: 'Completado' | 'Cancelado') => {
    // SECURITY CHECK: This logic only runs if triggered from the Admin Panel view,
    // which is already guarded by the isAdmin check in the render.
    setAppState(prev => {
      const tx = prev.transactions.find(t => t.id === txId);
      if (!tx || tx.status !== 'Pendiente') return prev;

      const updatedTransactions = prev.transactions.map(t => 
        t.id === txId ? { ...t, status } : t
      );

      const updatedUsers = prev.users.map(u => {
        if (u.id === tx.userId) {
          // ADMIN APPROVAL LOGIC:
          // 1. If Recharge is Completed -> ADD money to the user account.
          if (tx.type === 'Recarga' && status === 'Completado') {
            return { ...u, balance: u.balance + tx.totalMXN };
          }
          // 2. If Envío is Cancelled -> REFUND the money back.
          if (tx.type === 'Envío' && status === 'Cancelado') {
            return { ...u, balance: u.balance + tx.totalMXN };
          }
        }
        return u;
      });

      const newCurrentUser = prev.currentUser && updatedUsers.find(u => u.id === prev.currentUser?.id) || prev.currentUser;

      return {
        ...prev,
        transactions: updatedTransactions,
        users: updatedUsers,
        currentUser: newCurrentUser
      };
    });
  };

  if (!appState.currentUser) {
    return <AuthForms onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <Layout 
      user={appState.currentUser} 
      onLogout={handleLogout}
      onNavigate={setCurrentView}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
             <nav className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`w-full flex items-center px-6 py-4 text-sm font-bold transition-all ${currentView === 'dashboard' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setCurrentView('transfer')}
                  className={`w-full flex items-center px-6 py-4 text-sm font-bold transition-all ${currentView === 'transfer' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Enviar Dinero
                </button>
                <button 
                  onClick={() => setCurrentView('topup')}
                  className={`w-full flex items-center px-6 py-4 text-sm font-bold transition-all ${currentView === 'topup' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Recargar Saldo
                </button>
                <button 
                  onClick={() => setCurrentView('history')}
                  className={`w-full flex items-center px-6 py-4 text-sm font-bold transition-all ${currentView === 'history' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Historial / Registros
                </button>
                
                {/* STRICT ADMIN ACCESS GUARD */}
                {appState.currentUser.isAdmin && (
                  <div className="mt-4 border-t border-slate-100">
                    <p className="px-6 pt-4 pb-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">Administración</p>
                    <button 
                      onClick={() => setCurrentView('admin')}
                      className={`w-full flex items-center px-6 py-4 text-sm font-bold transition-all ${currentView === 'admin' ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    >
                      🛠 Panel de Control
                    </button>
                  </div>
                )}
             </nav>
          </aside>

          <main className="flex-grow">
            {currentView === 'dashboard' && (
              <Dashboard 
                user={appState.currentUser} 
                transactions={appState.transactions} 
                onNavigate={setCurrentView}
                onViewReceipt={setSelectedTx}
              />
            )}
            {currentView === 'topup' && (
              <TopupForm 
                user={appState.currentUser} 
                onSubmit={handleCreateTransaction} 
                onCancel={() => setCurrentView('dashboard')} 
              />
            )}
            {currentView === 'transfer' && (
              <TransferForm 
                user={appState.currentUser} 
                onConfirm={handleCreateTransaction} 
                onCancel={() => setCurrentView('dashboard')} 
              />
            )}
            {currentView === 'history' && (
              <HistoryView 
                transactions={appState.transactions.filter(t => t.userId === appState.currentUser?.id)} 
                onViewReceipt={setSelectedTx}
              />
            )}
            {/* COMPONENT GUARD: Only render AdminPanel if currentUser is actually an Admin */}
            {currentView === 'admin' && appState.currentUser.isAdmin && (
              <AdminPanel 
                transactions={appState.transactions}
                users={appState.users}
                onUpdateStatus={handleAdminUpdateStatus}
              />
            )}
          </main>
        </div>
      </div>

      <SupportChat />

      {selectedTx && (
        <ReceiptModal 
          transaction={selectedTx} 
          onClose={() => setSelectedTx(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
