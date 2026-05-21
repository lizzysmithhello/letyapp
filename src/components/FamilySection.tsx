/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cake, Plus, MessageSquare, Phone, User, Calendar, Trash2, Heart, ExternalLink } from 'lucide-react';
import { FamilyBirthday, FamilyContact } from '../types';

interface FamilySectionProps {
  birthdays: FamilyBirthday[];
  contacts: FamilyContact[];
  onAddBirthday: (name: string, date: string, relationship: string) => void;
  onDeleteBirthday: (id: string) => void;
  onAddContact: (name: string, phone: string, relationship: string) => void;
  onDeleteContact: (id: string) => void;
  grandmaName?: string;
}

export default function FamilySection({
  birthdays,
  contacts,
  onAddBirthday,
  onDeleteBirthday,
  onAddContact,
  onDeleteContact,
  grandmaName = 'Esperanza',
}: FamilySectionProps) {
  // Birthday inputs state
  const [bName, setBName] = useState('');
  const [bDate, setBDate] = useState('');
  const [bRelation, setBRelation] = useState('');
  const [showBForm, setShowBForm] = useState(false);

  // Contact inputs state
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cRelation, setCRelation] = useState('');
  const [showCForm, setShowCForm] = useState(false);

  // Hardcoded reference system today from environment metadata: May 21, 2026
  const REFERENCE_TODAY_STR = '2026-05-21';
  const systemToday = new Date(REFERENCE_TODAY_STR + 'T00:00:00');

  // Helper: compute details of birthday
  const getBirthdayDetails = (b: FamilyBirthday) => {
    const birthDate = new Date(b.date + 'T00:00:00');
    
    // Calculate birth year (used to calculate what age they are turning)
    const birthYear = birthDate.getFullYear();
    const currentYear = systemToday.getFullYear();

    // Create next occurrence date
    let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    // If it already passed this year, the next birthday is next year
    if (nextBday < systemToday) {
      nextBday.setFullYear(currentYear + 1);
    }

    const ageTurning = nextBday.getFullYear() - birthYear;
    
    // Days remaining
    const diffTime = nextBday.getTime() - systemToday.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isToday = diffDays === 0 || (birthDate.getMonth() === systemToday.getMonth() && birthDate.getDate() === systemToday.getDate());

    return {
      ageTurning,
      daysLeft: isToday ? 0 : diffDays,
      isToday,
      formattedDate: birthDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
    };
  };

  const handleBirthdaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim() || !bDate) return;
    onAddBirthday(bName.trim(), bDate, bRelation.trim() || 'Familiar');
    setBName('');
    setBDate('');
    setBRelation('');
    setShowBForm(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim()) return;
    // Strip non digits from phone for safe whatsapp api matching
    const cleanNum = cPhone.replace(/\D/g, '');
    onAddContact(cName.trim(), cleanNum, cRelation.trim() || 'Parentesco');
    setCName('');
    setCPhone('');
    setCRelation('');
    setShowCForm(false);
  };

  // Pre-configured custom Whatsapp quick message trigger
  const triggerWhatsApp = (contact: FamilyContact, messageType: 'general' | 'health' | 'love') => {
    let text = '';
    switch (messageType) {
      case 'health':
        text = `¡Hola %21 Espero que estés muy bien. Te escribo de Lety App ❤️ para comentarte sobre el cuidado de nuestra abuela ${grandmaName}. ¿Cómo vas?`;
        break;
      case 'love':
        text = `¡Hola %21 👋 Te mando un fuerte abrazo y un beso. Te escribo de Lety App, acordándome mucho de ti y deseándote un lindo y maravilloso día.`;
        break;
      default:
        text = `¡Hola %21 👋 Te mando un saludo cariñoso desde Lety App ❤️`;
        break;
    }

    const customizedText = text.replace('%21', contact.name);
    // Spanish prefix code "521" or "52" for Mexican cellphones if length is 10 digits
    let apiPhone = contact.phone;
    if (apiPhone.length === 10) {
      apiPhone = `52${apiPhone}`;
    }
    
    window.open(`https://wa.me/${apiPhone}?text=${customizedText}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SECTION 1: CUMPLEAÑOS FAMILIARES */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-1.5">
              <Cake className="w-5 h-5 text-rose-500 fill-rose-100" />
              Cumpleaños Familiares
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">Fechas especiales y edad que van a cumplir</p>
          </div>

          <button
            onClick={() => setShowBForm(!showBForm)}
            className="px-2.5 py-1 rounded-lg border border-rose-100 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-rose-100/70"
          >
            <Plus className="w-3.5 h-3.5" />
            Cumpleaños
          </button>
        </div>

        {showBForm && (
          <form onSubmit={handleBirthdaySubmit} className="mb-4 bg-stone-50 p-4 border border-stone-100 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Añadir Cumpleaños</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Nombre familiar</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Karla Martínez"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Parentesco</label>
                <input
                  type="text"
                  placeholder="Ej. Sobrina, Primo"
                  value={bRelation}
                  onChange={(e) => setBRelation(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                required
                value={bDate}
                onChange={(e) => setBDate(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowBForm(false)}
                className="px-3 py-1 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Guardar Cumpleaños
              </button>
            </div>
          </form>
        )}

        {/* Birthdays display list, sorted by closest first */}
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-1">
          {birthdays.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm italic">
              No hay cumpleaños agregados.
            </div>
          ) : (
            birthdays
              .map(b => ({ ...b, details: getBirthdayDetails(b) }))
              .sort((first, val) => first.details.daysLeft - val.details.daysLeft)
              .map((b) => (
                <div
                  key={b.id}
                  className={`group p-3 border rounded-xl flex justify-between items-center transition-all ${
                    b.details.isToday 
                      ? 'bg-rose-100/60 border-rose-300 animate-pulse' 
                      : b.details.daysLeft <= 10 
                        ? 'bg-amber-50/50 border-amber-200' 
                        : 'border-stone-100 hover:border-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-sm shrink-0">
                      🎂
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-semibold text-stone-800">{b.name}</h4>
                        {b.details.isToday && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-bold uppercase tracking-wider animate-bounce">
                            ¡Hoy! 🥳
                          </span>
                        )}
                        {b.details.daysLeft <= 10 && !b.details.isToday && (
                          <span className="text-[9px] px-1 bg-amber-200 text-amber-800 rounded font-semibold font-mono">
                            ¡Ya casi!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs mt-1 text-stone-500">
                        <span className="font-medium text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">{b.relationship}</span>
                        <span>•</span>
                        <span className="font-mono">{b.details.formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-xs font-bold text-stone-800">
                        {b.details.isToday 
                          ? `¡Cumple ${b.details.ageTurning} años!` 
                          : `Cumplirá ${b.details.ageTurning} años`}
                      </span>
                      {(!b.details.isToday) && (
                        <span className="text-[10px] text-stone-500 font-mono">
                          Faltan {b.details.daysLeft} días
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteBirthday(b.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Eliminar cumpleaños"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* SECTION 2: TELÉFONOS FAMILIARES */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-800 flex items-center gap-1.5">
              <Phone className="w-5 h-5 text-emerald-600" />
              Directorio de Teléfonos Familiares
            </h2>
            <p className="text-stone-500 text-xs mt-0.5">Contactos rápidos con enlace directo a WhatsApp</p>
          </div>

          <button
            onClick={() => setShowCForm(!showCForm)}
            className="px-2.5 py-1 rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-emerald-100/70"
          >
            <Plus className="w-3.5 h-3.5" />
            Contacto
          </button>
        </div>

        {showCForm && (
          <form onSubmit={handleContactSubmit} className="mb-4 bg-stone-50 p-4 border border-stone-100 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Añadir Contacto Directo</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Nombre completo / Seudónimo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tío Alberto"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Notas / Parentesco de ayuda</label>
                <input
                  type="text"
                  placeholder="Ej. Auto disponible, Doctor de cabecera"
                  value={cRelation}
                  onChange={(e) => setCRelation(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Número telefónico (10 dígitos sin espacios)</label>
              <input
                type="tel"
                required
                placeholder="Ej. 5512345678"
                maxLength={15}
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                className="w-full text-sm border border-stone-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-rose-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCForm(false)}
                className="px-3 py-1 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Guardar Contacto
              </button>
            </div>
          </form>
        )}

        {/* Contacts render lists */}
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3.5 pr-1">
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm italic">
              No hay contactos registrados.
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="group p-3 border border-stone-100 hover:border-emerald-100 hover:bg-emerald-50/5 rounded-2xl flex justify-between items-center transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-800">{contact.name}</h4>
                    <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-0.5 font-mono uppercase">
                      {contact.relationship}
                    </span>
                    <span className="block text-xs font-mono text-stone-500 mt-1">
                      📱 {contact.phone}
                    </span>
                  </div>
                </div>

                {/* WhatsApp message options */}
                <div className="flex gap-1.5 items-center">
                  <div className="flex gap-1 bg-stone-50 border border-stone-100 p-1 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => triggerWhatsApp(contact, 'general')}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-lg text-xs font-semibold border border-stone-200/40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Mandar saludo"
                    >
                      👋 <span className="hidden sm:inline text-[9px] uppercase font-bold text-stone-600 font-mono">Saludar</span>
                    </button>
                    <button
                      onClick={() => triggerWhatsApp(contact, 'health')}
                      className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg text-xs font-semibold border border-stone-200/40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Preguntar por la abuela / Salud"
                    >
                      🩺 <span className="hidden sm:inline text-[9px] uppercase font-bold text-stone-600 font-mono">Salud</span>
                    </button>
                    <button
                      onClick={() => triggerWhatsApp(contact, 'love')}
                      className="p-1.5 bg-white hover:bg-pink-50 text-pink-600 hover:text-pink-700 rounded-lg text-xs font-semibold border border-stone-200/40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Mandar amor"
                    >
                      ❤️ <span className="hidden sm:inline text-[9px] uppercase font-bold text-stone-600 font-mono font-mono">Apapacho</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer whitespace-nowrap"
                    title="Eliminar contacto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
