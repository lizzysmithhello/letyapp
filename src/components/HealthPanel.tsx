/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Calendar, 
  Activity, 
  Check, 
  PlusCircle, 
  Sparkles, 
  Clock, 
  Trash2, 
  Droplet, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  FileText, 
  AlertTriangle,
  Stethoscope,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { Medicine, BloodPressureReading, IsssteAppointment } from '../types';

interface HealthPanelProps {
  medicines: Medicine[];
  bloodPressureReadings: BloodPressureReading[];
  onAddMedicine: (name: string, dose: string, frequency: string, timeOfDay: 'Mañana' | 'Tarde' | 'Noche' | 'Personalizado', notes: string) => void;
  onDeleteMedicine: (id: string) => void;
  onAddReading: (period: 'AM' | 'PM', systolic: number, diastolic: number, pulse: number, notes: string) => void;
  onDeleteReading: (id: string) => void;
  grandmaName?: string;
  glassCount: number;
  onSetGlassCount: React.Dispatch<React.SetStateAction<number>>;
  appointments: IsssteAppointment[];
  onAddAppointment: (date: string, time: string, specialty: string, doctor: string, notes?: string) => void;
  onToggleAppointment: (id: string) => void;
  onDeleteAppointment: (id: string) => void;
  isAdmin?: boolean;
}

type HealthSubTab = 'tension' | 'medicamentos' | 'citas';

