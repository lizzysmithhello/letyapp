/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Check, Info, Coins, ShieldCheck, CheckSquare, Square } from 'lucide-react';

interface RentStates {
  israel: boolean;
  ericka: boolean;
  grandma: boolean;
}

interface RentPanelProps {
  rentStates: RentStates;
  onToggleRent: (person: 'israel' | 'ericka' | 'grandma') => void;
  monthlyBudgetGoal: number;
}

export default function RentPanel({
  rentStates,
  onToggleRent,
  monthlyBudgetGoal
}: RentPanelProps) {
  const amountPerPerson = 2500;
  const totalRentGoal = 7500;

  // Calculate dynamic sum
  let paidCount = 0;
  if (rentStates.israel) paidCount++;
  if (rentStates.ericka) paidCount++;
  if (rentStates.grandma) paidCount++;

  const totalCollected = paidCount * amountPerPerson;
  const isFullyPaid = paidCount === 3;

  return (
    <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col h-full relative overflow-hidden group">
      {/* Top beautiful layout line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-emerald-600" />
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-stone-950 flex items-center gap-2 font-sans tracking-tight">
          <span className="p-1 px-2.5 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-black shadow-xs">🏠</span>
          Pago de Renta
        </h2>
        <p className="text-stone-500 text-xs mt-0.5">Control individual de la renta del hogar</p>
      </div>

      {/* Info Badge: part of the 19800 monthly */}
      <div className="mb-5 bg-emerald-50/70 border border-emerald-100/80 rounded-2xl p-3 flex gap-2 text-emerald-905 items-start">
        <Info className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-[11px] font-bold text-emerald-900 leading-tight">
            Presupuesto Integrado
          </p>
          <p className="text-[10px] text-emerald-805 leading-normal">
            Estos montos (<strong className="font-extrabold">${totalRentGoal.toLocaleString('es-MX')}</strong> total) <strong>también forman parte</strong> de los <span className="font-bold">${monthlyBudgetGoal.toLocaleString('es-MX')}</span> mensuales del presupuesto familiar.
          </p>
        </div>
      </div>

      {/* Progress dial */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-center">
          <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">Recaudado</span>
          <span className="text-lg font-mono font-black text-emerald-700">
            ${totalCollected.toLocaleString('es-MX')}
          </span>
          <span className="block text-[8px] text-stone-400">de ${totalRentGoal.toLocaleString('es-MX')}</span>
        </div>

        <div className={`border rounded-xl p-3 text-center flex flex-col justify-center items-center font-bold ${
          isFullyPaid 
            ? 'bg-emerald-100/50 border-emerald-300 text-emerald-805' 
            : 'bg-amber-50/50 border-amber-200 text-amber-800'
        }`}>
          <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-wider">Estado</span>
          {isFullyPaid ? (
            <span className="text-xs font-black flex items-center gap-1 mt-0.5 text-emerald-700 tracking-tight">
              🎉 ¡Completada!
            </span>
          ) : (
            <span className="text-xs font-black flex items-center gap-1 mt-0.5 text-amber-700 tracking-tight animate-pulse">
              ⏳ Pendiente
            </span>
          )}
          <span className="block text-[8px] text-stone-400 font-normal">{paidCount} de 3 listos</span>
        </div>
      </div>

      {/* Detailed Checkboxes */}
      <div className="space-y-3 flex-1">
        <span className="block text-[10px] uppercase font-extrabold text-stone-400 tracking-wider">
          Aportes Individuales
        </span>

        {/* Israel */}
        <div 
          onClick={() => onToggleRent('israel')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
            rentStates.israel 
              ? 'bg-emerald-50/30 border-emerald-300 hover:border-emerald-400' 
              : 'bg-stone-50/50 border-stone-200/70 hover:bg-white hover:border-stone-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">🧔</span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Israel</h4>
              <p className="text-[10px] text-stone-500 font-mono font-medium">Cuota: $2,500.00</p>
            </div>
          </div>
          
          <button
            type="button"
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              rentStates.israel 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                : 'bg-white border-stone-300 text-transparent hover:border-emerald-500'
            }`}
            aria-label="Marcar pago Israel"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Ericka */}
        <div 
          onClick={() => onToggleRent('ericka')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
            rentStates.ericka 
              ? 'bg-emerald-50/30 border-emerald-300 hover:border-emerald-400' 
              : 'bg-stone-50/50 border-stone-200/70 hover:bg-white hover:border-stone-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">👩‍🦰</span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Ericka</h4>
              <p className="text-[10px] text-stone-500 font-mono font-medium">Cuota: $2,500.00</p>
            </div>
          </div>
          
          <button
            type="button"
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              rentStates.ericka 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                : 'bg-white border-stone-300 text-transparent hover:border-emerald-500'
            }`}
            aria-label="Marcar pago Ericka"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Abuela Esperanza */}
        <div 
          onClick={() => onToggleRent('grandma')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
            rentStates.grandma 
              ? 'bg-emerald-50/30 border-emerald-300 hover:border-emerald-400' 
              : 'bg-stone-50/50 border-stone-200/70 hover:bg-white hover:border-stone-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">👵</span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Abuela Esperanza</h4>
              <p className="text-[10px] text-stone-500 font-mono font-medium">Cuota: $2,500.00</p>
            </div>
          </div>
          
          <button
            type="button"
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              rentStates.grandma 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                : 'bg-white border-stone-300 text-transparent hover:border-emerald-500'
            }`}
            aria-label="Marcar pago Abuela"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

      </div>

      {/* General completed feedback alert */}
      {isFullyPaid && (
        <div className="mt-4 bg-emerald-50 border border-emerald-250 p-2.5 rounded-xl text-emerald-800 text-[10px] font-medium leading-tight flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-605 shrink-0" />
          <span>¡Todos los aportes a la renta mensual han sido verificados con éxito!</span>
        </div>
      )}
    </div>
  );
}
