/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Plus, Calendar, Activity, Check, PlusCircle, Sparkles, Clock, Trash2 } from 'lucide-react';
import { Medicine, BloodPressureReading } from '../types';

interface HealthPanelProps {
  medicines: Medicine[];
  bloodPressureReadings: BloodPressureReading[];
  onAddMedicine: (name: string, dose: string, frequency: string, timeOfDay: 'Mañana' | 'Tarde' | 'Noche' | 'Personalizado', notes: string) => void;
  onDeleteMedicine: (id: string) => void;
  onAddReading: (period: 'AM' | 'PM', systolic: number, diastolic: number, pulse: number, notes: string) => void;
  onDeleteReading: (id: string) => void;
  grandmaName?: string;
}

export default function HealthPanel({
  medicines,
  bloodPressureReadings,
  onAddMedicine,
  onDeleteMedicine,
  onAddReading,
  onDeleteReading,
  grandmaName = 'Esperanza',
}: HealthPanelProps) {
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

  // Determine tension diagnosis ranges
  const getPressureDiagnosis = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) {
      return {
        label: 'Hipertensión Fase 2',
        color: 'bg-rose-100 border-rose-300 text-rose-800',
        alert: true,
        desc: '⚠️ Presión MUY ALTA. Repetir en 5 min, si sigue alta, llama al Dr. Salvador Romero.'
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

  // Compute stats of last 5 readings
  const recentBp = bloodPressureReadings.slice().reverse().slice(0, 5);
  const avgSystolic = Math.round(bloodPressureReadings.reduce((sum, r) => sum + r.systolic, 0) / (bloodPressureReadings.length || 1));
  const avgDiastolic = Math.round(bloodPressureReadings.reduce((sum, r) => sum + r.diastolic, 0) / (bloodPressureReadings.length || 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* COLUMN 1: PILLE/MEDICINES SCHEDULE (5 / 12) */}
      <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-1.5">
              <span className="p-1 px-2 rounded-lg bg-rose-50 text-rose-600 font-bold block text-sm">💊</span>
              Medicamentos de la Abuela {grandmaName}
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">Control de horarios y dosis de la abuelita {grandmaName}</p>
          </div>

          <button
            onClick={() => setShowMedForm(!showMedForm)}
            className="px-2.5 py-1 rounded-lg border border-rose-100 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-rose-100/70"
          >
            <Plus className="w-3.5 h-3.5" />
            Medicamento
          </button>
        </div>

        {showMedForm && (
          <form onSubmit={handleMedSubmit} className="mb-4 bg-stone-50 p-4 border border-stone-100 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Añadir Pastilla</h4>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Nombre medicamento</label>
              <input
                type="text"
                required
                placeholder="Ej. Losartán"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Dosis (Cant.)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 1 Tableta (50 mg)"
                  value={medDose}
                  onChange={(e) => setMedDose(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
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
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Momento recomendado de toma</label>
                <select
                  value={medTime}
                  onChange={(e) => setMedTime(e.target.value as any)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                >
                  <option value="Mañana">🌅 Mañana (Ayuno / Desayuno)</option>
                  <option value="Tarde">☀️ Tarde (Almuerzo)</option>
                  <option value="Noche">🌙 Noche (Cena / Dormir)</option>
                  <option value="Personalizado">⏰ Hora Personalizada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Notas especiales de Mamá</label>
                <input
                  type="text"
                  placeholder="Ej. Tomar antes del desayuno con agua tibia..."
                  value={medNotes}
                  onChange={(e) => setMedNotes(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowMedForm(false)}
                className="px-3 py-1 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Añadir Pastilla
              </button>
            </div>
          </form>
        )}

        {/* Medicines list renderer sorted by general daily timing */}
        <div className="flex-1 overflow-y-auto max-h-[340px] space-y-3.5 pr-1">
          {medicines.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm italic">
              Sin pastillas dadas de alta. Introduce una.
            </div>
          ) : (
            medicines.map((med) => (
              <div
                key={med.id}
                className="group border border-stone-150 bg-stone-50/10 hover:bg-stone-50/35 rounded-xl p-3.5 flex justify-between items-start transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                    {med.timeOfDay === 'Mañana' && '🌅'}
                    {med.timeOfDay === 'Tarde' && '☀️'}
                    {med.timeOfDay === 'Noche' && '🌙'}
                    {med.timeOfDay === 'Personalizado' && '⏰'}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-stone-800">{med.name}</h4>
                    <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md mt-0.5">
                      {med.dose} – {med.frequency}
                    </span>
                    <span className="block text-[11px] text-stone-500 font-mono mt-1">
                      Horario: {med.timeOfDay}
                    </span>
                    {med.notes && (
                      <p className="text-stone-500 text-xs italic mt-1.5 font-serif leading-tight">
                        💬 {med.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMedicine(med.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Eliminar medicamento"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* COLUMN 2: BLOOD PRESSURE TRACKER (7 / 12) */}
      <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-1.5">
              <span className="p-1 px-2 rounded-lg bg-emerald-50 text-emerald-600 font-bold block text-sm">❤️</span>
              Presión Arterial (Abuela)
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">Control de tomas 2 veces al día (AM y PM)</p>
          </div>

          <button
            onClick={() => setShowBpForm(!showBpForm)}
            className="px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-emerald-100/70"
          >
            <Activity className="w-3.5 h-3.5" />
            Nueva Toma
          </button>
        </div>

        {/* BP Historic Stats Header */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center justify-around mb-4">
          <div className="text-center">
            <span className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider">Promedio Sístole</span>
            <span className="text-lg font-mono font-bold text-stone-800">{avgSystolic} <span className="text-xs font-normal text-stone-500">mmHg</span></span>
          </div>
          <div className="h-8 border-r border-stone-200" />
          <div className="text-center">
            <span className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider">Promedio Diástole</span>
            <span className="text-lg font-mono font-bold text-stone-800">{avgDiastolic} <span className="text-xs font-normal text-stone-500">mmHg</span></span>
          </div>
          <div className="h-8 border-r border-stone-200" />
          <div className="text-center">
            <span className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider">Lecturas Hechas</span>
            <span className="text-lg font-mono font-bold text-emerald-600">{bloodPressureReadings.length} tomas</span>
          </div>
        </div>

        {showBpForm && (
          <form onSubmit={handleBpSubmit} className="mb-4 bg-stone-50 p-4 border border-stone-100 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Registrar Lectura de Presión</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Horario</label>
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
                    className={`flex-1 py-1.5 text-xs font-bold cursor-pointer transition ${bpPeriod === 'PM' ? 'bg-indigo-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'}`}
                  >
                    🌙 PM
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Sistólica (Alta)</label>
                <input
                  type="number"
                  required
                  min="60"
                  max="220"
                  placeholder="Ej. 120"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Diastólica (Baja)</label>
                <input
                  type="number"
                  required
                  min="30"
                  max="150"
                  placeholder="Ej. 80"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Pulso (PPM/LPM)</label>
                <input
                  type="number"
                  required
                  min="40"
                  max="180"
                  placeholder="Ej. 72"
                  value={bpPulse}
                  onChange={(e) => setBpPulse(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Estado de la abuela u observaciones</label>
              <input
                type="text"
                placeholder="Ej. Acababa de reposar, tranquila. Tomó té de manzanilla."
                value={bpNotes}
                onChange={(e) => setBpNotes(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowBpForm(false)}
                className="px-3 py-1 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Guardar Lectura
              </button>
            </div>
          </form>
        )}

        {/* BP Historic logs render list */}
        <div className="flex-1 overflow-y-auto max-h-[280px] space-y-2.5 pr-1">
          {recentBp.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm italic">
              Sin tomas registradas para hoy. Introduce la primera toma.
            </div>
          ) : (
            recentBp.map((read) => {
              const diag = getPressureDiagnosis(read.systolic, read.diastolic);
              return (
                <div
                  key={read.id}
                  className="group p-3 border border-stone-100 hover:border-emerald-100 hover:bg-emerald-50/5 rounded-xl transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm shrink-0">
                        {read.period === 'AM' ? '🌅' : '🌙'}
                      </div>
                      
                      <div>
                        {/* Values display */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-base text-stone-800">
                            {read.systolic}/{read.diastolic}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono">mmHg</span>
                          <span className="text-xs text-stone-400 font-mono ml-2">❤️ {read.pulse} ppm</span>
                        </div>

                        {/* Date and moment stamp */}
                        <span className="block text-[10px] text-stone-400 font-mono mt-0.5">
                          Registrado: {new Date(read.date + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} – Horario: {read.period === 'AM' ? 'Mañana (AM)' : 'Tarde/Noche (PM)'}
                        </span>

                        {read.notes && (
                          <p className="text-stone-600 text-xs italic mt-1 font-serif">
                            "{read.notes}"
                          </p>
                        )}
                        
                        <p className={`text-[11px] px-2 py-1 rounded-lg border inline-block mt-2 font-semibold ${diag.color}`}>
                          {diag.label} – <span className="font-normal font-sans italic">{diag.desc}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteReading(read.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Eliminar esta lectura"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
