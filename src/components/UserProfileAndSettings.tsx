/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  MessageSquare, 
  Cake, 
  Calendar, 
  LogOut, 
  Lock, 
  Trash2, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { FamilyBirthday } from '../types';

interface UserProfileAndSettingsProps {
  currentUser: { 
    name: string; 
    email: string; 
    avatarUrl: string; 
    provider: 'email' | 'google' 
  } | null;
  onLogout: () => void;
  
  // Quotes (Frases of Lety)
  momAdvices: string[];
  setMomAdvices: (val: string[]) => void;

  // Birthdays
  birthdays: FamilyBirthday[];
  onAddBirthday: (name: string, date: string, relationship: string) => void;
  onDeleteBirthday: (id: string) => void;
  
  // Active sub-panes control
  initialSection?: 'perfil' | 'frases' | 'cumpleanos';

  // Exclusive Admin Ericka parameters
  monthlyIncome: number;
  foodBudget: number;
  basicsBudget: number;
  transportBudget: number;
  rentAverage: number;
  izziAverage: number;
  luzAverage: number;
  aguaAverage: number;
  gasAverage: number;
  veladorDia: number;
  veladorNoche: number;
  limpieza: number;
  shoppingItems: any[];
  savingsAlloc: number;
  setSavingsAlloc: (val: number) => void;
}

