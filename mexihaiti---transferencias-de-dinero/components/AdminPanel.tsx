
import React from 'react';
import { Transaction, User } from '../types';
import { formatMXN, formatDate, formatHTG } from '../utils/formatters';

interface AdminPanelProps {
  transactions: Transaction[];
  users: User[];
  onUpdateStatus: (txId: string, status: 'Completado' | 'Cancelado') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ transactions, users, onUpdateStatus }) => {
  const pendingTransactions = transactions
    .filter(t => t.status === 'Pendiente')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const completedTransactions = transactions
    .filter(t => t.status !== 'Pendiente')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getUser = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Panel Administrativo</h2>
          <p className="text-slate-500 font-medium italic">Acceso restringido: Procesamiento manual de fondos.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-amber-200 shadow-sm flex flex-col items-center justify-center min-w-[100px]">
            <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">Por Revisar</p>
            <p className="text-2xl font-black text-amber-700">{pendingTransactions.length}</p>
          </div>
          <div className="bg-white px-5 py-3 rounded-2xl border border-blue-200 shadow-sm flex flex-col items-center justify-center min-w-[100px]">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Usuarios</p>
            <p className="text-2xl font-black text-blue-900">{users.length}</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Solicitudes de Acreditación</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Verifica el comprobante antes de aprobar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {pendingTransactions.length > 0 ? (
            pendingTransactions.map(tx => {
              const user = getUser(tx.userId);
              return (
                <div key={tx.id} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 flex flex-col lg:flex-row justify-between gap-8 border-l-8 border-l-amber-500 relative overflow-hidden group">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        tx.type === 'Recarga' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{formatDate(tx.date)}</span>
                    </div>
                    
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200 text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Usuario Solicitante</p>
                         <p className="font-black text-xl text-slate-800 leading-tight">{user?.firstName} {user?.lastName}</p>
                         <p className="text-sm font-medium text-slate-500 mt-1">{user?.email}</p>
                         <p className="text-xs text-slate-400">ID Usuario: {tx.userId.slice(0, 10)}</p>
                       </div>
                    </div>

                    {tx.type === 'Envío' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                        <div>
                          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">🇭🇹 Destinatario</p>
                          <p className="font-bold text-slate-700">{tx.receiverName}</p>
                          <p className="text-xs text-slate-500 font-medium">{tx.receiverPhone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-1">Canal & Monto</p>
                          <p className="font-black text-blue-900">{tx.service}</p>
                          <p className="text-lg font-black text-emerald-600 leading-none mt-1">{formatHTG(tx.amountHTG || 0)}</p>
                        </div>
                      </div>
                    )}

                    {tx.type === 'Recarga' && (
                      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-3">
                         <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <div>
                               <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest mb-1">Comentarios del usuario</p>
                               <p className="text-sm font-medium text-emerald-800 italic">"{tx.notes || 'Sin observaciones'}"</p>
                            </div>
                         </div>
                         <div className="pt-3 border-t border-emerald-100 flex items-center gap-2">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                           <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Acción Requerida: Validar transferencia y acreditar saldo.</p>
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center items-end min-w-[260px] bg-slate-50 lg:bg-transparent p-6 lg:p-0 rounded-2xl border lg:border-none border-slate-100">
                    <div className="text-right mb-8">
                        <p className="text-4xl font-black text-slate-800 tabular-nums tracking-tighter">{formatMXN(tx.totalMXN)}</p>
                        <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">Monto a Liquidar</p>
                    </div>
                    
                    <div className="flex flex-col w-full gap-3">
                      <button 
                        onClick={() => onUpdateStatus(tx.id, 'Completado')}
                        className="w-full py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {tx.type === 'Recarga' ? 'Acreditar Saldo' : 'Confirmar Envío'}
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(tx.id, 'Cancelado')}
                        className="w-full py-3 rounded-2xl font-bold text-red-500 bg-white border border-red-200 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Rechazar Solicitud
                      </button>
                    </div>
                  </div>
                  
                  {/* Visual flourish for the card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-24 text-center border-4 border-dashed border-slate-100">
              <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </div>
              <p className="text-slate-400 font-black text-xl">Sin Pendientes</p>
              <p className="text-slate-300 text-sm mt-1">El sistema está al día. Todas las solicitudes han sido procesadas.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6 pt-4 border-t border-slate-100">
           <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-800">Bitácora Global</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Registro maestro de operaciones finalizadas</p>
           </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Sello de Tiempo</th>
                <th className="px-6 py-5">Perfil de Usuario</th>
                <th className="px-6 py-5">Tipo de Operación</th>
                <th className="px-6 py-5">Monto (MXN)</th>
                <th className="px-6 py-5">Dictamen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedTransactions.slice(0, 50).map(tx => {
                const user = getUser(tx.userId);
                return (
                  <tr key={tx.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 text-slate-500 whitespace-nowrap font-medium">{formatDate(tx.date)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                           {user?.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        tx.type === 'Recarga' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-800 text-base">{formatMXN(tx.totalMXN)}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        tx.status === 'Completado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
