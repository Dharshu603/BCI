/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Brain, LayoutDashboard, Cpu, Monitor, Info, ArrowRight, Zap, Activity, ShieldCheck } from 'lucide-react';
import { WorkflowDiagram } from '../components/WorkflowDiagram';

const features = [
  {
    icon: Zap,
    title: 'EEG Signal Acquisition',
    description: 'High-fidelity capture of neural electrical activity using advanced EEG sensors.',
    color: 'text-yellow-400',
  },
  {
    icon: Cpu,
    title: 'Signal Processing',
    description: 'Real-time noise filtering and feature extraction for precise signal interpretation.',
    color: 'text-blue-400',
  },
  {
    icon: Activity,
    title: 'ML Analysis',
    description: 'Deep learning models classify brain patterns into actionable digital commands.',
    color: 'text-green-400',
  },
  {
    icon: Monitor,
    title: 'Device Control',
    description: 'Seamless integration with external hardware for direct thought-to-action control.',
    color: 'text-purple-400',
  },
];

export const Home: React.FC = () => {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
        >
          <Brain size={16} />
          <span>The Future of Human-Computer Interaction</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Brain–Computer Interface <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Control System
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-white/60 mb-12 max-w-2xl mx-auto"
        >
          Control devices using brain signals. Experience the next evolution of assistive technology and neural control systems.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center gap-2 group"
          >
            Start Demo
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* Workflow Diagram */}
      <section className="mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How it Works</h2>
          <p className="text-white/40">The end-to-end pipeline from neural activity to device execution.</p>
        </div>
        <WorkflowDiagram />
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all group"
          >
            <div className={`p-4 rounded-xl bg-white/5 border border-white/10 w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
              <feature.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-white/40 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Trust Section */}
      <section className="text-center p-12 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-3xl border border-cyan-500/10">
        <ShieldCheck size={48} className="text-cyan-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Medical Grade Precision</h2>
        <p className="text-white/50 max-w-xl mx-auto">
          Our system utilizes high-resolution EEG sensors and state-of-the-art signal processing algorithms to ensure safe and reliable device control.
        </p>
      </section>
    </div>
  );
};
