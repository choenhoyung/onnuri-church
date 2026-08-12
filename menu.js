const DEFAULT_MENU = [
  { title: "교회소개", url: "index.html#about", submenus: [
    { label: "담임목사 인사", url: "index.html#pastor" },
    { label: "예배시간 안내", url: "index.html#worship" },
    { label: "오시는 길", url: "index.html#location" }
  ]},
  { title: "좋은뉴스", url: "bulletins.html", submenus: [
    { label: "교회주보", url: "bulletins.html" },
    { label: "앨범", url: "gallery.html" }
  ]},
  { title: "교육부&청년회", url: "gallery.html", submenus: [
    { label: "유치부", url: "gallery.html" },
    { label: "초등부", url: "gallery.html" },
    { label: "학생부", url: "gallery.html" },
    { label: "청년부", url: "gallery.html" },
    { label: "장년부", url: "gallery.html" }
  ]}
];

function renderNav(menu) {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.innerHTML = menu.map(item => {
    const hasSubmenus = item.submenus && item.submenus.length;
    return `
    <div class="nav-item">
      <a class="nav-top-link" href="${item.url || '#'}"${hasSubmenus ? ' aria-haspopup="true" aria-expanded="false"' : ''}>${item.title}</a>
      ${hasSubmenus ? `
        <div class="nav-dropdown" role="menu">
          ${item.submenus.map(s => `<a href="${s.url || '#'}" role="menuitem">${s.label}</a>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
  }).join('');
  nav.querySelectorAll('.nav-item').forEach(navItem => {
    const link = navItem.querySelector('.nav-top-link[aria-haspopup]');
    if (!link) return;
    const setExpanded = (v) => link.setAttribute('aria-expanded', String(v));
    navItem.addEventListener('mouseenter', () => setExpanded(true));
    navItem.addEventListener('mouseleave', () => setExpanded(false));
    navItem.addEventListener('focusin', () => setExpanded(true));
    navItem.addEventListener('focusout', (e) => {
      if (!navItem.contains(e.relatedTarget)) setExpanded(false);
    });
  });
}

function renderSitemap(menu) {
  const grid = document.getElementById('sitemap-grid');
  if (!grid) return;
  grid.innerHTML = menu.map(item => `
    <div class="sitemap-col">
      <a class="sitemap-col-title" href="${item.url || '#'}">${item.title}</a>
      <ul>
        ${(item.submenus || []).map(s => `<li><a href="${s.url || '#'}">${s.label}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderDrawer(menu) {
  const wrap = document.getElementById('drawer-accordion');
  if (!wrap) return;
  wrap.innerHTML = menu.map((item, i) => {
    const hasSubmenus = item.submenus && item.submenus.length;
    return `
    <div class="drawer-group">
      <button class="drawer-group-btn" data-i="${i}"${hasSubmenus ? ' aria-expanded="false" aria-controls="drawer-sub-' + i + '"' : ''}>
        <a href="${item.url || '#'}" onclick="event.stopPropagation()">${item.title}</a>
        ${hasSubmenus ? '<span class="drawer-caret">▾</span>' : ''}
      </button>
      ${hasSubmenus ? `
        <div class="drawer-submenu" id="drawer-sub-${i}">
          ${item.submenus.map(s => `<a href="${s.url || '#'}">${s.label}</a>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
  }).join('');
  wrap.querySelectorAll('.drawer-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = document.getElementById('drawer-sub-' + btn.dataset.i);
      if (sub) {
        sub.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(sub.classList.contains('open')));
      }
    });
  });
}

const QUICK_MENU_ICONS = ['🙏', '📖', '📰', '📍', '💒', '✝️'];

function renderQuickMenu(menu) {
  const grid = document.getElementById('quick-menu');
  if (!grid) return;
  grid.innerHTML = menu.map((item, i) => `
    <a href="${item.url || '#'}">
      <div style="font-size:1.6rem;margin-bottom:0.5rem">${QUICK_MENU_ICONS[i % QUICK_MENU_ICONS.length]}</div>
      <div>${item.title}</div>
    </a>
  `).join('');
}

async function initMenu() {
  let menu = DEFAULT_MENU;
  try {
    const { data } = await sb.from('site_menu').select('menu').eq('id', 1).single();
    if (data && Array.isArray(data.menu) && data.menu.length) menu = data.menu;
  } catch (e) {}
  renderNav(menu);
  renderSitemap(menu);
  renderDrawer(menu);
  renderQuickMenu(menu);
}

function initMenuOverlays() {
  const sitemapModal = document.getElementById('sitemap-modal');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const sitemapBtn = document.getElementById('sitemap-btn');
  if (!sitemapModal || !mobileDrawer || !sitemapBtn) return;

  function openOverlay() {
    const target = window.innerWidth <= 860 ? mobileDrawer : sitemapModal;
    target.hidden = false;
    requestAnimationFrame(() => target.classList.add('open'));
  }
  function closeOverlays() {
    sitemapModal.classList.remove('open');
    mobileDrawer.classList.remove('open');
    setTimeout(() => { sitemapModal.hidden = true; mobileDrawer.hidden = true; }, 250);
  }

  sitemapBtn.addEventListener('click', openOverlay);
  document.getElementById('sitemap-close').addEventListener('click', closeOverlays);
  document.getElementById('drawer-close').addEventListener('click', closeOverlays);
  sitemapModal.addEventListener('click', (e) => { if (e.target === sitemapModal) closeOverlays(); });
  mobileDrawer.addEventListener('click', (e) => { if (e.target === mobileDrawer) closeOverlays(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlays(); });

  const bottomNavMore = document.getElementById('bottom-nav-more');
  if (bottomNavMore) bottomNavMore.addEventListener('click', openOverlay);
}

function initBottomNav() {
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.bottom-nav-item[data-page]').forEach(item => {
    if (item.dataset.page === page) item.classList.add('active');
  });
}

