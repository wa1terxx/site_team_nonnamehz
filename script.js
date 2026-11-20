// ========== CURSOR GLOW ==========
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ========== MOBILE MENU ==========
const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');

burger?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  burger.classList.toggle('open');
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ========== REVEAL ON SCROLL ==========
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// ========== HEADER SHADOW ==========
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.style.boxShadow = '0 4px 30px -10px rgba(0,0,0,0.25)';
    header.style.background = 'rgba(15, 23, 42, 0.55)';
  } else {
    header.style.boxShadow = 'none';
    header.style.background = 'rgba(15, 23, 42, 0.35)';
  }
}, { passive: true });

// ========== SPOTLIGHT + TILT ==========
const spotlightCards = document.querySelectorAll('.bento-card, .price-card, .case-card');
spotlightCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  });
});

// ========== SMOOTH SCROLL + SCROLL PADDING ==========
// (scroll-behavior и scroll-padding-top уже в CSS, но подстрахуемся для старых браузеров)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
    // Закрываем мобильное меню, если открыто
    mobileNav?.classList.remove('open');
  });
});

// ========== ACTIVE ANCHOR HIGHLIGHT ==========
const anchorLinks = document.querySelectorAll('.nav a[data-anchor]');
const anchorTargets = Array.from(anchorLinks)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const anchorObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      anchorLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === id);
      });
    }
  });
}, {
  rootMargin: '-45% 0px -50% 0px',
  threshold: 0
});

anchorTargets.forEach(target => anchorObserver.observe(target));

// ========== PARALLAX ASTRONAUT ==========
const astronaut = document.querySelector('.astronaut-img');
if (astronaut) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      astronaut.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

// ========== MAGNETIC BUTTONS ==========
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ========== AUDIT CALCULATOR ==========
const auditOrders = document.getElementById('audit-orders');
const auditManual = document.getElementById('audit-manual');
const auditTeam = document.getElementById('audit-team');
const auditOrdersVal = document.getElementById('audit-orders-val');
const auditManualVal = document.getElementById('audit-manual-val');
const auditTeamVal = document.getElementById('audit-team-val');
const auditResultHours = document.getElementById('audit-result-hours');

function calculateAudit() {
  if (!auditOrders || !auditManual || !auditTeam) return;
  const orders = parseInt(auditOrders.value, 10);
  const manual = parseInt(auditManual.value, 10);
  const team = parseInt(auditTeam.value, 10);
  auditOrdersVal.textContent = orders;
  auditManualVal.textContent = manual;
  auditTeamVal.textContent = team;
  const hoursPerWeek = Math.round((orders * manual * 0.15) / Math.max(team, 1));
  animateNumber(auditResultHours, hoursPerWeek);
}

function animateNumber(el, target) {
  const start = parseInt(el.textContent, 10) || 0;
  const duration = 400;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

[auditOrders, auditManual, auditTeam].forEach(input => {
  input?.addEventListener('input', calculateAudit);
});
calculateAudit();

// ========== CASE SLIDER ==========
const caseSlider = document.getElementById('case-slider');
const caseSliderAfter = document.getElementById('case-slider-after');
const caseSliderHandle = document.getElementById('case-slider-handle');

if (caseSlider && caseSliderAfter && caseSliderHandle) {
  let isDragging = false;

  function updateSlider(clientX) {
    const rect = caseSlider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    caseSliderAfter.style.clipPath = `inset(0 0 0 ${percent}%)`;
    caseSliderHandle.style.left = `${percent}%`;
  }

  caseSlider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });
  window.addEventListener('mouseup', () => { isDragging = false; });
  caseSlider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
}

// ========== BUBBLES PARALLAX (лёгкий сдвиг при скролле) ==========
const bubbles = document.getElementById('bubbles');
if (bubbles) {
  window.addEventListener('scroll', () => {
    // Очень медленный сдвиг — фон «дышит», но не отвлекает
    bubbles.style.transform = `translateY(${window.scrollY * -0.02}px)`;
  }, { passive: true });
}