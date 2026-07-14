(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const toggleLabel = document.querySelector('[data-nav-toggle-label]');
  const nav = document.querySelector('[data-site-nav]');
  const mobileBreakpoint = 860;

  const setNavState = (open, { returnFocus = false } = {}) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (toggleLabel) toggleLabel.textContent = open ? 'Close menu' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open && window.innerWidth <= mobileBreakpoint);
    if (returnFocus) toggle.focus();
  };

  const closeNav = (options) => setNavState(false, options);

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setNavState(open);
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth > mobileBreakpoint) return;
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!event.target.closest('[data-site-header]')) closeNav();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav({ returnFocus: true });
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > mobileBreakpoint) closeNav();
    }, { passive: true });
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('[data-nav-page]').forEach((link) => {
      if (link.dataset.navPage === page) link.setAttribute('aria-current', 'page');
    });
  }

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const tokens = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    tokens.add('noopener');
    tokens.add('noreferrer');
    link.setAttribute('rel', [...tokens].join(' '));
  });

  document.querySelectorAll('[data-current-year]').forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
})();

(() => {
  const filterButtons = [...document.querySelectorAll('[data-blog-filter]')];
  const blogCards = [...document.querySelectorAll('[data-blog-category]')];
  const emptyMessage = document.querySelector('[data-empty-filter]');

  if (filterButtons.length && blogCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selected = button.dataset.blogFilter;
        let visibleCount = 0;

        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });

        blogCards.forEach((card) => {
          const categories = (card.dataset.blogCategory || '').split(/\s+/);
          const visible = selected === 'all' || categories.includes(selected);
          card.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
      });
    });
  }

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const message = form.querySelector('[name="message"]');
  const counter = form.querySelector('[data-message-count]');
  const status = form.querySelector('[data-form-status]');

  const updateCount = () => {
    if (message && counter) counter.textContent = String(message.value.length);
  };
  message?.addEventListener('input', updateCount);
  updateCount();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements.website?.value) return;

    const data = new FormData(form);
    const recipient = form.dataset.recipient || '';
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || 'Website inquiry').trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Inquiry type: ${subject}`,
      '',
      String(data.get('message') || '').trim()
    ].join('\n');

    if (status) status.textContent = 'Your email application should open with the message prepared.';
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(`${subject} — website message`)}&body=${encodeURIComponent(body)}`;
  });
})();