export default function HealthPanel({
  medicines,
  bloodPressureReadings,
  onAddMedicine,
  onDeleteMedicine,
  onAddReading,
  onDeleteReading,
  grandmaName = 'Esperanza',
  glassCount,
  onSetGlassCount,
  appointments = [],
  onAddAppointment,
  onToggleAppointment,
  onDeleteAppointment,
  isAdmin = false,
}: HealthPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<HealthSubTab>('medicamentos');

  // Medicine form state
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medTime, setMedTime] = useState<'Mañana' | 'Tarde' | 'Noche' | 'Personalizado'>('Mañana');
  const [medNotes, setMedNotes] = useState('');
  const [showMedForm, setShowMedForm] = useState(false);

  // Blood pressure form state
  const [bpPeriod, setBpPeriod] = useState<'AM' | 'PM'>('AM');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [bpPulse, setBpPulse] = useState('');
  const [bpNotes, setBpNotes] = useState('');
  const [showBpForm, setShowBpForm] = useState(false);

  // ISSSTE Appointment form state
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptSpecialty, setApptSpecialty] = useState('');
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptNotes, setApptNotes] = useState('');
  const [showApptForm, setShowApptForm] = useState(false);

  const getPressureDiagnosis = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) {
      return {
        label: 'Hipertensión Fase 2',
        color: 'bg-rose-100 border-rose-300 text-rose-800',
        alert: true,
        desc: '⚠️ Presión MUY ALTA. Repetir en 5 min, si sigue alta, llama a urgencias o a su médico de cabecera.'
      };
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return {
        label: 'Hipertensión Fase 1',
        color: 'bg-orange-100 border-orange-200 text-orange-800',
        alert: false,
        desc: 'Presión alta. Procura reposo de sal por hoy y vigila molestias.'
      };
    } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
      return {
        label: 'Presión Elevada',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        alert: false,
        desc: 'Ligeramente elevada, mantén vigilancia continua.'
      };
    } else {
      return {
        label: 'Presión Normal',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        alert: false,
        desc: 'Lectura perfecta y saludable. ¡Buen control!'
      };
    }
  };

  const handleMedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDose.trim()) return;
    onAddMedicine(medName.trim(), medDose.trim(), medFreq.trim() || 'Cada 24h', medTime, medNotes.trim());
    setMedName('');
    setMedDose('');
    setMedFreq('');
    setMedTime('Mañana');
    setMedNotes('');
    setShowMedForm(false);
  };

  const handleBpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpSystolic || !bpDiastolic || !bpPulse) return;
    onAddReading(bpPeriod, parseInt(bpSystolic), parseInt(bpDiastolic), parseInt(bpPulse), bpNotes.trim());
    setBpSystolic('');
    setBpDiastolic('');
    setBpPulse('');
    setBpNotes('');
    setShowBpForm(false);
  };

  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptDate || !apptSpecialty || !apptDoctor) return;
    onAddAppointment(apptDate, apptTime || '08:00', apptSpecialty.trim(), apptDoctor.trim(), apptNotes.trim());
    setApptDate('');
    setApptTime('');
    setApptSpecialty('');
    setApptDoctor('');
    setApptNotes('');
    setShowApptForm(false);
  };

  // Water/Hydration handlers
  const handleScaleGlass = (val: number) => {
    onSetGlassCount(prev => {
      // If tapping same index, decrement by 1, otherwise set to tapped index
      if (val === prev) {
        return Math.max(0, val - 1);
      }
      return val;
    });
  };

  const recentBp = bloodPressureReadings.slice().reverse().slice(0, 5);
  const avgSystolic = Math.round(bloodPressureReadings.reduce((sum, r) => sum + r.systolic, 0) / (bloodPressureReadings.length || 1));
  const avgDiastolic = Math.round(bloodPressureReadings.reduce((sum, r) => sum + r.diastolic, 0) / (bloodPressureReadings.length || 1));

  // Determine next ISSSTE appointment
  const pendingAppointments = appointments
    .filter(a => !a.isCompleted)
    .sort((a, b) => a.date.localeCompare(b.date));
  const completedAppointments = appointments
    .filter(a => a.isCompleted)
    .sort((a, b) => b.date.localeCompare(b.date));

  const nextAppointment = pendingAppointments[0];

  return (
    <div className="space-y-6">
      {/* SECTION HEADER BLOCK */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 translate-y-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="p-1 px-3 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-wider font-sans">
              Control Clínico Familiar
            </span>
            <h1 className="text-3xl font-serif font-black tracking-tight flex items-center gap-2">
              <span>🩺</span> Cuidado de la Abuela {grandmaName}
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl font-sans font-medium lead-relaxed">
              Monitoreo integral de salud: pastillas e instrucciones de toma diarias, hidratación interactiva, control de presión antes y después del día, e historial de citas médicas del ISSSTE.
            </p>
          </div>

          {/* QUICK DIALS & LIVE STATS BAR */}
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <span className="block text-[9px] text-emerald-200 uppercase font-black tracking-wider">Última Presión</span>
              <span className="text-lg font-mono font-black">
                {bloodPressureReadings.length > 0 
                  ? `${bloodPressureReadings[bloodPressureReadings.length - 1].systolic}/${bloodPressureReadings[bloodPressureReadings.length - 1].diastolic}` 
                  : 'N/A'}
              </span>
              <span className="block text-[8px] text-emerald-300 font-mono">mmHg</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
              <span className="block text-[9px] text-emerald-200 uppercase font-black tracking-wider">Próxima Cita ISSSTE</span>
              <span className="text-xs font-bold font-sans truncate block max-w-[120px]">
                {nextAppointment ? nextAppointment.specialty : 'Sin citas'}
              </span>
              <span className="block text-[8px] text-emerald-300">
                {nextAppointment ? new Date(nextAppointment.date + 'T00:00:00').toLocaleDateString('es-MX', {day: 'numeric', month: 'short'}) : 'Al corriente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE BREATHE / HYDRATION PERSISTENT FLOATER WIDGET */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-150 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 shadow-md shadow-blue-500/20 text-white flex items-center justify-center shrink-0">
              <Droplet className="w-6 h-6 fill-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-stone-800">
                  💧 Registro de Hidratación (Abuela)
                </h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
                  Meta: 8 Vasos (2 Litros)
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-tight">
                Es mandatorio mantener a la abuela hidratada para facilitar la circulación y cuidar sus riñones. Registra cada vaso servido hoy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border border-stone-200/60 p-3 rounded-2xl shadow-2sx flex-1 lg:flex-initial justify-between">
            <div className="text-center px-2 shrink-0">
              <span className="block text-[8px] uppercase font-bold text-stone-400">Vasos Hoy</span>
              <strong className="text-xl font-mono block text-blue-800 font-extrabold">{glassCount} <span className="text-xs font-normal text-stone-500">of 8</span></strong>
            </div>

            <div className="flex gap-1.5 flex-wrap justify-end">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <button
                  key={i}
                  id={`glass-water-${i}`}
                  onClick={() => isAdmin && handleScaleGlass(i)}
                  className={`w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-all shadow-sm select-none ${
                    isAdmin 
                      ? 'cursor-pointer' 
                      : 'cursor-not-allowed opacity-75'
                  } ${
                    i <= glassCount 
                      ? 'bg-blue-600 text-white scale-105 shadow-md shadow-blue-600/10' 
                      : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-300 hover:text-blue-500 hover:border-blue-300'
                  }`}
                  title={!isAdmin ? "Solo lectura" : `${i} Vaso de Agua`}
                >
                  🥛
                </button>
              ))}
            </div>
          </div>
        </div>

        {glassCount >= 8 ? (
          <div className="mt-3.5 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-sans font-bold">
            <span>🎉</span>
            <span>¡Excelente control! Se ha cumplido la meta diaria de hidratación para la abuela {grandmaName}. ¡Gracias por cuidarla tanto!</span>
          </div>
        ) : (
          <div className="mt-2 text-[10px] text-stone-400 italic">
            {isAdmin 
              ? "* Haz clic en el vaso correspondiente para actualizar la hidratación consumida." 
              : "🔒 Solo Ericka edita e incrementa los vasos de agua."
            }
          </div>
        )}
      </div>

      {/* CORE NAVIGATION SYSTEM */}
      <div className="flex border-b border-stone-200 pb-px gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('medicamentos')}
          className={`px-4 py-2 text-sm font-serif font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'medicamentos'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
          }`}
        >
          <span>💊</span>
          <span>Medicamentos con Indicaciones</span>
          <span className="p-0.5 px-1.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold">
            {medicines.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('citas')}
          className={`px-4 py-2 text-sm font-serif font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'citas'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
          }`}
        >
          <span>🏥</span>
          <span>Citas Médicas en el ISSSTE</span>
          {pendingAppointments.length > 0 && (
            <span className="p-0.5 px-1.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
              {pendingAppointments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('tension')}
          className={`px-4 py-2 text-sm font-serif font-black transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'tension'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
          }`}
        >
          <span>❤️</span>
          <span>Presión Arterial</span>
          <span className="p-0.5 px-1.5 rounded-full bg-stone-100 text-stone-600 font-mono text-[10px]">
            {bloodPressureReadings.length}
          </span>
        </button>
      </div>

      {/* SUB-TABS RENDERER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: MEDICINES SECTION */}
        {activeSubTab === 'medicamentos' && (
          <>
            {/* Form & Introduction (4 Col) */}
            <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-serif font-semibold text-stone-800 flex items-center gap-1.5">
                  📁 Registrar Recetado
                </h3>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => setShowMedForm(!showMedForm)}
                    className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold cursor-pointer hover:bg-emerald-100"
                  >
                    {showMedForm ? 'Cerrar' : '+ Añadir'}
                  </button>
                ) : (
                  <span className="text-stone-400 font-bold text-[10px]">🔒 Solo Ericka</span>
                )}
              </div>

              {!showMedForm ? (
                <div className="space-y-3.5 bg-stone-50/50 p-4 border border-stone-100 rounded-xl">
                  <div className="flex gap-2 text-stone-600 text-xs">
                    <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-800">Administración Responsable</p>
                      <p className="mt-1 leading-relaxed text-stone-500">
                        Procura que cada vez que el médico familiar o especialista modifique la receta, se revise y actualice de inmediato en esta herramienta para evitar confusiones de dosis.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-950 font-sans space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <span>⚠️</span> Instrucciones del Geriatra
                    </p>
                    <p className="text-amber-900 leading-normal">
                      No mezclar suplementos o tés de hierbas sin consultarlo preventivamente antes con su médico geriatra.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleMedSubmit} className="space-y-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Detalles de la medicina</h4>
                  
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Losartán"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-emerald-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Dosis (ej. 50mg)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 1 Tableta"
                        value={medDose}
                        onChange={(e) => setMedDose(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-emerald-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Frecuencia</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Cada 24 horas"
                        value={medFreq}
                        onChange={(e) => setMedFreq(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-emerald-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Horario Diario</label>
                    <select
                      value={medTime}
                      onChange={(e) => setMedTime(e.target.value as any)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-emerald-300"
                    >
                      <option value="Mañana">🌅 Mañana (Ayuno / Desayuno)</option>
                      <option value="Tarde">☀️ Tarde (Almuerzo)</option>
                      <option value="Noche">🌙 Noche (Cena / Acostarse)</option>
                      <option value="Personalizado">⏰ Otro horario específico</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Indicaciones e Instrucciones</label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Tomar en ayunas con media taza de agua tibia. No masticar."
                      value={medNotes}
                      onChange={(e) => setMedNotes(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-emerald-300 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowMedForm(false)}
                      className="flex-1 py-1.5 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Añadir pastilla
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Detailed list highlighting instructions and timings (8 Col) */}
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-800">
                  📋 Lista de Medicinas con Indicaciones Clínicas
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Indicaciones exactas dadas a abuela {grandmaName}. Organizado de manera semanal para el cuidador general en turno.
                </p>
              </div>

              <div className="space-y-3.5">
                {medicines.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 italic text-xs">
                    Sin medicamentos cargados en la receta. Usa el botón Añadir para registrar uno.
                  </div>
                ) : (
                  medicines.map((med) => (
                    <div
                      key={med.id}
                      className="group p-4 bg-gradient-to-br from-stone-50 to-stone-50/10 hover:from-white hover:to-emerald-50/10 border border-stone-150 rounded-2xl shadow-2sx hover:shadow-sm transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 text-emerald-800 font-extrabold text-xl shrink-0 flex items-center justify-center shadow-inner">
                          {med.timeOfDay === 'Mañana' && '🌅'}
                          {med.timeOfDay === 'Tarde' && '☀️'}
                          {med.timeOfDay === 'Noche' && '🌙'}
                          {med.timeOfDay === 'Personalizado' && '⏰'}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-serif font-bold text-stone-850">
                              {med.name}
                            </h4>
                            <span className="p-0.5 px-2 bg-emerald-100 text-emerald-900 border border-emerald-150/50 text-[10px] font-black tracking-wide rounded-md">
                              {med.dose} – {med.frequency}
                            </span>
                            <span className="p-0.5 px-2 bg-stone-100 text-stone-600 text-[10px] uppercase font-mono rounded-md">
                              Momento: {med.timeOfDay}
                            </span>
                          </div>

                          {/* IMPORTANT HIGHLIGHT - LES INDICACIONES */}
                          <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100 text-xs text-stone-700 leading-relaxed space-y-1">
                            <span className="block font-black text-emerald-800 text-[9px] uppercase tracking-widest">
                              📌 INDICACIONES DE TOMA:
                            </span>
                            <p className="font-medium italic text-stone-650 font-serif">
                              {med.notes || '"Sin indicaciones especiales registradas. Tomar con cuidado habitual."'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex md:flex-col justify-end items-end shrink-0 gap-2 border-t md:border-t-0 border-stone-100 pt-2 md:pt-0">
                          <button
                            onClick={() => onDeleteMedicine(med.id)}
                            className="p-1.5 px-2.5 text-stone-400 hover:text-rose-705 bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-150 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                            title="Quitar medicamento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="md:hidden">Quitar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: ISSSTE APPOINTMENTS */}
        {activeSubTab === 'citas' && (
          <>
            {/* Form Section (4 Col) */}
            <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-serif font-bold text-stone-850 flex items-center gap-1.5">
                  🏥 Añadir Cita ISSSTE
                </h3>
                {isAdmin ? (
                  <button
                    onClick={() => setShowApptForm(!showApptForm)}
                    className="px-2 py-1 rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 cursor-pointer"
                  >
                    {showApptForm ? 'Ver Tips' : '+ Registrar'}
                  </button>
                ) : (
                  <span className="text-stone-400 font-bold text-[10px]">🔒 Solo Ericka</span>
                )}
              </div>

              {!showApptForm ? (
                <div className="space-y-4 bg-stone-50 p-4 border border-stone-100 rounded-xl">
                  <div className="flex gap-2 text-stone-600 text-xs">
                    <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-800">Dirección Clínica ISSSTE</p>
                      <p className="mt-0.5 text-stone-500 leading-normal">
                        Para traslados o citas presenciales en urgencias de la clínica de zona.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-stone-200/80 rounded-xl text-[11px] text-stone-600 space-y-1.5">
                    <p className="font-bold text-stone-800">📋 Trámites Obligatorios:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-500">
                      <li>Llevar carnet original de afiliación</li>
                      <li>Copia de vigencia de derechos</li>
                      <li>Llegar con 20 minutos de anticipación al consultorio asignado</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-indigo-50 rounded-lg text-[11px] text-indigo-950 font-sans space-y-1">
                    <p className="font-bold flex items-center gap-1 text-indigo-900">
                      <span>💡</span> Consejo Familiar
                    </p>
                    <p className="text-indigo-850 leading-relaxed">
                      Ericka o la persona que acompañe a la abuela debe registrar en el bloque "Observaciones de consulta médica" lo que comente el doctor sobre sus dosis para ajustarlo de inmediato.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApptSubmit} className="space-y-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Nueva cita del ISSSTE</h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Especialidad Hospitalaria</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Geriatría, Oftalmología, Cardiología..."
                      value={apptSpecialty}
                      onChange={(e) => setApptSpecialty(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-indigo-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Fecha</label>
                      <input
                        type="date"
                        required
                        value={apptDate}
                        onChange={(e) => setApptDate(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-indigo-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Hora de entrada</label>
                      <input
                        type="time"
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-indigo-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Médico Familiar / Especialista</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Dr. Martínez"
                      value={apptDoctor}
                      onChange={(e) => setApptDoctor(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-indigo-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Indicaciones previas (Ej. Ayuno, carnet...)</label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Presentarse en ayuno absoluto de 12h. Llevar estudios de orina del IMSS."
                      value={apptNotes}
                      onChange={(e) => setApptNotes(e.target.value)}
                      className="w-full text-xs border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-indigo-300 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowApptForm(false)}
                      className="flex-1 py-1.5 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Crear Cita
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* List Section (8 Col) */}
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-850">
                  🏥 Próximas Citas Médicas e Historial ISSSTE
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Control exacto para que el responsable familiar en turno acompañe a nuestra abuelita y tome las indicaciones recetadas.
                </p>
              </div>

              {/* Pendientes vs Completadas separator */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider border-b pb-1.5 mb-3 flex items-center justify-between">
                    <span>📅 Citas Pendientes ({pendingAppointments.length})</span>
                    <span className="p-0.5 px-2 rounded-md bg-amber-50 text-amber-800 text-[9px] font-mono lowercase">Requieren acompañar</span>
                  </h4>

                  <div className="space-y-3">
                    {pendingAppointments.length === 0 ? (
                      <div className="text-center py-8 bg-stone-50/50 border border-stone-150 rounded-xl text-xs text-stone-400 italic">
                        ¡Al corriente! Sin citas pendientes registradas en el ISSSTE.
                      </div>
                    ) : (
                      pendingAppointments.map(appt => (
                        <div
                          key={appt.id}
                          className="group p-4 bg-gradient-to-br from-indigo-50/20 to-white hover:to-indigo-50/10 border border-indigo-100 rounded-2xl flex items-start justify-between gap-4 transition-all shadow-2sx"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              id={`toggle-appt-${appt.id}`}
                              onClick={() => isAdmin && onToggleAppointment(appt.id)}
                              className={`w-6 h-6 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 text-stone-300 mt-1 transition ${
                                isAdmin ? 'cursor-pointer hover:border-emerald-400 hover:text-emerald-650 hover:bg-emerald-50' : 'cursor-not-allowed opacity-60'
                              }`}
                              title={!isAdmin ? "Solo lectura" : "Marcar cita asistida / completada"}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>

                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="p-0.5 px-2 bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase rounded-lg">
                                  {appt.specialty}
                                </span>
                                <span className="text-xs text-stone-400 font-mono">
                                  👩‍⚕️ Méd: {appt.doctor}
                                </span>
                              </div>

                              <p className="text-sm font-serif font-semibold text-stone-800">
                                🗓️ {new Date(appt.date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                <span className="font-mono text-xs font-normal text-stone-500 bg-stone-100 p-0.5 px-1.5 rounded-md ml-2.5">
                                  ⏰ {appt.time} hrs
                                </span>
                              </p>

                              {appt.notes && (
                                <p className="text-xs text-stone-605 italic bg-white p-2 rounded-xl border border-stone-150 leading-relaxed font-sans font-semibold">
                                  💬 <span className="text-stone-500 font-normal">Requisitos / Notas:</span> {appt.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {isAdmin && (
                            <button
                              onClick={() => onDeleteAppointment(appt.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="Eliminar registro de cita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {completedAppointments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-stone-650 uppercase tracking-wider border-b pb-1.5 mb-3">
                      🏛️ Historial de Citas Completadas ({completedAppointments.length})
                    </h4>

                    <div className="space-y-2.5">
                      {completedAppointments.map(appt => (
                        <div
                          key={appt.id}
                          className="group p-3 bg-stone-50/40 border border-stone-150 rounded-xl flex items-center justify-between gap-4 opacity-75 hover:opacity-100 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              id={`toggle-appt-completed-${appt.id}`}
                              onClick={() => isAdmin && onToggleAppointment(appt.id)}
                              className={`w-5 h-5 rounded-full bg-emerald-100 border border-emerald-250 flex items-center justify-center shrink-0 text-emerald-700 transition ${
                                isAdmin ? 'cursor-pointer hover:bg-stone-50 hover:text-stone-300' : 'cursor-not-allowed opacity-60'
                              }`}
                              title={!isAdmin ? "Solo lectura" : "Regresar a pendientes"}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>

                            <div>
                              <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5 flex-wrap">
                                <span className="line-through text-stone-500">{appt.specialty}</span>
                                <span className="text-[9px] px-1 bg-stone-200 text-stone-600 rounded font-normal font-mono">Asistio</span>
                              </p>
                              <p className="text-[10px] text-stone-400 font-mono">
                                Realizada: {appt.date} con {appt.doctor}
                              </p>
                            </div>
                          </div>

                          {isAdmin && (
                            <button
                              onClick={() => onDeleteAppointment(appt.id)}
                              className="p-1 text-stone-300 hover:text-rose-600 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* TAB 3: BLOOD PRESSURE TRACKER */}
        {activeSubTab === 'tension' && (
          <>
            {/* BP Form Column (4 Col) */}
            <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-base font-serif font-bold text-stone-850">
                    ❤️ Toma de Presión
                  </h3>
                  {isAdmin ? (
                    <button
                      onClick={() => setShowBpForm(!showBpForm)}
                      className="px-2 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-850 text-xs font-semibold cursor-pointer hover:bg-emerald-100"
                    >
                      {showBpForm ? 'Ver Promedios' : '+ Añadir Toma'}
                    </button>
                  ) : (
                    <span className="text-stone-400 font-bold text-[10px]">🔒 Solo Ericka</span>
                  )}
                </div>

                {!showBpForm ? (
                  <div className="space-y-3.5">
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-2 text-center">
                      <span className="block text-[10px] text-stone-500 uppercase font-black tracking-widest">PROMEDIO SÍSTOLE (ÚLT. 5)</span>
                      <span className="text-2xl font-mono font-black text-stone-800">
                        {avgSystolic} <span className="text-xs font-normal text-stone-500">mmHg</span>
                      </span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 space-y-2 text-center">
                      <span className="block text-[10px] text-stone-500 uppercase font-black tracking-widest">PROMEDIO DIÁSTOLE (ÚLT. 5)</span>
                      <span className="text-2xl font-mono font-black text-stone-800">
                        {avgDiastolic} <span className="text-xs font-normal text-stone-500">mmHg</span>
                      </span>
                    </div>

                    <div className="p-3 bg-rose-50/70 text-rose-950 font-sans rounded-2xl border border-rose-100 text-[11px] leading-relaxed">
                      <p className="font-bold text-rose-900 flex items-center gap-1 mb-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                        Guía de Lectura Rápida
                      </p>
                      La presión objetivo ideal para la abuela es menor de 130/80 mmHg. Si supera 140/90 mmHg, dale reposo absoluto, quita sal de su alimento, y haz nueva lectura tras 10 min.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBpSubmit} className="space-y-3 p-4 bg-stone-50 border border-stone-100 rounded-xl">
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Detalles de la toma</h4>

                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Horario del Día</label>
                      <div className="flex rounded-xl overflow-hidden border border-stone-200">
                        <button
                          type="button"
                          onClick={() => setBpPeriod('AM')}
                          className={`flex-1 py-1.5 text-xs font-bold cursor-pointer transition ${bpPeriod === 'AM' ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'}`}
                        >
                          🌅 AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setBpPeriod('PM')}
                          className={`flex-1 py-1.5 text-xs font-bold cursor-pointer transition ${bpPeriod === 'PM' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-605'}`}
                        >
                          🌙 PM
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Sístole (Alta)</label>
                        <input
                          type="number"
                          required
                          min="60"
                          max="220"
                          placeholder="Ex. 120"
                          value={bpSystolic}
                          onChange={(e) => setBpSystolic(e.target.value)}
                          className="w-full text-xs border border-stone-200 rounded-xl px-2 py-1.5 bg-white focus:outline-none focus:border-emerald-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Diástole (Baja)</label>
                        <input
                          type="number"
                          required
                          min="30"
                          max="150"
                          placeholder="Ex. 80"
                          value={bpDiastolic}
                          onChange={(e) => setBpDiastolic(e.target.value)}
                          className="w-full text-xs border border-stone-200 rounded-xl px-2 py-1.5 bg-white focus:outline-none focus:border-emerald-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Pulso (PPM)</label>
                        <input
                          type="number"
                          required
                          min="45"
                          max="180"
                          placeholder="Ex. 75"
                          value={bpPulse}
                          onChange={(e) => setBpPulse(e.target.value)}
                          className="w-full text-xs border border-stone-200 rounded-xl px-2 py-1.5 bg-white focus:outline-none focus:border-emerald-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">Estado / Síntomas u Observación</label>
                      <input
                        type="text"
                        placeholder="Ej. Acababa de reposar tras bañarse, tranquila."
                        value={bpNotes}
                        onChange={(e) => setBpNotes(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-emerald-300"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowBpForm(false)}
                        className="flex-1 py-1.5 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-850 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Guardar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* BP Logs Column (8 Col) */}
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-850">
                  ❤️ Historial Reciente de Presión Arterial
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Ultimos registros efectuados de mañana (AM) y noche (PM) para monitorear tendencias.
                </p>
              </div>

              <div className="space-y-3">
                {recentBp.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 italic text-xs">
                    Sin tomas de presión de abuela registradas. Presiona "Nueva Toma" para subir una.
                  </div>
                ) : (
                  recentBp.map((read) => {
                    const diag = getPressureDiagnosis(read.systolic, read.diastolic);
                    return (
                      <div
                        key={read.id}
                        className="group p-3.5 border border-stone-150 hover:border-emerald-200 hover:bg-emerald-50/5 rounded-xl transition-all"
                      >
                        <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                          <div className="flex items-start gap-3">
                            <div className="w-8.5 h-8.5 rounded-full bg-stone-100 flex items-center justify-center text-sm shrink-0">
                              {read.period === 'AM' ? '🌅' : '🌙'}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-base text-stone-800">
                                  {read.systolic}/{read.diastolic}
                                </span>
                                <span className="text-[10px] text-stone-500 font-mono">mmHg</span>
                                <span className="text-xs text-stone-400 font-mono ml-2">❤️ {read.pulse} ppm</span>
                                <span className="text-[10px] text-stone-400 font-mono ml-1.5 font-bold">
                                  ({read.period})
                                </span>
                              </div>

                              <span className="block text-[10px] text-stone-400 font-mono">
                                Registrado: {new Date(read.date + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                              </span>

                              {read.notes && (
                                <p className="text-stone-600 text-xs italic mt-1 font-serif">
                                  💬 "{read.notes}"
                                </p>
                              )}

                              <p className={`text-[10px] px-2 py-0.5 rounded border inline-block mt-1 font-bold ${diag.color}`}>
                                {diag.label} – <span className="font-semibold font-sans italic">{diag.desc}</span>
                              </p>
                            </div>
                          </div>

                          {isAdmin && (
                            <button
                              onClick={() => onDeleteReading(read.id)}
                              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="Eliminar esta lectura"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
