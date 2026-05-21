/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, RefreshCw, Sparkles, Quote, Calendar, Star } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-3xl border border-white bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-pink-500/5 mb-8 group transition-all duration-300 hover:shadow-pink-500/10">
      
      {/* Backdrops elements to make colors extremely vivid and alive */}
      <div className="absolute top-[-30%] right-[-10%] w-80 h-80 rounded-full bg-gradient-to-br from-rose-450/40 to-pink-500/30 blur-3xl opacity-35 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-[-20%] left-[20%] w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-60 h-60 rounded-full bg-amber-200/30 blur-3xl opacity-25 pointer-events-none" />

      {/* Subtle modern grid line design */}
      <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_0.6px,transparent_0.6px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6 sm:gap-8 relative z-10">
        
        {/* Memorial Framed Avatar block - Ultra Modern */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative group">
            
            {/* Pulsing neon halo border ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-400 opacity-75 blur-md animate-pulse group-hover:opacity-100 transition duration-300" />
            
            <div className="relative w-28 h-28 bg-stone-900 rounded-full p-1.5 flex flex-col justify-center items-center overflow-hidden shadow-2xl border-4 border-white">
              
              {/* Inner stylized graphics representing Leticia */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3)_0%,transparent_70%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-950/20 to-rose-950/80" />
              
              <span className="text-3xl relative z-10 animate-bounce" style={{ animationDuration: '4s' }}>✨🕊️</span>
              <span className="text-white font-serif font-black text-xl mt-1 tracking-tight drop-shadow-md z-10">
                Lety
              </span>
              <span className="text-[9px] text-rose-200 font-extrabold uppercase tracking-widest z-10 bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-700/30">
                1964 – 2026
              </span>
            </div>
            
            {/* Mini floating hearts */}
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs select-none animate-bounce">
              ❤️
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 border-2 border-red-100 text-rose-600 shadow-xs">
              <Calendar className="w-3 h-3 text-rose-500" />
              Familia Unida
            </span>
          </div>
        </div>

        {/* Tribute Message & Wise Mama Advice */}
        <div className="flex-1 text-center lg:text-left space-y-3">
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white uppercase tracking-widest shadow-xs">
                In Memoriam
              </span>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase tracking-wide">
                El Legado de Mamá
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4.5xl font-serif font-black text-stone-900 tracking-tight leading-none">
              Lety App <span className="bg-gradient-to-r from-rose-500 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent italic font-normal">| El Corazón de Casa</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans font-medium max-w-3xl">
            Inspirada con amor infinito en la memoria de <strong className="font-extrabold text-stone-850">Leticia Rodríguez Escalante (1964 - 2026)</strong>. Un rincón digital inteligente y muy familiar diseñado para guiar de forma amable el presupuesto del hogar, planificar la despensa familiar contra la inflación y cuidar de la salud de nuestra abuela Esperanza con la calidez con la que solo lo haría una madre.
          </p>

          {/* Interactive Advice/Apapacho container */}
          <div className="relative mt-4 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-indigo-500/5 hover:from-amber-500/15 hover:via-rose-500/10 hover:to-indigo-500/10 border-2 border-amber-500/25 rounded-2xl p-4 shadow-inner transition-all duration-200">
            
            {/* Top Indicator */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-700 shrink-0">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400 stroke-amber-600 stroke-[2]" />
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-800 font-mono">
                Frases de Lety
              </span>
            </div>

            <div className="flex gap-3.5 items-start pl-1 pr-20">
              <Quote className="w-8 h-8 text-rose-500/25 shrink-0 -mt-1 transform -scale-x-100" />
              <div>
                <p className="text-xs sm:text-sm font-serif italic text-stone-850 leading-relaxed text-left font-bold border-l-2 border-rose-500/30 pl-3">
                  "{advicesToUse[adviceIndex] || advicesToUse[0]}"
                </p>
              </div>
            </div>

            {/* Siguiente apapacho trigger */}
            <button
              onClick={rotateAdvice}
              className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-rose-600 hover:text-rose-800 bg-white hover:bg-rose-50 border-2 border-rose-100 px-3 py-1.5 rounded-xl shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Escuchar otro consejo de Mamá"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
              <span>Siguiente apapacho</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
