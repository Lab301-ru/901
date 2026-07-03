#!/usr/bin/env node
// Генератор статических SEO-страниц новостей для lab301.ru
// Читает news/data/*.json и создаёт:
//   - news/<slug>.html        отдельная страница каждой новости (индексируется)
//   - news.html               страница-список всех новостей (в меню сайта)
//   - news/index.json         индекс для админки
//   - news/rss.xml            RSS-лента
//   - sitemap.xml             обновляет блок между маркерами NEWS:START / NEWS:END
// Запуск: node scripts/build-news.mjs
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'news', 'data');
const NEWS_DIR = path.join(ROOT, 'news');
const SITE = 'https://lab301.ru';

const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля',
  'августа','сентября','октября','ноября','декабря'];

// ── helpers ────────────────────────────────────────────────────────────────
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = (s = '') => esc(s);

function fmtDateRu(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d)) return iso;
  return `${d.getUTCDate()} ${MONTHS_RU[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function rfc822(iso) {
  const d = new Date(iso + 'T09:00:00Z');
  return isNaN(d) ? new Date().toUTCString() : d.toUTCString();
}

function absUrl(p) {
  if (!p) return '';
  if (/^https?:\/\//.test(p)) return p;
  return SITE + '/' + String(p).replace(/^\//, '');
}

// первый <img> из тела — запасная картинка, если обложка не задана
function firstImg(html = '') {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
}

// время чтения (мин) по голому тексту
function readingMinutes(html = '') {
  const text = String(html).replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// fmt: dd.mm.yyyy
function fmtDateShort(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  if (isNaN(d)) return iso;
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

// стабильный file-id: 2600 + (порядок от старых к новым)
function fileStamp(i, total) { return 2600 + (total - i); }

// ── шаблон отдельной новости ────────────────────────────────────────────────
function articlePage(n, ctx = { index: 0, total: 1 }) {
  const url = `${SITE}/news/${n.slug}.html`;
  const cover = n.cover || firstImg(n.bodyHtml) || 'og-share.png';
  const coverAbs = absUrl(cover);
  const desc = n.description || '';
  const tags = Array.isArray(n.tags) ? n.tags : [];
  const tagLine = tags.length ? tags.map(esc).join(' · ') : 'Новости';
  const tagsBadge = tags.length ? tags.map(esc).join(' · ') : 'НОВОСТИ';
  const readMin = readingMinutes(n.bodyHtml);
  const stamp = fileStamp(ctx.index, ctx.total);
  const author = n.author || 'LAB301';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title,
    description: desc,
    image: [coverAbs],
    datePublished: n.date,
    dateModified: n.updated || n.date,
    author: { '@type': 'Organization', name: n.author || 'LAB301', url: SITE },
    publisher: {
      '@type': 'Organization', name: 'LAB301',
      logo: { '@type': 'ImageObject', url: `${SITE}/lab301-logo.png` }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'LAB301', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Новости', item: SITE + '/news.html' },
      { '@type': 'ListItem', position: 3, name: n.title, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="ru" data-palette="signal" data-density="comfortable">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<base href="/" />
<title>${esc(n.title)} — Новости LAB301</title>
<meta name="description" content="${attr(desc)}" />
<link rel="canonical" href="${url}" />
<meta name="theme-color" content="#0A0B0D" />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:title" content="${attr(n.title)}" />
<meta property="og:description" content="${attr(desc)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${attr(coverAbs)}" />
<meta property="og:locale" content="ru_RU" />
<meta property="og:site_name" content="LAB301" />
<meta property="article:published_time" content="${attr(n.date)}" />
<meta property="article:modified_time" content="${attr(n.updated || n.date)}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${attr(n.title)}" />
<meta name="twitter:description" content="${attr(desc)}" />
<meta name="twitter:image" content="${attr(coverAbs)}" />

<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="LAB301" />
<meta name="application-name" content="LAB301" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="guga.avif" fetchpriority="high">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"></noscript>
<link rel="stylesheet" href="theme.css?v=7">
<link rel="alternate" type="application/rss+xml" title="Новости LAB301" href="news/rss.xml" />
<script type="application/ld+json">
${JSON.stringify(ld)}
</script>
<script type="application/ld+json">
${JSON.stringify(crumbs)}
</script>
</head>
<body data-page="news">

<section class="page-head article-page">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">LAB301</a><span class="sep">/</span><a href="news.html">Новости</a><span class="sep">/</span><span class="here">${esc(n.title)}</span></div>
    <div class="article-layout">
      <aside class="article-side reveal">
        <dl>
          <dt>Date</dt><dd><time datetime="${attr(n.date)}">${esc(fmtDateShort(n.date))}</time></dd>
          <dt>Cat</dt><dd class="break">/ ${esc(n.slug)}</dd>
          <dt>Read</dt><dd>~${readMin} мин</dd>
          <dt>Author</dt><dd>${esc(author)}</dd>
          <dt>File</dt><dd>${stamp} · News</dd>
        </dl>
      </aside>
      <article class="article-main">
        <div class="article-label reveal">Entry · ${String(stamp).slice(-2)}</div>
        <h1 class="article-title reveal">${esc(n.title)}</h1>
        ${desc ? `<p class="article-lede reveal">${esc(desc)}</p>` : ''}
        ${n.cover ? `<div class="article-cover-wrap reveal"><img class="article-cover" src="${attr(n.cover)}" alt="${attr(n.title)}" loading="eager" decoding="async" /><div class="article-cover-tags">${tagsBadge}</div></div>` : ''}
        <div class="article-body">
${n.bodyHtml || ''}
        </div>
        <div class="article-foot reveal">
          <a class="btn-secondary" href="news.html"><span>← Все новости</span></a>
          <a class="btn-primary" href="thankyou.html?to=https://t.me/Judgeopenclawbot"><span>Обсудить проект</span><span>→</span></a>
        </div>
      </article>
    </div>
  </div>
</section>

<script src="theme.js?v=7" defer></script>
</body>
</html>
`;
}

