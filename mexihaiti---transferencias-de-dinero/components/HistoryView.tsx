
import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatMXN, formatDate, formatHTG } from '../utils/formatters';

interface HistoryViewProps {
  transactions: Transaction[];
  onViewReceipt: (tx: Transaction) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions, onViewReceipt }) => {
  const [activeRegister, setActiveRegister] = useState<'Envío' | 'Recarga'>('Envío');
  
  const filteredRecords = transactions
    .filter(tx => tx.type === activeRegister)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeRegister === 'Envío' ? 'Registro de Envíos' : 'Registro de Recargas'}
          </h2>
          <p className="text-sm text-slate-500">Consulta el historial de tus operaciones filtradas por categoría.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveRegister('Envío')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeRegister === 'Envío' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Envíos
          </button>
          <button
            onClick={() => setActiveRegister('Recarga')}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeRegister === 'Recarga' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Recargas
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {filteredRecords.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredRecords.map(tx => (
              <div key={tx.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    tx.type === 'Recarga' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-blue-100 text-blue-600 border border-blue-200'
                  }`}>
                    {tx.type === 'Recarga' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-slate-800 text-lg">
                        {tx.type === 'Recarga' ? 'Carga de Saldo' : `Remesa ${tx.service}`}
                      </p>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        tx.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        tx.status === 'Completado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.date)}</p>
                    {tx.receiverName && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Receptor: <span className="font-semibold text-slate-800">{tx.receiverName}</span></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                  <div className="text-right">
                    <p className={`text-xl font-black ${tx.type === 'Recarga' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.type === 'Recarga' ? '+' : '-'}{formatMXN(tx.totalMXN)}
                    </p>
                    {tx.amountHTG && <p className="text-xs font-bold text-blue-600">Equivale a {formatHTG(tx.amountHTG)}</p>}
                  </div>
                  
                  <button 
                    onClick={() => onViewReceipt(tx)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all bg-slate-50"
                  >
                    Ver Comprobante
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6 border border-dashed border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-bold text-lg">Sin registros disponibles</p>
            <p className="text-slate-400 text-sm max-w-xs mt-1">
              Aún no tienes movimientos registrados en la categoría de {activeRegister === 'Envío' ? 'envíos de dinero' : 'recargas de saldo'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
