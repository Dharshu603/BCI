/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Filter, Cpu, Brain, Monitor, ArrowRight, CheckCircle2 } from 'lucide-react';

const processingSteps = [
  {
    id: 'raw',
    title: 'EEG Raw Data',
    icon: Activity,
    description: 'Capture raw microvolt electrical signals from the scalp surface.',
    details: ['Sampling Rate: 250Hz', 'Resolution: 24-bit', 'Impedance: <5kΩ'],
    color: 'text-blue-400',
  },
  {
    id: 'filtering',
    title: 'Noise Filtering',
    icon: Filter,
    description: 'Remove artifacts like eye blinks, muscle movement, and power line noise.',
    details: ['Bandpass: 1-50Hz', 'Notch Filter: 60Hz', 'ICA Decomposition'],
    color: 'text-cyan-400',
  },
  {
    id: 'extraction',
    title: 'Feature Extraction',
    icon: Cpu,
    description: 'Isolate specific frequency bands and spatial patterns from the clean signal.',
    details: ['FFT Analysis', 'Wavelet Transform', 'CSP Spatial Filters'],
    color: 'text-indigo-400',
  },
  {
    id: 'classification',
    title: 'ML Classification',
    icon: Brain,
    description: 'Map extracted features to specific user intents using deep learning.',
    details: ['CNN Architecture', 'LSTM Temporal Layers', '95% Accuracy'],
    color: 'text-purple-400',
  },
  {
    id: 'command',
    title: 'Device Command',
    icon: Monitor,
    description: 'Translate classified intent into digital control signals for hardware.',
    details: ['API Integration', 'Low Latency: <50ms', 'Safety Interlocks'],
    color: 'text-green-400',
  },
];

export const SignalProcessing: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processingSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Signal Processing Pipeline</h1>
        <p className="text-white/40 max-w-2xl mx-auto">
          Explore the sophisticated journey of a brain signal from raw electrical activity to digital command execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-16">
        {processingSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <motion.div
              onClick={() => setActiveStep(index)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer h-full ${
                activeStep === index
                  ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 w-fit mb-4 ${step.color}`}>
                <step.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${activeStep >= index ? 'bg-cyan-400' : 'bg-white/10'}`} />
                <span className="text-[10px] uppercase tracking-widest text-white/30">
                  {activeStep === index ? 'Processing...' : activeStep > index ? 'Complete' : 'Pending'}
                </span>
              </div>
            </motion.div>
            {index < processingSteps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 z-10 text-white/10">
                <ArrowRight size={20} />
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="p-12 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 w-fit mb-8 ${processingSteps[activeStep].color}`}>
              {React.createElement(processingSteps[activeStep].icon, { size: 48 })}
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">{processingSteps[activeStep].title}</h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              {processingSteps[activeStep].description}
            </p>
            <div className="space-y-4">
              {processingSteps[activeStep].details.map((detail, i) => (
                <div key={i} className="flex items-center gap-3 text-white/40">
                  <CheckCircle2 size={18} className="text-cyan-400" />
                  <span className="font-mono text-sm">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square rounded-3xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            
            {/* Animated Visualization based on step */}
            <div className="relative z-10 w-full h-full p-12">
              {activeStep === 0 && <RawDataViz />}
              {activeStep === 1 && <FilteringViz />}
              {activeStep === 2 && <ExtractionViz />}
              {activeStep === 3 && <MLViz />}
              {activeStep === 4 && <CommandViz />}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const RawDataViz = () => (
  <div className="w-full h-full flex flex-col justify-center gap-4">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          x: [-20, 20, -20],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        className="h-2 bg-blue-500/30 rounded-full w-full"
      />
    ))}
  </div>
);

const FilteringViz = () => (
  <div className="w-full h-full flex items-center justify-center">
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="w-48 h-48 border-4 border-dashed border-cyan-400/30 rounded-full flex items-center justify-center"
    >
      <Filter size={48} className="text-cyan-400" />
    </motion.div>
  </div>
);

const ExtractionViz = () => (
  <div className="w-full h-full grid grid-cols-2 gap-4">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          scale: [1, 1.05, 1],
          backgroundColor: ["rgba(99, 102, 241, 0.1)", "rgba(99, 102, 241, 0.3)", "rgba(99, 102, 241, 0.1)"],
        }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
        className="rounded-2xl border border-indigo-500/20"
      />
    ))}
  </div>
);

const MLViz = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="grid grid-cols-3 gap-4">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 1, 0.2],
          }}
          transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
          className="w-8 h-8 rounded-lg bg-purple-500"
        />
      ))}
    </div>
  </div>
);

const CommandViz = () => (
  <div className="w-full h-full flex items-center justify-center">
    <motion.div
      animate={{
        y: [0, -20, 0],
        boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 40px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-32 h-32 rounded-3xl bg-green-500/20 border border-green-500/50 flex items-center justify-center"
    >
      <Monitor size={48} className="text-green-500" />
    </motion.div>
  </div>
);
