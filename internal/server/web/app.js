document.addEventListener('DOMContentLoaded', async () => {
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  let messages = {};

  const els = {
    themeBtn: $('modeBtn'),
    themeIcon: $('modeIcon'),
    themeText: $('modeText'),
    langBtn: $('langBtn'),
    langText: $('langText'),
    menuBtn: $('menuBtn'),
    navMenu: $('navMenu'),
    year: $('year'),
    i18n: document.querySelectorAll('[data-i18n]'),
    contactEmails: document.querySelectorAll('[data-contact-email]'),
    reveal: document.querySelectorAll('.reveal')
  };

  async function getInitialLang() {
    const saved = localStorage.getItem('lang');
    if (saved) return saved;

    try {
      const res = await fetch('/api/lang');
      const data = await res.json();
      return data.lang || 'en';
    } catch {
      return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
    }
  }

  async function loadMessages(lang) {
    const res = await fetch(`/api/i18n/${lang}`);
    if (!res.ok) throw new Error('language unavailable');
    return res.json();
  }

  async function updateLang(lang) {
    try {
      const data = await loadMessages(lang);
      lang = data.lang;
      messages = data.messages || {};
    } catch {
      lang = 'en';
      messages = {};
    }

    root.lang = lang;
    localStorage.setItem('lang', lang);

    els.i18n.forEach((el) => {
      const value = messages[el.getAttribute('data-i18n')];
      if (value) el.innerHTML = value;
    });

    if (els.langText) els.langText.textContent = lang.toUpperCase();

    els.contactEmails.forEach((el) => {
      el.href = `mailto:${lang === 'es' ? 'contacto@luismm2311.com' : 'contact@luismm2311.com'}`;
    });

    updateTheme(root.classList.contains('light') || localStorage.getItem('theme') === 'light');
  }

  function updateTheme(isLight) {
    root.classList.toggle('light', isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    if (els.themeIcon) els.themeIcon.textContent = isLight ? '☀' : '☾';
    if (els.themeText) els.themeText.textContent = isLight ? messages.light_mode || 'Light' : messages.dark_mode || 'Dark';
  }

  function closeMenu() {
    if (!els.navMenu || !els.menuBtn) return;
    els.navMenu.classList.remove('open');
    els.menuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (!els.navMenu || !els.menuBtn) return;
    const isOpen = els.navMenu.classList.toggle('open');
    els.menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  await updateLang(await getInitialLang());
  updateTheme(localStorage.getItem('theme') === 'light');

  if (els.langBtn) {
    els.langBtn.addEventListener('click', () => {
      updateLang(root.lang === 'es' ? 'en' : 'es');
    });
  }

  if (els.themeBtn) {
    els.themeBtn.addEventListener('click', () => {
      updateTheme(!root.classList.contains('light'));
    });
  }

  if (els.menuBtn && els.navMenu) {
    els.menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('click', (e) => {
      if (!els.navMenu.classList.contains('open')) return;
      if (els.navMenu.contains(e.target) || els.menuBtn.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });

    els.navMenu.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a?.getAttribute('href')?.startsWith('#')) closeMenu();
    });
  }

  if (els.year) els.year.textContent = new Date().getFullYear();

  if (els.reveal.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('show');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    els.reveal.forEach((el) => observer.observe(el));
  } else {
    els.reveal.forEach((el) => el.classList.add('show'));
  }
});
