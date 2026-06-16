import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ParticleCanvas from './components/ParticleCanvas';
import Hero from './components/Hero';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [activeCore, setActiveCore] = useState(true);
  const [gravityFactor, setGravityFactor] = useState(1.0);
  const [currentSection, setCurrentSection] = useState('hero');

  const handleToggleCore = () => {
    setActiveCore((prev) => !prev);
  };

  // Scroll spy to update active navigation state
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'dashboard'];
      const scrollPosition = window.scrollY + 250; // offset for triggers

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030310] text-[#f3f4f6] overflow-x-hidden selection:bg-brand-cyan/30 selection:text-white">
      {/* High-Performance Canvas Particle System */}
      <ParticleCanvas gravityFactor={gravityFactor} activeCore={activeCore} />

      {/* Header / Nav */}
      <Navbar
        activeCore={activeCore}
        onToggleCore={handleToggleCore}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Hero Section */}
      <Hero
        activeCore={activeCore}
        onToggleCore={handleToggleCore}
        gravityFactor={gravityFactor}
      />

      {/* Technical concepts specs */}
      <About />

      {/* Control Console telemetry dashboard */}
      <Dashboard
        activeCore={activeCore}
        onToggleCore={handleToggleCore}
        gravityFactor={gravityFactor}
        setGravityFactor={setGravityFactor}
      />

      {/* Footer & Live Diagnostic logs terminal */}
      <Footer activeCore={activeCore} gravityFactor={gravityFactor} />
    </div>
  );
}

export default App;
