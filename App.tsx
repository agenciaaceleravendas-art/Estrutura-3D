
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { SvgPreview } from './components/SvgPreview';
import { generateImageFromPrompt } from './services/geminiService';
import { GeneratedImage, GenerationStatus, ApiError } from './types';
import { AlertCircle, Construction } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const handleGenerate = async (prompt: string, sketch?: string) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setCurrentImage(null);

    try {
      const imageUrl = await generateImageFromPrompt(prompt, sketch);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt || "Baseado no rascunho técnico",
        timestamp: Date.now()
      };
      
      setCurrentImage(newImage);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError({
        message: "Erro de Renderização Estrutural",
        details: err.message || "Ocorreu um erro ao tentar converter seu rascunho em 3D."
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500/30">
      <Header />
      
      <main className="relative z-10 pb-24">
        <InputSection onGenerate={handleGenerate} status={status} />
        
        {status === GenerationStatus.ERROR && error && (
          <div className="max-w-2xl mx-auto mt-8 px-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4 text-red-200">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-red-400">{error.message}</h4>
                <p className="text-sm text-red-300/60 mt-1">{error.details}</p>
              </div>
            </div>
          </div>
        )}

        {status === GenerationStatus.SUCCESS && currentImage && (
          <SvgPreview 
            data={currentImage} 
          />
        )}
        
        {status === GenerationStatus.IDLE && (
          <div className="max-w-2xl mx-auto mt-20 text-center px-4">
             <div className="relative inline-flex items-center justify-center mb-8">
                <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-3xl scale-150"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                   <Construction className="w-10 h-10 text-zinc-800" strokeWidth={1} />
                </div>
             </div>
             <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">Aguardando Rascunho ou Texto</p>
             <p className="text-zinc-700 mt-2 max-w-xs mx-auto text-xs">O motor de IA da Palestino agora lê seus desenhos feitos à mão para montar o 3D.</p>
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 w-full py-4 bg-black/50 backdrop-blur-sm border-t border-white/5 text-center pointer-events-none">
         <p className="text-[9px] font-black text-white/10 uppercase tracking-[1em]">Palestino Estruturas & Eventos © 2025</p>
      </footer>
    </div>
  );
};

export default App;
