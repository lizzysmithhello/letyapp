/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, Minus, Target, Sparkles, TrendingUp, Calendar, Trash2, History, DollarSign } from 'lucide-react';
import { SavingsProgress } from '../types';

interface SavingsPanelProps {
  savings: SavingsProgress;
  onUpdateSavings: (amount: number) => void;
  onUpdateGoal: (goalName: string, goalAmount: number) => void;
}

interface WeeklySurplus {
  id: string;
  weekLabel: string; // e.g. "Semana 1", "Semana 2", etc.
  amount: number;
  date: string;
}

export default function SavingsPanel({
  savings,
  onUpdateSavings,
  onUpdateGoal,
}: SavingsPanelProps) {
  // Configured target inputs
  const [amountInput, setAmountInput] = useState('');
  const [goalNameInput, setGoalNameInput] = useState(savings.goalName);
  const [goalAmountInput, setGoalAmountInput] = useState(savings.goalAmount.toString());
  const [showConfig, setShowConfig] = useState(false);

  // Weekly surplus manual input states
  const [surplusWeek, setSurplusWeek] = useState('Semana 1');
  const [surplusAmountInput, setSurplusAmountInput] = useState('');

  // Weekly surpluses history from localStorage
  const [weeklySurpluses, setWeeklySurpluses] = useState<WeeklySurplus[]>(() => {
    const saved = localStorage.getItem('lety_weekly_surpluses_v2');
    return saved ? JSON.parse(saved) : [];
  });

  // Save leftovers state to localStorage dynamically
  useEffect(() => {
    localStorage.setItem('lety_weekly_surpluses_v2', JSON.stringify(weeklySurpluses));
  }, [weeklySurpluses]);

  const percent = Math.min(Math.round((savings.currentSavings / savings.goalAmount) * 100), 100);

  // Standard piggy bank deposit/withdraw
  const handleSavingsChange = (isAdd: boolean) => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) return;
    onUpdateSavings(isAdd ? val : -val);
    setAmountInput('');
  };

  // Adjust savings goal
  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(goalAmountInput);
    if (!goalNameInput.trim() || isNaN(limit) || limit <= 0) return;
    onUpdateGoal(goalNameInput.trim(), limit);
    setShowConfig(false);
  };

  // Add a weekly budget leftover manually
  const handleAddSurplusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(surplusAmountInput);
    if (isNaN(amt) || amt <= 0) return;

    const newSurplus: WeeklySurplus = {
      id: 'ws_' + Math.random().toString(36).substr(2, 9),
      weekLabel: surplusWeek,
      amount: amt,
      date: new Date().toLocaleDateString('es-MX', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setWeeklySurpluses(prev => [newSurplus, ...prev]);
    onUpdateSavings(amt);
    setSurplusAmountInput('');
  };

  // Remove a weekly budget leftover (un-saves it)
  const handleDeleteSurplus = (id: string, amount: number) => {
    setWeeklySurpluses(prev => prev.filter(item => item.id !== id));
    onUpdateSavings(-amount);
  };

  return (
    <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col h-full relative overflow-hidden group">
      {/* Dynamic top visual highlight strip */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-500" />

      {/* Main Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2 pt-2">
        <div>
          <h2 className="text-xl font-extrabold text-stone-950 flex items-center gap-2 font-sans tracking-tight">
            <span className="p-1.5 px-3 rounded-2xl bg-rose-100 text-rose-600 text-base font-black shadow-xs">🐷</span>
            Alcancía de Ahorros Familiar
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">Fondo de reserva colectiva, emergencias y sobrantes de presupuesto</p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-3.5 py-1.5 rounded-xl border-2 border-stone-150 bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-stone-100 transition-all active:scale-95"
        >
          <Target className="w-4 h-4 text-rose-500" />
          Configurar Meta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Piggy Bank Target Progress */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-amber-50/10 border-2 border-amber-100/50 p-5 rounded-2xl flex flex-col justify-center relative overflow-hidden shadow-xs">
            {/* Ambient visual background element */}
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
              <PiggyBank className="w-40 h-40 text-amber-550" />
            </div>

            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block mb-1">
              🎯 Meta Activa de la Casa
            </span>
            <h3 className="text-sm font-black text-rose-950 pr-8 leading-snug mb-3">
              {savings.goalName}
            </h3>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-3xl font-mono font-black text-rose-700">
                ${savings.currentSavings.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-stone-400 font-mono text-xs font-semibold">
                de ${savings.goalAmount.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
              </span>
            </div>

            {/* Progress bar and percentages */}
            <div className="mt-3">
              <div className="flex justify-between items-center text-xs text-stone-600 font-bold mb-1.5">
                <span>Progreso total</span>
                <span className="font-mono text-rose-600 font-black bg-rose-50 px-2 py-0.5 rounded-lg">{percent}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-3 border border-stone-300/30 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-700 relative"
                  style={{ width: `${percent}%` }}
                >
                  {percent > 5 && (
                    <div className="absolute inset-y-0 right-1.5 flex items-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] font-medium text-stone-600 font-serif mt-4 bg-white/75 p-3 rounded-xl border border-stone-150 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {percent >= 100 
                  ? '🎉 ¡Enhorabuena! Han alcanzado la meta querida de la familia. Es momento de festejar.' 
                  : `Faltan solo $${(savings.goalAmount - savings.currentSavings).toLocaleString('es-MX')} pesos para completar nuestro objetivo.`}
              </span>
            </p>
          </div>

          {/* Setup active goal pop-form */}
          {showConfig && (
            <div className="animate-fade-in bg-stone-50 border-2 border-stone-200 p-4 rounded-xl space-y-3 relative">
              <h4 className="text-xs font-black text-stone-900 uppercase tracking-wider">Modificar Meta de Ahorro</h4>
              <form onSubmit={handleConfigSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">¿Qué estamos ahorrando?</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Fondo para vacaciones familiares"
                    value={goalNameInput}
                    onChange={(e) => setGoalNameInput(e.target.value)}
                    className="w-full text-xs border border-stone-250 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-450 font-medium text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-1">Monto Objetivo ($ MXN)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="Ej. 18000"
                    value={goalAmountInput}
                    onChange={(e) => setGoalAmountInput(e.target.value)}
                    className="w-full text-xs border border-stone-250 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-450 font-mono font-bold text-stone-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="px-3.5 py-1.5 border border-stone-200 hover:bg-stone-200 rounded-xl text-stone-600 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Deposits and Manual Weekly leftover handling */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* SECTION 1: MANUALLY DEPOSIT WEEKLY LEFTOVER */}
          <div className="bg-gradient-to-br from-indigo-50/20 to-white p-5 rounded-2xl border-2 border-indigo-100 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                Abonar Sobrante de Presupuesto
              </h3>
              <p className="text-[11px] text-stone-500 mb-4 font-sans leading-relaxed">
                ¿Sobró dinero de la despensa o servicios esta semana? Regístralo de forma manual para ingresarlo a la alcancía.
              </p>
            </div>

            <form onSubmit={handleAddSurplusSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Semana Correspondiente</label>
                  <select
                    value={surplusWeek}
                    onChange={(e) => setSurplusWeek(e.target.value)}
                    className="w-full text-xs font-bold border border-stone-250 rounded-xl px-2.5 py-2.5 bg-white text-stone-800 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Semana 1">Semana 1</option>
                    <option value="Semana 2">Semana 2</option>
                    <option value="Semana 3">Semana 3</option>
                    <option value="Semana 4">Semana 4</option>
                    <option value="Otro / Extra">Otro / Extra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Sobrante ($ MXN)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      placeholder="Ej. 450"
                      value={surplusAmountInput}
                      onChange={(e) => setSurplusAmountInput(e.target.value)}
                      className="w-full text-xs font-mono font-bold border border-stone-250 rounded-xl pl-6 pr-3 py-2.5 bg-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:shadow-indigo-100 transition-all active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Guardar Sobrante en Ahorros
              </button>
            </form>
          </div>

          {/* SECTION 2: REGULAR DEPOSIT / WITHDRAW */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col gap-3">
            <div>
              <h4 className="text-[11px] font-black text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Minus className="w-3.5 h-3.5 text-stone-500" />
                Retirar / Ajustar Manualmente
              </h4>
              <p className="text-[10px] text-stone-450 mt-0.5">Retira efectivo de la reserva para cubrir una emergencia imprevista.</p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Monto"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full text-xs font-mono font-bold border border-stone-250 rounded-xl pl-6 pr-3 py-2 bg-white text-stone-850"
                />
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSavingsChange(false)}
                  className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold shrink-0 transition"
                  title="Retirar de los ahorros familiares"
                >
                  Retirar
                </button>
                <button
                  type="button"
                  onClick={() => handleSavingsChange(true)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition"
                  title="Inyectar a ahorros generales"
                >
                  Depositar
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER SECTION: SAVED LEFT-OVERS HISTORY AUDIT TRAIL */}
      <div className="mt-8 pt-6 border-t-2 border-stone-100">
        <h3 className="text-xs font-black uppercase text-stone-450 tracking-widest mb-4 flex items-center gap-1.5">
          <History className="w-4 h-4 text-stone-400" />
          Historial de Sobrantes Ahorrados
        </h3>

        {weeklySurpluses.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs italic bg-stone-50/55 rounded-2xl border border-dashed border-stone-200">
            Aún no se han registrado sobrantes manuales este mes. Usa el formulario de arriba para guardar los primeros.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weeklySurpluses.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/70 hover:bg-white hover:border-stone-300 transition-all duration-150 animate-fade-in group/item"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850 flex items-center gap-1.5">
                      {item.weekLabel}
                      <span className="text-[10px] font-normal text-stone-400 font-serif">({item.date.split(',')[0]})</span>
                    </h4>
                    <span className="font-mono text-xs font-bold text-stone-650">+${item.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿Quitar el sobrante de $${item.amount} de ${item.weekLabel} y restarlo de la alcancía?`)) {
                      handleDeleteSurplus(item.id, item.amount);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition flex items-center gap-1"
                  title="Eliminar este sobrante (restará del total)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
