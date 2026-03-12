/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EEGChart } from '../components/EEGChart';
import { Brain, Activity, Zap, MousePointer2, Eye, MoveLeft, MoveRight, Focus, Smile, Upload, FileJson, AlertCircle, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { BCICommand, EEGDataPoint } from '../types';
import { eegService } from '../services/eegDataService';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const commands: BCICommand[] = [
  { id: 'focus', label: 'Focus', icon: 'Focus', predictedCommand: 'High Attention', executedAction: 'Increase Speed' },
  { id: 'relax', label: 'Relax', icon: 'Smile', predictedCommand: 'Alpha State', executedAction: 'Idle Mode' },
  { id: 'blink', label: 'Blink', icon: 'Eye', predictedCommand: 'Eye Blink', executedAction: 'Select Item' },
  { id: 'left', label: 'Move Left', icon: 'MoveLeft', predictedCommand: 'Motor Imagery: Left', executedAction: 'Turn Left' },
  { id: 'right', label: 'Move Right', icon: 'MoveRight', predictedCommand: 'Motor Imagery: Right', executedAction: 'Turn Right' },
];

const iconMap: Record<string, any> = {
  Focus, Smile, Eye, MoveLeft, MoveRight
};

export const Dashboard: React.FC = () => {
  const [lastCommand, setLastCommand] = useState<BCICommand | null>(null);
  const [commandHistory, setCommandHistory] = useState<{ cmd: BCICommand, time: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [sessionReport, setSessionReport] = useState<any>(null);
  const [hasData, setHasData] = useState(eegService.hasData());
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (cmd: BCICommand) => {
    if (!hasData) {
      setError('Please upload a dataset first to simulate signal processing.');
      return;
    }
    
    // Inject visual feedback into the waves
    if (cmd.id === 'focus') eegService.injectSpike('beta', 25, 8);
    if (cmd.id === 'relax') eegService.injectSpike('alpha', 20, 10);
    if (cmd.id === 'blink') eegService.injectSpike('gamma', 35, 3);
    if (cmd.id === 'left' || cmd.id === 'right') eegService.injectSpike('beta', 15, 6);

    setIsProcessing(true);
    setLastCommand(cmd);
    
    setTimeout(() => {
      setIsProcessing(false);
      setCommandHistory(prev => [{ 
        cmd, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
      }, ...prev].slice(0, 5));
    }, 1500);
  };

  const generateReport = () => {
    if (commandHistory.length === 0) {
      setError('Please trigger some commands first to generate a meaningful report.');
      return;
    }

    const counts = commandHistory.reduce((acc: any, curr) => {
      acc[curr.cmd.id] = (acc[curr.cmd.id] || 0) + 1;
      return acc;
    }, {});

    const dominantState = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0][0];
    
    const insights = {
      totalCommands: commandHistory.length,
      dominantState: commands.find(c => c.id === dominantState)?.label,
      timestamp: new Date().toLocaleString(),
      summary: dominantState === 'focus' 
        ? "Your session shows high levels of cognitive engagement and concentration."
        : dominantState === 'relax'
        ? "Your session indicates a successful shift into a meditative and relaxed state."
        : "Your session shows a variety of neural patterns, indicating active cognitive switching.",
      recommendation: dominantState === 'focus'
        ? "Consider taking a short break to prevent mental fatigue."
        : "You are in an optimal state for creative thinking or stress recovery.",
      waveAnalysis: [
        { name: 'Alpha', status: counts['relax'] > 0 ? 'Active' : 'Baseline', description: 'Associated with relaxation and light meditation.' },
        { name: 'Beta', status: (counts['focus'] > 0 || counts['left'] > 0 || counts['right'] > 0) ? 'High' : 'Normal', description: 'Associated with active thinking and motor imagery.' },
        { name: 'Gamma', status: counts['blink'] > 0 ? 'Spiking' : 'Stable', description: 'Associated with high-level information processing.' }
      ]
    };

    setSessionReport(insights);
    setShowReport(true);
  };

  const validateAndSetData = (data: any[]) => {
    if (!Array.isArray(data)) throw new Error('Invalid format: Expected an array of data points.');
    
    if (data.length === 0) throw new Error('The file is empty.');

    // Helper to find value by case-insensitive key and common aliases
    const getValue = (obj: any, searchKey: string) => {
      const aliases: Record<string, string[]> = {
        alpha: ['alpha', 'alpha_wave', 'alpha wave', 'a-wave', 'eeg_alpha', 'ch1', 'channel1', 'val1'],
        beta: ['beta', 'beta_wave', 'beta wave', 'b-wave', 'eeg_beta', 'ch2', 'channel2', 'val2'],
        gamma: ['gamma', 'gamma_wave', 'gamma wave', 'g-wave', 'eeg_gamma', 'ch3', 'channel3', 'val3'],
        timestamp: ['timestamp', 'time', 'ms', 'date', 'index', 'id']
      };
      
      const searchKeys = aliases[searchKey.toLowerCase()] || [searchKey];
      const objKeys = Object.keys(obj);
      
      // Collect all matching values for the search key (including aliases and patterns like alpha0, alpha1)
      const values: number[] = [];
      
      // Check aliases
      for (const alias of searchKeys) {
        const foundKey = objKeys.find(k => k.toLowerCase() === alias.toLowerCase().trim());
        if (foundKey !== undefined) {
          const val = Number(obj[foundKey]);
          if (!isNaN(val)) values.push(val);
        }
      }

      // Check for wave[number] pattern (e.g., alpha0, alpha1, alpha2, alpha3)
      if (['alpha', 'beta', 'gamma'].includes(searchKey.toLowerCase())) {
        const pattern = new RegExp(`^${searchKey.toLowerCase()}\\d+$`);
        for (const key of objKeys) {
          if (pattern.test(key.toLowerCase())) {
            const val = Number(obj[key]);
            if (!isNaN(val)) values.push(val);
          }
        }
      }

      if (values.length > 0) {
        // Return average if multiple channels found, otherwise the single value
        // Using a Set to avoid double-counting if an alias also matches a pattern
        const uniqueValues = Array.from(new Set(values));
        return uniqueValues.reduce((a, b) => a + b, 0) / uniqueValues.length;
      }

      // If it's an array-like object (no headers), try indices
      if (searchKey === 'alpha' && obj['0'] !== undefined) return obj['0'];
      if (searchKey === 'beta' && obj['1'] !== undefined) return obj['1'];
      if (searchKey === 'gamma' && obj['2'] !== undefined) return obj['2'];
      if (searchKey === 'timestamp' && obj['3'] !== undefined) return obj['3'];

      return undefined;
    };

    const processedData: EEGDataPoint[] = data.map((p, index) => {
      const rawAlpha = getValue(p, 'alpha');
      const rawBeta = getValue(p, 'beta');
      const rawGamma = getValue(p, 'gamma');
      const rawTimestamp = getValue(p, 'timestamp');

      const alpha = Number(rawAlpha);
      const beta = Number(rawBeta);
      const gamma = Number(rawGamma);
      const timestamp = rawTimestamp !== undefined ? Number(rawTimestamp) : index;

      if (rawAlpha === undefined || rawBeta === undefined || rawGamma === undefined) {
        const foundColumns = Object.keys(p).join(', ');
        throw new Error(`Missing columns: Could not find "alpha", "beta", or "gamma" in your file. Found columns: [${foundColumns}]. Please ensure your file has headers or uses the first 3 columns for EEG data.`);
      }

      if (isNaN(alpha) || isNaN(beta) || isNaN(gamma)) {
        throw new Error(`Invalid data at row ${index + 1}: Values must be numbers. Found: alpha=${rawAlpha}, beta=${rawBeta}, gamma=${rawGamma}.`);
      }

      return { timestamp, alpha, beta, gamma };
    });

    eegService.setDataset(processedData);
    setHasData(true);
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          validateAndSetData(json);
        } catch (err: any) {
          setError(err.message || 'Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    } else if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            validateAndSetData(results.data);
          } catch (err: any) {
            setError(err.message || 'Failed to parse CSV file.');
          }
        },
        error: (err) => {
          setError(`CSV parsing error: ${err.message}`);
        }
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          validateAndSetData(json);
        } catch (err: any) {
          setError(err.message || 'Failed to parse Excel file.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Unsupported file format. Please upload JSON, CSV, or Excel.');
    }
  };

  const downloadSample = (format: 'json' | 'csv') => {
    const sample = Array.from({ length: 50 }, (_, i) => ({
      timestamp: 1543421837 + i,
      alpha0: Math.round(Math.sin(i * 0.2) * 10 + 20 + Math.random() * 5),
      alpha1: Math.round(Math.sin(i * 0.2 + 0.5) * 10 + 20 + Math.random() * 5),
      alpha2: Math.round(Math.sin(i * 0.2 + 1.0) * 10 + 20 + Math.random() * 5),
      alpha3: Math.round(Math.sin(i * 0.2 + 1.5) * 10 + 20 + Math.random() * 5),
      beta0: Math.round(Math.cos(i * 0.5) * 15 + 30 + Math.random() * 8),
      beta1: Math.round(Math.cos(i * 0.5 + 0.5) * 15 + 30 + Math.random() * 8),
      beta2: Math.round(Math.cos(i * 0.5 + 1.0) * 15 + 30 + Math.random() * 8),
      beta3: Math.round(Math.cos(i * 0.5 + 1.5) * 15 + 30 + Math.random() * 8),
      gamma0: Math.round(Math.sin(i * 0.8) * 5 + 10 + Math.random() * 3),
      gamma1: Math.round(Math.sin(i * 0.8 + 0.5) * 5 + 10 + Math.random() * 3),
      gamma2: Math.round(Math.sin(i * 0.8 + 1.0) * 5 + 10 + Math.random() * 3),
      gamma3: Math.round(Math.sin(i * 0.8 + 1.5) * 5 + 10 + Math.random() * 3),
      concentration: 0.7
    }));

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
      filename = 'bci_sample_dataset.json';
    } else {
      const csv = Papa.unparse(sample);
      blob = new Blob([csv], { type: 'text/csv' });
      filename = 'bci_sample_dataset.csv';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">EEG Signal Dashboard</h1>
          <p className="text-white/40">Upload your EEG dataset (JSON, CSV, or Excel) to begin simulation.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadSample('json')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-xs"
            >
              <FileJson size={14} />
              <span>JSON Sample</span>
            </button>
            <button
              onClick={() => downloadSample('csv')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-xs"
            >
              <FileText size={14} />
              <span>CSV Sample</span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,.csv,.xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all"
          >
            <Upload size={18} />
            <span>Upload Dataset</span>
          </button>
          {hasData && (
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10"
            >
              <FileText size={18} />
              <span>Generate Report</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
        >
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {!hasData && (
        <div className="mb-12 p-12 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
          <div className="flex justify-center gap-4 mb-6 text-white/20">
            <FileJson size={48} />
            <FileText size={48} />
            <FileSpreadsheet size={48} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Dataset Loaded</h3>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Please upload a JSON, CSV, or Excel file containing EEG data points (alpha, beta, gamma) to visualize brain activity.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
          >
            Select File
          </button>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-500 ${!hasData ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
        {/* EEG Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Alpha Waves (8-13 Hz)</h3>
              </div>
              <span className="text-xs font-mono text-white/30">RELAXATION / FOCUS</span>
            </div>
            <div className="h-48">
              <EEGChart type="alpha" color="#06b6d4" label="Alpha" />
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Beta Waves (13-30 Hz)</h3>
              </div>
              <span className="text-xs font-mono text-white/30">ACTIVE THINKING</span>
            </div>
            <div className="h-48">
              <EEGChart type="beta" color="#3b82f6" label="Beta" />
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Brain size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Gamma Waves (30-100 Hz)</h3>
              </div>
              <span className="text-xs font-mono text-white/30">COGNITIVE PROCESSING</span>
            </div>
            <div className="h-48">
              <EEGChart type="gamma" color="#a855f7" label="Gamma" />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-8">
          <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 sticky top-24">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <MousePointer2 className="text-cyan-400" />
              Brain Activity Control
            </h3>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              {commands.map((cmd) => {
                const Icon = iconMap[cmd.icon];
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleCommand(cmd)}
                    disabled={isProcessing}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 text-white/60 group-hover:text-cyan-400 transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="block font-bold text-white">{cmd.label}</span>
                      <span className="text-xs text-white/30 uppercase tracking-wider">Trigger Signal</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {lastCommand && (
                <motion.div
                  key={lastCommand.id + (isProcessing ? 'p' : 'f')}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-2xl border shadow-lg ${
                    isProcessing ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-emerald-500/20 border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isProcessing ? (
                        <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                      )}
                      <span className={`text-sm font-black uppercase tracking-widest ${isProcessing ? 'text-cyan-400' : 'text-emerald-400'}`}>
                        {isProcessing ? 'Analyzing...' : 'Command Active'}
                      </span>
                    </div>
                    {!isProcessing && (
                      <span className="text-[10px] font-mono text-white/40">RESULT READY</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase mb-1 font-bold">Neural Pattern</p>
                      <p className="text-lg font-mono text-white leading-none">
                        {isProcessing ? '???' : lastCommand.predictedCommand}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase mb-1 font-bold">System Action</p>
                      <p className="text-lg font-mono text-cyan-400 leading-none">
                        {isProcessing ? 'WAITING...' : lastCommand.executedAction}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {commandHistory.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Command Log</h4>
                <div className="space-y-2">
                  {commandHistory.map((item, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span className="text-white font-bold">{item.cmd.label}</span>
                      </div>
                      <span className="font-mono text-white/30">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && sessionReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Neural Session Report</h2>
                  <p className="text-xs text-white/40 font-mono mt-1">GENERATED: {sessionReport.timestamp}</p>
                </div>
                <button 
                  onClick={() => setShowReport(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <AlertCircle className="rotate-45" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Executive Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Brain size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Executive Summary</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-white/80 leading-relaxed italic">"{sessionReport.summary}"</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Dominant State</p>
                    <p className="text-xl font-black text-white">{sessionReport.dominantState}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Total Commands</p>
                    <p className="text-xl font-black text-white">{sessionReport.totalCommands}</p>
                  </div>
                </div>

                {/* Wave Analysis Table */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Activity size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Wave Analysis</h3>
                  </div>
                  <div className="space-y-2">
                    {sessionReport.waveAnalysis.map((wave: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">{wave.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              wave.status === 'High' || wave.status === 'Active' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/40'
                            }`}>
                              {wave.status}
                            </span>
                          </div>
                          <p className="text-xs text-white/40">{wave.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Zap size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Recommendation</h4>
                  </div>
                  <p className="text-sm text-white/70">{sessionReport.recommendation}</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowReport(false)}
                  className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all uppercase tracking-widest text-xs"
                >
                  Dismiss Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
