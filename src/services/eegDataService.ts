/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EEGDataPoint } from '../types';

export class EEGDataService {
  private data: EEGDataPoint[] = [];
  private currentIndex = 0;
  private activeSpike: { type: 'alpha' | 'beta' | 'gamma', magnitude: number, duration: number } | null = null;

  setDataset(newData: EEGDataPoint[]) {
    this.data = newData;
    this.currentIndex = 0;
  }

  injectSpike(type: 'alpha' | 'beta' | 'gamma', magnitude: number = 20, duration: number = 5) {
    this.activeSpike = { type, magnitude, duration };
  }

  getNextDataPoint(): EEGDataPoint {
    if (this.data.length === 0) {
      return { timestamp: Date.now(), alpha: 0, beta: 0, gamma: 0 };
    }
    const point = { ...this.data[this.currentIndex] };
    this.currentIndex = (this.currentIndex + 1) % this.data.length;

    // Apply spike if active
    if (this.activeSpike && this.activeSpike.duration > 0) {
      point[this.activeSpike.type] += this.activeSpike.magnitude;
      this.activeSpike.duration--;
      if (this.activeSpike.duration <= 0) {
        this.activeSpike = null;
      }
    }

    return {
      ...point,
      timestamp: Date.now(), // Update timestamp for real-time simulation
    };
  }

  getInitialData(count: number = 20): EEGDataPoint[] {
    if (this.data.length === 0) {
      return Array.from({ length: count }, (_, i) => ({
        timestamp: Date.now() - (count - i) * 200,
        alpha: 0,
        beta: 0,
        gamma: 0
      }));
    }
    return this.data.slice(0, count);
  }

  getDataset(): EEGDataPoint[] {
    return this.data;
  }

  hasData(): boolean {
    return this.data.length > 0;
  }
}

export const eegService = new EEGDataService();
