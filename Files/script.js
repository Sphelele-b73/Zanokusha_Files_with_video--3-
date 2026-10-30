/* Zanokusha Enterprise - Part 3 JavaScript
   Features: mobile nav, reveal animations, tabs, accordion, gallery lightbox,
   dynamic product listing (search / filter / sort / modal), Google Maps embed,
   form validation, AJAX enquiry submission, composed contact email. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    kids.forEach(k => n.append(k));
    return n;
  };
  document.documentElement.classList.add('js');

  /* ---------- Settings you can change ---------- */
  const CONFIG = {
    EMAIL: 'info@zanokushaenterprise.co.za',      // recipient for the contact-form email
    ENDPOINT: '',                                  // e.g. 'https://formspree.io/f/xxxxxxx' - leave empty for demo mode
  };

  /* ---------- Product data (prices are indicative placeholders) ---------- */
  const PRODUCTS = [
    { id: 'spinach', name: 'Fresh Spinach', category: 'Leafy greens', price: 22, minKg: 50, availability: 'In stock', season: 'Year-round, subject to season',
      img: 'images/spinach-field.jpg', alt: 'Rows of leafy spinach growing in dark soil',
      desc: 'Premium spinach grown with sustainable methods, ideal for restaurants, retailers and health-conscious buyers.',
      points: ['Available in bulk quantities', 'Fresh and pesticide-controlled', 'Suits retail and wholesale buyers'] },
    { id: 'green-cabbage', name: 'Green Cabbage', category: 'Cabbage', price: 9, minKg: 100, availability: 'In stock', season: 'Year-round',
      img: 'images/green-cabbage.jpg', alt: 'A firm green cabbage head surrounded by large leaves',
      desc: 'Classic crisp green cabbage for every culinary use, grown to the highest standards.',
      points: ['Classic variety for all culinary uses', 'Bulk orders available', 'Suits supermarkets and food service providers'] },
    { id: 'red-cabbage', name: 'Red Cabbage', category: 'Cabbage', price: 14, minKg: 100, availability: 'Limited stock', season: 'Cool-season crop',
      img: 'images/red-cabbage.jpg', alt: 'Halved and whole red cabbages on a wooden table',
      desc: 'Nutrient-rich and visually appealing red cabbage for salads, slaws and pickling.',
      points: ['Nutrient-rich and colourful', 'Bulk orders available', 'Great for retail displays'] },
    { id: 'maize', name: 'Fresh Maize', category: 'Grain', price: 6, minKg: 500, availability: 'Seasonal', season: 'Harvest roughly February to May',
      img: 'images/maize-cob.jpg', alt: 'A ripe yellow maize cob on the stalk under a blue sky',
      desc: 'High-quality maize ideal for maize meal factories and food production companies.',
      points: ['High-yield, quality grain', 'Suitable for maize meal production', 'Large volume orders welcome'] }
  ];
  const badgeClass = a => a === 'In stock' ? '' : a === 'Seasonal' ? 'seasonal' : 'limited';
  const rand = n => 'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- Mobile navigation ---------- */
  const toggle = $('#nav-toggle'), menu = $('#nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    revealEls.forEach(n => io.observe(n));
  } else revealEls.forEach(n => n.classList.add('in'));

  /* ---------- Tabs (about page) ---------- */
  $$('[role=tablist]').forEach(list => {
    const tabs = $$('[role=tab]', list);
    const select = t => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        $('#' + x.getAttribute('aria-controls')).hidden = !on;
      });
      t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length]); }
      });
    });
  });

  /* ---------- Accordion (FAQ) ---------- */
  $$('.acc-trigger').forEach(btn => btn.addEventListener('click', () => {
    const panel = $('#' + btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    panel.classList.toggle('open', open);
  }));

  /* ---------- Generic overlay helper (modal + lightbox) ---------- */
  let lastFocus = null;
  function openOverlay(ov) {
    lastFocus = document.activeElement;
    ov.hidden = false;
    document.body.style.overflow = 'hidden';
    (ov.querySelector('button') || ov).focus();
  }
  function closeOverlay(ov) {
    ov.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function trapFocus(ov, e) {
    if (e.key !== 'Tab') return;
    const f = $$('button, a[href]', ov).filter(x => !x.hidden);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Gallery lightbox ---------- */
  const thumbs = $$('.gallery button');
  if (thumbs.length) {
    const img = el('img'), cap = el('figcaption');
    const prev = el('button', { className: 'lb-btn lb-prev', type: 'button', textContent: '‹', ariaLabel: 'Previous image' });
    const next = el('button', { className: 'lb-btn lb-next', type: 'button', textContent: '›', ariaLabel: 'Next image' });
    const close = el('button', { className: 'lb-btn lb-close', type: 'button', textContent: '×', ariaLabel: 'Close image viewer' });
    const ov = el('div', { className: 'overlay lightbox', hidden: true, role: 'dialog', ariaModal: 'true', ariaLabel: 'Image viewer' },
      close, prev, next, el('figure', {}, img, cap));
    document.body.append(ov);
    let idx = 0;
    const show = i => {
      idx = (i + thumbs.length) % thumbs.length;
      const t = $('img', thumbs[idx]);
      img.src = t.dataset.full || t.src; img.alt = t.alt; cap.textContent = t.alt;
    };
    thumbs.forEach((b, i) => b.addEventListener('click', () => { show(i); openOverlay(ov); }));
    prev.onclick = () => show(idx - 1);
    next.onclick = () => show(idx + 1);
    close.onclick = () => closeOverlay(ov);
    ov.addEventListener('click', e => { if (e.target === ov) closeOverlay(ov); });
    document.addEventListener('keydown', e => {
      if (ov.hidden) return;
      if (e.key === 'Escape') closeOverlay(ov);
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
      trapFocus(ov, e);
    });
  }

  /* ---------- Products page: dynamic listing ---------- */
  const grid = $('#product-grid');
  if (grid) {
    const q = $('#search'), cat = $('#category'), sort = $('#sort'), count = $('#result-count');
    [...new Set(PRODUCTS.map(p => p.category))].forEach(c => cat.append(el('option', { value: c, textContent: c })));

    const modalBody = el('div');
    const mClose = el('button', { className: 'x', type: 'button', textContent: '×', ariaLabel: 'Close product details' });
    const modalOv = el('div', { className: 'overlay', hidden: true, role: 'dialog', ariaModal: 'true', ariaLabel: 'Product details' },
      el('div', { className: 'modal' }, mClose, modalBody));
    document.body.append(modalOv);
    mClose.onclick = () => closeOverlay(modalOv);
    modalOv.addEventListener('click', e => { if (e.target === modalOv) closeOverlay(modalOv); });
    document.addEventListener('keydown', e => {
      if (modalOv.hidden) return;
      if (e.key === 'Escape') closeOverlay(modalOv);
      trapFocus(modalOv, e);
    });

    const openProduct = p => {
      modalBody.replaceChildren(
        el('img', { src: p.img, alt: p.alt, width: 800, height: 533 }),
        el('h2', { textContent: p.name }),
        el('p', { textContent: p.desc }),
        el('ul', {}, ...p.points.map(t => el('li', { textContent: t }))),
        el('p', {}, el('strong', { textContent: 'Indicative price: ' }), `${rand(p.price)} per kg · minimum order ${p.minKg} kg`),
        el('p', {}, el('strong', { textContent: 'Availability: ' }), `${p.availability} (${p.season})`),
        el('a', { className: 'btn', href: `enquiry.html?product=${p.id}`, textContent: 'Enquire about this product' })
      );
      openOverlay(modalOv);
    };

    const card = p => {
      const b = el('button', { className: 'btn', type: 'button', textContent: 'View details' });
      b.onclick = () => openProduct(p);
      return el('article', { className: 'card' },
        el('img', { src: p.img, alt: p.alt, width: 800, height: 533, loading: 'lazy' }),
        el('div', { className: 'card-body' },
          el('h3', { textContent: p.name }),
          el('span', { className: 'badge ' + badgeClass(p.availability), textContent: p.availability }),
          el('p', { textContent: p.desc }),
          el('p', { className: 'price', textContent: `From ${rand(p.price)} / kg` }), b));
    };

    const render = () => {
      const term = q.value.trim().toLowerCase();
      let list = PRODUCTS.filter(p =>
        (!cat.value || p.category === cat.value) &&
        (!term || [p.name, p.desc, p.category, ...p.points].join(' ').toLowerCase().includes(term)));
      const s = sort.value;
      list.sort((a, b) => s === 'price-asc' ? a.price - b.price : s === 'price-desc' ? b.price - a.price : a.name.localeCompare(b.name));
      grid.replaceChildren(...list.map(card));
      if (!list.length) grid.append(el('p', { textContent: 'No products match your search. Try a different word or clear the filters.' }));
      count.textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
    };
    [q, cat, sort].forEach(c => c.addEventListener('input', render));
    render();
  }

  /* ---------- Form validation ---------- */
  const SA_PHONE = /^(\+27|0)[6-8][0-9]{8}$/;           // mobile numbers e.g. +27 83 261 3339 / 083 261 3339
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const NAME = /^[A-Za-zÀ-ÿ' .-]{2,60}$/;
  const rules = {
    name: v => !v ? 'Enter your full name.' : !NAME.test(v) ? 'Use letters only (2 to 60 characters).' : '',
    email: v => !v ? 'Enter your email address.' : !EMAIL.test(v) ? 'Enter a valid email, like name@example.com.' : '',
    phone: v => !v ? 'Enter your phone number.' : !SA_PHONE.test(v.replace(/[\s()-]/g, '')) ? 'Use a South African mobile number, like 083 261 3339 or +27 83 261 3339.' : '',
    company: v => v.length > 80 ? 'Keep the company name under 80 characters.' : '',
    product: v => v ? '' : 'Choose a product.',
    quantity: v => !v ? 'Enter the quantity you need.' : (+v < 1 || +v > 100000) ? 'Enter a quantity between 1 and 100 000.' : '',
    date: v => {
      if (!v) return '';
      const d = new Date(v + 'T00:00:00'), t = new Date(); t.setHours(0, 0, 0, 0);
      const max = new Date(t); max.setFullYear(t.getFullYear() + 1);
      return d <= t ? 'Choose a date after today.' : d > max ? 'Choose a date within the next year.' : '';
    },
    topic: v => v ? '' : 'Choose what your message is about.',
    subject: v => !v ? 'Enter a subject.' : v.length < 4 ? 'Subject must be at least 4 characters.' : v.length > 100 ? 'Keep the subject under 100 characters.' : '',
    message: v => !v ? 'Enter your message.' : v.length < 10 ? 'Message must be at least 10 characters.' : v.length > 1000 ? 'Keep the message under 1000 characters.' : ''
  };
  function checkField(f) {
    const rule = rules[f.name]; if (!rule) return true;
    const msg = rule(f.value.trim());
    const err = $('#err-' + f.name);
    if (err) err.textContent = msg;
    f.setAttribute('aria-invalid', !!msg);
    return !msg;
  }
  function wireForm(form, onValid) {
    const fields = $$('input, select, textarea', form).filter(f => rules[f.name]);
    fields.forEach(f => {
      f.addEventListener('blur', () => checkField(f));
      f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') checkField(f); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if ($('.hp input', form)?.value) return;           // honeypot: bots fill this in
      const bad = fields.filter(f => !checkField(f));
      if (bad.length) { bad[0].focus(); return; }
      onValid(Object.fromEntries(fields.map(f => [f.name, f.value.trim()])));
    });
    form.addEventListener('reset', () => {
      fields.forEach(f => { f.removeAttribute('aria-invalid'); const e = $('#err-' + f.name); if (e) e.textContent = ''; });
      const s = $('.status'); if (s) s.hidden = true;
    });
  }
  const showStatus = (box, title, rows, bad) => {
    box.className = 'status' + (bad ? ' bad' : '');
    box.hidden = false;
    box.replaceChildren(el('h3', { textContent: title }),
      ...(rows || []));
    box.setAttribute('tabindex', '-1');
    box.focus();
  };

  /* ---------- Enquiry form: AJAX submit + instant response ---------- */
  const enq = $('#enquiry-form-el');
  if (enq) {
    const sel = $('#product', enq), date = $('#date', enq);
    PRODUCTS.forEach(p => sel.append(el('option', { value: p.id, textContent: `${p.name} (from ${rand(p.price)}/kg)` })));
    sel.append(el('option', { value: 'other', textContent: 'Other / multiple products' }));
    const pre = new URLSearchParams(location.search).get('product');
    if (pre && PRODUCTS.some(p => p.id === pre)) sel.value = pre;
    const tmr = new Date(); tmr.setDate(tmr.getDate() + 1);
    date.min = tmr.toISOString().slice(0, 10);

    const send = async data => {
      if (!CONFIG.ENDPOINT) { await new Promise(r => setTimeout(r, 700)); return { demo: true }; }   // demo mode
      const res = await fetch(CONFIG.ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Server responded ' + res.status);
      return res.json();
    };

    wireForm(enq, async data => {
      const btn = $('button[type=submit]', enq), box = $('#enquiry-result');
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        await send(data);
        const ref = 'ZE-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
        const p = PRODUCTS.find(x => x.id === data.product), qty = +data.quantity;
        const rows = [];
        if (p) {
          const meets = qty >= p.minKg;
          rows.push(el('dl', {},
            el('dt', { textContent: 'Product' }), el('dd', { textContent: p.name }),
            el('dt', { textContent: 'Quantity' }), el('dd', { textContent: `${qty.toLocaleString('en-ZA')} kg` }),
            el('dt', { textContent: 'Estimated cost' }), el('dd', { textContent: `${rand(qty * p.price)} (at ${rand(p.price)}/kg, excl. delivery)` }),
            el('dt', { textContent: 'Availability' }), el('dd', { textContent: `${p.availability} - ${p.season}` }),
            el('dt', { textContent: 'Minimum order' }), el('dd', { textContent: meets ? `${p.minKg} kg - your order qualifies.` : `${p.minKg} kg - your quantity is below the minimum, we will contact you about options.` })));
        } else {
          rows.push(el('p', { textContent: 'For multiple products we prepare a combined quote.' }));
        }
        rows.push(el('p', { textContent: `Reference ${ref}. This is an estimate; ${data.name.split(' ')[0]}, our team will confirm the final price and delivery details at ${data.email} within one business day.` }));
        showStatus(box, 'Thank you - your enquiry was received', rows);
        enq.reset();
        box.hidden = false;
      } catch (err) {
        showStatus(box, 'Your enquiry could not be sent', [el('p', {}, `Please try again, or email us at `, el('a', { href: 'mailto:' + CONFIG.EMAIL, textContent: CONFIG.EMAIL }), '.')], true);
      } finally {
        btn.disabled = false; btn.textContent = 'Submit enquiry';
      }
    });
  }

  /* ---------- Contact form: compose an email ---------- */
  const con = $('#contact-form-el');
  if (con) {
    wireForm(con, data => {
      const topics = { general: 'General question', orders: 'Orders and delivery', partner: 'Partnership', feedback: 'Feedback', other: 'Other' };
      const subject = `${topics[data.topic] || 'Message'}: ${data.subject}`;
      const body = `Hello Zanokusha Enterprise,\n\n${data.message}\n\n---\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nTopic: ${topics[data.topic]}`;
      const href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showStatus($('#email-preview'), 'Your email is ready to send', [
        el('p', {}, el('strong', { textContent: 'To: ' }), CONFIG.EMAIL),
        el('p', {}, el('strong', { textContent: 'Subject: ' }), subject),
        el('pre', { className: 'email', textContent: body }),
        el('a', { className: 'btn', href, textContent: 'Send in my email app' }),
        el('p', { textContent: 'This opens your email app with the message filled in. Press send there to deliver it.' })
      ]);
    });
  }
})();
