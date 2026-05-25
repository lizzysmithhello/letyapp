/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, AlertTriangle, Clock, CheckCircle, Plus, Receipt, Trash2, ShieldAlert } from 'lucide-react';
import { ServicePayment } from '../types';

interface ServicesPanelProps {
  services: ServicePayment[];
  onAddService: (name: string, amount: number, dueDate: string) => void;
  onToggleServicePaid: (id: string) => void;
  onToggleServiceWeek?: (id: string, week: 1 | 2 | 3 | 4) => void;
  onDeleteService: (id: string) => void;
  isAdmin?: boolean;
}

const isWeeklyService = (name: string) => {
  const norm = name?.toLowerCase() || '';
  return norm.includes('velador') || norm.includes('limpieza');
};

export default function ServicesPanel({
  services,
  onAddService,
  onToggleServicePaid,
  onToggleServiceWeek,
  onDeleteService,
  isAdmin = false
}: ServicesPanelProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Hardcoded reference system today from environment metadata: May 21, 2026
  const REFERENCE_TODAY_STR = '2026-05-21';
  const systemToday = new Date(REFERENCE_TODAY_STR + 'T00:00:00');

  const getServiceStatus = (service: ServicePayment) => {
    if (service.isPaid) {
      return {
        key: 'paid',
        label: '¡Pagado!',
        bgColor: 'bg-emerald-50 border-emerald-200/50 text-emerald-800',
        badgeColor: 'bg-emerald-600',
        message: `Pagado con éxito el ${service.paymentDate ? new Date(service.paymentDate + 'T00:00:00').toLocaleDateString('es-MX', {day: 'numeric', month: 'short'}) : 'tiempo'}`,
        iconColor: 'text-emerald-500'
      };
    }

    const due = new Date(service.dueDate + 'T00:00:00');
    // Calculate difference in whole days
    const timeDiff = due.getTime() - systemToday.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));

    if (diffDays < 0) {
      return {
        key: 'overdue',
        label: '🚨 Atrasado',
        bgColor: 'bg-rose-50 border-rose-200/70 text-rose-900',
        badgeColor: 'bg-rose-600',
        message: `¡Se pasó de fecha por ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'día' : 'días'}! Pagar de inmediato.`,
        iconColor: 'text-rose-600'
      };
    } else if (diffDays === 0) {
      return {
        key: 'today',
        label: '⏰ Toca hoy',
        bgColor: 'bg-amber-100/70 border-amber-300 text-amber-900 animate-pulse',
        badgeColor: 'bg-amber-600',
        message: '¡El pago vence HOY mismo! Preparar fondos.',
        iconColor: 'text-amber-600'
      };
    } else if (diffDays === 1) {
      return {
        key: 'tomorrow',
        label: '🔔 Alarma: Mañana',
        bgColor: 'bg-orange-50 border-orange-200 text-orange-900',
        badgeColor: 'bg-orange-500',
        message: 'Vence mañana. ¿Ya tienes listo el abono grupal?',
        iconColor: 'text-orange-500'
      };
    } else {
      return {
        key: 'pending',
        label: `En ${diffDays} días`,
        bgColor: 'bg-stone-50 border-stone-200/50 text-stone-700',
        badgeColor: 'bg-stone-500',
        message: `Vence el ${due.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}`,
        iconColor: 'text-stone-400'
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!name.trim() || !amount || !dueDate) return;
    onAddService(name, parseFloat(amount), dueDate);
    setName('');
    setAmount('');
    setDueDate('');
    setShowForm(false);
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-500/80" />
            Control de Pago de Servicios
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">Control de fechas límites, alertas mecánicas y cobros</p>
        </div>
        
        {isAdmin ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 rounded-xl border border-rose-100 hover:border-rose-200 bg-rose-50 hover:bg-rose-100/70 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Nuevo Servicio
          </button>
        ) : (
          <div className="text-stone-500 bg-stone-50 border border-stone-150 text-[10px] font-bold py-1 px-2.5 rounded-lg">
            <span>🔒 Solo Ericka edita servicios</span>
          </div>
        )}
      </div>

      <div className="text-stone-500 text-[11px] mb-4 bg-amber-50/50 border border-amber-200/40 p-2 rounded-xl flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Calendario Activo: Hoy es <strong className="font-semibold text-stone-700">21 de Mayo de 2026</strong>. El sistema activa alarmas automáticas un día antes y el día correspondiente.</span>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 bg-stone-50 p-4 border border-stone-100 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Añadir Nuevo Servicio por Pagar</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-stone-600 mb-1">Nombre</label>
              <input
                type="text"
                required
                placeholder="Ej. Gas LP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Monto ($ MXN)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="Ej. 350"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Fecha de pago/vencimiento</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              Guardar Servicio
            </button>
          </div>
        </form>
      )}

      {/* Services List Display */}
      <div className="flex-1 overflow-y-auto max-h-[320px] space-y-3 pr-1">
        {services.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm italic">
            No se han registrado servicios para pagar. Presiona "Nuevo Servicio" arriba.
          </div>
        ) : (
          services.map((service) => {
            const status = getServiceStatus(service);
            return (
              <div
                key={service.id}
                className={`group border rounded-2xl p-4 transition-all relative overflow-hidden ${status.bgColor}`}
              >
                {/* Visual marker bar side */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${status.badgeColor}`} />

                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3">
                    {/* Paid toggle checkbox button */}
                    <button
                      onClick={() => isAdmin && onToggleServicePaid(service.id)}
                      className={`mt-1 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        isAdmin ? 'cursor-pointer hover:border-emerald-500' : 'cursor-not-allowed opacity-60'
                      } ${
                        service.isPaid 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-stone-400 bg-white text-transparent'
                      }`}
                      title={!isAdmin ? "Solo lectura" : (service.isPaid ? "Marcar como pendiente" : "Marcar como pagado")}
                    >
                      <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-semibold tracking-tight ${service.isPaid ? 'line-through text-stone-600' : 'text-stone-800'}`}>
                          {service.name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${status.badgeColor} text-white uppercase tracking-wider`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs mt-1.5 flex-wrap">
                        <span className="font-mono font-bold text-stone-800 tracking-tight text-sm">
                          ${service.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>

                        <span className="text-stone-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          Vence: {new Date(service.dueDate + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-stone-600 italic mt-2 font-serif flex items-center gap-1 bg-white/40 p-1 px-2 rounded-lg border border-stone-200/20">
                        <span>💬</span>
                        {status.message}
                      </p>

                      {isWeeklyService(service.name) && (
                        <div className="mt-3 pt-3 border-t border-stone-200/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1">
                              📅 Pagos Semanales (1/4 total cada uno)
                            </span>
                            <span className="text-[9px] bg-rose-100 text-rose-900 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                              Pagado: {
                                [service.w1, service.w2, service.w3, service.w4].filter(Boolean).length
                              } / 4
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((wk) => {
                              const isWkPaid = !!service[`w${wk}` as 'w1' | 'w2' | 'w3' | 'w4'];
                              const wkAmount = service.amount / 4;
                              return (
                                <button
                                  key={wk}
                                  type="button"
                                  onClick={() => isAdmin && onToggleServiceWeek?.(service.id, wk as 1 | 2 | 3 | 4)}
                                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                    isAdmin ? 'cursor-pointer hover:scale-102 active:scale-98' : 'cursor-not-allowed opacity-75'
                                  } ${
                                    isWkPaid
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                                  }`}
                                  title={!isAdmin ? "Solo lectura (Solo Ericka edita)" : `Marcar pago de semana ${wk}`}
                                >
                                  <span className="text-[9px] font-bold text-stone-500 uppercase">Semana {wk}</span>
                                  <span className="text-[11px] font-mono font-bold mt-0.5">${wkAmount.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</span>
                                  <div className={`mt-1.5 w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                                    isWkPaid ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 bg-white'
                                  }`}>
                                    {isWkPaid && (
                                      <svg className="w-2.5 h-2.5 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => onDeleteService(service.id)}
                      className="p-1 px-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-100/30 shrink-0 transition cursor-pointer"
                      title="Eliminar este servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
