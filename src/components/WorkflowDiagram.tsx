/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, Activity, Zap, Monitor, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Brain, label: 'Brain Activity', color: 'text-pink-500' },
  { icon: Zap, label: 'EEG Sensor', color: 'text-yellow-500' },
  { icon: Cpu, label: 'Signal Processing', color: 'text-blue-500' },
  { icon: Activity, label: 'ML Analysis', color: 'text-green-500' },
  { icon: Monitor, label: 'Device Control', color: 'text-purple-500' },
];

export const WorkflowDiagram: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${step.color}`}>
              <step.icon size={32} />
            </div>
            <span className="text-sm font-medium text-white/70 text-center">{step.label}</span>
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: index * 0.2 + 0.1 }}
              className="hidden md:block text-white/20"
            >
              <ArrowRight size={24} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
