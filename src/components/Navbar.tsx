/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, Cpu, Monitor, Info } from 'lucide-react';

const navItems = [
  { path: '/', icon: Brain, label: 'Home' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/processing', icon: Cpu, label: 'Processing' },
  { path: '/control', icon: Monitor, label: 'Control' },
  { path: '/about', icon: Info, label: 'About' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-cyan-400 font-bold text-xl">
          <Brain className="animate-pulse" />
          <span>BCI Control</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                location.pathname === item.path ? 'text-cyan-400' : 'text-white/60 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile nav could be added here */}
        </div>
      </div>
    </nav>
  );
};
