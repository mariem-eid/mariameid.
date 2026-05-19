/* ============================================================
   ARCHITECT.JS — "Get Me Hired" Path Interactions
   ============================================================ */

// ── Theme Toggle ─────────────────────────────────────────────
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateToggleIcon(toggle, saved);
  }
  
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateToggleIcon(toggle, next);
  });
}

function updateToggleIcon(btn, theme) {
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ── Flip Cards ───────────────────────────────────────────────
function initFlipCards() {
  // Flip cards are now handled via CSS :hover
}

// ── Scroll Reveal ────────────────────────────────────────────
function initScrollReveal() {
  const archPath = document.getElementById('architect-path');
  if (!archPath) return;
  const reveals = archPath.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px', root: null });

  reveals.forEach(el => observer.observe(el));
}

// ── Smooth Scroll for Nav Links ──────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('#architect-path .nav-links a[href^="#"], #architect-path .btn-hero[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetTop - navHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ── Active Nav Highlight ─────────────────────────────────────
function initActiveNav() {
  const archPath = document.getElementById('architect-path');
  if (!archPath) return;
  const sections = archPath.querySelectorAll('.section-block, .arch-footer');
  const navLinks = archPath.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px', root: null });

  sections.forEach(s => observer.observe(s));
}

// ── Particle Canvas ──────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('archParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let shapes = [];

  let mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let cw, ch;
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  
  function create() {
    particles = [];
    shapes = [];
    const particleCount = Math.floor(cw / 12); // Dynamic count
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        o: Math.random() * 0.5 + 0.3 // Increased opacity
      });
    }

    // Add larger moving geometric shapes
    for (let i = 0; i < 20; i++) {
      shapes.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        size: Math.random() * 20 + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        type: Math.floor(Math.random() * 3) // 0: square, 1: triangle, 2: plus
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, cw, ch);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const colorRGB = isDark ? '239, 83, 80' : '192, 57, 43';
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 130) * 0.5; // Increased line visibility
          ctx.strokeStyle = `rgba(${colorRGB}, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      // Mouse Interaction
      if (mouse.x != null && mouse.y != null) {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let forceDirectionX = dx / dist;
          let forceDirectionY = dy / dist;
          let maxDistance = mouse.radius;
          let force = (maxDistance - dist) / maxDistance;
          let directionX = forceDirectionX * force * 5;
          let directionY = forceDirectionY * force * 5;
          p.x += directionX;
          p.y += directionY;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > cw) p.vx *= -1;
      if (p.y < 0 || p.y > ch) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRGB}, ${p.o})`;
      ctx.fill();
    });

    // Draw floating shapes
    shapes.forEach(s => {
      // Mouse interaction for shapes
      if (mouse.x != null && mouse.y != null) {
        let dx = s.x - mouse.x;
        let dy = s.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let forceDirectionX = dx / dist;
          let forceDirectionY = dy / dist;
          let maxDistance = mouse.radius;
          let force = (maxDistance - dist) / maxDistance;
          let directionX = forceDirectionX * force * 5;
          let directionY = forceDirectionY * force * 5;
          s.x += directionX;
          s.y += directionY;
        }
      }

      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vRot;
      if (s.x < -50) s.x = cw + 50;
      if (s.x > cw + 50) s.x = -50;
      if (s.y < -50) s.y = ch + 50;
      if (s.y > ch + 50) s.y = -50;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.strokeStyle = `rgba(${colorRGB}, 0.35)`; // Increased visibility
      ctx.lineWidth = 2;

      ctx.beginPath();
      if (s.type === 0) { // Square
        ctx.rect(-s.size/2, -s.size/2, s.size, s.size);
      } else if (s.type === 1) { // Triangle
        ctx.moveTo(0, -s.size/1.5);
        ctx.lineTo(s.size/1.5, s.size/1.5);
        ctx.lineTo(-s.size/1.5, s.size/1.5);
        ctx.closePath();
      } else { // Plus
        ctx.moveTo(-s.size/2, 0);
        ctx.lineTo(s.size/2, 0);
        ctx.moveTo(0, -s.size/2);
        ctx.lineTo(0, s.size/2);
      }
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  resize();
  create();
  draw();
  window.addEventListener('resize', () => { resize(); create(); });
}

// ── Initialize All ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFlipCards();
  initParticles();

  // Delay scroll-dependent init until architect path is shown
  const nexusSides = document.querySelectorAll('.side');
  nexusSides.forEach(side => {
    side.addEventListener('click', () => {
      setTimeout(() => {
        initScrollReveal();
        initSmoothScroll();
        initActiveNav();
      }, 900);
    });
  });
});
