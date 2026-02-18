
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Layout, Tent } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 border-b border-white/5 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg shadow-orange-500/20">
            <Tent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">Palestino <span className="text-orange-500">AI</span></h1>
            <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] uppercase">Visualizador de Estruturas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Motor Estrutural Ativo</span>
          </div>
        </div>
      </div>
    </header>
  );
};