async function applyTheme() {
  try {
    const { data } = await sb.from('site_settings').select('banner_bg_color, banner_text_color, font_family, hero_style, hero_bg_image').eq('id', 1).single();
    if (!data) return;
    const root = document.documentElement.style;
    if (data.banner_bg_color) root.setProperty('--banner-bg', data.banner_bg_color);
    if (data.banner_text_color) root.setProperty('--banner-text', data.banner_text_color);
    if (data.font_family) root.setProperty('--font-primary', `'${data.font_family}', 'Noto Sans KR', sans-serif`);
    if (data.hero_bg_image) {
      root.setProperty('--hero-bg-image', `url('${data.hero_bg_image}')`);
      document.body.classList.add('has-hero-photo');
    }
    document.body.dataset.heroStyle = data.hero_style || '';
  } catch (e) {}
}

const POPUP_DISMISS_KEY = 'popupDismissedUntil';

async function initPopup() {
  try {
    const { data } = await sb.from('popup_settings').select('*').eq('id', 1).single();
    if (!data || !data.active || !data.image_url) return;
    const dismissedUntil = localStorage.getItem(POPUP_DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    const overlay = document.createElement('div');
    overlay.id = 'site-popup';
    const imgTag = `<img src="${data.image_url}" alt="공지">`;
    overlay.innerHTML = `
      <div class="site-popup-inner">
        ${data.link_url ? `<a href="${data.link_url}" target="_blank" rel="noopener">${imgTag}</a>` : imgTag}
        <div class="site-popup-actions">
          <button id="popup-dismiss-today">오늘 하루 보지 않기</button>
          <button id="popup-close">닫기</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('popup-close').addEventListener('click', () => overlay.remove());
    document.getElementById('popup-dismiss-today').addEventListener('click', () => {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      localStorage.setItem(POPUP_DISMISS_KEY, String(endOfDay.getTime()));
      overlay.remove();
    });
  } catch (e) {}
}

initMenuOverlays();
initMenu();
applyTheme();
initPopup();
initBottomNav();
