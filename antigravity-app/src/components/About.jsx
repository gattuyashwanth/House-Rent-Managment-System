import React, { useState } from 'react';
import { Atom, Shield, Zap, Orbit } from 'lucide-react';

const About = () => {
  const [activeTab, setActiveTab] = useState('graviton');

  const tabs = {
    graviton: {
      title: 'Quantum Graviton Core',
      icon: <Atom className="w-5 h-5" />,
      tagline: 'Exciting spacetime fields at a sub-atomic scale',
      description: 'The Quantum Graviton Core generates coherent beams of graviton field carriers. By creating a localized density gradient of virtual particles, the core alters the stress-energy tensor surrounding the vessel, producing a controllable anti-gravity vector.',
      metrics: [
        { label: 'Carrier Excitations', value: '1.42 PeV' },
        { label: 'Virtual Flux Density', value: '4.8 × 10¹² / cm³' },
        { label: 'Field Coherence', value: '99.98%' }
      ],
      color: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5'
    },
    warp: {
      title: 'Alcubierre Metric Bubble',
      icon: <Orbit className="w-5 h-5" />,
      tagline: 'Expanding space behind, compressing space in front',
      description: 'By generating negative energy densities using Casimir-type quantum cavities, this generator bends spacetime around the platform. Spacetime is contracted ahead and expanded behind, allowing static levitation and high-velocity motion without inertia.',
      metrics: [
        { label: 'Energy Density', value: '-1.21 MJ/cm³' },
        { label: 'Bubble Thickness', value: '0.04 nm' },
        { label: 'Warp Factor', value: 'Static Lev' }
      ],
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    },
    superconduct: {
      title: 'Meissner Flux Shielding',
      icon: <Shield className="w-5 h-5" />,
      tagline: 'Quantum pinning in high-temperature superconductors',
      description: 'Utilizing ceramic YBCO superconducting grids cooled to cryogenic temperatures, magnetic flux lines from the Earth’s magnetosphere are expelled and locked in place. This provides rock-solid spatial locking and absolute levitational stability.',
      metrics: [
        { label: 'Core Temp', value: '77 K (-196°C)' },
        { label: 'Flux Locking Power', value: '45,000 N' },
        { label: 'Grid Field Rating', value: '8.4 Tesla' }
      ],
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5'
    },
    electrogravity: {
      title: 'Electro-Gravitic Exciter',
      icon: <Zap className="w-5 h-5" />,
      tagline: 'High-voltage asymmetrical electrostatic propulsion',
      description: 'Harnessing the Biefeld-Brown effect, extremely high voltages are applied across asymmetric capacitors. The resulting electrostatic ion-drift couples directly with localized gravitational fields, providing auxiliary attitude control.',
      metrics: [
        { label: 'Applied Potential', value: '450 kV' },
        { label: 'Anode Discharges', value: '2.4 kHz' },
        { label: 'Ion Thrust Output', value: '180 mN' }
      ],
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5'
    }
  };

  return (
    <section id="about" className="relative w-full py-24 px-6 border-t border-white/5 bg-black/20">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
            How Anti-Gravity Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-cyan to-brand-purple mx-auto rounded-full mb-6" />
          <p className="text-gray-400 font-light">
            Manipulating gravity is no longer science fiction. Our systems utilize three fundamental pillars of quantum physics and spatial metrics to achieve static and dynamic levitation.
          </p>
        </div>

        {/* Tab Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Buttons (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {Object.entries(tabs).map(([key, tab]) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'glass-panel-neon border-brand-cyan/45 text-white shadow-[0_0_20px_rgba(0,242,254,0.08)]'
                      : 'bg-white/2 hover:bg-white/5 border-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-gray-500'
                  }`}>
                    {tab.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{tab.title}</h4>
                    <p className="text-[10px] font-mono text-gray-500 mt-0.5 uppercase tracking-wider truncate">
                      {tab.metrics[0].value} / {tab.metrics[1].value}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Concept Detail Card (8 cols) */}
          <div className="lg:col-span-8">
            <div className="glass-panel p-8 rounded-2xl border-white/5 shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              
              {/* Scanline element */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/2 to-transparent pointer-events-none -z-10 animate-scanline" />

              <div>
                {/* Active Tab Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-widest text-brand-cyan uppercase">
                      Core Blueprint Section
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-white mt-1">
                      {tabs[activeTab].title}
                    </h3>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider uppercase ${tabs[activeTab].color}`}>
                    {tabs[activeTab].icon} Quantum Metric
                  </div>
                </div>

                {/* Content */}
                <p className="text-brand-cyan font-mono text-xs uppercase tracking-wider mb-3">
                  // {tabs[activeTab].tagline}
                </p>
                <p className="text-gray-300 leading-relaxed font-light mb-8">
                  {tabs[activeTab].description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-black/40 border border-white/5 rounded-xl p-5">
                {tabs[activeTab].metrics.map((metric, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                      {metric.label}
                    </span>
                    <span className="text-base font-mono font-extrabold text-white mt-1">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
