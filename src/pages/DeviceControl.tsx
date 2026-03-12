/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Cpu, Accessibility, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square, Play, RefreshCw } from 'lucide-react';

const devices = [
  {
    id: 'computer',
    name: 'Computer Control',
    icon: Monitor,
    description: 'Interface with digital environments using neural commands.',
    actions: ['Select', 'Scroll Up', 'Scroll Down', 'Back'],
    color: 'text-blue-400',
  },
  {
    id: 'robotic-arm',
    name: 'Robotic Arm',
    icon: Cpu,
    description: 'Precision control of physical prosthetic or industrial arms.',
    actions: ['Grip', 'Rotate', 'Extend', 'Retract'],
    color: 'text-purple-400',
  },
  {
    id: 'wheelchair',
    name: 'Smart Wheelchair',
    icon: Accessibility,
    description: 'Autonomous navigation and manual neural steering.',
    actions: ['Forward', 'Backward', 'Left', 'Right'],
    color: 'text-green-400',
  },
];

export const DeviceControl: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleAction = (action: string) => {
    setIsExecuting(true);
    setLastAction(action);
    setTimeout(() => setIsExecuting(false), 800);
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Device Control Simulation</h1>
        <p className="text-white/40">Simulate real-world applications of BCI technology across various hardware platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 bg-white/5 backdrop-blur-md rounded-3xl border transition-all ${
              activeDevice === device.id ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-white/10'
            }`}
          >
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 w-fit mb-6 ${device.color}`}>
              <device.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{device.name}</h3>
            <p className="text-white/40 mb-8 text-sm leading-relaxed">{device.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {device.actions.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setActiveDevice(device.id);
                    handleAction(action);
                  }}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/70 text-sm font-medium transition-all active:scale-95"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activeDevice === device.id ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  {activeDevice === device.id ? 'Connected' : 'Standby'}
                </span>
              </div>
              {activeDevice === device.id && isExecuting && (
                <RefreshCw size={14} className="text-cyan-400 animate-spin" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Execution Visualization */}
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-cyan-500 text-black font-bold rounded-2xl shadow-2xl shadow-cyan-500/20 flex items-center gap-4 z-50"
          >
            <div className="p-2 bg-black/10 rounded-lg">
              <Play size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-60">Executing Command</span>
              <span className="text-lg">{lastAction}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Interface Simulation */}
      <div className="mt-16 p-12 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-50" />
        
        <div className="relative z-10 text-center">
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <motion.div
                animate={{
                  scale: isExecuting ? [1, 1.2, 1] : 1,
                  opacity: isExecuting ? [0.5, 1, 0.5] : 0.5,
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-cyan-400 rounded-full blur-3xl"
              />
              <div className="relative p-12 rounded-full bg-black/60 border border-white/10 backdrop-blur-3xl">
                <Brain size={64} className="text-cyan-400" />
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Neural Feedback Loop</h3>
          <p className="text-white/40 max-w-md mx-auto mb-8">
            Real-time visual feedback of neural command execution. Select a device action above to trigger the simulation.
          </p>

          <div className="flex items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-mono text-white">98.4%</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Accuracy</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-mono text-white">42ms</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Latency</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-mono text-white">12ch</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Channels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Brain = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 4 4 0 0 0 5.327 2.7l.11-.05a3 3 0 1 0 5.132-2.35 4 4 0 0 0 5.327-2.7 4 4 0 0 0 .52-8.106 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5Z" />
    <path d="M9 13a4.5 4.5 0 0 0 3-4" />
    <path d="M6.003 5.125A3 3 0 1 1 12 5" />
    <path d="M12 5a3 3 0 1 1 5.997.125" />
    <path d="M21.474 10.895a4 4 0 1 1-5.327 2.7" />
    <path d="M16.147 13.595a4 4 0 1 1-5.327 2.7" />
    <path d="M10.82 16.295a4 4 0 1 1-5.327 2.7" />
    <path d="M5.493 18.995a4 4 0 1 1-5.327 2.7" />
  </svg>
);
