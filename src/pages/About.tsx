/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Brain, Heart, Accessibility, Zap, Globe, Lightbulb, Users, Target } from 'lucide-react';

const applications = [
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Early diagnosis of neurological disorders such as epilepsy, Alzheimer’s, and sleep apnea.',
    color: 'text-red-400',
  },
  {
    icon: Accessibility,
    title: 'Assistive Tech',
    description: 'Empowering individuals with severe motor disabilities to communicate and control their environment.',
    color: 'text-green-400',
  },
  {
    icon: Zap,
    title: 'Smart Device Control',
    description: 'Hands-free interaction with smart homes, computers, and industrial machinery.',
    color: 'text-yellow-400',
  },
  {
    icon: Globe,
    title: 'Future HCI',
    description: 'The next frontier of human-computer interaction, enabling seamless neural-digital integration.',
    color: 'text-blue-400',
  },
];

export const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-8"
        >
          <Brain size={48} />
        </motion.div>
        <h1 className="text-5xl font-bold text-white mb-6">What is a BCI?</h1>
        <p className="text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
          A Brain–Computer Interface (BCI) is a direct communication pathway between an enhanced or wired brain and an external device. It allows for bidirectional information flow, enabling the brain to control hardware and software directly through neural activity.
        </p>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 text-cyan-400">
            <Target size={32} />
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg text-white/60 leading-relaxed">
            Our goal is to bridge the gap between human thought and digital execution. By leveraging state-of-the-art EEG technology and machine learning, we aim to create intuitive, low-latency control systems that enhance human capabilities and provide life-changing solutions for those with physical limitations.
          </p>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={20} />
              Key Innovation
            </h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Unlike traditional interfaces that rely on physical movement, BCI bypasses the peripheral nervous system and muscles, reading intent directly from the source: the brain's electrical signals.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 text-purple-400">
            <Users size={32} />
            <h2 className="text-3xl font-bold">Who is it for?</h2>
          </div>
          <p className="text-lg text-white/60 leading-relaxed">
            While BCI technology has profound implications for the general population in terms of productivity and gaming, its most critical application remains in the field of rehabilitation and assistive technology.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-white mb-1">1B+</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Potential Users</div>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-white mb-1">95%</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Accuracy Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Applications Grid */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Real-World Applications</h2>
          <p className="text-white/40">Transforming industries through neural integration.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {applications.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all group"
            >
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 w-fit mb-6 ${app.color} group-hover:scale-110 transition-transform`}>
                <app.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{app.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{app.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <section className="text-center p-16 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to explore the neural frontier?</h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Join us in developing the next generation of brain-computer interfaces. Experience our interactive demo today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-colors"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};