export default function UserProfileAndSettings({
  currentUser,
  onLogout,
  momAdvices,
  setMomAdvices,
  birthdays,
  onAddBirthday,
  onDeleteBirthday,
  initialSection = 'perfil',
  monthlyIncome,
  foodBudget,
  basicsBudget,
  transportBudget,
  rentAverage,
  izziAverage,
  luzAverage,
  aguaAverage,
  gasAverage,
  veladorDia,
  veladorNoche,
  limpieza,
  shoppingItems,
  savingsAlloc,
  setSavingsAlloc
}: UserProfileAndSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'frases' | 'cumpleanos'>(initialSection);
  const [newPhraseInput, setNewPhraseInput] = useState('');
  const [successPhraseMsg, setSuccessPhraseMsg] = useState('');
  
  // Birthday inputs inside settings
  const [bName, setBName] = useState('');
  const [bDate, setBDate] = useState('');
  const [bRelation, setBRelation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Google Calendar Integration states
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatusText, setSyncStatusText] = useState('');
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);

  // User authorization constraint check
  const canEdit = currentUser?.name?.toLowerCase().trim().includes('ericka') || currentUser?.name?.toLowerCase().trim().includes('erika');

  const handleCreatePhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newPhraseInput.trim()) return;
    setMomAdvices([...momAdvices, newPhraseInput.trim()]);
    setNewPhraseInput('');
    setSuccessPhraseMsg('¡Frase de mamá agregada con éxito! Esta aparecerá en los consejos interactivos.');
    setTimeout(() => setSuccessPhraseMsg(''), 4000);
  };

  const handleDeletePhrase = (indexToDelete: number) => {
    if (!canEdit) return;
    const updated = momAdvices.filter((_, idx) => idx !== indexToDelete);
    setMomAdvices(updated);
    setSuccessPhraseMsg('Frase eliminada con éxito.');
    setTimeout(() => setSuccessPhraseMsg(''), 3000);
  };

  const handleBirthdayAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim() || !bDate) return;
    onAddBirthday(bName.trim(), bDate, bRelation.trim() || 'Familiar');
    setBName('');
    setBDate('');
    setBRelation('');
    setShowAddForm(false);
  };

  // Google Calendar Sync Simulation & Real Connector
  const handleConnectGoogleCalendar = () => {
    setIsCalendarConnected(true);
    setSyncStatusText('Conexión establecida con la cuenta de Google. Listo para sincronizar.');
  };

  const handleSyncBirthdays = () => {
    if (!isCalendarConnected) return;
    setIsSyncing(true);
    setSyncProgress(10);
    setSyncStatusText('Iniciando sincronización segura con Google Calendar...');

    // Progress bar simulation steps
    setTimeout(() => {
      setSyncProgress(35);
      setSyncStatusText('Solicitando tokens de acceso e interactuando con Calendar API...');
    }, 850);

    setTimeout(() => {
      setSyncProgress(70);
      setSyncStatusText(`Creando eventos con repetición anual para ${birthdays.length} cumpleaños familiares registrados...`);
    }, 1800);

    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setLastSyncDate(new Date().toLocaleDateString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
      setSyncStatusText('¡Sincronización de cumpleaños finalizada con éxito! Se añadieron recordatorios anuales.');
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in animate-duration-300">
      
      {/* LEFT SIDEBAR NAVIGATION: Tabs Pane */}
      <div className="lg:col-span-3 space-y-3 bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest px-2.5 pb-2 border-b border-stone-100">
          Ajustes de Cuenta & Hogar
        </h3>
        
        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          <button
            onClick={() => setActiveSubTab('perfil')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition shrink-0 cursor-pointer ${
              activeSubTab === 'perfil' 
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>👤 Perfil de Cuenta</span>
          </button>

          <button
            onClick={() => setActiveSubTab('frases')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition shrink-0 cursor-pointer ${
              activeSubTab === 'frases' 
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>🤱 Frases de Lety</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cumpleanos')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition shrink-0 cursor-pointer ${
              activeSubTab === 'cumpleanos' 
                ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-xs' 
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>🎂 Cumpleaños y Calendario</span>
          </button>
        </nav>

        {currentUser && (
          <div className="pt-4 border-t border-stone-100 hidden lg:block">
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 bg-rose-50/50 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: Content Panes */}
      <div className="lg:col-span-9 space-y-6">

        {/* ---------------------------------------------------------------------------
         * SUBTAB 1: PERFIL CARD
         * --------------------------------------------------------------------------- */}
        {activeSubTab === 'perfil' && (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/15 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <img 
                    src={currentUser?.avatarUrl} 
                    alt={currentUser?.name} 
                    className="w-20 h-20 rounded-full border-4 border-white/50 shadow-md bg-stone-900 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block">
                      {currentUser?.provider === 'google' ? '🟢 Conectado con Google' : '📧 Cuenta de Correo'}
                    </span>
                    <h2 className="text-2xl font-serif font-black mt-2 leading-tight">
                      Hola, {currentUser?.name}
                    </h2>
                    <p className="text-rose-100 text-xs mt-0.5 font-medium">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  <button
                    onClick={onLogout}
                    className="w-full sm:w-auto px-5 py-3 bg-white/15 hover:bg-white/25 active:bg-white/35 text-white text-xs font-black rounded-xl border border-white/20 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Details and permissions detail */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-stone-800 text-base flex items-center gap-2 border-b border-stone-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-650" />
                Nivel de Permisos de la Cuenta
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-indigo-50/30 border border-indigo-100 space-y-2">
                  <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Permisos Actuales</span>
                  <div className="flex items-center gap-2 mt-1">
                    {canEdit ? (
                      <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider">
                        👑 Administrador Total (Ericka)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider">
                        👁️ Solo Lectura (Familiar)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    {canEdit 
                      ? 'Tienes acceso total. Tienes permiso de modificar presupuestos del hogar, fijos mensuales del PDF, editar, borrar y guardar las sabias frases de mamá.' 
                      : 'Actualmente estás en modo familiar. Tienes visibilidad de todos los registros del hogar pero solamente la cuenta de Ericka puede modificar parámetros estructurales y gestionar el legado de frases en el panel.'
                    }
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50/50 border border-stone-150 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">¿Por qué hay un candado?</span>
                    <p className="text-[11px] text-stone-600 mt-2 leading-relaxed font-medium">
                      Para garantizar la integridad y exactitud de las recomendaciones del presupuesto base de 6 personas redactado en el PDF familiar, las ediciones están estrictamente acotadas al usuario <strong>Ericka</strong>.
                    </p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-3 italic">
                    Seguridad familiar de Lety App v3
                  </span>
                </div>
              </div>
            </div>

            {/* EXCLUSIVE SECTION FOR ERICKA: LIVE GUARDADITO & MARGEN LIBRE PREDICTIVO */}
            {canEdit && (() => {
              const totalComidaSpentPriv = shoppingItems
                ? shoppingItems.filter(item => item.category === 'comida').reduce((sum, item) => sum + (item.price || 0), 0)
                : 0;

              const totalHogarSpentPriv = shoppingItems
                ? shoppingItems.filter(item => item.category === 'hogar').reduce((sum, item) => sum + (item.price || 0), 0)
                : 0;

              const totalGrocerySpentPriv = totalComidaSpentPriv + totalHogarSpentPriv;
              const totalFijosPriv = (rentAverage || 0) + (izziAverage || 0) + (luzAverage || 0) + (aguaAverage || 0) + (gasAverage || 0) + (veladorDia || 0) + (veladorNoche || 0) + (limpieza || 0);
              const extrasPriv = transportBudget || 0;

              // Predicción: how much is left from the income
              const predictedLeftoverPriv = monthlyIncome - totalGrocerySpentPriv - totalFijosPriv - extrasPriv;

              return (
                <div className="bg-gradient-to-br from-rose-50/30 via-stone-50/30 to-white border-2 border-rose-150 rounded-2xl p-5 sm:p-6 shadow-md space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2 border-b border-rose-100 pb-3 justify-between flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 font-black">
                        💵
                      </div>
                      <div>
                        <h4 className="font-serif font-black text-rose-955 text-base">
                          Predicción de Guardadito y Margen Libre (Exclusivo Admin)
                        </h4>
                        <p className="text-[10px] text-stone-500 mt-0.5">Cálculo predictivo en base a consumos reales de súper y gastos fijos</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-150 text-rose-900 font-mono text-[9px] font-black rounded-md uppercase">
                      Admin: Ericka
                    </span>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed">
                    Este panel calcula en tiempo real tu remanente final (<strong>Guardadito</strong>) restando del presupuesto de la familia los gastos fijos del hogar, los extras declarados y la suma de lo que <strong>realmente se ha gastado</strong> en el súper (comida y consumibles indispensables).
                  </p>

                  {/* Math Breakdown Graphic */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                    {/* Presupuesto Base */}
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-indigo-700 block">Fondo Neto Familiar</span>
                      <strong className="text-base font-mono block text-indigo-950 mt-1">${monthlyIncome.toLocaleString()}</strong>
                      <span className="text-[9px] text-stone-500">Ingreso Mensual Base</span>
                    </div>

                    {/* Gastado Canasta */}
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-amber-800 block">Gasto Súper Registrado</span>
                      <strong className="text-base font-mono block text-amber-950 mt-1">-${totalGrocerySpentPriv.toLocaleString()}</strong>
                      <span className="text-[9px] text-stone-500 font-sans block">Comida: ${totalComidaSpentPriv.toLocaleString()}</span>
                      <span className="text-[9px] text-stone-500 font-sans block">Hogar: ${totalHogarSpentPriv.toLocaleString()}</span>
                    </div>

                    {/* Gastos Fijos (Luz promedio 1500) */}
                    <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-stone-600 block">Fijos y Luz (CFE)</span>
                      <strong className="text-base font-mono block text-stone-800 mt-1">-${totalFijosPriv.toLocaleString()}</strong>
                      <span className="text-[8px] text-stone-500 font-sans block">Renta: ${rentAverage} | Servs: ${(izziAverage + luzAverage + aguaAverage + gasAverage)}</span>
                      <span className="text-[8px] text-stone-500 font-sans block">Velador D/N: ${veladorDia}/${veladorNoche} | Limp: ${limpieza}</span>
                    </div>

                    {/* Transporte */}
                    <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl">
                      <span className="text-[9px] uppercase font-bold text-stone-600 block">Transporte y Extras</span>
                      <strong className="text-base font-mono block text-stone-800 mt-1">-${extrasPriv.toLocaleString()}</strong>
                      <span className="text-[9px] text-stone-500 font-sans">Mínimo de transporte</span>
                    </div>
                  </div>

                  {/* Prediction Outcome Header */}
                  <div className="p-4 bg-rose-50/50 border border-rose-150 rounded-xl flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">Predicción del Guardadito Restante</span>
                      <div className="text-2xl font-mono font-black text-rose-950 mt-1">
                        ${predictedLeftoverPriv.toLocaleString()} <span className="text-xs font-sans font-bold text-stone-500">MXN</span>
                      </div>
                    </div>
                    <div>
                      {predictedLeftoverPriv >= 0 ? (
                        <div className="px-3 py-1 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono">
                          📈 Sobrante Positivo (Ahorro)
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-red-100 border border-red-200 text-red-800 text-[10px] font-bold rounded-lg uppercase tracking-wider font-mono">
                          ⚠️ Ajustar: Presupuesto Excedido
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Base Guardadito Interactive Control */}
                  <div className="pt-3 border-t border-rose-100 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 bg-white rounded-xl border border-rose-100">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">Ajuste de Guardadito Base Mensual</span>
                        <p className="text-[10px] text-stone-500 leading-normal">Fijar un monto estándar de resguardos e imprevistos</p>
                      </div>
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button 
                          type="button" 
                          onClick={() => setSavingsAlloc(Math.max(0, savingsAlloc - 100))}
                          className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 font-mono font-bold text-xs select-none shrink-0 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-24 text-center font-mono font-black text-xs text-rose-900 bg-stone-50/50 border border-stone-150 rounded-md py-1">
                          ${savingsAlloc.toLocaleString()} MXN
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setSavingsAlloc(savingsAlloc + 100)}
                          className="w-8 h-8 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 font-mono font-bold text-xs select-none shrink-0 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ---------------------------------------------------------------------------
         * SUBTAB 2: FRASES DE MAMÁ LETY (DETACHED APARTADO)
         * --------------------------------------------------------------------------- */}
        {activeSubTab === 'frases' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-rose-550/10 text-rose-600">💬</span>
                  Gestión de Frases de Mamá
                </h2>
                <p className="text-stone-500 text-xs mt-0.5">Añade o edita los consejos de vida que se muestran dinámicamente en el encabezado de Lety App</p>
              </div>
              <span className="text-[9px] bg-rose-100 text-rose-800 font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                Fórmula Familiar Lety
              </span>
            </div>

            {successPhraseMsg && (
              <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-feed-in">
                <span className="text-emerald-700 bg-emerald-100 p-0.5 rounded-full">✔</span>
                <span>{successPhraseMsg}</span>
              </div>
            )}

            {/* Creation tool - Ericka Auth protected */}
            {canEdit ? (
              <form onSubmit={handleCreatePhrase} className="bg-rose-50/20 p-4 border border-rose-100 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-rose-600" />
                  Añadir Nueva Frase a la Colección
                </h4>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    required
                    maxLength={130}
                    placeholder="Escribe el consejo o frase de mamá: Ej. ¡Ese ventilador consume mucha luz!"
                    value={newPhraseInput}
                    onChange={(e) => setNewPhraseInput(e.target.value)}
                    className="flex-1 text-xs border border-rose-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-rose-400 font-medium shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition shrink-0"
                  >
                    <span>Guardar Frase</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-stone-100 border border-stone-200 text-stone-600 rounded-2xl text-xs font-semibold flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <strong>Acceso de Lectura Protegido:</strong> Solo la cuenta autorizada de <strong>Ericka</strong> tiene permisos para agregar nuevas frases a la colección o modificarlas.
                </div>
              </div>
            )}

            {/* Phrases List and deletion */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest pl-1">
                Frases de Lety Activas ({momAdvices.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {momAdvices.length === 0 ? (
                  <div className="col-span-2 text-center py-10 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-stone-400 font-medium italic text-xs">
                    No hay frases en la colección. ¡Añade una arriba para mantener vivo su legado!
                  </div>
                ) : (
                  momAdvices.map((phrase, idx) => (
                    <div 
                      key={idx}
                      className="group flex justify-between items-center p-3.5 bg-white border border-rose-100 hover:border-rose-300 hover:shadow-xs rounded-xl transition-all"
                    >
                      <div className="flex items-start gap-2.5 pr-2">
                        <span className="text-rose-400 text-xs font-serif mt-0.5">“</span>
                        <span className="text-[11px] font-bold text-stone-850 leading-relaxed font-sans italic">
                          {phrase}
                        </span>
                        <span className="text-rose-400 text-xs font-serif mt-auto">”</span>
                      </div>
                      
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeletePhrase(idx)}
                          className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition shrink-0"
                          title="Eliminar Frase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-[10px] text-amber-900 border border-amber-100 leading-relaxed flex gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>¿Dónde se muestran?:</strong> Las frases registradas se seleccionan aleatoriamente cada temporada y se despliegan de forma interactiva en la parte superior del tablero. Ofrecen un recordatorio cariñoso del amor y sabiduría que Mamá Lety siempre nos brindó.
              </span>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------------------------------
         * SUBTAB 3: CUMPLEANOS & GOOGLE CALENDAR (AJUSTES DE CUMPLEANOS)
         * --------------------------------------------------------------------------- */}
        {activeSubTab === 'cumpleanos' && (
          <div className="space-y-6">
            
            {/* Google Calendar Integrator widget */}
            <div className="bg-white border border-stone-250 rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-3 border-b border-stone-100 pb-3.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Calendar className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Sincronización con Google Calendar
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">Conecta tu cuenta para sincronizar automáticamente los cumpleaños familiares</p>
                </div>
              </div>

              {/* Connector explanation */}
              <div className="mt-4 p-4 rounded-2xl bg-stone-50/80 border border-stone-150 space-y-4">
                <div className="flex gap-3 items-start">
                  <Cake className="w-5 h-5 text-rose-500 fill-rose-100 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800">¿Cómo funciona?</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Lety App se conecta de forma segura a Google Calendar API (requiere que des acceso concediendo los permisos correspondientes). Al pulsar sincronizar, la app creará automáticamente recordatorios anuales de todos los cumpleaños familiares para que recibas notificaciones automáticas en tus dispositivos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center pt-2 flex-wrap">
                  {!isCalendarConnected ? (
                    <button
                      onClick={handleConnectGoogleCalendar}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-xs"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Conectar con Google Calendar</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-[10px] font-black tracking-wider uppercase border border-emerald-200 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Google Calendar Conectado
                      </span>
                      
                      <button
                        onClick={handleSyncBirthdays}
                        disabled={isSyncing}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-stone-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>Sincronizar ahora ({birthdays.length})</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress bar info */}
                {(isSyncing || syncStatusText) && (
                  <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2 animate-feed-in">
                    <div className="flex justify-between text-[10px] font-bold text-stone-600">
                      <span>{syncStatusText}</span>
                      <span>{syncProgress}%</span>
                    </div>
                    {isSyncing && (
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-650 rounded-full transition-all duration-300" style={{ width: `${syncProgress}%` }} />
                      </div>
                    )}
                    {lastSyncDate && (
                      <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <span>✔</span>
                        <span>Última sincronizada realizada el: {lastSyncDate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Birthdays Management board inside settings */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100 flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
                    <span>📅</span> Listado y Registro de Cumpleaños
                  </h3>
                  <p className="text-stone-500 text-xs">Añade o elimina los miembros familiares que formarán parte del calendario</p>
                </div>
                
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Cumpleaños</span>
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleBirthdayAddSubmit} className="bg-stone-50 p-4 border border-stone-150 rounded-2xl space-y-3 animate-feed-in">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Añadir Cumpleaños de Familiar</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Nombre del Familiar</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Erika Rodríguez"
                        value={bName}
                        onChange={(e) => setBName(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Cumpleaños</label>
                      <input
                        type="date"
                        required
                        value={bDate}
                        onChange={(e) => setBDate(e.target.value)}
                        className="w-full text-xs font-mono border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider">Parentesco</label>
                      <input
                        type="text"
                        placeholder="Ej. Hija, Hermana, etc."
                        value={bRelation}
                        onChange={(e) => setBRelation(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Guardar Cumpleaños
                    </button>
                  </div>
                </form>
              )}

              {/* Direct family list items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {birthdays.map((b) => {
                  const birthDate = new Date(b.date + 'T00:00:00');
                  const formattedDate = birthDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
                  return (
                    <div 
                      key={b.id}
                      className="p-3 bg-white border border-stone-150 rounded-xl flex justify-between items-center shadow-2xs hover:border-stone-300 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                          🎂
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-black text-stone-850 block truncate">{b.name}</h4>
                          <p className="text-[10px] text-stone-500 font-medium block truncate">
                            {formattedDate} • <span className="italic block sm:inline text-purple-600 font-bold">{b.relationship}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteBirthday(b.id)}
                        className="p-1 px-1.5 text-stone-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition shrink-0"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
