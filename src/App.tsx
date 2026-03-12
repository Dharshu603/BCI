/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { NeuralBackground } from './components/NeuralBackground';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { DeviceControl } from './pages/DeviceControl';
import { SignalProcessing } from './pages/SignalProcessing';
import { About } from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-white selection:bg-cyan-500/30">
        <NeuralBackground />
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/processing" element={<SignalProcessing />} />
            <Route path="/control" element={<DeviceControl />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="relative z-10 py-12 px-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl">
              <span>BCI Control System</span>
            </div>
            <p className="text-white/20 text-sm">
              © 2026 BCI Control System. All rights reserved. Neural-digital integration.
            </p>
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
