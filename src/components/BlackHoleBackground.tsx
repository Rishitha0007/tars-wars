import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  angle: number;
  distance: number;
  speed: number;
  color: string;
  alpha: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
}

export const BlackHoleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener('resize', handleResize);

    // Deep space stars
    let stars: Star[] = [];
    const starCount = Math.min(240, Math.floor((width * height) / 5500));

    // Accretion matter sparks
    let particles: Particle[] = [];
    const particleCount = prefersReducedMotion ? 0 : 80;

    const initElements = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
        });
      }

      particles = [];
      const baseRadius = Math.min(width, height) * 0.22;
      for (let i = 0; i < particleCount; i++) {
        const dist = Math.random() * (baseRadius * 2.2) + baseRadius * 1.02;
        particles.push({
          x: 0,
          y: 0,
          radius: Math.random() * 1.8 + 0.6,
          angle: Math.random() * Math.PI * 2,
          distance: dist,
          speed: (Math.random() * 0.007 + 0.003) * ((baseRadius * 2) / dist),
          color: Math.random() > 0.4 ? '#00e5ff' : '#38bdf8',
          alpha: Math.random() * 0.7 + 0.25,
        });
      }
    };

    initElements();

    let rotationAngle = 0;

    const render = () => {
      // 1. Deep Space Void
      ctx.fillStyle = '#010309';
      ctx.fillRect(0, 0, width, height);

      // Center coordinates for Gargantua (prominently sized and positioned)
      const centerX = width * 0.5;
      const centerY = height * 0.44;
      const holeRadius = Math.min(width, height) * 0.22;

      // 2. Cosmic Background Nebulae
      const nebula = ctx.createRadialGradient(
        centerX,
        centerY,
        holeRadius * 0.8,
        centerX,
        centerY,
        holeRadius * 4.2
      );
      nebula.addColorStop(0, 'rgba(14, 30, 68, 0.65)');
      nebula.addColorStop(0.35, 'rgba(8, 18, 44, 0.4)');
      nebula.addColorStop(0.7, 'rgba(4, 9, 24, 0.2)');
      nebula.addColorStop(1, 'rgba(1, 3, 9, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // 3. Stars
      for (const star of stars) {
        if (!prefersReducedMotion) {
          star.alpha += star.twinkleSpeed;
          if (star.alpha > 1 || star.alpha < 0.15) {
            star.twinkleSpeed = -star.twinkleSpeed;
          }
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 246, 255, ${Math.max(0.1, Math.min(1, star.alpha))})`;
        ctx.fill();
      }

      ctx.save();
      ctx.translate(centerX, centerY);

      // 4. LOWER GRAVITATIONAL LENSING ARCH (Reddish-amber warp arc directly matching Image 2!)
      ctx.beginPath();
      ctx.ellipse(0, holeRadius * 0.38, holeRadius * 2.2, holeRadius * 1.35, 0, 0, Math.PI, false);
      ctx.lineWidth = holeRadius * 0.32;
      const lowerRedGrad = ctx.createLinearGradient(-holeRadius * 2.2, 0, holeRadius * 2.2, 0);
      lowerRedGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)'); // Red-orange glow
      lowerRedGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.85)'); // Amber highlight
      lowerRedGrad.addColorStop(0.7, 'rgba(185, 28, 28, 0.5)');
      lowerRedGrad.addColorStop(1, 'rgba(69, 10, 10, 0.1)');
      ctx.strokeStyle = lowerRedGrad;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. UPPER GRAVITATIONAL LENSING ARCH (Electric blue-white halo directly matching Image 2!)
      // Broad atmospheric blue halo
      ctx.beginPath();
      ctx.ellipse(0, -holeRadius * 0.22, holeRadius * 2.6, holeRadius * 1.85, 0, Math.PI, 0, false);
      ctx.lineWidth = holeRadius * 0.48;
      const upperBlueGrad = ctx.createLinearGradient(-holeRadius * 2.6, 0, holeRadius * 2.6, 0);
      upperBlueGrad.addColorStop(0, 'rgba(0, 229, 255, 0.75)'); // Intense Doppler approaching
      upperBlueGrad.addColorStop(0.28, 'rgba(255, 255, 255, 0.95)'); // Pure incandescent white
      upperBlueGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.6)');
      upperBlueGrad.addColorStop(1, 'rgba(14, 116, 144, 0.2)');
      ctx.strokeStyle = upperBlueGrad;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 30;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Razor-sharp inner blue-white crest line
      ctx.beginPath();
      ctx.ellipse(0, -holeRadius * 0.16, holeRadius * 1.85, holeRadius * 1.35, 0, Math.PI, 0, false);
      ctx.lineWidth = holeRadius * 0.14;
      ctx.strokeStyle = 'rgba(240, 253, 244, 0.85)';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();

      // 6. Swirling Accretion Matter Particles
      if (!prefersReducedMotion) {
        rotationAngle += 0.005;
      }

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.angle += p.speed;
        }
        const px = centerX + Math.cos(p.angle) * p.distance;
        const py = centerY + Math.sin(p.angle) * (p.distance * 0.26);

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 7. EQUATORIAL MAIN ACCRETION DISK (Sweeping Across the Front)
      ctx.save();
      ctx.translate(centerX, centerY);

      // Broad luminous front disk
      ctx.beginPath();
      ctx.ellipse(0, 0, holeRadius * 3.6, holeRadius * 0.58, -0.04, 0, Math.PI * 2);
      ctx.lineWidth = holeRadius * 0.44;
      const frontGrad = ctx.createLinearGradient(-holeRadius * 3.6, 0, holeRadius * 3.6, 0);
      frontGrad.addColorStop(0, 'rgba(0, 229, 255, 0.9)'); // Approaching extreme Doppler
      frontGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.98)');
      frontGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.55)');
      frontGrad.addColorStop(1, 'rgba(3, 105, 161, 0.15)');
      ctx.strokeStyle = frontGrad;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 35;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();

      // 8. EVENT HORIZON (Pure Obsidian Infinite Black Void - Image 2)
      ctx.beginPath();
      ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#010206';
      ctx.fill();

      // Photon Ring (Critical Orbit Boundary - Razor Glowing White-Cyan Edge)
      ctx.beginPath();
      ctx.arc(centerX, centerY, holeRadius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 9. Cockpit HUD Holographic Alignment Grid & Reticles
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.lineWidth = 1;

      // Corner Reticles
      const bracketSize = 45;
      const margin = 35;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(margin, margin + bracketSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bracketSize, margin);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + bracketSize);
      ctx.stroke();

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ filter: 'contrast(1.1) saturate(1.2)' }}
        aria-hidden="true"
      />
      {/* Subtle atmospheric scanlines */}
      <div className="absolute inset-0 hologram-scanlines opacity-30 pointer-events-none" />
    </div>
  );
};
