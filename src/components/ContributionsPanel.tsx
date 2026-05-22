/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, User, Trash2, Check, RefreshCw, Sparkles, DollarSign, HelpCircle, PenTool } from 'lucide-react';
import { WeeklyContributor } from '../types';

interface ContributionsPanelProps {
  contributors: WeeklyContributor[];
  onAddContributor: (name: string, weeklyAmount: number) => void;
  onUpdateContributor: (id: string, updated: Partial<WeeklyContributor>) => void;
  onDeleteContributor: (id: string) => void;
  totalPaidServices: number;
  monthlyBudgetGoal: number; // e.g. $19,800
}

export default function ContributionsPanel({
  contributors,
  onAddContributor,
  onUpdateContributor,
  onDeleteContributor,
  totalPaidServices,
  monthlyBudgetGoal
}: ContributionsPanelProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Calculate stats
  const getContributorMonthTotal = (c: WeeklyContributor) => {
    let weeksCount = 0;
    if (c.w1) weeksCount++;
    if (c.w2) weeksCount++;
    if (c.w3) weeksCount++;
    if (c.w4) weeksCount++;
    return c.weeklyAmount * weeksCount;
  };

  const totalContributed = contributors.reduce((sum, c) => sum + getContributorMonthTotal(c), 0);
  const remainingNeeded = monthlyBudgetGoal - totalContributed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    onAddContributor(name.trim(), parseFloat(amount) || 1000);
    setName('');
    setAmount('');
    setShowForm(false);
  };

  const handleToggleWeek = (id: string, week: 'w1' | 'w2' | 'w3' | 'w4', currentVal: boolean) => {
    onUpdateContributor(id, { [week]: !currentVal });
  };

  const handleStartEdit = (c: WeeklyContributor) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditAmount(c.weeklyAmount.toString());
  };

  const handleSave = (id: string) => {
    const val = parseFloat(editAmount);
    if (editName.trim() && !isNaN(val) && val >= 0) {
      onUpdateContributor(id, { name: editName.trim(), weeklyAmount: val });
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col h-full overflow-hidden relative group/panel">
      {/* Visual dynamic top indicator for modern vibey look */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500" />
      
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 font-sans tracking-tight">
            <span className="p-1 px-2.5 rounded-xl bg-violet-100 text-violet-700 text-sm font-black shadow-xs">💸</span>
            Abonos Semanales al Presupuesto
          </h2>
          <p className="text-stone-500 text-xs mt-0.5">Palomea las aportaciones de cada integrante por semana</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Nuevo Integrante
        </button>
      </div>

      {/* Main Budget Progress Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
        <div className="bg-gradient-to-br from-violet-50/50 to-white border border-violet-100 p-3.5 rounded-2xl">
          <span className="text-[10px] uppercase font-extrabold text-violet-600 tracking-wider block">Mes Recaudado</span>
          <span className="text-xl font-mono font-black text-violet-950 block mt-1">
            ${totalContributed.toLocaleString('es-MX')}
          </span>
          <span className="text-[10px] text-stone-500 block mt-1 font-sans">Suma de semanas marcadas</span>
        </div>

        <div className="bg-stone-50 border border-stone-200/60 p-3.5 rounded-2xl">
          <span className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider block">Meta Presupuesto</span>
          <span className="text-xl font-mono font-black text-stone-800 block mt-1">
            ${monthlyBudgetGoal.toLocaleString('es-MX')}
          </span>
          <span className="text-[10px] text-stone-500 block mt-1 font-sans">Meta editable arriba</span>
        </div>

        <div className={`p-4 rounded-2xl border ${remainingNeeded <= 0 ? 'bg-emerald-50/70 border-emerald-150 text-emerald-950' : 'bg-amber-50/60 border-amber-200 text-amber-950'}`}>
          <span className="text-[10px] uppercase font-extrabold tracking-wider block opacity-75">
            {remainingNeeded <= 0 ? '🎉 Meta Cubierta' : '⚖️ Faltante del Mes'}
          </span>
          <span className="text-xl font-mono font-black block mt-1">
            {remainingNeeded <= 0 ? '$0' : `-$${remainingNeeded.toLocaleString('es-MX')}`}
          </span>
          <span className="text-[10px] opacity-75 block mt-1 font-sans">
            {remainingNeeded <= 0 ? '¡Excelente organización familiar!' : 'Por aportar colectivamente'}
          </span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5 bg-gradient-to-b from-stone-50 to-stone-100 p-4 border border-stone-200/80 rounded-2xl space-y-3 animate-fade-in relative">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            👤 Registrar Nuevo Aportador
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                placeholder="Ej. Tío Alberto, Karla"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-violet-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Abono Semanal ($)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="Ej. 1200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-violet-400 font-mono font-bold"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-stone-200/60">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-1.5 border border-stone-200 hover:bg-stone-200 rounded-xl text-stone-600 text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              Añadir Integrante
            </button>
          </div>
        </form>
      )}

      {/* Week Interactive Table */}
      <div className="flex-1 overflow-x-auto min-w-full">
        {contributors.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs italic bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            No hay integrantes registrados en el abono semanal. ¡Añade uno arriba!
          </div>
        ) : (
          <table className="min-w-full divide-y divide-stone-200/80">
            <thead>
              <tr className="text-left text-[10px] font-extrabold text-stone-400 uppercase tracking-widest bg-stone-50/60">
                <th className="py-2.5 px-3 rounded-l-xl">Integrante</th>
                <th className="py-2.5 px-2 text-center">Sem 1</th>
                <th className="py-2.5 px-2 text-center">Sem 2</th>
                <th className="py-2.5 px-2 text-center">Sem 3</th>
                <th className="py-2.5 px-2 text-center">Sem 4</th>
                <th className="py-2.5 px-2 text-right">Monto Semanal</th>
                <th className="py-2.5 px-3 text-right">Aporte Mes</th>
                <th className="py-2.5 px-3 text-center rounded-r-xl w-36">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {contributors.map((c) => {
                const monthTotal = getContributorMonthTotal(c);
                const isEditing = editingId === c.id;
                return (
                  <tr key={c.id} className={`transition-colors ${isEditing ? 'bg-violet-50/40' : 'hover:bg-violet-50/20'}`}>
                    {/* Name */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1 px-1.5 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold">👤</span>
                        {isEditing ? (
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-white border-2 border-violet-400 focus:outline-none rounded-lg text-xs font-bold px-2 py-1 max-w-[140px]"
                            onKeyDown={(e) => e.key === 'Enter' && handleSave(c.id)}
                            autoFocus
                          />
                        ) : (
                          <span className="text-xs font-bold text-stone-900 block">{c.name}</span>
                        )}
                      </div>
                    </td>

                    {/* Week 1 */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleWeek(c.id, 'w1', c.w1)}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all cursor-pointer ${
                          c.w1 
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs' 
                            : 'border-stone-300 bg-white text-transparent hover:border-violet-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </td>

                    {/* Week 2 */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleWeek(c.id, 'w2', c.w2)}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all cursor-pointer ${
                          c.w2 
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs' 
                            : 'border-stone-300 bg-white text-transparent hover:border-violet-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </td>

                    {/* Week 3 */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleWeek(c.id, 'w3', c.w3)}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all cursor-pointer ${
                          c.w3 
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs' 
                            : 'border-stone-300 bg-white text-transparent hover:border-violet-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </td>

                    {/* Week 4 */}
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleWeek(c.id, 'w4', c.w4)}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all cursor-pointer ${
                          c.w4 
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs' 
                            : 'border-stone-300 bg-white text-transparent hover:border-violet-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </td>

                    {/* Weekly Amount */}
                    <td className="py-2.5 px-2 text-right">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span className="text-[10px] text-stone-400 font-mono">$</span>
                          <input
                            type="number"
                            required
                            min="0"
                            className="w-20 border-2 border-violet-400 font-mono font-bold text-center text-xs p-1 rounded-lg focus:outline-none"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave(c.id)}
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-stone-700">${c.weeklyAmount.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Month Contribution Total calculated dynamically */}
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                        ${monthTotal.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSave(c.id)}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] rounded-lg transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Guardar"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Ok</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(c)}
                              className="p-1 px-2 text-[10px] font-black tracking-wide bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg cursor-pointer transition flex items-center gap-1"
                              title="Editar integrante"
                            >
                              ✏️ <span className="hidden md:inline">Editar</span>
                            </button>
                             {deleteConfirmId === c.id ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteContributor(c.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="p-1 px-2 text-[10px] font-black tracking-wide bg-rose-600 text-white rounded-lg cursor-pointer transition flex items-center gap-1 animate-pulse"
                                title="Confirmar remoción"
                              >
                                ⚠️ <span>Confirmar</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirmId(c.id);
                                  setTimeout(() => {
                                    setDeleteConfirmId(prev => prev === c.id ? null : prev);
                                  }, 4000);
                                }}
                                className="p-1 px-2 text-[10px] font-black tracking-wide bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer transition flex items-center gap-1"
                                title="Eliminar integrante"
                              >
                                🗑️ <span className="hidden md:inline">Quitar</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
