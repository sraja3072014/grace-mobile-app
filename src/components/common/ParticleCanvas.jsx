// src/components/common/ParticleCanvas.jsx
import React, { useEffect, useRef } from 'react';

class Particle {
  constructor(type, W, H) {
    this.type = type;
    this.W = W;
    this.H = H;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.W;
    this.y = Math.random() * this.H;

    if (this.type === 'rain') {
      this.speed = Math.random() * 12 + 15;
      this.length = Math.random() * 25 + 10;
      this.opacity = Math.random() * 0.35 + 0.15;
    } else if (this.type === 'star') {
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    } else if (this.type === 'sun') {
      this.radius = Math.random() * 3.5 + 1.5;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * -0.6 - 0.2;
      this.opacity = Math.random() * 0.22 + 0.05;
    }
  }

  update() {
    if (this.type === 'rain') {
      this.y += this.speed;
      this.x += 2;
      if (this.y > this.H) this.reset();
    } else if (this.type === 'star') {
      this.opacity += this.twinkleSpeed;
      if (this.opacity > 1 || this.opacity < 0.2) this.twinkleSpeed *= -1;
    } else if (this.type === 'sun') {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -20 || this.x < -20 || this.x > this.W + 20) {
        this.x = Math.random() * this.W;
        this.y = this.H + 20;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    if (this.type === 'rain') {
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1.3;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - 2, this.y - this.length);
      ctx.stroke();
    } else if (this.type === 'star') {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'sun') {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default function ParticleCanvas({ particleType = 'sun' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    if (particleType !== 'none') {
      const count = particleType === 'rain' ? 100 : particleType === 'star' ? 75 : 35;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(particleType, canvas.width, canvas.height));
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [particleType]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}