// ── карточка в списке ───────────────────────────────────────────────────────
function newsCard(n, idx) {
  const stamp = String(100 + idx).padStart(3, '0');
  const cover = n.cover || firstImg(n.bodyHtml);
  const tags = Array.isArray(n.tags) && n.tags.length ? n.tags.join(' · ').toUpperCase() : 'НОВОСТИ';
  const vis = cover
    ? `style="--mx:60%;--my:40%; background-image: url('${attr(cover)}'); background-size: cover; background-position: center;"`
    : `style="--mx:60%;--my:40%;"`;
  return `      <article class="arc-card arc-card--link">
        <a class="arc-card-overlay" href="news/${attr(n.slug)}.html" aria-label="${attr(n.title)} — читать"></a>
        <div class="arc-vis" ${vis}>
          <span class="tag">${esc(tags)}</span><span class="stamp">${stamp}</span>
        </div>
        <div class="arc-body">
          <h3 class="arc-title">${esc(n.title)}</h3>
          <p class="arc-desc">${esc(n.description || '')}</p>
          <div class="arc-metrics">
            <div class="arc-metric"><div class="v">${esc(fmtDateRu(n.date))}</div><div class="k">опубликовано</div></div>
          </div>
        </div>
      </article>`;
}

// ── страница-список news.html ───────────────────────────────────────────────
function listPage(items) {
  const cards = items.length
    ? items.map((n, i) => newsCard(n, i)).join('\n\n')
    : `      <article class="arc-card" style="border-style:dashed; opacity:.55;">
        <div class="arc-vis" style="--mx:50%;--my:50%;"><span class="tag tag-green">СКОРО</span></div>
        <div class="arc-body"><h3 class="arc-title">Скоро здесь появятся новости</h3><p class="arc-desc">Мы готовим первые материалы.</p></div>
      </article>`;
  const count = items.length;
  return `<!DOCTYPE html>
<html lang="ru" data-palette="signal" data-density="comfortable">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Новости — LAB301</title>
<meta name="description" content="Новости и обновления студии LAB301: запуски проектов, продукты, технологии и кейсы." />
<link rel="canonical" href="${SITE}/news.html" />
<meta name="theme-color" content="#0A0B0D" />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:title" content="Новости — LAB301" />
<meta property="og:description" content="Новости и обновления студии LAB301: запуски проектов, продукты, технологии и кейсы." />
<meta property="og:type" content="website" />
<meta property="og:url" content="${SITE}/news.html" />
<meta property="og:image" content="og-share.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="LAB301 — Технологии роста для бизнеса" />
<meta property="og:locale" content="ru_RU" />
<meta property="og:site_name" content="LAB301" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Новости — LAB301" />
<meta name="twitter:description" content="Новости и обновления студии LAB301." />
<meta name="twitter:image" content="og-share.png" />

<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="LAB301" />
<meta name="application-name" content="LAB301" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="lab301-logo-mobile.avif" fetchpriority="high">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"></noscript>
<link rel="stylesheet" href="theme.css?v=7">
<link rel="alternate" type="application/rss+xml" title="Новости LAB301" href="news/rss.xml" />
<script type="application/ld+json">
${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Новости LAB301',
        url: `${SITE}/news.html`,
        description: 'Новости и обновления студии LAB301: запуски проектов, продукты, технологии и кейсы.',
        hasPart: items.map(n => ({
          '@type': 'NewsArticle',
          headline: n.title,
          url: `${SITE}/news/${n.slug}.html`,
          datePublished: n.date
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'LAB301', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Новости', item: `${SITE}/news.html` }
        ]
      }
    ]
  })}
</script>
</head>
<body data-page="news">

<section class="page-head">
  <div class="container">
    <div class="coord reveal"><div><b>FILE / 07</b> &nbsp; NEWS.INDEX &nbsp; / &nbsp; ${count} ${count === 1 ? 'ЗАПИСЬ' : 'ЗАПИСЕЙ'}</div><div class="sig"><span style="color:#16a34a;">●</span> ЛЕНТА ОБНОВЛЕНИЙ</div></div>
    <div class="crumbs reveal"><a href="index.html">LAB301</a><span class="sep">/</span><span class="here">Новости</span></div>
    <div class="grid2">
      <div class="reveal">
        <div class="label" style="margin-bottom:32px;"><span class="dot">▌</span> ИНДЕКС / 07 — НОВОСТИ</div>
        <h1><span class="swatch"></span>Новости<br>и&nbsp;<em>обновления</em>.</h1>
      </div>
      <aside class="meta reveal">
        <p class="lede">Запуски проектов, продукты студии, технологии и&nbsp;кейсы. Коротко и&nbsp;по&nbsp;делу&nbsp;— то, над&nbsp;чем мы&nbsp;работаем.</p>
        <div class="cta-row">
          <a class="btn-primary" href="thankyou.html?to=https://t.me/Judgeopenclawbot">Обсудить проект <span>→</span></a>
        </div>
      </aside>
    </div>
  </div>
</section>

<section style="padding-top:0;">
  <div class="container">
    <div class="arc-grid reveal">

${cards}

    </div>
  </div>
</section>

<script src="theme.js?v=7" defer></script>
</body>
</html>
`;
}

