/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, RefreshCw, CheckCircle, Lock } from 'lucide-react';

interface HouseholdSettingsPanelProps {
  grandmaName: string;
  setGrandmaName: (val: string) => void;
  monthlyIncome: number;
  setMonthlyIncome: (val: number) => void;
  
  // Categories budget
  foodBudget: number;
  setFoodBudget: (val: number) => void;
  basicsBudget: number;
  setBasicsBudget: (val: number) => void;
  savingsAlloc: number;
  setSavingsAlloc: (val: number) => void;
  transportBudget: number;
  setTransportBudget: (val: number) => void;

  // Services averages
  rentAverage: number;
  setRentAverage: (val: number) => void;
  izziAverage: number;
  setIzziAverage: (val: number) => void;
  luzAverage: number;
  setLuzAverage: (val: number) => void;
  aguaAverage: number;
  setAguaAverage: (val: number) => void;
  gasAverage: number;
  setGasAverage: (val: number) => void;

  onResetDefaults: () => void;
  currentUser?: { name: string; email: string; avatarUrl: string; provider: 'email' | 'google' } | null;
}

export default function HouseholdSettingsPanel({
  grandmaName,
  setGrandmaName,
  monthlyIncome,
  setMonthlyIncome,
  foodBudget,
  setFoodBudget,
  basicsBudget,
  setBasicsBudget,
  savingsAlloc,
  setSavingsAlloc,
  transportBudget,
  setTransportBudget,
  rentAverage,
  setRentAverage,
  izziAverage,
  setIzziAverage,
  luzAverage,
  setLuzAverage,
  aguaAverage,
  setAguaAverage,
  gasAverage,
  setGasAverage,
  onResetDefaults,
  currentUser
}: HouseholdSettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const canEdit = currentUser?.name?.toLowerCase().trim().includes('ericka') || currentUser?.name?.toLowerCase().trim().includes('erika');
  
  // Local state for temporary inputs
  const [tempGrName, setTempGrName] = useState(grandmaName);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [tempRent, setTempRent] = useState(rentAverage.toString());
  const [tempIzzi, setTempIzzi] = useState(izziAverage.toString());
  const [tempLuz, setTempLuz] = useState(luzAverage.toString());
  const [tempAgua, setTempAgua] = useState(aguaAverage.toString());
  const [tempGas, setTempGas] = useState(gasAverage.toString());
  const [tempFood, setTempFood] = useState(foodBudget.toString());
  const [tempBasics, setTempBasics] = useState(basicsBudget.toString());
  const [tempSavings, setTempSavings] = useState(savingsAlloc.toString());
  const [tempTransport, setTempTransport] = useState(transportBudget.toString());

  const handleStartEdit = () => {
    setTempGrName(grandmaName);
    setTempIncome(monthlyIncome.toString());
    setTempRent(rentAverage.toString());
    setTempIzzi(izziAverage.toString());
    setTempLuz(luzAverage.toString());
    setTempAgua(aguaAverage.toString());
    setTempGas(gasAverage.toString());
    setTempFood(foodBudget.toString());
    setTempBasics(basicsBudget.toString());
    setTempSavings(savingsAlloc.toString());
    setTempTransport(transportBudget.toString());
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGrandmaName(tempGrName.trim() || 'Esperanza');
    setMonthlyIncome(parseFloat(tempIncome) || 19800);
    setRentAverage(parseFloat(tempRent) || 7500);
    setIzziAverage(parseFloat(tempIzzi) || 345);
    setLuzAverage(parseFloat(tempLuz) || 750);
    setAguaAverage(parseFloat(tempAgua) || 400);
    setGasAverage(parseFloat(tempGas) || 333);
    setFoodBudget(parseFloat(tempFood) || 6200);
    setBasicsBudget(parseFloat(tempBasics) || 1200);
    setSavingsAlloc(parseFloat(tempSavings) || 1500);
    setTransportBudget(parseFloat(tempTransport) || 1000);
    
    setIsEditing(false);
    setSuccessMsg('¡Parámetros del presupuesto familiar guardados con éxito!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetClick = () => {
    if (window.confirm('¿Reestablecer los parámetros recomendados del PDF de 6 personas?')) {
      onResetDefaults();
      setIsEditing(false);
      setSuccessMsg('Valores reestablecidos a la recomendación recomendada del PDF.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Live Math calculations
  const currIncome = isEditing ? (parseFloat(tempIncome) || 0) : monthlyIncome;
  const currRent = isEditing ? (parseFloat(tempRent) || 0) : rentAverage;
  const currIzzi = isEditing ? (parseFloat(tempIzzi) || 0) : izziAverage;
  const currLuz = isEditing ? (parseFloat(tempLuz) || 0) : luzAverage;
  const currAgua = isEditing ? (parseFloat(tempAgua) || 0) : aguaAverage;
  const currGas = isEditing ? (parseFloat(tempGas) || 0) : gasAverage;

  const currFood = isEditing ? (parseFloat(tempFood) || 0) : foodBudget;
  const currBasics = isEditing ? (parseFloat(tempBasics) || 0) : basicsBudget;
  const currSavings = isEditing ? (parseFloat(tempSavings) || 0) : savingsAlloc;
  const currTransport = isEditing ? (parseFloat(tempTransport) || 0) : transportBudget;

  const totalHousingServices = currRent + currIzzi + currLuz + currAgua + currGas;
  const leftoverForGuardadito = currIncome - currFood - totalHousingServices - currBasics - currTransport;

  return (
    <div className="bg-white border-2 border-stone-150 rounded-3xl p-5 sm:p-6 shadow-md mb-6 relative overflow-hidden">
      {/* Decorative modern border */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500" />

      <div className="flex justify-between items-center mb-5 flex-wrap gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 shadow-xs">
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              ⚙️ Configurador de Parámetros del Hogar
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Define los presupuestos base, reparaciones y fijos de casa</p>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit ? (
            !isEditing ? (
              <button
                onClick={handleStartEdit}
                className="px-3.5 py-1.5 text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl border border-violet-100 transition duration-150 cursor-pointer flex items-center gap-1.5"
              >
                📝 Editar Parámetros
              </button>
            ) : (
              <button
                onClick={handleResetClick}
                type="button"
                className="px-2.5 py-1.5 text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-200 transition duration-150 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reestablecer
              </button>
            )
          ) : (
            <div className="px-3 py-1.5 text-xs font-bold bg-stone-100/80 text-stone-600 rounded-xl border border-stone-200 flex items-center gap-1.5 shadow-3sx select-none">
              <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Solo Ericka puede editar</span>
            </div>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 bg-emerald-50 border border-emerald-150 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-feed-in">
          <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">✔</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* NEW RADIOGRAPHY INTERFACE: EXACTLY AS REQUESTED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total presupuesto al mes */}
        <div className="p-4 bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-150 rounded-2xl">
          <span className="text-[10px] uppercase font-black text-indigo-500 tracking-wider">Total Presupuesto Mes</span>
          <div className="text-xl font-mono font-black text-indigo-950 mt-1">
            ${currIncome.toLocaleString()} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
          </div>
          <p className="text-[10px] text-stone-500 mt-1 font-sans">Monto ingresado por la familia</p>
        </div>

        {/* Card 2: Total despensa familiar 6 personas */}
        <div className="p-4 bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-150 rounded-2xl">
          <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Total Despensa 6 Personas</span>
          <div className="text-xl font-mono font-black text-emerald-950 mt-1">
            -${currFood.toLocaleString()} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
          </div>
          <p className="text-[10px] text-stone-500 mt-1 font-sans">Presupuesto asignado para comida y leche</p>
        </div>

        {/* Card 3: Total para servicios */}
        <div className="p-4 bg-gradient-to-br from-amber-50/50 to-white border border-amber-200 rounded-2xl">
          <span className="text-[10px] uppercase font-black text-amber-700 tracking-wider">Total para Servicios</span>
          <div className="text-xl font-mono font-black text-stone-900 mt-1">
            -${totalHousingServices.toLocaleString()} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
          </div>
          <p className="text-[10px] text-stone-500 mt-1 font-sans">Renta, internet, luz, agua y gas L.P.</p>
        </div>

        {/* Card 4: Margen libre para el guardadito */}
        <div className={`p-4 border rounded-2xl ${leftoverForGuardadito >= 0 ? 'bg-gradient-to-br from-rose-50/60 to-white border-rose-200' : 'bg-red-50/80 border-red-200'}`}>
          <span className="text-[10px] uppercase font-black text-rose-600 tracking-wider">Guardadito y Margen Libre</span>
          <div className="text-xl font-mono font-black text-rose-950 mt-1">
            ${leftoverForGuardadito.toLocaleString()} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
          </div>
          <p className="text-[10px] text-stone-500 mt-1 font-sans">
            {leftoverForGuardadito >= 0 
              ? '✅ Sobrante listo para el cochinito' 
              : '⚠️ Ajustar: Presupuesto en desborde'}
          </p>
        </div>
      </div>

      {/* SINGLE COLUMN FOR CONFIG */}
      <div className="w-full">
        <div className="bg-stone-50/50 p-5 border border-stone-150 rounded-2xl">
          {!isEditing ? (
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-[10px] uppercase text-stone-400 tracking-widest border-b border-stone-200 pb-2 flex justify-between">
                <span>Canasta Básica y Fijos del PDF</span>
                <span className="text-stone-500 font-sans italic not-case font-normal lowercase">(Nombre de abuela se gestiona en su módulo)</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Alimentación Mensual (6 personas):</span>
                    <strong className="text-stone-850 font-mono">${foodBudget.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Básicos del hogar / Limpieza:</span>
                    <strong className="text-stone-850 font-mono">${basicsBudget.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Guardadito para imprevistos / emergencias:</span>
                    <strong className="text-emerald-700 font-mono">${savingsAlloc.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-500 font-medium">Transporte y extras mínimos:</span>
                    <strong className="text-stone-850 font-mono">${transportBudget.toLocaleString()} MXN</strong>
                  </div>
                </div>

                <div className="space-y-2.5 border-t md:border-t-0 md:border-l md:pl-6 border-stone-100 pt-3 md:pt-0">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium font-sans">Renta Mensual Fija Vivienda:</span>
                    <strong className="text-stone-850 font-mono">${rentAverage.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Internet / Cable Izzi:</span>
                    <strong className="text-stone-850 font-mono">${izziAverage.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Luz Promedio (CFE Bimestral prorrateada):</span>
                    <strong className="text-stone-850 font-mono">${luzAverage.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-500 font-medium">Agua Potable (Prorrateada al mes):</span>
                    <strong className="text-stone-850 font-mono">${aguaAverage.toLocaleString()} MXN</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-500 font-medium">Gas L.P. promedio mensual:</span>
                    <strong className="text-stone-850 font-mono">${gasAverage.toLocaleString()} MXN</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider border-b border-indigo-100 pb-1.5">
                ✏️ Editar Parámetros Recomendados de Presupuestos
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bloque 1 */}
                <div className="space-y-3 p-3 bg-stone-100/40 rounded-xl border border-stone-100">
                  <h5 className="font-black text-[9px] uppercase text-stone-400 tracking-wider">Ingresos y Estructura</h5>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Nombre de la Abuela</label>
                    <input
                      type="text"
                      required
                      value={tempGrName}
                      onChange={(e) => setTempGrName(e.target.value)}
                      className="w-full text-xs font-medium border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Presupuesto Ingresado Mensual ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempIncome}
                      onChange={(e) => setTempIncome(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                </div>

                {/* Bloque 2 */}
                <div className="space-y-3 p-3 bg-stone-100/40 rounded-xl border border-stone-100">
                  <h5 className="font-black text-[9px] uppercase text-stone-400 tracking-wider">Canasta de Gastos ($)</h5>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Alimentación Mensual (6p)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempFood}
                      onChange={(e) => setTempFood(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Básicos de limpieza</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempBasics}
                      onChange={(e) => setTempBasics(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Guardadito imprevistos</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempSavings}
                      onChange={(e) => setTempSavings(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white font-bold text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Transporte y extras mínimos</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempTransport}
                      onChange={(e) => setTempTransport(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                </div>

                {/* Bloque 3 */}
                <div className="space-y-3 p-3 bg-stone-100/40 rounded-xl border border-stone-100">
                  <h5 className="font-black text-[9px] uppercase text-stone-400 tracking-wider">Servicios Vivienda ($)</h5>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Renta Fija Mensual</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempRent}
                      onChange={(e) => setTempRent(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Internet Izzi</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempIzzi}
                      onChange={(e) => setTempIzzi(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Luz (Bimestral promedio)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempLuz}
                      onChange={(e) => setTempLuz(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Agua (Bimestral promedio)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempAgua}
                      onChange={(e) => setTempAgua(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Gas L.P. promedio</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempGas}
                      onChange={(e) => setTempGas(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2.5 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl text-stone-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
