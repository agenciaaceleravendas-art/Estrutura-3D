
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Download, Share2, Maximize2, RefreshCw } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImagePreviewProps {
  data: GeneratedImage | null;
}

export const SvgPreview: React.FC<ImagePreviewProps> = ({ data }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!data) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = data.url;
    link.download = `lumina-${data.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Lumina AI Generation',
          text: `Check out this AI generation: "${data.prompt}"`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(data.url);
        alert("Image URL copied to clipboard!");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="group relative bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)]">
        
        {/* Image Container */}
        <div className={`relative overflow-hidden transition-all duration-700 ease-in-out ${isZoomed ? 'aspect-auto' : 'aspect-square sm:aspect-video'} bg-zinc-950 flex items-center justify-center`}>
          <img 
            src={data.url} 
            alt={data.prompt}
            className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? 'scale-100' : 'scale-[1.01] group-hover:scale-105'}`}
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
             <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-medium text-lg line-clamp-2 shadow-sm italic">
                    "{data.prompt}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
                    title="Toggle Zoom"
                   >
                     <Maximize2 className="w-5 h-5" />
                   </button>
                   <button 
                    onClick={handleDownload}
                    className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 border border-indigo-400/20"
                    title="Download Image"
                   >
                     <Download className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="px-6 py-4 bg-zinc-900/60 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 tracking-wider">
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> GEN 2.5</span>
            <span className="text-zinc-700">|</span>
            <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
             >
               <Share2 className="w-4 h-4" /> SHARE
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
