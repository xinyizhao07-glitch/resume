/* ============ 滚动进度条 / 导航 / 回顶 ============ */
const bar = document.getElementById('progressBar');
const nav = document.querySelector('nav');
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 20);
  backTop.classList.toggle('show', h.scrollTop > 500);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============ 出场动画 ============ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============ 数字滚动（展开时触发） ============ */
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  let start = null;
  const dur = 1100;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============ 手风琴展开 / 收起 ============ */
const projects = [...document.querySelectorAll('.project.acc')];
function setOpen(card, open) {
  card.classList.toggle('open', open);
  if (open) card.querySelectorAll('.num').forEach(countUp);
}
projects.forEach(card => {
  card.querySelector('.acc-head').addEventListener('click', () => {
    setOpen(card, !card.classList.contains('open'));
  });
});

/* ============ 项目筛选 ============ */
document.querySelectorAll('.filter').forEach(f => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const key = f.dataset.f;
    projects.forEach(p => {
      const match = key === 'all' || p.dataset.company === key;
      p.classList.toggle('hide', !match);
      if (match) { p.classList.remove('open'); }
    });
  });
});

/* ============ 时间线 → 跳转并展开对应项目 ============ */
document.querySelectorAll('.exp-jump').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.target; // proj-aqy / proj-bd / proj-tx
    // 先切换筛选到对应公司
    const company = { 'proj-aqy': 'iqiyi', 'proj-bd': 'bytedance', 'proj-tx': 'tencent' }[key];
    document.querySelector(`.filter[data-f="${company}"]`).click();
    const first = document.getElementById(key);
    if (!first) return;
    setOpen(first, true);
    setTimeout(() => {
      first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  });
});

/* ============ 图片灯箱 ============ */
const lbImgs = [...document.querySelectorAll('.lb')];
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
let lbIndex = 0;
function showLb(i) {
  lbIndex = (i + lbImgs.length) % lbImgs.length;
  lbImg.src = lbImgs[lbIndex].src;
  lbCap.textContent = lbImgs[lbIndex].dataset.cap || '';
}
lbImgs.forEach((img, i) => img.addEventListener('click', () => { showLb(i); lightbox.classList.add('open'); }));
document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('open'));
document.getElementById('lbPrev').addEventListener('click', () => showLb(lbIndex - 1));
document.getElementById('lbNext').addEventListener('click', () => showLb(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') lightbox.classList.remove('open');
  if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
  if (e.key === 'ArrowRight') showLb(lbIndex + 1);
});

/* ============ 目录高亮 ============ */
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section, #contact').forEach(s => s.id && spy.observe(s));
