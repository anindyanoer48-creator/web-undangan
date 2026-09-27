/**
 * Falling Jasmine (Bunga Melati) & Gold Foil Petals Canvas Simulation
 * Elegant, subtle, non-intrusive ambient effect for Keraton wedding theme.
 */

class PetalsCanvas {
  constructor(canvasId = 'petals-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = window.innerWidth < 640 ? 16 : 32; // dynamic density for mobile performance
    this.animationId = null;
    this.isActive = true;

    this.initCanvasSize();
    this.createPetals();
    this.bindEvents();
    this.start();
  }

  initCanvasSize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createPetals() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      this.petals.push(this.newPetal(true));
    }
  }

  newPetal(randomY = false) {
    const isGold = Math.random() > 0.65; // mix of white jasmine petals and golden dust
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -20,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.9 + 0.6,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      oscillation: Math.random() * 100,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      isGold: isGold,
      opacity: Math.random() * 0.5 + 0.4
    };
  }

  drawPetal(petal) {
    this.ctx.save();
    this.ctx.translate(petal.x, petal.y);
    this.ctx.rotate(petal.rotation);
    this.ctx.globalAlpha = petal.opacity;

    // Draw delicate jasmine / teardrop petal
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(petal.size / 2, -petal.size / 2, petal.size, petal.size / 2, 0, petal.size * 1.5);
    this.ctx.bezierCurveTo(-petal.size, petal.size / 2, -petal.size / 2, -petal.size / 2, 0, 0);
    this.ctx.closePath();

    if (petal.isGold) {
      // Royal Prada Gold Petal
      const grad = this.ctx.createLinearGradient(-petal.size, 0, petal.size, petal.size);
      grad.addColorStop(0, '#fff4b8');
      grad.addColorStop(0.5, '#e5c158');
      grad.addColorStop(1, '#9e761d');
      this.ctx.fillStyle = grad;
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      this.ctx.shadowBlur = 4;
    } else {
      // Jasmine White (Melati Suci)
      const grad = this.ctx.createLinearGradient(0, -petal.size, 0, petal.size * 1.5);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.8, '#f4f0e6');
      grad.addColorStop(1, '#dcd4c0');
      this.ctx.fillStyle = grad;
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
      this.ctx.shadowBlur = 2;
    }

    this.ctx.fill();
    this.ctx.restore();
  }

  updatePetals() {
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.oscillation += p.oscillationSpeed;
      p.x += p.speedX + Math.sin(p.oscillation) * 0.7;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Wrap around bottom/sides
      if (p.y > this.height + 20) {
        this.petals[i] = this.newPetal(false);
      }
      if (p.x > this.width + 20) {
        p.x = -20;
      } else if (p.x < -20) {
        p.x = this.width + 20;
      }
    }
  }

  render() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.petals.length; i++) {
      this.drawPetal(this.petals[i]);
    }

    this.updatePetals();
    this.animationId = requestAnimationFrame(() => this.render());
  }

  start() {
    if (!this.animationId) {
      this.isActive = true;
      this.render();
    }
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.petalsCanvas = new PetalsCanvas('petals-canvas');
});
