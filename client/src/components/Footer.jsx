import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';

const Footer = ({ activeCore, gravityFactor }) => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  const mockLogMessages = [
    'Sub-space exciter frequency locked at 8.44 GHz',
    'YBCO superconductive grids locked at 77 Kelvin',
    'Quantum Casimir cavity vacuum density stabilized',
    'Expelling magnetic flux lines via Meissner shielding',
    'Coherence grid checks completed (efficiency: 99.98%)',
    'Electro-gravitic capacitors operating under 450 kV load',
    'Anode ionization discharge cycles aligned at 2.4 kHz',
    'Virtual particle fluctuation densities monitored',
    'Stress-energy tensor displacement ratio normalized',
    'Auxiliary attitude thrusters synchronized with main core'
  ];

  const logLevels = ['INFO', 'DEBUG', 'SYSTEM'];

  // Add initial logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 6 }, () => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const level = logLevels[Math.floor(Math.random() * logLevels.length)];
      const msg = mockLogMessages[Math.floor(Math.random() * mockLogMessages.length)];
      return `[${time}] [${level}] ${msg}`;
    });
    setLogs(initialLogs);
  }, []);

  // Append new logs periodically
  useEffect(() => {
    if (!activeCore) return;

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      let level = logLevels[Math.floor(Math.random() * logLevels.length)];
      let msg = mockLogMessages[Math.floor(Math.random() * mockLogMessages.length)];

      // Customize log message occasionally based on gravity
      if (Math.random() > 0.6) {
        if (gravityFactor < 0.95) {
          level = 'WARN';
          msg = `Gravity vector distortion index shifted to ${gravityFactor.toFixed(2)} G - local stress increased`;
        } else if (gravityFactor > 1.05) {
          level = 'SYS';
          msg = `Hyper-gravitational pressure core loading at ${gravityFactor.toFixed(2)} G`;
        }
      }

      setLogs((prev) => {
        const next = [...prev, `[${time}] [${level}] ${msg}`];
        if (next.length > 25) return next.slice(1);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeCore, gravityFactor]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <footer className="w-full border-t border-white/5 bg-[#03030d] pt-16 pb-12 px-6 relative overflow-hidden">
      
      {/* Footer Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left Side: Brand & Logs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <div>
            <h3 className="font-display font-extrabold text-white text-lg tracking-wider uppercase">
              GraviShield Telemetry
            </h3>
            <p className="text-gray-500 text-xs font-light mt-1">
              Next-generation spatial displacement and anti-gravity propulsion monitoring nodes.
            </p>
          </div>

          {/* Diagnostic Console Terminal */}
          <div className="w-full bg-black/80 rounded-xl border border-white/5 p-4 shadow-inner flex flex-col h-48">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Diagnostic System Logs</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="flex-grow overflow-y-auto font-mono text-[10px] leading-relaxed text-gray-400 space-y-1 pr-2">
              {logs.map((log, idx) => {
                let colorClass = 'text-gray-400';
                if (log.includes('[WARN]')) colorClass = 'text-amber-400 font-semibold';
                if (log.includes('[SYS]')) colorClass = 'text-brand-cyan';
                if (log.includes('[DEBUG]')) colorClass = 'text-brand-purple/80';
                return (
                  <div key={idx} className={`${colorClass} truncate`}>
                    {log}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Right Side: Links (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-8 pt-4 lg:pt-0">
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500 font-light">
              <li>
                <a href="#hero" className="hover:text-brand-cyan transition-colors">
                  Spatial Stabilization
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-cyan transition-colors">
                  Quantum Blueprints
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-brand-cyan transition-colors">
                  Telemetry Console
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">
                  Vector Calibration
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
              Documentation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-500 font-light">
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">
                  Spacetime Metrics PDF
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">
                  Alcubierre Equations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">
                  YBCO Cryogenics API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-cyan transition-colors">
                  Developer Core SDK
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-mono text-gray-600">
          © {new Date().getFullYear()} GraviShield Industries. Defying limits since 2026.
        </span>
        <div className="flex gap-6 text-xs font-mono text-gray-600">
          <a href="#" className="hover:text-brand-cyan transition-colors">
            Security Protocol
          </a>
          <a href="#" className="hover:text-brand-cyan transition-colors">
            Node Diagnostics
          </a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
