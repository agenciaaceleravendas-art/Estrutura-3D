
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 Data URL
  prompt: string;
  timestamp: number;
}

export interface ApiError {
  message: string;
  details?: string;
}
