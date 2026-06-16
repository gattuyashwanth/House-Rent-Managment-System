import React, { useState, useEffect, useRef } from 'react';
import TelemetryChart from './TelemetryChart';
import { Gauge, Zap, ShieldAlert, Thermometer, Wind, RefreshCw, Radio } from 'lucide-react';

const Dashboard = ({ activeCore, onToggleCore, gravityFactor, setGravityFactor }) => {
  const [altitude, setAltitude] = useState(0);
  const [coreTemp, setCoreTemp] = useState(24); // in Celsius
  const [stability, setStability] = useState(100);
  const [charge, setCharge] = useState(0);
  const animationRef = useRef(null);

  // Power Consumption calculation: base power + extra power needed for gravity distortion
  const powerUsage = activeCore
    ? Math.round(150 + Math.abs(1.0 - gravityFactor) * 450)
    : 0;

  // Handle core metrics and altitude simulation
  useEffect(() => {
    let lastTime = Date.now();

    const updateMetrics = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000; // time delta in seconds
      lastTime = now;

      if (activeCore) {
        // Core Temp rises with power usage
        const targetTemp = 24 + (powerUsage / 600) * 120;
        setCoreTemp((prev) => {
          const diff = targetTemp - prev;
          return +(prev + diff * dt * 0.5).toFixed(1);
        });

        // Stability fluctuates around 98-100% based on gravity inversion depth
        setStability((prev) => {
          const maxInstability = Math.max(0, (gravityFactor <= 0 ? Math.abs(gravityFactor) * 4 : 0));
          const targetStability = 99.4 - maxInstability;
          const noise = Math.random() * 0.8 - 0.4;
          const newVal = prev + (targetStability - prev) * dt * 2 + noise;
          return +Math.min(100, Math.max(70, newVal)).toFixed(2);
        });

        // Charge slowly fills up to 100%
        setCharge((prev) => {
          if (prev >= 100) return 100;
          return +(prev + dt * 25).toFixed(1);
        });

        // Altitude rises if gravity is less than 0.9 G. The more negative, the faster it rises.
        if (gravityFactor < 0.95) {
          const upwardAcceleration = (1.0 - gravityFactor) * 85; // m/s² acceleration rate
          setAltitude((prev) => +(prev + upwardAcceleration * dt).toFixed(1));
        } else {
          // Gravity pulled down, altitude falls back to 0
          setAltitude((prev) => {
            if (prev <= 0) return 0;
            const downwardVelocity = (gravityFactor - 0.95) * 50 + 20;
            return +Math.max(0, prev - downwardVelocity * dt).toFixed(1);
          });
        }
      } else {
        // Core Offline: stats cool down, charge drops
        setCoreTemp((prev) => {
          const diff = 24 - prev;
          return +(prev + diff * dt * 0.8).toFixed(1);
        });
        setStability((prev) => {
          const diff = 0 - prev;
          return +(prev + diff * dt * 1.5).toFixed(2);
        });
        setCharge((prev) => {
          if (prev <= 0) return 0;
          return +(prev - dt * 50).toFixed(1);
        });
        setAltitude((prev) => {
          if (prev <= 0) return 0;
          // Free fall to earth
          return +Math.max(0, prev - 120 * dt).toFixed(1);
        });
      }

      animationRef.current = requestAnimationFrame(updateMetrics);
    };

    animationRef.current = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(animationRef.current);
  }, [activeCore, gravityFactor, powerUsage]);

  const resetConsole = () => {
    setGravityFactor(1.0);
    if (!activeCore) onToggleCore();
  };

  const setPreset = (val) => {
    if (!activeCore) onToggleCore();
    setGravityFactor(val);
  };

  return (
    <section id="dashboard" className="relative w-full py-24 px-6 border-t border-white/5 bg-black/40">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-purple uppercase px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20">
            Operations Center
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mt-4 mb-4">
            Interactive Quantum Console
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple mx-auto rounded-full mb-6" />
          <p className="text-gray-400 font-light">
            Calibrate gravity vector metrics and supervise electromagnetic field induction limits in real-time.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Core Status & Switcher */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-white">Quantum Core Generator</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                  activeCore ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {activeCore ? 'Online' : 'Offline'}
                </span>
              </div>
              <p className="text-gray-400 text-xs font-light mb-6">
                Active electromagnetic vacuum excitation is necessary to trigger gravitonic shielding fields.
              </p>
              
              <button
                onClick={onToggleCore}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                  activeCore
                    ? 'bg-red-500/15 border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50 text-red-400'
                    : 'bg-brand-cyan/15 border-brand-cyan/30 hover:bg-brand-cyan/25 hover:border-brand-cyan/50 text-brand-cyan shadow-[0_0_15px_rgba(0,242,254,0.1)]'
                }`}
              >
                {activeCore ? 'Deactivate Gravity Field' : 'De-escalate & Active Core'}
              </button>
            </div>

            {/* Gravity Slider Slider */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 shadow-lg flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-lg text-white">Gravitational Vector (G)</h3>
                  <span className="text-xl font-mono font-extrabold text-brand-cyan text-glow-cyan">
                    {gravityFactor.toFixed(2)} G
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-light mb-6">
                  Slide below 1.0G to begin levitational lift. Negative values represent absolute upward push.
                </p>
                
                {/* Custom Slider */}
                <div className="relative mt-8 mb-6">
                  <input
                    type="range"
                    min="-2.0"
                    max="2.0"
                    step="0.05"
                    value={gravityFactor}
                    onChange={(e) => {
                      if (!activeCore) onToggleCore();
                      setGravityFactor(parseFloat(e.target.value));
                    }}
                    className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-brand-cyan hover:accent-cyan-400 transition-colors"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-2">
                    <span>-2.0G (Levitate Up)</span>
                    <span>0G (Zero Grav)</span>
                    <span>1.0G (Earth standard)</span>
                    <span>2.0G (Hyper Grav)</span>
                  </div>
                </div>
              </div>

              {/* Presets Shortcuts */}
              <div className="border-t border-white/5 pt-6 mt-4">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Core Presets</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => setPreset(1.0)} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-[11px] font-mono font-bold text-gray-300 transition-all cursor-pointer">
                    1.0G Earth
                  </button>
                  <button onClick={() => setPreset(0.0)} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-[11px] font-mono font-bold text-gray-300 transition-all cursor-pointer">
                    0.0G Zero
                  </button>
                  <button onClick={() => setPreset(-1.0)} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-[11px] font-mono font-bold text-gray-300 transition-all cursor-pointer">
                    -1.0G Orbit
                  </button>
                  <button onClick={() => setPreset(-2.0)} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-[11px] font-mono font-bold text-gray-300 transition-all cursor-pointer">
                    -2.0G Thrust
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: Live Data & Charts (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Top 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Card 1: Altitude */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Altitude</span>
                </div>
                <h4 className="text-xl font-mono font-extrabold text-white">{altitude.toLocaleString()} m</h4>
                <p className="text-[9px] font-mono text-gray-500 mt-1">
                  Rate: {gravityFactor < 0.95 ? `+${((1.0 - gravityFactor) * 85).toFixed(1)}m/s` : gravityFactor > 0.95 && altitude > 0 ? `-${((gravityFactor - 0.95) * 50 + 20).toFixed(1)}m/s` : 'Static'}
                </p>
              </div>

              {/* Card 2: Power usage */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <Zap className="w-4 h-4 text-brand-purple" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Load</span>
                </div>
                <h4 className="text-xl font-mono font-extrabold text-white">{powerUsage} kW</h4>
                <p className="text-[9px] font-mono text-gray-500 mt-1">Core Draw Ratio</p>
              </div>

              {/* Card 3: Core temp */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Core Temp</span>
                </div>
                <h4 className="text-xl font-mono font-extrabold text-white">{coreTemp}°C</h4>
                <p className="text-[9px] font-mono text-gray-500 mt-1">Thermal Exciter</p>
              </div>

              {/* Card 4: Stability */}
              <div className="glass-card p-4 rounded-xl">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <ShieldAlert className="w-4 h-4 text-green-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Stability</span>
                </div>
                <h4 className="text-xl font-mono font-extrabold text-white">{stability}%</h4>
                <p className="text-[9px] font-mono text-gray-500 mt-1">Field Harmonic</p>
              </div>

            </div>

            {/* Telemetry Chart Component Card */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 shadow-lg flex-grow flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Gravitational Distortion Waveforms</h3>
                  <p className="text-gray-400 text-xs font-light mt-0.5">Real-time quantum wave harmonics of the Alcubierre warping bubble.</p>
                </div>
                
                <button
                  onClick={resetConsole}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-cyan/25 text-gray-400 hover:text-brand-cyan transition-all cursor-pointer"
                  title="Calibrate Core System"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <TelemetryChart gravityFactor={gravityFactor} activeCore={activeCore} />
              
              {/* Bottom Telemetry Logger */}
              <div className="mt-6 flex items-center justify-between text-[10px] font-mono text-gray-500 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <Radio className={`w-3.5 h-3.5 ${activeCore ? 'text-brand-cyan animate-pulse' : ''}`} />
                  <span>Sub-space Frequency: 8.44 GHz</span>
                </div>
                <span>Core Charge: {charge}%</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Dashboard;
