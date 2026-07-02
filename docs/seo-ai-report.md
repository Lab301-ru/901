# SEO + AI Visibility — отчёт по внедрению

Дата: 2026-07-02 · Сайт: https://lab301.ru

## Что сделано

### 1. Техническое SEO для AI-краулеров

| Файл | Изменение |
|---|---|
| `robots.txt` | Явно разрешены AI-краулеры: GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, ClaudeBot, anthropic-ai, PerplexityBot, Amazonbot, Applebot-Extended, YandexBot. В каждой группе сохранён `Disallow: /admin/`. |
| `sitemap.xml` | Уже содержал все основные страницы и новости (блок новостей обновляется автоматически генератором). Добавлены 2 новых ассета: `brief-14-days.html`, `ai-agent-checklist.html`. Итого 20 URL. |

### 2. JSON-LD Schema.org (все блоки валидны, 14 блоков)

| Страница | Разметка |
|---|---|
| `index.html` | Organization + LocalBusiness (было ранее) |
| `services.html` | 3 × Service (сайты, AI-ассистент, автоматизация) + BreadcrumbList |
| `sites.html` | Service + BreadcrumbList |
| `ai-assistant.html` | Service + BreadcrumbList |
| `process.html` | BreadcrumbList |
| `faq.html` | **FAQPage с 20 вопросами** (сгенерирована из видимого контента — 1:1 совпадение) + BreadcrumbList |
| `cases.html` | CollectionPage + BreadcrumbList + Person (автор) |
| `contacts.html` | ContactPage + Organization + BreadcrumbList |
| `news.html` | CollectionPage (со списком статей) + BreadcrumbList — добавлено в генератор `scripts/build-news.mjs`, переживает пересборку |
| `news/*.html` | NewsArticle + BreadcrumbList (было ранее, генератор) |
| Ассеты | Article + BreadcrumbList |

### 3. Контент для AI-ответов (BLUF)

- `services.html` — лид переписан: первое предложение прямо отвечает «что делает LAB301».
- `process.html` — лид: «Запускаем проект за 5 шагов и в среднем 14 дней: бриф → прототип → дизайн → сборка → рост».
- `faq.html` — лид: прямой ответ «здесь 20 коротких ответов на частые вопросы».
- `index.html` — hero-лид уже был в BLUF-формате («Создаем цифровые системы… Запуск — 14 дней»), не трогали.
- **FAQ расширен с 14 до 20 вопросов** (2 новых раздела: «Старт проекта», «SEO, право и стек»). Все ответы основаны только на фактах, уже опубликованных на сайте. Заодно исправлен обрезанный вопрос №06.

### 4. E-E-A-T

- Видимый блок автора «Кто делает работу» (Юрий Бабаджанов, основатель LAB301) — на `cases.html` и `services.html`, с Person JSON-LD и ссылкой на Telegram.
- 2 linkable-ассета в стиле сайта, со своей SEO-разметкой:
  - **`brief-14-days.html`** — «Бриф для сайта за 14 дней» (20 вопросов в 5 блоках);
  - **`ai-agent-checklist.html`** — «Чек-лист внедрения AI-агента» (5 блоков, честные ориентиры без выдуманных цифр).
- Оба добавлены в подвал сайта (`theme.js`) и в `sitemap.xml`.

### 5. Верификация (пройдена)

- ✅ Все 14 JSON-LD блоков парсятся без ошибок; FAQPage = 20 Q&A = видимому контенту; у всех Service есть provider.
- ✅ `sitemap.xml` и `news/rss.xml` — валидный XML; 20 URL, ассеты включены.
- ✅ `robots.txt` — 11 UA-групп, в каждой `Disallow: /admin/`.
- ✅ `theme.js` и генератор — синтаксис OK; новости пересобраны.
- ✅ Smoke-тест headless Chromium: faq.html и services.html рендерятся с корректным title.
- ⚠️ Полный Lighthouse в этом окружении недоступен — прогоните вручную: https://pagespeed.web.dev/ (страницы статические, самая тяжёлая ~32 КБ HTML, проблем не ожидается).

## Что требует ручной работы (только владелец)

1. **Google Search Console** — подтвердить сайт, отправить sitemap, запросить переиндексацию изменённых страниц.
2. **Яндекс.Вебмастер** — то же самое + проверить раздел «Диагностика»; включить «Быстрые ссылки».
3. **Яндекс Бизнес / Google Business Profile** — заполнить карточку организации, привязать сайт (уже делали для Ремсити36 — повторить для LAB301).
4. Проверить разметку валидаторами после деплоя: https://validator.schema.org/ и «Проверка микроразметки» в Яндекс.Вебмастере.
5. По желанию: добавить реальное фото Юрия в блок автора (сейчас без фото — не выдумывали).

## Чек-лист на 2 недели

**Неделя 1**
- [ ] Смержить PR, проверить страницы вживую (Cmd+Shift+R).
- [ ] Search Console + Яндекс.Вебмастер: sitemap, переиндексация Home/Services/FAQ/News.
- [ ] Прогнать faq.html и services.html через validator.schema.org.
- [ ] PageSpeed Insights для главной и faq.html — убедиться, что 90+.
- [ ] Опубликовать 1–2 новости через админку (регулярность — сигнал для Яндекса).

**Неделя 2**
- [ ] Проверить в Вебмастере, что news/*.html попали в индекс.
- [ ] Спросить у ChatGPT/Perplexity «разработка сайтов Воронеж LAB301» — проверить цитируемость.
- [ ] Расшарить «Бриф за 14 дней» в Telegram-канале / соцсетях — это линкабельный магнит.
- [ ] Добавить ссылку на чек-лист AI-агента в подпись/автоответ Михалыча.
- [ ] Собрать первые фразы из Вебмастера («По каким запросам показывались») — темы для следующих новостей.

## Изменённые файлы

`robots.txt`, `sitemap.xml`, `faq.html`, `services.html`, `sites.html`, `ai-assistant.html`, `process.html`, `cases.html`, `contacts.html`, `theme.js`, `scripts/build-news.mjs`, `news.html` + `news/*.html` (пересборка), **новые:** `brief-14-days.html`, `ai-agent-checklist.html`, `docs/seo-ai-report.md`.
