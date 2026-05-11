// Effet confettis (canvas plein ecran) - declenche par window.fireConfetti()
(function () {
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let running = false;
  const COLORS = ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(n) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 14,
        vy: -(8 + Math.random() * 12),
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.4,
        gravity: 0.32 + Math.random() * 0.1,
        life: 1,
      });
    }
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.life -= 0.005;
      if (p.y > canvas.height + 50 || p.life <= 0) p.dead = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });
    particles = particles.filter(p => !p.dead);
    if (particles.length > 0) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  window.fireConfetti = function (count = 120) {
    spawn(count);
    if (!running) { running = true; requestAnimationFrame(tick); }
  };

  // Bonus : combo popup
  window.showCombo = function (text) {
    const el = document.createElement('div');
    el.className = 'combo-popup';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  };
})();
