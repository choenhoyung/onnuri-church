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
  nav.innerHTML = menu.map(item => `
    <div class="nav-item">
      <a class="nav-top-link" href="${item.url || '#'}">${item.title}</a>
      ${item.submenus && item.submenus.length ? `
        <div class="nav-dropdown">
          ${item.submenus.map(s => `<a href="${s.url || '#'}">${s.label}</a>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
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
  wrap.innerHTML = menu.map((item, i) => `
    <div class="drawer-group">
      <button class="drawer-group-btn" data-i="${i}">
        <a href="${item.url || '#'}" onclick="event.stopPropagation()">${item.title}</a>
        ${item.submenus && item.submenus.length ? '<span class="drawer-caret">▾</span>' : ''}
      </button>
      ${item.submenus && item.submenus.length ? `
        <div class="drawer-submenu" id="drawer-sub-${i}">
          ${item.submenus.map(s => `<a href="${s.url || '#'}">${s.label}</a>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
  wrap.querySelectorAll('.drawer-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = document.getElementById('drawer-sub-' + btn.dataset.i);
      if (sub) sub.classList.toggle('open');
    });
  });
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
}

async function applyTheme() {
  try {
    const { data } = await sb.from('site_settings').select('banner_bg_color, banner_text_color, font_family').eq('id', 1).single();
    if (!data) return;
    const root = document.documentElement.style;
    if (data.banner_bg_color) root.setProperty('--banner-bg', data.banner_bg_color);
    if (data.banner_text_color) root.setProperty('--banner-text', data.banner_text_color);
    if (data.font_family) root.setProperty('--font-primary', `'${data.font_family}', 'Noto Sans KR', sans-serif`);
  } catch (e) {}
}

initMenuOverlays();
initMenu();
applyTheme();
