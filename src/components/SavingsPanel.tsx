/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Minus, 
  Target, 
  Sparkles, 
  Calendar, 
  Trash2, 
  History, 
  DollarSign, 
  Archive, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Layers,
  TrendingUp,
  Droplet
} from 'lucide-react';
import { SavingsProgress, WeeklySurplus, MonthlyArchive } from '../types';

interface SavingsPanelProps {
  savings: SavingsProgress;
  onUpdateSavings: (amount: number) => void;
  onUpdateGoal: (goalName: string, goalAmount: number) => void;
  // Lifted state & Monthly close props
  weeklySurpluses: WeeklySurplus[];
  onAddSurplus: (weekLabel: string, amount: number) => void;
  onDeleteSurplus: (id: string, amount: number) => void;
  monthlyArchives: MonthlyArchive[];
  onArchiveCurrentMonth: (customLabel: string) => void;
  onDeleteArchive: (id: string) => void;
}

export default function SavingsPanel({
  savings,
  onUpdateSavings,
  onUpdateGoal,
  weeklySurpluses,
  onAddSurplus,
  onDeleteSurplus,
  monthlyArchives,
  onArchiveCurrentMonth,
  onDeleteArchive
}: SavingsPanelProps) {
  // Configured target inputs
  const [amountInput, setAmountInput] = useState('');
  const [goalNameInput, setGoalNameInput] = useState(savings.goalName);
  const [goalAmountInput, setGoalAmountInput] = useState(savings.goalAmount.toString());
  const [showConfig, setShowConfig] = useState(false);

  // Weekly surplus manual input states
  const [surplusWeek, setSurplusWeek] = useState('Semana 1');
  const [surplusAmountInput, setSurplusAmountInput] = useState('');

  // Expandable archive detail state (tracks archive ID)
  const [expandedArchiveId, setExpandedArchiveId] = useState<string | null>(null);

  // Manual Month closing state
  const [showManualClose, setShowManualClose] = useState(false);
  const [manualMonthYearLabel, setManualMonthYearLabel] = useState('');

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

    onAddSurplus(surplusWeek, amt);
    setSurplusAmountInput('');
  };

  // Trigger manual archive close-out
  const handleManualArchiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMonthYearLabel.trim()) return;
    
    onArchiveCurrentMonth(manualMonthYearLabel.trim());
    setManualMonthYearLabel('');
    setShowManualClose(false);
  };

  const getSpanishMonthYearDefault = () => {
    const monthsNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const d = new Date();
    return `${monthsNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  const openQuickClose = () => {
    setManualMonthYearLabel(getSpanishMonthYearDefault());
    setShowManualClose(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ----------------- SAVINGS CARD SECTION ----------------- */}
      <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col relative overflow-hidden group">
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

          <div className="flex items-center gap-2">
            <button
              onClick={openQuickClose}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 border-2 border-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100/70 transition-all active:scale-95"
              title="Hacer corte manual y archivar mes actual"
            >
              <Archive className="w-4 h-4 text-indigo-600" />
              Corte del Mes
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-1.5 rounded-xl border-2 border-stone-150 bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-stone-100 transition-all active:scale-95"
            >
              <Target className="w-4 h-4 text-rose-500" />
              Configurar Meta
            </button>
          </div>
        </div>

        {/* POPUP FOR MANUALLY CLOSING THE MONTH */}
        {showManualClose && (
          <div className="mb-6 p-5 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-2 border-indigo-200 rounded-2xl animate-fade-in relative space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-extrabold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide">
                  <span>🗓️ Archivar y Reiniciar Mes</span>
                </h3>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Esto guardará una copia de seguridad en el historial y reiniciará los abonos semanales, agua y servicios en ceros para el siguiente ciclo.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowManualClose(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualArchiveSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-indigo-900 mb-1">Nombre o Período del Mes</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mayo 2026"
                    value={manualMonthYearLabel}
                    onChange={(e) => setManualMonthYearLabel(e.target.value)}
                    className="flex-1 text-xs border border-indigo-250 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-indigo-550 font-bold text-indigo-950"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 rounded-xl shadow-xs cursor-pointer transition-all duration-150 active:scale-95"
                  >
                    Confirmar Corte
                  </button>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold mt-1 inline-block">
                  ⚠️ Nota: La alcancía acumulativa NO se borrará; solo se archivará su progreso actual.
                </span>
              </div>
            </form>
          </div>
        )}

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
                      placeholder="Ej. 15000"
                      value={goalAmountInput}
                      onChange={(e) => setGoalAmountInput(e.target.value)}
                      className="w-full text-xs border border-stone-250 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-450 font-mono font-bold text-stone-800"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1 font-bold">
                    <button
                      type="button"
                      onClick={() => setShowConfig(false)}
                      className="px-3.5 py-1.5 border border-stone-200 hover:bg-stone-200 rounded-xl text-stone-600 text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs cursor-pointer"
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
                <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5 mb-1 animate-pulse">
                  <DollarSign className="w-4 h-4 text-indigo-600" />
                  Abonar Sobrante de Presupuesto
                </h3>
                <p className="text-[11px] text-stone-500 mb-4 font-sans leading-relaxed">
                  ¿Sobró dinero de la despensa o servicios esta semana? Regístralo aquí manualmente para inyectarlo en directo a la alcancía.
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

                <div className="flex gap-1.5 font-bold">
                  <button
                    type="button"
                    onClick={() => handleSavingsChange(false)}
                    className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs shrink-0 transition"
                    title="Retirar de los ahorros familiares"
                  >
                    Retirar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavingsChange(true)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs shrink-0 transition"
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
            Historial de Sobrantes Ahorrados (Semanales)
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
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/70 hover:bg-white hover:border-stone-300 transition-all duration-150 group/item"
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
                        onDeleteSurplus(item.id, item.amount);
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

      {/* ----------------- HISTORIAL MENSUAL ARCHIVE VIEW ----------------- */}
      <div className="bg-stone-50 border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col relative overflow-hidden">
        <div className="mb-5 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2 font-sans tracking-tight">
              <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700 text-sm font-black shadow-xs">📁</span>
              Histórico de Cortes Mensuales
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">Evolución, ahorros y cumplimiento mes con mes</p>
          </div>
          
          <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50/70 border border-indigo-100 px-3 py-1 rounded-full">
            {monthlyArchives.length} {monthlyArchives.length === 1 ? 'corte registrado' : 'cortes registrados'}
          </span>
        </div>

        {monthlyArchives.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-2xl border-2 border-dashed border-stone-200">
            <Archive className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-xs font-bold text-stone-700 mb-1">Ningún corte guardado todavía</h3>
            <p className="text-[11px] text-stone-500 max-w-md mx-auto leading-normal">
              Al finalizar cada mes, las cuentas familiares se archivarán aquí automáticamente o mediante el botón <strong>"Corte del Mes"</strong> situado arriba. Esto reiniciará las listas semanales para un nuevo período.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {monthlyArchives.map((archive) => {
              const isExpanded = expandedArchiveId === archive.id;
              
              // Count paid services vs total
              const paidServicesCount = archive.servicesSnap.filter(s => s.isPaid).length;
              const totalServicesCount = archive.servicesSnap.length;

              return (
                <div 
                  key={archive.id}
                  className="bg-white border-2 border-stone-150 rounded-2xl overflow-hidden transition-all duration-200 hover:border-stone-300 block"
                >
                  {/* Collapsed view header */}
                  <div 
                    onClick={() => setExpandedArchiveId(isExpanded ? null : archive.id)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-stone-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-600 font-bold text-xs uppercase shadow-2xs font-sans">
                        📆
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-stone-900 tracking-tight">
                          {archive.monthLabel}
                        </h4>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          Archivado el {archive.archivedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-5">
                      {/* High-level metrics */}
                      <div className="hidden sm:flex flex-col text-right">
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Ahorro Sobrante</span>
                        <span className="text-xs font-mono font-black text-indigo-600">
                          +${archive.weeklySurplusesTotal.toLocaleString('es-MX')}
                        </span>
                      </div>

                      <div className="hidden sm:flex flex-col text-right">
                        <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Aporte Familiar</span>
                        <span className="text-xs font-mono font-black text-emerald-600">
                          ${archive.totalContributorsPaid.toLocaleString('es-MX')}
                        </span>
                      </div>

                      {/* Expand indicator and delete */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`¿Seguro que quieres borrar permanentemente del historial el mes de "${archive.monthLabel}"?`)) {
                              onDeleteArchive(archive.id);
                            }
                          }}
                          className="p-1 px-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Eliminar este mes archivado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-stone-450 p-1 bg-stone-50 rounded-lg group-hover:bg-stone-100">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail section */}
                  {isExpanded && (
                    <div className="p-5 border-t border-stone-100 bg-stone-50/20 space-y-4 animate-fade-in text-xs">
                      {/* Metric widgets */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-center">
                          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Ingreso del Mes</span>
                          <span className="text-sm font-mono font-black text-stone-850">
                            ${archive.monthlyIncome.toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-center">
                          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Abonos Integrantes</span>
                          <span className="text-sm font-mono font-black text-emerald-700">
                            ${archive.totalContributorsPaid.toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-center">
                          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Servicios Pagados</span>
                          <span className="text-sm font-mono font-black text-amber-700">
                            ${archive.totalServicesPaid.toLocaleString('es-MX')}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-center">
                          <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest">Renta Recaudada</span>
                          <span className="text-sm font-mono font-black text-stone-800">
                            ${archive.rentCollected.toLocaleString('es-MX')}
                          </span>
                        </div>
                      </div>

                      {/* Side details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Services snaps list */}
                        <div className="bg-white p-3 rounded-xl border border-stone-150 space-y-2">
                          <h5 className="font-extrabold text-[10px] text-stone-450 uppercase tracking-widest">Estado de Recibos</h5>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {archive.servicesSnap.map((service, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1 border-b border-stone-50 last:border-0">
                                <span className="font-semibold text-stone-800">{service.name}</span>
                                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                  <span className="font-bold text-stone-500">${service.amount}</span>
                                  {service.isPaid ? (
                                    <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold font-sans text-[8px] uppercase">PAGADO</span>
                                  ) : (
                                    <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold font-sans text-[8px] uppercase">PENDIENTE</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Contributors snaps list */}
                        <div className="bg-white p-3 rounded-xl border border-stone-150 space-y-2">
                          <h5 className="font-extrabold text-[10px] text-stone-450 uppercase tracking-widest">Presupuestos Semanales</h5>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {archive.contributorsSnap.length === 0 ? (
                              <span className="text-stone-400 italic block py-2">Sin integrantes asignados</span>
                            ) : (
                              archive.contributorsSnap.map((c, idx) => {
                                let weeksPaid = 0;
                                if (c.w1) weeksPaid++;
                                if (c.w2) weeksPaid++;
                                if (c.w3) weeksPaid++;
                                if (c.w4) weeksPaid++;
                                return (
                                  <div key={idx} className="flex items-center justify-between py-0.5 border-b border-stone-50 last:border-0">
                                    <div>
                                      <span className="font-bold text-stone-800 block leading-tight">{c.name}</span>
                                      <span className="text-[9px] text-stone-450">Cuota: ${c.weeklyAmount}/semana</span>
                                    </div>
                                    <span className="font-bold font-mono text-[11px] text-stone-605 bg-stone-50 px-2 py-1 rounded-lg">
                                      {weeksPaid} de 4 semanas
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional minor details banner */}
                      <div className="flex gap-4 items-center bg-stone-100/60 p-2.5 rounded-xl border border-stone-200/50 text-[10px] text-stone-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-blue-500" />
                          <span>Vasos de agua Abuela: <strong>{archive.grandmaWaterGlasses}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PiggyBank className="w-3.5 h-3.5 text-purple-500" />
                          <span>Acumulado de alcancía al archivar: <strong>${archive.savingsSnapshot.toLocaleString('es-MX')}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          <span>Sobrantes del mes inyectados: <strong>${archive.weeklySurplusesTotal.toLocaleString('es-MX')}</strong></span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
