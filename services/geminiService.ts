
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gera uma imagem especializada baseada em um rascunho manual ou prompt de texto.
 */
export const generateImageFromPrompt = async (prompt: string, sketchBase64?: string): Promise<string> => {
  try {
    const systemInstruction = `
      You are an expert event engineer for Palestino Estruturas.
      TASK: Convert the provided hand-drawn sketch (A4 paper) or text description into a high-end 3D realistic rendering.
      INSTRUCTIONS:
      1. Analyze any handwritten text/labels on the sketch (e.g., Q30, Q50, Tenda, Palco).
      2. Interpret the grid/squares as spatial placement for structural components.
      3. Render using Palestino's premium standards: polished aluminum trusses, perfectly tensioned white or crystal PVC, professional stages.
      4. The output must look like a high-quality commercial 3D render, not a drawing.
      5. Style: Architectural photography, cinematic lighting, realistic environment.
    `;

    const parts: any[] = [{ text: `${systemInstruction}\n\nUser request: ${prompt || "Generate the 3D structure based on the uploaded sketch labels."}` }];

    if (sketchBase64) {
      const base64Data = sketchBase64.split(',')[1];
      const mimeType = sketchBase64.split(',')[0].split(':')[1].split(';')[0];
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Não foi possível interpretar o rascunho para gerar a estrutura.");
  } catch (error: any) {
    console.error("Palestino AI Error:", error);
    throw new Error(error.message || "Erro ao sintetizar estrutura.");
  }
};
