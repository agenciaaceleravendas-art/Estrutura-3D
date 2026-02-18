
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useRef } from 'react';
import { Sparkles, Loader2, Construction, FileUp, X, FileText } from 'lucide-react';
import { GenerationStatus } from '../types';

interface InputSectionProps {
  onGenerate: (prompt: string, sketch?: string) => void;
  status: GenerationStatus;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status }) => {
  const [input, setInput] = useState('');
  const [sketch, setSketch] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSketch(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || sketch) && status !== GenerationStatus.LOADING) {
      onGenerate(input.trim(), sketch || undefined);
    }
  }, [input, sketch, status, onGenerate]);

  const removeSketch = () => {
    setSketch(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
          Do Rascunho ao 3D.
        </h2>
        <p className="text-zinc-500 text-lg">
          Suba a foto do seu desenho A4 ou descreva a estrutura.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sketch Preview */}
        {sketch && (
          <div className="relative w-32 h-32 mx-auto mb-4 animate-in zoom-in duration-300">
            <img src={sketch} alt="Preview" className="w-full h-full object-cover rounded-xl border-2 border-orange-500 shadow-lg" />
            <button 
              type="button"
              onClick={removeSketch}
              className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-orange-600 text-[8px] font-bold text-white rounded uppercase whitespace-nowrap">
              Rascunho A4
            </div>
          </div>
        )}

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-10 group-hover:opacity-30 transition duration-700 blur-xl"></div>
          <div className="relative flex items-center bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden p-2 rounded-xl">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`pl-4 flex items-center gap-2 transition-colors ${sketch ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Upload Rascunho A4"
            >
              <FileUp className="w-5 h-5" />
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={sketch ? "Adicione detalhes extras (opcional)..." : "Descreva ou suba um rascunho..."}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-700 px-4 py-3"
              disabled={isLoading}
            />
            
            <button
              type="submit"
              disabled={(!input.trim() && !sketch) || isLoading}
              className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300
                ${(!input.trim() && !sketch) || isLoading 
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                  : 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-500/20'}
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">{isLoading ? 'Processando...' : 'Gerar 3D'}</span>
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
          <FileText className="w-3 h-3 text-orange-500" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Dica: Escreva os nomes das peças nos quadrados do desenho</span>
        </div>
      </div>
    </div>
  );
};
