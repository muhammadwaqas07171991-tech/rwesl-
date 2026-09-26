/* ==========================================================================
   RWESL (Regional Water Environment System Lab) - Unified JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Animated Counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const duration = 1600;
          const increment = target / (duration / 16);

          const update = () => {
            count += increment;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              requestAnimationFrame(update);
            } else {
              counter.innerText = target;
            }
          };
          update();
          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  // 3. Fluid Wave Canvas Simulation (for Hero section)
  const canvas = document.getElementById('waveCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let step = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || 600;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Deep Blue Ambient Wave
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 25) {
        const y = Math.sin((x * 0.003) + (step * 0.02)) * 28 + 
                  Math.cos((x * 0.002) + (step * 0.015)) * 18 + 
                  (height * 0.82);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(2, 132, 199, 0.08)';
      ctx.fill();

      // Cyan Highlight Wave
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 25) {
        const y = Math.sin((x * 0.004) - (step * 0.018)) * 22 + 
                  Math.sin((x * 0.0015) + (step * 0.01)) * 14 + 
                  (height * 0.86);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 212, 255, 0.05)';
      ctx.fill();

      step += 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // 4. Global Ambient Hydrological Telemetry Network Canvas
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas) {
    const actx = ambientCanvas.getContext('2d');
    let awidth, aheight;
    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 30), 45);

    let mouse = { x: null, y: null, maxDist: 150 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeAmbient() {
      awidth = ambientCanvas.width = window.innerWidth;
      aheight = ambientCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeAmbient);
    resizeAmbient();

    class TelemetryNode {
      constructor() {
        this.x = Math.random() * awidth;
        this.y = Math.random() * aheight;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1.2;
        this.color = Math.random() > 0.4 ? 'rgba(0, 212, 255,' : 'rgba(16, 185, 129,';
        this.baseAlpha = Math.random() * 0.35 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = awidth;
        if (this.x > awidth) this.x = 0;
        if (this.y < 0) this.y = aheight;
        if (this.y > aheight) this.y = 0;
      }

      draw() {
        let alpha = this.baseAlpha;
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            alpha = Math.min(1, this.baseAlpha + (1 - dist / mouse.maxDist) * 0.6);
          }
        }

        actx.beginPath();
        actx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        actx.fillStyle = this.color + alpha + ')';
        actx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new TelemetryNode());
    }

    function animateAmbient() {
      actx.clearRect(0, 0, awidth, aheight);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const lineAlpha = (1 - dist / 115) * 0.18;
            actx.beginPath();
            actx.moveTo(particles[i].x, particles[i].y);
            actx.lineTo(particles[j].x, particles[j].y);
            actx.strokeStyle = 'rgba(56, 189, 248,' + lineAlpha + ')';
            actx.lineWidth = 0.8;
            actx.stroke();
          }
        }
      }

      requestAnimationFrame(animateAmbient);
    }
    animateAmbient();
  }
});

// Global Lightbox modal helpers
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
}
