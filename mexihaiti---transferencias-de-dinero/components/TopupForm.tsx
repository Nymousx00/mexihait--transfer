
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { formatMXN, generateWhatsAppLink } from '../utils/formatters';
import { ADMIN_WHATSAPP } from '../constants';

interface TopupFormProps {
  user: User;
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

const TopupForm: React.FC<TopupFormProps> = ({ user, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return alert('Ingrese un monto válido');
    if (!file) return alert('Debe subir el comprobante de pago');

    onSubmit({
      amountMXN: numAmount,
      totalMXN: numAmount,
      notes,
      type: 'Recarga',
    });

    // Notify Admin via WhatsApp
    // Note: We include the filename in the text and prompt the user to attach it manually
    const message = `👋 Hola Admin, he solicitado una RECARGA DE SALDO:\n\n` +
      `👤 Usuario: ${user.firstName} ${user.lastName}\n` +
      `📧 Email: ${user.email}\n` +
      `💰 Monto: ${formatMXN(numAmount)}\n` +
      `📝 Notas: ${notes || 'Ninguna'}\n\n` +
      `📸 COMPROBANTE: He subido el archivo "${file.name}".\n\n` +
      `⚠️ INSTRUCCIONES: Por favor, ADJUNTA EL COMPROBANTE A ESTE CHAT para una verificación inmediata.`;
    
    window.open(generateWhatsAppLink(ADMIN_WHATSAPP, message), '_blank');
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-blue-900 p-6 text-white">
        <h2 className="text-2xl font-bold">Recargar Saldo</h2>
        <p className="text-blue-200 text-sm mt-1">Transfiere a nuestras cuentas y sube tu comprobante</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Monto a Recargar (MXN)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
            <input 
              type="number" 
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Comprobante de Pago (Imagen/PDF)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 transition-colors cursor-pointer group">
            <div className="space-y-1 text-center w-full">
              <svg className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex justify-center text-sm text-slate-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Sube un archivo</span>
                  <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </label>
                <p className="pl-1 text-slate-500">o arrastra y suelta</p>
              </div>
              <p className="text-xs text-slate-400">PNG, JPG, PDF hasta 10MB</p>
              {file && (
                <div className="mt-3 bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold text-emerald-700 truncate max-w-[200px]">{file.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Notas adicionales (Opcional)</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
            placeholder="Ej. Transferencia desde BBVA..."
          />
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-xs text-amber-800 flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>Al hacer clic en el botón, se abrirá WhatsApp. Por favor, asegúrate de adjuntar tu comprobante manualmente en el chat que se abrirá.</p>
        </div>

        <div className="flex space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all"
          >
            Solicitar Recarga
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopupForm;
