import React, { useEffect, useRef } from 'react';

const ParticleCanvas = ({ gravityFactor = 1.0, activeCore = true }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, radius: 120 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 120);

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        // If gravity is negative, particles rise up, so start them from bottom.
        // If gravity is positive, particles fall down, so start them from top.
        if (init) {
          this.y = Math.random() * canvas.height;
        } else {
          this.y = gravityFactor <= 0 ? canvas.height + 10 : -10;
        }
        this.size = Math.random() * 3.5 + 0.5;
        // Horizontal drift
        this.speedX = Math.random() * 0.8 - 0.4;
        // Vertical speed scales with gravity factor
        const baseSpeed = Math.random() * 1.5 + 0.5;
        // Negative gravity means particles float upwards (negative Y velocity)
        // When core is active, we multiply the speed
        const coreMultiplier = activeCore ? 1.5 : 0.2;
        this.speedY = -(1.0 - gravityFactor) * baseSpeed * coreMultiplier;
        
        // Colors: cyan/blue/purple gradients
        const colors = [
          'rgba(0, 242, 254, ', 
          'rgba(168, 85, 247, ', 
          'rgba(59, 130, 246, '
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.growing = Math.random() > 0.5;
      }

      update() {
        this.x += this.speedX;
        
        // Dynamic speed adjustment based on gravity slider in real-time
        const baseSpeed = Math.random() * 1.5 + 0.5;
        const coreMultiplier = activeCore ? 1.5 : 0.2;
        this.speedY = -(1.0 - gravityFactor) * baseSpeed * coreMultiplier;
        
        // If gravity is exactly 1.0, drift slightly downwards
        if (Math.abs(gravityFactor - 1.0) < 0.05) {
          this.y += 0.3 * coreMultiplier;
        } else {
          this.y += this.speedY;
        }

        // Slowly pulse alpha
        if (this.growing) {
          this.alpha += this.fadeSpeed;
          if (this.alpha >= 0.8) this.growing = false;
        } else {
          this.alpha -= this.fadeSpeed;
          if (this.alpha <= 0.1) this.growing = true;
        }

        // Mouse interaction (repelling effect)
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
            // Push particles away
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 4;
            this.y += Math.sin(angle) * force * 4;
          }
        }

        // Boundary checks
        if (this.x < 0 || this.x > canvas.width) {
          this.x = Math.random() * canvas.width;
        }

        if (gravityFactor <= 0.5) {
          // Floating UP, check if exited top of screen
          if (this.y < -20) {
            this.reset(false);
          }
        } else {
          // Falling DOWN, check if exited bottom of screen
          if (this.y > canvas.height + 20) {
            this.reset(false);
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${this.alpha})`;
        ctx.fill();

        // If core is active, draw a subtle glow around some particles
        if (activeCore && this.size > 2.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${this.colorPrefix}${this.alpha * 0.15})`;
          ctx.fill();
        }
      }
    }

    // Populate initial particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background space grids if active
      if (activeCore) {
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.015)';
        ctx.lineWidth = 1;
        const gridSize = 80;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gravityFactor, activeCore]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-b from-[#030312] via-[#05061c] to-[#010108]"
    />
  );
};

export default ParticleCanvas;
