
import React from 'react';
import { Transaction } from '../types';
import { formatMXN, formatDate, formatHTG } from '../utils/formatters';
import { SUPPORT_EMAIL } from '../constants';

interface ReceiptModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative bg-blue-900 p-8 text-white text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Comprobante de Operación</h2>
          <p className="text-blue-300 text-sm">{transaction.status === 'Completado' ? 'Transacción Exitosa' : 'Transacción ' + transaction.status}</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-800">
              {transaction.type === 'Recarga' ? '+' : '-'}{formatMXN(transaction.totalMXN)}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {transaction.id.slice(0, 12)}</p>
          </div>

          <div className="space-y-3 border-y border-slate-100 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fecha y Hora:</span>
              <span className="font-bold text-slate-800">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tipo de Servicio:</span>
              <span className="font-bold text-slate-800">{transaction.type} {transaction.service && `/ ${transaction.service}`}</span>
            </div>
            {transaction.receiverName && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Receptor:</span>
                <span className="font-bold text-slate-800">{transaction.receiverName}</span>
              </div>
            )}
            {transaction.amountHTG && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Monto en Haití:</span>
                <span className="font-bold text-emerald-600">{formatHTG(transaction.amountHTG)}</span>
              </div>
            )}
            {transaction.feeMXN && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Comisión:</span>
                <span className="font-bold text-slate-800">{formatMXN(transaction.feeMXN)}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">Si tienes dudas sobre este recibo, contáctanos a:</p>
            <p className="text-xs font-bold text-blue-600">{SUPPORT_EMAIL}</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="flex-1 py-3 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
