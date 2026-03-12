/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EEGDataPoint {
  timestamp: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface BCICommand {
  id: string;
  label: string;
  icon: string;
  predictedCommand: string;
  executedAction: string;
}

export interface DeviceState {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'error';
  lastCommand?: string;
}
