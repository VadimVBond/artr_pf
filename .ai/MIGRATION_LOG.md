# MIGRATION_LOG.md — История и статус миграции

> Обновлено: 2026-05-17

---

## ✅ Фаза 1 — ЗАВЕРШЕНА (май 2026)

**MVP компонентной архитектуры**

### Что сделано:
- Создана система `ComponentLoader` (шаблонизатор с кэшем, поддержка `{{#each}}`, `{{#if}}`)
- Все данные вынесены в `data/*.json` (10 файлов)
- Шаблоны созданы в `templates/layout/`, `templates/sections/`, `templates/cards/`, `templates/components/`
- `index.html` мигрирован: 1160 строк → 97 строк (-91%)
- Внедрён `i18n.js` с поддержкой EN/RU (localStorage)
- Внедрён `theme.js` переключатель тем
- Исправлены race conditions между ComponentLoader и i18n (событие `componentsReady`)
- Исправлены пути к шаблонам (404 устранены)
- CSS-переменные внедрены в `css/style.css`

### Исправленные баги:
| Баг | Решение |
|-----|---------|
| `OverscrollPlugin is not defined` | Проверка `typeof OverscrollPlugin` |
| `Object.querySelectorAll is not a function` | i18n запускается после `componentsReady` |
| Дублирование рендеринга | Последовательный render вместо параллельного |
| 404 на templates/ | Исправлена логика путей в `components-loader.js` |

---

## ⏳ Фаза 2 — ЗАВЕРШЕНА

**Миграция страниц портфолио и блога**

### Статус по страницам:
| Страница                   | Статус        | Результат миграции |
|----------------------------|---------------|--------------------|
| `portfolio-2-col.html`     | ✅ Мигрирована | 729 → 68 строк (-90%) |
| `portfolio-3-col.html`     | ✅ Мигрирована | 729 → 68 строк (-90%) |
| `portfolio-2-col-masonry.html` | ✅ Мигрирована | 729 → 68 строк (-90%) |
| `portfolio-3-col-masonry.html` | ✅ Мигрирована | 729 → 68 строк (-90%) |
| `portfolio-single.html`    | ✅ Мигрирована | 789 → 72 строки (-91%) |
| `portfolio-single-2.html`  | ✅ Мигрирована | ~789 → 72 строки (-91%) |
| `blog-2-col.html`          | ✅ Мигрирована | 790 → 62 строки (-92%) |
| `blog-3-col.html`          | ✅ Мигрирована | ~790 → 62 строки (-92%) |
| `blog-post.html`           | ✅ Мигрирована | 863 → 62 строки (-93%) |
| `history.html`             | ✅ Мигрирована | 839 → 62 строки (-92%) |
| `contact.html`             | ✅ Мигрирована | 646 → 62 строки (-90%) |

### Созданные шаблоны для Фазы 2:
- `templates/sections/portfolio-grid-2col.html`
- `templates/sections/portfolio-grid-3col.html`
- `templates/sections/portfolio-grid-2col-masonry.html`
- `templates/sections/portfolio-grid-3col-masonry.html`
- `templates/sections/portfolio-single.html`
- `templates/sections/blog-grid-2col.html`
- `templates/sections/blog-grid-3col.html`
- `templates/sections/blog-post.html`
- `templates/sections/history.html`
- `templates/sections/contact.html`

---

## ✅ Фаза 3 — ЗАВЕРШЕНА

**Полная интернационализация**

- ✅ Добавлен `data-i18n` во все статические тексты на всех страницах (и компонентах)
- ✅ Заполнен `locales/uk.json` (украинский язык)
- ✅ Добавлен UI переключателя языков (флаги: 🇬🇧, 🇷🇺, 🇺🇦)
- ✅ Протестировано переключение без перезагрузки (через `i18n.js` и событие `componentsReady`)

---

## 📋 Фаза 4 — ЗАПЛАНИРОВАНА

**Оптимизация производительности**

- `loading="lazy"` для всех `<img>`
- Critical CSS inline
- Минификация JS/CSS
- WebP конвертация изображений
- Cache-Control для статики

---

## 📋 Фаза 5 — ЗАПЛАНИРОВАНА

**Доступность (A11y) и SEO**

- `aria-label` для всех интерактивных элементов
- Навигация с клавиатуры (Tab index)
- Skip-link
- WCAG AA контрастность
- Open Graph / Twitter Cards мета-теги
- `sitemap.xml` и `robots.txt`

---

## 🗑️ Legacy компоненты (можно удалить после Фазы 2)

| Файл | Причина устаревания |
|------|---------------------|
| `components/sidebar.html` | Дублирует `templates/layout/sidebar.html` |
| `components/navbar.html` | Дублирует `templates/layout/navbar.html` |
| `components/sidebar_ru.html` | Статический RU — заменён i18n системой |
| `components/navbar_ru.html` | Статический RU — заменён i18n системой |
| `index.html.old` | Бэкап старого монолита — не нужен |

## ?? Migration Notes (May 2026 Update)

### ??? Modified Templates/Components
- Integrated data-i18n fully across all extracted components:
  - \	emplates/layout/navbar.html\
  - \	emplates/layout/sidebar.html\
  - \	emplates/sections/pricing.html\
  - \	emplates/sections/services.html\
  - \	emplates/sections/counters.html\
- Migrated hardcoded data mapping keys in \data/navigation.json\ and \data/counters.json\ to reference translation dictionaries.

### ?? Lifecycle Adjustments & Rendering Parity Fixes
- Added standard Emoji flags to the navigation component language switcher.
- Synchronized rendering pipeline: i18n.js now strictly executes its translation mapping *only* after ComponentLoader confirms all HTML shards are inserted (via componentsReady event).

### ??? Deprecated Behavior Removed
- Removed static localized HTML files (e.g. \components/sidebar_ru.html\, \components/navbar_ru.html\). The architecture now operates strictly on a single layout file (\sidebar.html\) populated dynamically.
- Removed legacy index.html.old and monolithic backups.

### ? Remaining Untranslated Blocks
- \onepage.html\ remains a monolithic exception for edge-case usage and lacks complete i18n mapping.
