/* LAB301 / OPERATIONS — shared chrome + palette controls */
(function(){
  // ── Yandex Metrika 109259274 — deferred after load to avoid TBT impact
  window.addEventListener('load', function() {
    setTimeout(function() {
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109259274','ym');
      ym(109259274,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
      if(!document.querySelector('noscript[data-ym]')){
        var ns=document.createElement('noscript');ns.setAttribute('data-ym','');
        ns.innerHTML='<div><img src="https://mc.yandex.ru/watch/109259274" style="position:absolute;left:-9999px" alt=""/></div>';
        document.body.appendChild(ns);
      }
    }, 3000);
  });

  // ── Clean URL: strip .html from address bar (GitHub Pages only, not file://)
  try {
    if (window.location.protocol !== 'file:' && window.location.pathname.endsWith('.html')) {
      var cleanPath = window.location.pathname.slice(0, -5);
      history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
    }
  } catch(e) {}
  const NAMES = {
    signal:"SIGNAL // 01", cyber:"CYBER // 02", acid:"ACID // 03",
    magenta:"PLASMA // 04", amber:"SODIUM // 05", ice:"ARCTIC // 06"
  };
  const root = document.documentElement;

  // ── pick up saved settings
  try {
    const p = localStorage.getItem('lab301.palette');
    const d = localStorage.getItem('lab301.density');
    const l = localStorage.getItem('lab301.lang');
    const bg = localStorage.getItem('lab301.bg');
    if (p && NAMES[p]) root.setAttribute('data-palette', p);
    if (d) root.setAttribute('data-density', d);
    if (l === 'en') root.setAttribute('lang', 'en');
    if (bg === 'grey') root.setAttribute('data-bg', 'grey');
  } catch(e){}

  // Translation dictionary for chrome + common UI strings
  const lang = root.getAttribute('lang') === 'en' ? 'en' : 'ru';
  const T = {
    ru: {
      home:'Главная', services:'Услуги', sites:'Сайты', ai:'AI-Ассистент', process:'Процесс', cases:'Архив', news:'Новости', faq:'FAQ', contacts:'Контакты',
      live:'LAB301 / OPERATIONS LIVE', sys:'SYS · STABLE', uptime:'UPTIME · 99.98%', queue:'QUEUE · 03', tz:'MSK GMT+3',
      cta:'Заказать сайт', menuOpen:'Открыть меню', backHome:'LAB301 — на главную',
      fBrand:'LAB301 / OPS', fAbout:'Лаборатория, которая собирает сайты, AI‑агентов и&nbsp;автоматизации для роста&nbsp;бизнеса.',
      fNav:'Навигация', fSvc:'Сервисы', fLink:'Связь',
      fSvcSite:'Сайт под ключ', fSvcAi:'AI‑агент', fSvcAuto:'Автоматизация', fSvcPerf:'Performance',
      fLegal1:'WhatsApp принадлежит компании Meta, деятельность которой признана экстремистской и&nbsp;запрещена на&nbsp;территории РФ.',
      fLegal2:'Информация на&nbsp;сайте носит ознакомительный характер и&nbsp;не&nbsp;является публичной офертой в&nbsp;соответствии со&nbsp;ст.&nbsp;437 ГК&nbsp;РФ.',
      fCopy:'© LAB301 · 2026 · все&nbsp;права&nbsp;защищены', fBuild:'BUILD', fPalette:'PALETTE',
      fPowered:'Михалыч powered by AI · Built with',
      dPalette:'ПАЛИТРА', dDensity:'ПЛОТНОСТЬ', dCompact:'Compact', dComfort:'Comfortable', dSpacious:'Spacious',
      dLang:'Язык', dA11y:'Режим доступности'
    },
    en: {
      home:'Home', services:'Services', sites:'Sites', ai:'AI Assistant', process:'Process', cases:'Archive', news:'News', faq:'FAQ', contacts:'Contacts',
      live:'LAB301 / OPERATIONS LIVE', sys:'SYS · STABLE', uptime:'UPTIME · 99.98%', queue:'QUEUE · 03', tz:'MSK GMT+3',
      cta:'Order a site', menuOpen:'Open menu', backHome:'LAB301 — home',
      fBrand:'LAB301 / OPS', fAbout:'A lab building websites, AI&nbsp;agents and automations that move business metrics.',
      fNav:'Navigation', fSvc:'Services', fLink:'Contact',
      fSvcSite:'Website turnkey', fSvcAi:'AI agent', fSvcAuto:'Automation', fSvcPerf:'Performance',
      fLegal1:'WhatsApp is owned by Meta, whose activities are recognized as extremist and prohibited in&nbsp;the&nbsp;Russian Federation.',
      fLegal2:'Information on&nbsp;the&nbsp;site is for reference only and does not constitute a&nbsp;public offer under Art.&nbsp;437 of&nbsp;the&nbsp;Civil Code of&nbsp;the&nbsp;Russian Federation.',
      fCopy:'© LAB301 · 2026 · all&nbsp;rights&nbsp;reserved', fBuild:'BUILD', fPalette:'PALETTE',
      fPowered:'Mikhalych powered by AI · Built with',
      dPalette:'PALETTE', dDensity:'DENSITY', dCompact:'Compact', dComfort:'Comfortable', dSpacious:'Spacious',
      dLang:'Language', dA11y:'Accessibility mode'
    }
  };
  const t = T[lang];

  // ── ribbon + nav + footer + dock chrome
  const palette = root.getAttribute('data-palette') || 'signal';
  const density = root.getAttribute('data-density') || 'comfortable';

  const pageId = document.body.dataset.page || '';
  const NAV = [
    { id:'home',     i:'00', label:t.home,     href:'index.html' },
    { id:'services', i:'01', label:t.services, href:'services.html' },
    { id:'sites',    i:'02', label:t.sites,    href:'sites.html' },
    { id:'ai',       i:'03', label:t.ai,       href:'ai-assistant.html' },
    { id:'process',  i:'04', label:t.process,  href:'process.html' },
    { id:'cases',    i:'05', label:t.cases,    href:'cases.html' },
    { id:'news',     i:'06', label:t.news,     href:'news.html' },
    { id:'contacts', i:'07', label:t.contacts, href:'contacts.html' },
  ];

  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const yy = String(now.getFullYear()).slice(2);

  const ribbon = `
    <div class="ribbon">
      <span class="live">${t.live}</span>
      <div class="ribbon-mid">
        <span>${t.sys}</span>
        <span>${t.uptime}</span>
        <span>${t.queue}</span>
        <span>${t.tz}</span>
      </div>
      <span class="mono">${dd}.${mm}.${yy}</span>
    </div>`;

  const navLinks = NAV.map(n =>
    `<li><a data-i="${n.i}" href="${n.href}"${n.id===pageId?' aria-current="page"':''}>${n.label}</a></li>`
  ).join('');

  const drawerLinks = NAV.map(n =>
    `<li><a data-i="${n.i}" href="${n.href}"${n.id===pageId?' aria-current="page"':''}>${n.label}</a></li>`
  ).join('');

  const nav = `
    <nav class="topnav">
      <a class="logo" href="index.html" aria-label="${t.backHome}">
        <img src="guga.avif" alt="LAB301" class="logo-img" width="1200" height="630" fetchpriority="high" decoding="async" />
        <span class="dim"><span class="dim-l1">AI automation&amp;</span><span class="dim-l2">Digital studio</span></span>
      </a>
      <ul class="nav-links">${navLinks}</ul>
      <div class="nav-right">
        <button class="bg-toggle nav-bg-toggle" id="bgToggle" aria-label="Сменить фон" title="Тёмный / Чёрный фон">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13V1.5z" fill="currentColor"/></svg>
        </button>
        <a class="nav-cta" href="thankyou.html?to=https://t.me/Judgeopenclawbot">${t.cta} <span class="arrow">→</span></a>
      </div>
      <div class="nav-mobile-controls">
        <button class="bg-toggle nav-bg-toggle" aria-label="Сменить фон" title="Тёмный / Чёрный фон">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13V1.5z" fill="currentColor"/></svg>
        </button>
        <button class="hamburger" id="hamburger" aria-label="${t.menuOpen}" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
      <ul class="drawer-links">${drawerLinks}</ul>
      <div class="drawer-cta">
        <a class="btn-primary" href="thankyou.html?to=https://t.me/Judgeopenclawbot">Заказать сайт <span>→</span></a>
        <a class="btn-secondary" href="tel:+79996708772">+7 999 670 87 72</a>
        <a class="btn-secondary" href="mailto:lab.301@ya.ru">lab.301@ya.ru</a>
      </div>
    </div>
    <a class="fab-order" href="thankyou.html?to=https://t.me/Judgeopenclawbot" aria-label="Заказать сайт">
      <span class="fab-text">Заказать сайт</span>
    </a>`;

  const footer = `
    <footer>
      <div class="container">
        <div class="f-grid">
          <div class="f-brand">
            <img src="guga.avif" alt="LAB301" class="f-logo-img" style="height:160px;" width="1200" height="630" loading="lazy" decoding="async" />
            <p>${t.fAbout}</p>
            <div class="f-powered">
              <span>${t.fPowered}</span>
              <img src="image-151.avif" alt="Mikhalych AI" class="f-powered-img" width="1768" height="363" loading="lazy" decoding="async" />
            </div>
            <div class="f-stack">OpenAI &middot; Anthropic &middot; Next.js &middot; React.js &middot; Vercel &middot; Figma &middot; n8n &middot; Netlify &middot; Cloudflare &middot; GitHub &middot; GitLab &middot; Render &middot; Supabase &middot; Yandex &middot; Telegram &middot; Bitrix24 &middot; REG.RU &middot; AmoCRM &middot; YooKassa &middot; Tinkoff &middot; VK</div>
          </div>
          <div class="f-col">
            <h5>${t.fNav}</h5>
            <ul>
              <li><a href="services.html">${t.services}</a></li>
              <li><a href="sites.html">${t.sites}</a></li>
              <li><a href="ai-assistant.html">${t.ai}</a></li>
              <li><a href="process.html">${t.process}</a></li>
              <li><a href="cases.html">${t.cases}</a></li>
              <li><a href="news.html">${t.news}</a></li>
              <li><a href="privacy.html">Конфиденциальность</a></li>
              <li><a href="faq.html">${t.faq}</a></li>
              <li><a href="brief-14-days.html">Бриф за 14 дней</a></li>
              <li><a href="ai-agent-checklist.html">Чек-лист AI-агента</a></li>
            </ul>
          </div>
          <div class="f-col">
            <h5>${t.fSvc}</h5>
            <ul>
              <li><a href="sites.html">${t.fSvcSite}</a></li>
              <li><a href="ai-assistant.html">${t.fSvcAi}</a></li>
              <li><a href="services.html">${t.fSvcAuto}</a></li>
              <li><a href="services.html">${t.fSvcPerf}</a></li>
              <li><a href="services.html">Брендинг и&nbsp;дизайн</a></li>
              <li><a href="services.html">Сопровождение</a></li>
              <li><a href="services.html">Яндекс Бизнес</a></li>
              <li><a href="services.html">Аналитика и&nbsp;аудит</a></li>
            </ul>
          </div>
          <div class="f-col">
            <h5>${t.fLink}</h5>
            <ul>
              <li><a href="thankyou.html?to=https://t.me/yuriybyg">Telegram</a></li>
              <li><a href="https://wa.me/79996708772">WhatsApp</a></li>
              <li><a href="tel:+79996708772">+7 999 670 87 72</a></li>
              <li><a href="mailto:lab.301@ya.ru">lab.301@ya.ru</a></li>
            </ul>
          </div>
        </div>
        <div class="f-legal">
          <p>${t.fLegal1}</p>
          <p>${t.fLegal2}</p>
        </div>
        <div class="f-bot">
          <span>${t.fCopy}</span>
          <span>Built for humans with <button id="f-heart" aria-label="Made with love" style="background:none;border:none;cursor:pointer;padding:0 1px;font-size:15px;line-height:1;color:#E8192C;display:inline;vertical-align:middle;transition:transform .15s ease;will-change:transform;">❤</button> optimized by AI.</span>
        </div>
      </div>
    </footer>`;


  // Batch ALL reads first to avoid forced reflow (layout thrash prevention)
  const hasLayers = !!document.querySelector('.grid-bg');
  const hasNav    = !!document.querySelector('nav.topnav');
  const hasRibbon = !!document.querySelector('.ribbon');
  const hasFooter = !!document.querySelector('footer');
  const hasBgBtn  = !!document.querySelector('.bg-toggle:not(.nav-bg-toggle)');
  const isDesktop = window.innerWidth > 768;

  // Build everything in detached fragments → single reflow per insertion point
  const parseHTML = (html) => {
    const tmp = document.createElement('template');
    tmp.innerHTML = html.trim();
    return tmp.content;
  };

  // Prepend chunk: ribbon + nav + (optional bg layers)
  const prependFrag = document.createDocumentFragment();
  if (!hasRibbon) prependFrag.appendChild(parseHTML(ribbon));
  if (!hasNav)    prependFrag.appendChild(parseHTML(nav));
  if (!hasLayers && isDesktop) {
    prependFrag.appendChild(parseHTML('<div class="grid-bg"></div><div class="bloom"></div><div class="grain"></div>'));
  }
  if (prependFrag.childNodes.length) document.body.prepend(prependFrag);

  // Append chunk: footer + floating bg toggle
  const appendFrag = document.createDocumentFragment();
  if (!hasFooter) appendFrag.appendChild(parseHTML(footer));
  if (!hasBgBtn) {
    appendFrag.appendChild(parseHTML('<button class="bg-toggle" aria-label="Сменить фон" title="Тёмный / Чёрный фон"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13V1.5z" fill="currentColor"/></svg></button>'));
  }
  if (appendFrag.childNodes.length) document.body.appendChild(appendFrag);
  // shared toggle logic for all .bg-toggle buttons
  const bgToggleHandler = () => {
    const isGrey = root.getAttribute('data-bg') === 'grey';
    if (isGrey) { root.removeAttribute('data-bg'); }
    else { root.setAttribute('data-bg', 'grey'); }
    try { localStorage.setItem('lab301.bg', isGrey ? '' : 'grey'); } catch(e){}
  };
  document.querySelectorAll('.bg-toggle').forEach(b => b.addEventListener('click', bgToggleHandler));

  // ── Footer heart confetti
  const fHeart = document.getElementById('f-heart');
  if (fHeart) {
    fHeart.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.3)'; });
    fHeart.addEventListener('mouseleave', function() { this.style.transform = ''; });
    fHeart.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const colors = ['#E8192C','#FF3B47','#FF6B6B','#ff8fa3','#C4223A','#ff4d6d'];
      const hearts = ['❤','🩷','❤','❤','🩷','❤'];
      for (var i = 0; i < 28; i++) {
        (function(idx) {
          setTimeout(function() {
            var h = document.createElement('span');
            h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            var angle = (Math.random() * 360) * Math.PI / 180;
            var dist  = 50 + Math.random() * 90;
            var size  = 10 + Math.random() * 16;
            var dur   = 0.7 + Math.random() * 0.7;
            var tx    = Math.cos(angle) * dist;
            var ty    = Math.sin(angle) * dist - 60 - Math.random() * 40;
            h.style.cssText = 'position:fixed;left:' + cx + 'px;top:' + cy + 'px;' +
              'font-size:' + size + 'px;color:' + colors[Math.floor(Math.random()*colors.length)] + ';' +
              'pointer-events:none;z-index:9999;transform:translate(-50%,-50%);' +
              'transition:transform ' + dur + 's cubic-bezier(.2,.8,.4,1),opacity ' + dur + 's ease-out;' +
              'opacity:1;user-select:none;';
            document.body.appendChild(h);
            requestAnimationFrame(function() {
              requestAnimationFrame(function() {
                h.style.transform = 'translate(calc(-50% + ' + tx + 'px),calc(-50% + ' + ty + 'px)) scale(' + (0.2 + Math.random() * 0.6) + ')';
                h.style.opacity = '0';
              });
            });
            setTimeout(function() { if (h.parentNode) h.parentNode.removeChild(h); }, (dur + 0.15) * 1000);
          }, idx * 30);
        })(i);
      }
      // Pulse the heart itself
      this.style.transform = 'scale(1.6)';
      var self = this;
      setTimeout(function() { self.style.transform = ''; }, 250);
    });
  }

  // ── reveal on scroll
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── Price coloring: digits green, ₽ / /мес white
  document.querySelectorAll('.mod-price b').forEach(function(el) {
    el.innerHTML = el.innerHTML.replace(/(\d[\d\s]*)(₽)/g, '<em>$1</em>$2');
  });

  // ── FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => item.classList.toggle('open'));
  });

  // ── Hero swatch parallax (skip if reduced motion preferred, skip on touch devices)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!prefersReduced && !isTouchDevice) {
    const swatches = document.querySelectorAll('.hero-title .swatch, .page-head .swatch');
    if (swatches.length) {
      let pendingX = 0, pendingY = 0, rafId = 0;
      const apply = () => {
        rafId = 0;
        const transform = `translate(${pendingX}px, ${pendingY}px)`;
        swatches.forEach(s => { s.style.transform = transform; });
      };
      document.addEventListener('mousemove', (e) => {
        pendingX = (e.clientX / window.innerWidth - .5) * 8;
        pendingY = (e.clientY / window.innerHeight - .5) * 8;
        if (!rafId) rafId = requestAnimationFrame(apply);
      }, { passive: true });
    }
  }

  // ── Hamburger / mobile drawer
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (hamburger && drawer) {
    const toggleDrawer = (force) => {
      const isOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
      drawer.classList.toggle('open', isOpen);
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    hamburger.addEventListener('click', () => toggleDrawer());
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDrawer(false); });
  }

  // ── Language toggle (RU ↔ EN). Skip heavy DOM walk on default RU load — only run when EN requested.
  const applyTranslations = (targetLang) => {
    document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.hasAttribute('data-ru')) el.setAttribute('data-ru', el.innerHTML);
      el.innerHTML = targetLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ru');
    });
    document.querySelectorAll('[data-en-attr]').forEach(el => {
      const spec = el.getAttribute('data-en-attr');
      spec.split('|').forEach(pair => {
        const [attr, val] = pair.split(':');
        if (!el.hasAttribute('data-ru-' + attr)) el.setAttribute('data-ru-' + attr, el.getAttribute(attr) || '');
        el.setAttribute(attr, targetLang === 'en' ? val : el.getAttribute('data-ru-' + attr));
      });
    });
    document.documentElement.setAttribute('lang', targetLang);
    document.title = targetLang === 'en' && document.title.match(/[А-Яа-я]/) ? (document.querySelector('meta[name="title-en"]')?.content || document.title) : document.title;
  };
  // Only run translations if EN explicitly requested. Default RU = HTML already matches, skip DOM walk.
  if (lang === 'en') applyTranslations('en');


  // ── Pulsing green dot for ONLINE status indicators (deferred to idle to avoid blocking LCP)
  const enhanceOnlineDots = () => {
    document.querySelectorAll('.sig, .v, .hero-coord > div').forEach(el => {
      if (el.textContent.includes('ONLINE')) {
        el.innerHTML = el.innerHTML.replace(/(?:<span[^>]*>)?●(?:<\/span>)?\s*/g, '<span class="online-dot"></span>');
      }
    });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(enhanceOnlineDots, { timeout: 1500 });
  else setTimeout(enhanceOnlineDots, 200);
})();
