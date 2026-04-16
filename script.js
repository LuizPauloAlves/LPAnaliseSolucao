/* ═══════════════════════════════════════════
   LP ANÁLISE & SOLUÇÕES — script.js
   ═══════════════════════════════════════════ */

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  ring.style.left   = rx + 'px';
  ring.style.top    = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width       = '56px';
    ring.style.height      = '56px';
    ring.style.borderColor = 'var(--gold)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width       = '38px';
    ring.style.height      = '38px';
    ring.style.borderColor = 'rgba(232,168,76,0.5)';
  });
});

// ── GALLERY DATA ──
const base = 'https://raw.githubusercontent.com/LuizPauloAlves/LPAnaliseSolucao/refs/heads/main/src/imagens/';

const images = [
  { file: 'Cap_02_pag01.png', label: 'Dados Iniciais',       chapter: 'ch2', page: 'Pág 1' },
  { file: 'Cap_03_pag01.png', label: 'Análise Exploratória', chapter: 'ch3', page: 'Pág 1' },
  { file: 'Cap_04_pag01.png', label: 'Análise Detalhada',    chapter: 'ch4', page: 'Pág 1' },
  { file: 'Cap_04_pag02.png', label: 'Análise Detalhada',    chapter: 'ch4', page: 'Pág 2' },
  { file: 'Cap_04_pag03.png', label: 'Análise Detalhada',    chapter: 'ch4', page: 'Pág 3' },
  { file: 'Cap_04_pag04.png', label: 'Análise Detalhada',    chapter: 'ch4', page: 'Pág 4' },
  { file: 'Cap_05_pag01.png', label: 'Modelagem',            chapter: 'ch5', page: 'Pág 1' },
  { file: 'Cap_05_pag02.png', label: 'Modelagem',            chapter: 'ch5', page: 'Pág 2' },
  { file: 'Cap_06_pag01.png', label: 'Resultados',           chapter: 'ch6', page: 'Pág 1' },
  { file: 'Cap_07_pag01.png', label: 'Insights',             chapter: 'ch7', page: 'Pág 1' },
  { file: 'Cap_08_pag01.png', label: 'Conclusão',            chapter: 'ch8', page: 'Pág 1' },
];

// Agrupar imagens por capítulo
const imagesByChapter = {};
images.forEach(img => {
  if (!imagesByChapter[img.chapter]) imagesByChapter[img.chapter] = [];
  imagesByChapter[img.chapter].push(img);
});

function makeCard(img, idx) {
  const div = document.createElement('div');
  div.className   = 'gallery-item';
  div.dataset.idx = idx;
  div.innerHTML = `
    <img src="${base}${img.file}" alt="${img.label}" loading="lazy" />
    <div class="gallery-caption">
      <span>${img.label}</span>
      <span style="color:var(--muted)">${img.page || img.file.replace('.png', '')}</span>
    </div>`;
  div.addEventListener('click', () => openLightbox(idx));
  return div;
}

const allPanel = document.getElementById('panel-all');
images.forEach((img, idx) => {
  allPanel.appendChild(makeCard(img, idx));
  const panel = document.getElementById('panel-' + img.chapter);
  if (panel) panel.appendChild(makeCard(img, idx));
});

// Aplicar layout correto em cada painel
document.querySelectorAll('.gallery-panel').forEach(panel => {
  const chapterId = panel.id.replace('panel-', '');
  const count = imagesByChapter[chapterId] ? imagesByChapter[chapterId].length : 0;
  if (count === 1)      panel.classList.add('single');
  else if (count > 1)   panel.classList.add('multiple');
});

// ── CHAPTER TABS ──
document.querySelectorAll('.chapter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const p = btn.dataset.panel;
    document.querySelectorAll('.gallery-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('panel-' + p).classList.add('active');
  });
});

// ── LIGHTBOX ──
let lbIdx = 0;
const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');

function openLightbox(idx) {
  lbIdx = idx;
  updateLb();
  lb.classList.add('open');
}

function updateLb() {
  const img = images[lbIdx];
  lbImg.src  = base + img.file;
  lbImg.alt  = img.label;
  lbCounter.textContent = `${lbIdx + 1} / ${images.length} — ${img.label} ${img.page}`;
}

document.getElementById('lbClose').onclick = () => lb.classList.remove('open');
document.getElementById('lbPrev').onclick  = () => { lbIdx = (lbIdx - 1 + images.length) % images.length; updateLb(); };
document.getElementById('lbNext').onclick  = () => { lbIdx = (lbIdx + 1) % images.length; updateLb(); };

lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });

document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % images.length; updateLb(); }
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + images.length) % images.length; updateLb(); }
  if (e.key === 'Escape')       lb.classList.remove('open');
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── SKILL BARS (animate on visible) ──
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

barObserver.observe(document.getElementById('skillChart'));
