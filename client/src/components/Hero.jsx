import React from 'react';
import { Shield, Sparkles, Navigation, Info, Power } from 'lucide-react';

const Hero = ({ activeCore, onToggleCore, gravityFactor }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      
      {/* Decorative Light Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
        
        {/* Text Area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-bold font-mono tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(0,242,254,0.08)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Quantum Levitation Core active
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Manipulate <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-purple bg-clip-text text-transparent text-glow-cyan">Spacetime</span> <br />
            Defy Gravity
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-xl mb-8 leading-relaxed font-light">
            Welcome to the frontier of aerospace and physics. Generate real-time local gravitational distortion fields using electro-magnetic quantum core stabilizers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => scrollTo('dashboard')}
              className="flex items-center justify-center gap-2 px-8 py-4 font-mono font-bold tracking-widest text-sm uppercase rounded-xl bg-gradient-to-r from-brand-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-[#030310] shadow-lg shadow-brand-cyan/25 hover:shadow-brand-cyan/45 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <Navigation className="w-4 h-4 rotate-45" /> Control Console
            </button>
            
            <button
              onClick={() => scrollTo('about')}
              className="flex items-center justify-center gap-2 px-8 py-4 font-mono font-bold tracking-widest text-sm uppercase rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-cyan/30 text-white transition-all duration-300 cursor-pointer"
            >
              <Info className="w-4 h-4" /> Technical Specs
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-lg border-t border-white/5 pt-8">
            <div>
              <p className="text-xs font-mono tracking-wider text-gray-500 uppercase">Field Vector</p>
              <p className="text-lg font-bold font-mono text-brand-cyan mt-1">
                {gravityFactor === 1.0 ? 'Vector: DOWN' : gravityFactor <= 0 ? 'Vector: UPWARDS' : 'Vector: WEAK'}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono tracking-wider text-gray-500 uppercase">Gravity Factor</p>
              <p className="text-lg font-bold font-mono text-white mt-1">{gravityFactor.toFixed(2)} G</p>
            </div>
            <div>
              <p className="text-xs font-mono tracking-wider text-gray-500 uppercase">Core Status</p>
              <p className="text-lg font-bold font-mono text-green-400 mt-1 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${activeCore ? 'bg-green-400 animate-ping' : 'bg-red-400'}`} />
                {activeCore ? 'ENGAGED' : 'OFFLINE'}
              </p>
            </div>
          </div>

        </div>

        {/* Floating Orb Visual Area (5 cols) */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[400px]">
          
          {/* Main Levitating Orb Group */}
          <div className={`relative flex items-center justify-center w-80 h-80 rounded-full transition-all duration-1000 ${
            activeCore ? 'animate-float-slow scale-100' : 'translate-y-8 scale-90'
          }`}>
            
            {/* Outer Energy Rings */}
            <div className={`absolute w-full h-full rounded-full border-2 border-dashed border-brand-cyan/20 transition-transform duration-1000 ${
              activeCore ? 'animate-spin' : ''
            }`} style={{ animationDuration: '24s' }} />
            
            <div className={`absolute w-[85%] h-[85%] rounded-full border border-dashed border-brand-purple/20 transition-transform duration-1000 ${
              activeCore ? 'animate-spin' : ''
            }`} style={{ animationDuration: '16s', animationDirection: 'reverse' }} />
            
            {/* Core Shield Sphere */}
            <div className={`relative w-48 h-48 rounded-full glass-panel flex items-center justify-center border-white/10 shadow-[0_0_50px_rgba(0,242,254,0.1)] transition-all duration-700 ${
              activeCore ? 'shadow-brand-cyan/25 border-brand-cyan/20' : ''
            }`}>
              {/* Inner glowing core */}
              <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/20 blur-sm transition-opacity duration-1000 ${
                activeCore ? 'opacity-100' : 'opacity-20'
              }`} />
              
              <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-br from-brand-cyan to-brand-purple transition-all duration-1000 shadow-inner flex items-center justify-center cursor-pointer ${
                activeCore ? 'scale-100 animate-pulse-glow shadow-brand-cyan/40' : 'scale-75 opacity-40 shadow-none'
              }`}
                onClick={onToggleCore}
              >
                <Power className={`w-8 h-8 text-[#030310] transition-all duration-300 ${
                  activeCore ? 'scale-110 drop-shadow-md' : 'scale-90'
                }`} />
              </div>
            </div>

            {/* Orbiting Quantum Particles */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-brand-cyan shadow-[0_0_10px_#00f2fe] animate-float-medium pointer-events-none" 
              style={{ transform: `translate(120px, -40px)` }} 
            />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-brand-purple shadow-[0_0_10px_#a855f7] animate-float-fast pointer-events-none" 
              style={{ transform: `translate(-130px, 60px)` }} 
            />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-float-slow pointer-events-none" 
              style={{ transform: `translate(40px, 110px)` }} 
            />
          </div>

          {/* Floating Data Panels */}
          <div className={`absolute top-0 right-0 sm:-right-6 glass-panel p-4 rounded-xl border-white/5 shadow-2xl transition-all duration-700 ${
            activeCore ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`} style={{ transitionDelay: '300ms' }}>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Magneto-Shield</p>
            <p className="text-sm font-bold text-white mt-1">EM Fields: 100%</p>
            <div className="w-24 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="w-[85%] h-full bg-brand-cyan rounded-full animate-pulse" />
            </div>
          </div>

          <div className={`absolute bottom-4 left-0 sm:-left-6 glass-panel p-4 rounded-xl border-white/5 shadow-2xl transition-all duration-700 ${
            activeCore ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
          }`} style={{ transitionDelay: '500ms' }}>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Quantum State</p>
            <p className="text-sm font-bold text-green-400 mt-1">Superconductive</p>
            <p className="text-[9px] font-mono text-gray-400 mt-1">Temp: -273.15°C</p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
