
import React, { useState, useEffect } from 'react';
import { User, WalletService, Transaction } from '../types';
import { formatMXN, formatHTG, generateWhatsAppLink } from '../utils/formatters';
import { COMMISSION_PERCENT, EXCHANGE_RATE, ADMIN_WHATSAPP } from '../constants';

interface TransferFormProps {
  user: User;
  onConfirm: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ user, onConfirm, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState<WalletService>('NatCash');
  const [amountMXN, setAmountMXN] = useState<string>('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [senderName, setSenderName] = useState(`${user.firstName} ${user.lastName}`);
  const [senderPhone, setSenderPhone] = useState(user.phone);

  const numAmount = parseFloat(amountMXN) || 0;
  const commission = numAmount * COMMISSION_PERCENT;
  const totalDeduction = numAmount + commission;
  const amountHTG = numAmount * EXCHANGE_RATE;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalDeduction > user.balance) return alert('Saldo insuficiente para realizar esta transferencia (incluyendo comisión)');
    if (numAmount <= 0) return alert('Ingrese un monto válido');
    setStep(2);
  };

  const handleConfirm = () => {
    const tx: Partial<Transaction> = {
      type: 'Envío',
      service,
      amountMXN: numAmount,
      feeMXN: commission,
      totalMXN: totalDeduction,
      amountHTG,
      receiverName,
      receiverPhone,
      senderName,
      senderPhone,
    };
    onConfirm(tx);

    const message = `🚨 NUEVA TRANSFERENCIA SOLICITADA:\n\n👤 Remitente: ${senderName}\n📞 Tel: ${senderPhone}\n\n🇭🇹 Receptor: ${receiverName}\n📞 Tel: ${receiverPhone}\n🛠 Servicio: ${service}\n\n💰 Enviado: ${formatMXN(numAmount)}\n📈 Cambio: ${formatHTG(amountHTG)}\n📉 Comisión: ${formatMXN(commission)}\n💎 Total Deducido: ${formatMXN(totalDeduction)}\n\nPor favor procesa esta transacción.`;
    window.open(generateWhatsAppLink(ADMIN_WHATSAPP, message), '_blank');
  };

  if (step === 2) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Confirmar Transferencia</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500">Servicio:</span>
            <span className="font-bold text-blue-900">{service}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500">Receptor:</span>
            <div className="text-right">
              <p className="font-bold">{receiverName}</p>
              <p className="text-sm text-slate-400">{receiverPhone}</p>
            </div>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500">Monto a enviar:</span>
            <span className="font-bold">{formatMXN(numAmount)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-100 text-amber-600">
            <span className="text-slate-500">Comisión (6%):</span>
            <span className="font-bold">+{formatMXN(commission)}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-lg font-bold text-slate-800">Total a Pagar:</span>
            <span className="text-xl font-bold text-blue-900">{formatMXN(totalDeduction)}</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-emerald-800 font-medium">Recibe en Haití:</span>
              <span className="text-2xl font-bold text-emerald-600">{formatHTG(amountHTG)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Editar</button>
          <button onClick={handleConfirm} className="flex-2 py-3 px-8 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-800 shadow-lg shadow-blue-900/20">Confirmar Envío</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-blue-900 p-6 text-white">
        <h2 className="text-2xl font-bold">Enviar Dinero a Haití</h2>
        <p className="text-blue-200 text-sm mt-1">Llega en minutos vía NatCash o MonCash</p>
      </div>

      <form onSubmit={handleNext} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setService('NatCash')}
            className={`py-4 rounded-xl font-bold border-2 transition-all flex flex-col items-center ${
              service === 'NatCash' ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-slate-100 text-slate-400 grayscale hover:grayscale-0'
            }`}
          >
            <span className="text-lg">NatCash</span>
          </button>
          <button 
            type="button"
            onClick={() => setService('MonCash')}
            className={`py-4 rounded-xl font-bold border-2 transition-all flex flex-col items-center ${
              service === 'MonCash' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400 grayscale hover:grayscale-0'
            }`}
          >
            <span className="text-lg">MonCash</span>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Datos del Remitente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre</label>
              <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Teléfono</label>
              <input type="tel" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Datos del Receptor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre Completo</label>
              <input type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)} required placeholder="Como aparece en ID" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Teléfono (Haití)</label>
              <input type="tel" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} required placeholder="+509" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Monto a enviar (MXN)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                required
                value={amountMXN}
                onChange={e => setAmountMXN(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xl"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Saldo disponible: <span className="font-bold text-emerald-600">{formatMXN(user.balance)}</span></p>
          </div>

          <div className="flex flex-col space-y-2 border-t border-slate-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tasa de Cambio:</span>
              <span className="font-medium">1 MXN = {EXCHANGE_RATE} HTG</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Comisión de servicio (6%):</span>
              <span className="font-medium">{formatMXN(commission)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-slate-700">El receptor recibe:</span>
              <span className="text-2xl font-black text-emerald-600">{formatHTG(amountHTG)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button type="button" onClick={onCancel} className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
          <button type="submit" className="flex-2 py-3 px-8 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all">Siguiente</button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
