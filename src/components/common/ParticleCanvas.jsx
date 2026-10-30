// src/components/common/ParticleCanvas.jsx
import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ particleType = 'sunbeams' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = 65;
    const items = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      // மழைக்கான வேகம்
      vy: Math.random() * 5 + 4,
      vx: Math.random() * 1.6 + 1.2
    }));

    let celestialAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 🌧️ 1. RAIN MOOD: காற்றில் சாய்ந்து ஆடும் மழைத்துளிகள் (Wind-swept Rain)
      if (particleType === 'rain') {
        items.forEach((drop) => {
          drop.y += drop.vy;
          drop.x += drop.vx; // காற்றில் 25 டிகிரி சாய்ந்து நகரும் இயக்கம்

          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * width - 100;
          }
          if (drop.x > width) {
            drop.x = -20;
          }

          ctx.strokeStyle = 'rgba(147, 197, 253, 0.45)';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + 3.5, drop.y + 14);
          ctx.stroke();
        });
      }

      // 🌙 2. MIDNIGHT & LUNAR: மின்னும் நட்சத்திரங்கள் + மிதக்கும் நிலா
      else if (particleType === 'stars' || particleType === 'lunar') {
        celestialAngle += 0.006;
        const moonX = width * 0.78 + Math.sin(celestialAngle) * 10;
        const moonY = height * 0.12 + Math.cos(celestialAngle * 0.7) * 6;

        const glow = ctx.createRadialGradient(moonX, moonY, 6, moonX, moonY, 32);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        glow.addColorStop(0.6, 'rgba(224, 231, 255, 0.12)');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        items.forEach((star) => {
          star.alpha += star.speed * star.direction;
          if (star.alpha >= 1) star.direction = -1;
          if (star.alpha <= 0.1) star.direction = 1;

          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 🌅 3. SUNRISE / DAWN: உதய சூரியன் மற்றும் தங்கக் கதிர்
      else if (particleType === 'sunrise') {
        celestialAngle += 0.004;
        const sunX = width * 0.8 + Math.sin(celestialAngle) * 6;
        const sunY = height * 0.14 + Math.cos(celestialAngle) * 4;

        const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 45);
        sunGlow.addColorStop(0, 'rgba(251, 146, 60, 0.45)');
        sunGlow.addColorStop(0.5, 'rgba(244, 63, 94, 0.18)');
        sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffedd5';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 13, 0, Math.PI * 2);
        ctx.fill();
      }

      // 🌇 4. SUNSET: மறையும் செவ்வானச் சூரியன்
      else if (particleType === 'sunset') {
        celestialAngle += 0.003;
        const duskX = width * 0.82;
        const duskY = height * 0.16 + Math.sin(celestialAngle) * 5;

        const duskGlow = ctx.createRadialGradient(duskX, duskY, 8, duskX, duskY, 40);
        duskGlow.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
        duskGlow.addColorStop(0.6, 'rgba(168, 85, 247, 0.15)');
        duskGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = duskGlow;
        ctx.beginPath();
        ctx.arc(duskX, duskY, 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(duskX, duskY, 13, 0, Math.PI * 2);
        ctx.fill();
      }

      // ☀️ 5. SUNBEAMS (Bright Peach): மென்மையான பேஸ்டல் கதிர்கள்
      else if (particleType === 'sunbeams') {
        items.forEach((p) => {
          p.alpha += p.speed * p.direction;
          if (p.alpha >= 0.5) p.direction = -1;
          if (p.alpha <= 0.1) p.direction = 1;
          ctx.fillStyle = `rgba(244, 63, 94, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}