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

  // 3. Fluid Wave Canvas Simulation
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
});
