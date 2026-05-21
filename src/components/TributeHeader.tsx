/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, RefreshCw, Milestone, Sparkles, BookOpen } from 'lucide-react';
import { MOM_ADVICES } from '../defaultData';

export interface TributeHeaderProps {
  momAdvices?: string[];
}

export default function TributeHeader({ momAdvices = [] }: TributeHeaderProps) {
  const [adviceIndex, setAdviceIndex] = useState(0);

  const advicesToUse = momAdvices.length > 0 ? momAdvices : [
    "Tómate la pastilla",
    "Toma agua",
    "Qué rica coca",
    "Bien que lo decía Pérez Chowel"
  ];

  const rotateAdvice = () => {
    setAdviceIndex((prev) => (prev + 1) % advicesToUse.length);
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50/40 to-stone-100 border border-rose-100/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden mb-8">
      {/* Decorative floral backgrounds */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-rose-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-amber-200/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative z-10">
        {/* Memorial Frame */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-300 to-amber-200 opacity-60 blur" />
            <div className="relative w-28 h-28 bg-stone-100 rounded-2xl p-2 border border-stone-200/60 flex flex-col justify-center items-center overflow-hidden shadow-inner">
              <span className="text-3xl">🕊️</span>
              <span className="text-rose-700 font-serif font-bold text-lg mt-1 tracking-tight">Lety</span>
              <span className="text-[10px] text-stone-500 font-mono mt-0.5">1964 – 2026</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200/50 text-rose-700">
              <Heart className="w-3.5 h-3.5 fill-rose-600 stroke-rose-600 stroke-[3]" />
              En Memoria
            </span>
          </div>
        </div>

        {/* Tribute Message & Wise Mama Advice */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-800 tracking-tight leading-tight">
            Lety App <span className="text-rose-600/80 font-normal">| El Corazón de Casa</span>
          </h1>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed font-sans max-w-2xl">
            Inspirada con inmenso amor en <strong className="font-semibold text-stone-800">Leticia Rodríguez Escalante (1964 - 2026)</strong>. Un espacio cálido para guiar las finanzas familiares, la lista de compras del hogar y cuidar con ternura la salud de nuestra abuela Esperanza. Una app amable que cuida cada detalle de nuestra familia, como una mamá.
          </p>

          {/* Advice/Apapacho Bubble */}
          <div className="mt-5 bg-white/95 border border-amber-200/60 p-4 rounded-2xl shadow-sm text-stone-700 max-w-2xl relative group">
            <div className="absolute top-2 right-2 flex gap-1 items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 font-mono flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-300" />
                Consejo de Mamá
              </span>
            </div>
            <div className="flex gap-3 items-start pr-16">
              <span className="text-3xl select-none leading-none pt-0.5">❤️</span>
              <p className="text-sm font-serif italic text-left text-stone-800 leading-relaxed">
                "{advicesToUse[adviceIndex] || advicesToUse[0]}"
              </p>
            </div>
            
            <button 
              onClick={rotateAdvice}
              className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50/50 border border-rose-100 hover:border-rose-200/80 transition-all px-2 py-1 rounded-lg font-medium cursor-pointer"
              title="Escuchar otro consejo de Mamá"
            >
              <RefreshCw className="w-3 h-3 animate-spin-slow text-rose-500" />
              <span>Siguiente apapacho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
