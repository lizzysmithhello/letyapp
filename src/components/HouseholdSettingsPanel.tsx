/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Lock } from 'lucide-react';

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

  // Additional fixed expenses
  veladorDia: number;
  setVeladorDia: (val: number) => void;
  veladorNoche: number;
  setVeladorNoche: (val: number) => void;
  limpieza: number;
  setLimpieza: (val: number) => void;

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
  veladorDia,
  setVeladorDia,
  veladorNoche,
  setVeladorNoche,
  limpieza,
  setLimpieza,
  onResetDefaults,
  currentUser
}: HouseholdSettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const canEdit = currentUser?.email?.toLowerCase().trim() === 'inglizvera@gmail.com' || currentUser?.name?.toLowerCase().trim().includes('ericka') || currentUser?.name?.toLowerCase().trim().includes('erika');
  
  // Local state for temporary inputs
  const [tempGrName, setTempGrName] = useState(grandmaName);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [tempRent, setTempRent] = useState(rentAverage.toString());
  const [tempIzzi, setTempIzzi] = useState(izziAverage.toString());
  const [tempLuz, setTempLuz] = useState(luzAverage.toString());
  const [tempAgua, setTempAgua] = useState(aguaAverage.toString());
  const [tempGas, setTempGas] = useState(gasAverage.toString());
  const [tempVeladorDia, setTempVeladorDia] = useState(veladorDia.toString());
  const [tempVeladorNoche, setTempVeladorNoche] = useState(veladorNoche.toString());
  const [tempLimpieza, setTempLimpieza] = useState(limpieza.toString());
  const [tempFood, setTempFood] = useState(foodBudget.toString());
  const [tempBasics, setTempBasics] = useState(basicsBudget.toString());
  const [tempTransport, setTempTransport] = useState(transportBudget.toString());

  const handleStartEdit = () => {
    setTempGrName(grandmaName);
    setTempIncome(monthlyIncome.toString());
    setTempRent(rentAverage.toString());
    setTempIzzi(izziAverage.toString());
    setTempLuz(luzAverage.toString());
    setTempAgua(aguaAverage.toString());
    setTempGas(gasAverage.toString());
    setTempVeladorDia(veladorDia.toString());
    setTempVeladorNoche(veladorNoche.toString());
    setTempLimpieza(limpieza.toString());
    setTempFood(foodBudget.toString());
    setTempBasics(basicsBudget.toString());
    setTempTransport(transportBudget.toString());
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGrandmaName(tempGrName.trim() || 'Esperanza');
    setMonthlyIncome(parseFloat(tempIncome) || 19800);
    setRentAverage(parseFloat(tempRent) || 7500);
    setIzziAverage(parseFloat(tempIzzi) || 345);
    setLuzAverage(parseFloat(tempLuz) || 1500);
    setAguaAverage(parseFloat(tempAgua) || 400);
    setGasAverage(parseFloat(tempGas) || 333);
    setVeladorDia(parseFloat(tempVeladorDia) || 120);
    setVeladorNoche(parseFloat(tempVeladorNoche) || 120);
    setLimpieza(parseFloat(tempLimpieza) || 1200);
    setFoodBudget(parseFloat(tempFood) || 6200);
    setBasicsBudget(parseFloat(tempBasics) || 1200);
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
  const currVeladorDia = isEditing ? (parseFloat(tempVeladorDia) || 0) : veladorDia;
  const currVeladorNoche = isEditing ? (parseFloat(tempVeladorNoche) || 0) : veladorNoche;
  const currLimpieza = isEditing ? (parseFloat(tempLimpieza) || 0) : limpieza;

  const currFood = isEditing ? (parseFloat(tempFood) || 0) : foodBudget;
  const currBasics = isEditing ? (parseFloat(tempBasics) || 0) : basicsBudget;
  const currTransport = isEditing ? (parseFloat(tempTransport) || 0) : transportBudget;

  const totalHousingServices = currRent + currIzzi + currLuz + currAgua + currGas + currVeladorDia + currVeladorNoche + currLimpieza;

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

      {/* RADIOGRAPHY INTERFACE: REMOVED GUARDADITO CARD, COLUMNS RESIZED */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
      </div>

      {/* SINGLE COLUMN FOR CONFIG */}
      <div className="w-full">
        <div className="bg-stone-50/50 p-5 border border-stone-150 rounded-2xl">
          {!isEditing ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-extrabold text-[10px] uppercase text-stone-500 tracking-widest">
                  📋 Resumen General de Parámetros Fijos y Despensa
                </h4>
                <span className="text-stone-400 font-sans text-[10px] italic">
                  (El nombre de la abuela se gestiona desde el módulo correspondiente)
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Col 1: Canasta de Consumo */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2 flex-wrap">
                    <span className="p-1 px-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold font-mono">🧺</span>
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-stone-700">
                      Canasta de Consumo
                    </h4>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Alimentacion */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🍎</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Alimentación</span>
                          <span className="block text-[8px] text-stone-400">Canasta mensual (6 pers)</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${foodBudget.toLocaleString()}
                      </span>
                    </div>

                    {/* Basicos */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🧼</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Limpieza e Higiene</span>
                          <span className="block text-[8px] text-stone-400">Básicos del hogar</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${basicsBudget.toLocaleString()}
                      </span>
                    </div>

                    {/* Transporte */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🚌</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Transporte</span>
                          <span className="block text-[8px] text-stone-400">Movilidad mínima y extras</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${transportBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 2: Servicios Residenciales */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2 flex-wrap">
                    <span className="p-1 px-1.5 rounded-lg bg-sky-50 text-sky-600 text-xs font-bold font-mono font-sans">⚡</span>
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-stone-700">
                      Servicios de la Casa
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {/* Renta */}
                    <div className="flex items-center justify-between p-2 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🏠</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Renta de Casa</span>
                          <span className="block text-[8px] text-stone-400">Arrendamiento fijo</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${rentAverage.toLocaleString()}
                      </span>
                    </div>

                    {/* Izzi */}
                    <div className="flex items-center justify-between p-2 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🌐</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Internet / Izzi</span>
                          <span className="block text-[8px] text-stone-400">Cable banda ancha</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${izziAverage.toLocaleString()}
                      </span>
                    </div>

                    {/* Luz */}
                    <div className="flex items-center justify-between p-2 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">💡</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Luz Promedio</span>
                          <span className="block text-[8px] text-stone-400">CFE Bimestral prorrateada</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${luzAverage.toLocaleString()}
                      </span>
                    </div>

                    {/* Agua */}
                    <div className="flex items-center justify-between p-2 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">💧</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Agua Potable</span>
                          <span className="block text-[8px] text-stone-400">Servicio mensualizado</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${aguaAverage.toLocaleString()}
                      </span>
                    </div>

                    {/* Gas */}
                    <div className="flex items-center justify-between p-2 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🔥</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Gas L.P. promedio</span>
                          <span className="block text-[8px] text-stone-400">Cálculo promedio</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${gasAverage.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Col 3: Apoyo & Seguridad */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2 flex-wrap">
                    <span className="p-1 px-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold font-mono">🛡️</span>
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-stone-700">
                      Apoyos y Seguridad
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {/* Velador Día */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">☀️</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Velador Día</span>
                          <span className="block text-[8px] text-stone-400">Vigilancia diurna asignada</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${veladorDia.toLocaleString()}
                      </span>
                    </div>

                    {/* Velador Noche */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🌙</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Velador Noche</span>
                          <span className="block text-[8px] text-stone-400">Custodia nocturna fija</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${veladorNoche.toLocaleString()}
                      </span>
                    </div>

                    {/* Señora Limpieza */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50/70 border border-stone-100/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-base select-none">🧹</span>
                        <div>
                          <span className="block font-bold text-stone-800 text-[11px] leading-tight">Señora Limpieza</span>
                          <span className="block text-[8px] text-stone-400">Servicios e higiene hogar</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2 py-1 rounded-lg border border-stone-150">
                        ${limpieza.toLocaleString()}
                      </span>
                    </div>
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
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Velador Día fijo ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempVeladorDia}
                      onChange={(e) => setTempVeladorDia(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Velador Noche fijo ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempVeladorNoche}
                      onChange={(e) => setTempVeladorNoche(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-semibold mb-0.5">Señora Limpieza fija ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempLimpieza}
                      onChange={(e) => setTempLimpieza(e.target.value)}
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
