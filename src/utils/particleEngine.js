export class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.currentMode = 'sunny';
    this.handleResize = this.resize.bind(this);

    window.addEventListener('resize', this.handleResize);
    this.resize();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setMode(mode) {
    this.currentMode = mode;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    if (this.animationId) cancelAnimationFrame(this.animationId);

    const count = this.currentMode === 'rain' ? 100 : this.currentMode === 'night' ? 70 : 35;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
    this.animate();
  }

  createParticle() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      speed: Math.random() * 12 + 15,
      length: Math.random() * 25 + 10,
      radius: Math.random() * 2.5 + 1,
      speedX: Math.random() * 0.8 - 0.4,
      speedY: Math.random() * -0.8 - 0.3,
      opacity: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      if (this.currentMode === 'rain') {
        p.y += p.speed;
        p.x += 2;
        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x - 2, p.y - p.length);
        this.ctx.stroke();
      } else if (this.currentMode === 'night') {
        p.opacity += p.twinkleSpeed;
        if (p.opacity > 0.9 || p.opacity < 0.2) p.twinkleSpeed *= -1;
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (this.currentMode === 'sunny') {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -20 || p.x < -20 || p.x > this.width + 20) {
          p.x = Math.random() * this.width;
          p.y = this.height + 10;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
        this.ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);
  }
}