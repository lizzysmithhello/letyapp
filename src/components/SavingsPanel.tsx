/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PiggyBank, Plus, Minus, Target, Sparkles, TrendingUp } from 'lucide-react';
import { SavingsProgress } from '../types';

interface SavingsPanelProps {
  savings: SavingsProgress;
  onUpdateSavings: (amount: number) => void;
  onUpdateGoal: (goalName: string, goalAmount: number) => void;
}

export default function SavingsPanel({
  savings,
  onUpdateSavings,
  onUpdateGoal,
}: SavingsPanelProps) {
  const [amountInput, setAmountInput] = useState('');
  const [goalNameInput, setGoalNameInput] = useState(savings.goalName);
  const [goalAmountInput, setGoalAmountInput] = useState(savings.goalAmount.toString());
  const [showConfig, setShowConfig] = useState(false);

  const percent = Math.min(Math.round((savings.currentSavings / savings.goalAmount) * 100), 100);

  const handleSavingsChange = (isAdd: boolean) => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) return;
    onUpdateSavings(isAdd ? val : -val);
    setAmountInput('');
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(goalAmountInput);
    if (!goalNameInput.trim() || isNaN(limit) || limit <= 0) return;
    onUpdateGoal(goalNameInput.trim(), limit);
    setShowConfig(false);
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-rose-500" />
            Alcancía de Ahorros Familiar
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">La reserva secreta de la casa para metas y emergencias</p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-stone-100"
        >
          <Target className="w-3.5 h-3.5" />
          Configurar Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Dynamic visual Progress meter */}
        <div className="bg-amber-50/20 border border-amber-100/30 p-5 rounded-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-15">
            <PiggyBank className="w-32 h-32 text-amber-500" />
          </div>

          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1">Meta Activa: {savings.goalName}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-stone-800">
              ${savings.currentSavings.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
            </span>
            <span className="text-stone-400 font-mono text-sm">
              de ${savings.goalAmount.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
            </span>
          </div>

          {/* Progress bar and percentages */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs text-stone-500 font-semibold mb-1">
              <span>Progreso del Ahorro</span>
              <span className="font-mono text-amber-700 font-bold">{percent}% completado</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3">
              <div 
                className="bg-rose-500 h-3 rounded-full transition-all duration-500 flex justify-end pr-1 items-center"
                style={{ width: `${percent}%` }}
              >
                {percent > 10 && <div className="w-1 h-1 bg-white rounded-full animate-ping" />}
              </div>
            </div>
          </div>

          <p className="text-xs italic text-stone-600 font-serif mt-3 bg-white/60 p-2 rounded-xl border border-stone-200/30 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            {percent >= 100 
              ? '🎉 ¡Felicidades! Lograron la meta querida de la familia.' 
              : `Faltan $${(savings.goalAmount - savings.currentSavings).toLocaleString('es-MX', { minimumFractionDigits: 0 })} para completar. ¡Ayudémonos todos!`}
          </p>
        </div>

        {/* Action Controls for saving & editing goals */}
        <div className="space-y-4">
          {showConfig ? (
            <form onSubmit={handleConfigSubmit} className="bg-stone-50 border border-stone-150 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Modificar Meta de Ahorro</h4>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">¿Qué estamos ahorrando?</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fondo para vacaciones"
                  value={goalNameInput}
                  onChange={(e) => setGoalNameInput(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Monto Objetivo ($ MXN)</label>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="Ej. 10000"
                  value={goalAmountInput}
                  onChange={(e) => setGoalAmountInput(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-3 py-1 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cambiar Meta
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-200/50 space-y-3">
              <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Depositar / Retirar de la Alcancía
              </h4>
              <p className="text-stone-500 text-xs leading-relaxed">¿La alcancía familiar recibió dinero o pagaron una emergencia?</p>
              
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Monto $ MXN"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="flex-1 text-sm border border-stone-250 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-300 text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSavingsChange(false)}
                  className="py-2 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="Retirar de los ahorros familiares"
                >
                  <Minus className="w-3.5 h-3.5" />
                  Retirar Dinero
                </button>
                <button
                  onClick={() => handleSavingsChange(true)}
                  className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition shadow-xs"
                  title="Guardar en ahorros"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Mandar Ahorro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
