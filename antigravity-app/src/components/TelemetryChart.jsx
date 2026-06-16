import React, { useEffect, useState, useRef } from 'react';

const TelemetryChart = ({ gravityFactor = 1.0, activeCore = true }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [dataPoints2, setDataPoints2] = useState([]);
  const maxPoints = 40;
  const timerRef = useRef(null);

  // Initialize data points
  useEffect(() => {
    const initialData = Array.from({ length: maxPoints }, (_, i) => ({
      x: i,
      y: 50 + Math.random() * 10
    }));
    const initialData2 = Array.from({ length: maxPoints }, (_, i) => ({
      x: i,
      y: 40 + Math.random() * 15
    }));
    setDataPoints(initialData);
    setDataPoints2(initialData2);
  }, []);

  // Update telemetry data dynamically on an interval
  useEffect(() => {
    if (!activeCore) return;

    timerRef.current = setInterval(() => {
      setDataPoints((prev) => {
        const next = [...prev.slice(1)];
        // Wave shifts based on gravity. Inverted gravity creates larger waves
        const gravityEffect = (1.0 - gravityFactor) * 20;
        const randomNoise = Math.random() * 12 - 6;
        // Base value: lower gravity shifts stress index upwards
        const baseline = 50 + gravityEffect;
        const val = Math.max(10, Math.min(95, baseline + randomNoise));
        next.push({ x: maxPoints - 1, y: val });
        return next.map((p, idx) => ({ ...p, x: idx }));
      });

      setDataPoints2((prev) => {
        const next = [...prev.slice(1)];
        const gravityEffect = Math.abs(1.0 - gravityFactor) * 12;
        const randomNoise = Math.random() * 8 - 4;
        const baseline = 35 + gravityEffect;
        const val = Math.max(5, Math.min(90, baseline + randomNoise + Math.sin(Date.now() / 300) * 15));
        next.push({ x: maxPoints - 1, y: val });
        return next.map((p, idx) => ({ ...p, x: idx }));
      });
    }, 250);

    return () => clearInterval(timerRef.current);
  }, [gravityFactor, activeCore]);

  // Convert points to SVG path string
  const getPathString = (points, width, height) => {
    if (points.length === 0) return '';
    const scaleX = width / (maxPoints - 1);
    // Invert Y because SVG coordinates start at top-left (0,0)
    const scaleY = height / 100;
    
    return points
      .map((p, idx) => {
        const xCoord = p.x * scaleX;
        const yCoord = height - p.y * scaleY;
        return `${idx === 0 ? 'M' : 'L'} ${xCoord.toFixed(1)} ${yCoord.toFixed(1)}`;
      })
      .join(' ');
  };

  const getAreaPathString = (points, width, height) => {
    const linePath = getPathString(points, width, height);
    if (!linePath) return '';
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  };

  const width = 500;
  const height = 150;

  const path1 = getPathString(dataPoints, width, height);
  const path2 = getPathString(dataPoints2, width, height);
  const areaPath1 = getAreaPathString(dataPoints, width, height);
  const areaPath2 = getAreaPathString(dataPoints2, width, height);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Spacetime Stress Index</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-purple animate-pulse" />
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Graviton Wave Flux</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 animate-pulse">
          Telemetry Live
        </span>
      </div>

      <div className="relative w-full h-[180px] bg-black/50 border border-white/5 rounded-xl p-4 overflow-hidden flex items-center justify-center">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 pointer-events-none">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="border-t border-l border-white/[0.03] w-full h-full" />
          ))}
        </div>

        {activeCore ? (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="gradientCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Areas */}
            <path d={areaPath2} fill="url(#gradientPurple)" />
            <path d={areaPath1} fill="url(#gradientCyan)" />

            {/* Lines */}
            <path
              d={path2}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
            <path
              d={path1}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]"
            />
          </svg>
        ) : (
          <div className="text-center text-sm font-mono text-gray-500 flex flex-col items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            Core Offline - Signal Connection Lost
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryChart;