// ── RSS ─────────────────────────────────────────────────────────────────────
function rss(items) {
  const entries = items.map(n => `    <item>
      <title>${esc(n.title)}</title>
      <link>${SITE}/news/${esc(n.slug)}.html</link>
      <guid isPermaLink="true">${SITE}/news/${esc(n.slug)}.html</guid>
      <pubDate>${rfc822(n.date)}</pubDate>
      <description>${esc(n.description || '')}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Новости LAB301</title>
    <link>${SITE}/news.html</link>
    <description>Новости и обновления студии LAB301</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${entries}
  </channel>
</rss>
`;
}

// ── sitemap (между маркерами) ───────────────────────────────────────────────
async function updateSitemap(items) {
  const file = path.join(ROOT, 'sitemap.xml');
  let xml;
  try { xml = await fs.readFile(file, 'utf8'); }
  catch { console.warn('sitemap.xml не найден — пропускаю'); return; }

  const block = ['  <!-- NEWS:START -->',
    `  <url>\n    <loc>${SITE}/news.html</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`,
    ...items.map(n =>
      `  <url>\n    <loc>${SITE}/news/${esc(n.slug)}.html</loc>\n    <lastmod>${esc(n.updated || n.date)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`),
    '  <!-- NEWS:END -->'].join('\n');

  if (xml.includes('<!-- NEWS:START -->') && xml.includes('<!-- NEWS:END -->')) {
    xml = xml.replace(/[ \t]*<!-- NEWS:START -->[\s\S]*?<!-- NEWS:END -->/, block);
  } else {
    xml = xml.replace(/\s*<\/urlset>/, '\n' + block + '\n</urlset>');
  }
  await fs.writeFile(file, xml);
}

// ── main ────────────────────────────────────────────────────────────────────
async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const files = (await fs.readdir(DATA_DIR)).filter(f => f.endsWith('.json'));
  const items = [];
  for (const f of files) {
    try {
      const n = JSON.parse(await fs.readFile(path.join(DATA_DIR, f), 'utf8'));
      if (!n.slug) n.slug = f.replace(/\.json$/, '');
      if (n.draft === true) continue; // черновики не публикуем
      items.push(n);
    } catch (e) { console.error(`Пропускаю ${f}: ${e.message}`); }
  }
  // новые сверху
  items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  // генерируем страницы новостей
  const wantHtml = new Set();
  for (let i = 0; i < items.length; i++) {
    const n = items[i];
    const out = path.join(NEWS_DIR, `${n.slug}.html`);
    await fs.writeFile(out, articlePage(n, { index: i, total: items.length }));
    wantHtml.add(`${n.slug}.html`);
  }

  // подчищаем осиротевшие news/*.html
  for (const f of await fs.readdir(NEWS_DIR)) {
    if (f.endsWith('.html') && !wantHtml.has(f)) {
      await fs.rm(path.join(NEWS_DIR, f));
      console.log(`Удалена осиротевшая страница: news/${f}`);
    }
  }

  // список, индекс для админки, RSS, sitemap
  await fs.writeFile(path.join(ROOT, 'news.html'), listPage(items));
  const index = items.map(n => ({
    slug: n.slug, title: n.title, description: n.description || '',
    cover: n.cover || '', date: n.date, updated: n.updated || n.date,
    tags: n.tags || []
  }));
  await fs.writeFile(path.join(NEWS_DIR, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  await fs.writeFile(path.join(NEWS_DIR, 'rss.xml'), rss(items));
  await updateSitemap(items);

  console.log(`Готово: ${items.length} новост(ь/и/ей) → news.html, news/*.html, index.json, rss.xml, sitemap.xml`);
}

main().catch(e => { console.error(e); process.exit(1); });
