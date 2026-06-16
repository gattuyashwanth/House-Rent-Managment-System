import React from 'react';
import { Orbit, Activity, ShieldAlert, Cpu } from 'lucide-react';

const Navbar = ({ activeCore, onToggleCore, currentSection, setCurrentSection }) => {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'Anti-Grav Theory' },
    { id: 'dashboard', label: 'Quantum Console' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 glass-panel border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentSection('hero')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-300">
            <Orbit className={`w-6 h-6 text-brand-cyan transition-transform duration-1000 ${activeCore ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-wider bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent uppercase select-none">
            GraviShield
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSection(item.id);
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                currentSection === item.id
                  ? 'bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20 border border-brand-cyan/30 text-brand-cyan shadow-lg shadow-brand-cyan/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
            <Activity className={`w-4 h-4 ${activeCore ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
            <span className="text-xs font-mono tracking-wider uppercase text-gray-300">
              Field Status: {activeCore ? <span className="text-green-400 font-bold">Stabilized</span> : <span className="text-red-400 font-bold">Suppressed</span>}
            </span>
          </div>

          <button
            onClick={onToggleCore}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono tracking-widest uppercase rounded-lg border transition-all duration-300 cursor-pointer ${
              activeCore
                ? 'bg-cyan-500/10 border-brand-cyan/30 hover:border-brand-cyan/60 text-brand-cyan shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                : 'bg-red-500/10 border-red-500/30 hover:border-red-500/60 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
            }`}
          >
            {activeCore ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Engage Shield
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 animate-bounce" /> Offline Mode
              </>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
