# Arter Portfolio - Component Refactoring Guide

## 📁 Новая структура проекта

```
/workspace
├── js/                          # JavaScript модули
│   ├── utils.js                 # Утилиты ($, $$, debounce, throttle)
│   ├── theme.js                 # Переключатель тем
│   ├── i18n.js                  # Интернационализация
│   ├── components-loader.js     # Загрузчик компонентов
│   ├── render.js                # Рендерер списков
│   └── main.js                  # Основная логика приложения
├── data/                        # JSON данные
│   ├── config.json              # Конфигурация сайта
│   ├── counters.json            # Счётчики
│   ├── services.json            # Услуги
│   ├── skills.json              # Навыки
│   └── section-titles.json      # Заголовки секций
├── templates/                   # HTML шаблоны компонентов
│   ├── components/              # Базовые компоненты
│   │   ├── counter.html         # Шаблон счётчика
│   │   └── section-title.html   # Шаблон заголовка
│   ├── cards/                   # Карточки (пусто)
│   ├── sections/                # Секции (пусто)
│   └── layout/                  # Layout (пусто)
├── locales/                     # Переводы
│   ├── en.json                  # English
│   ├── ru.json                  # Russian
│   └── uk.json                  # Ukrainian
└── test-components.html         # Тестовая страница
```

## 🚀 Как запустить

### Вариант 1: Локальный сервер (рекомендуется)
```bash
# Python 3
python3 -m http.server 8080

# Или Node.js
npx serve .

# Или PHP
php -S localhost:8080
```

Затем откройте:
- `http://localhost:8080/index.html` — главная страница
- `http://localhost:8080/test-components.html` — тест компонентов

### Вариант 2: VS Code Live Server
1. Установите расширение "Live Server"
2. Откройте `index.html` или `test-components.html`
3. Нажмите "Go Live"

## 🧩 Использование компонентов

### 1. Counter Component

**Шаблон:** `templates/components/counter.html`
```html
<div class="art-counter-frame">
  <div class="art-counter-box">
    <span class="art-counter">{{value}}</span>
    <span class="art-counter-plus">{{suffix}}</span>
  </div>
  <h6>{{label}}</h6>
</div>
```

**Данные:** `data/counters.json`
```json
{
  "counters": [
    { "value": 10, "suffix": "+", "label": "Years Experience" },
    { "value": 143, "suffix": "", "label": "Completed Projects" }
  ]
}
```

**Использование в HTML:**
```html
<!-- Рендер первого счётчика -->
<div data-component="counter" 
     data-source="counters" 
     data-index="0"></div>

<!-- Рендер второго счётчика -->
<div data-component="counter" 
     data-source="counters" 
     data-index="1"></div>
```

### 2. Section Title Component

**Шаблон:** `templates/components/section-title.html`
```html
<div class="art-section-title">
  <div class="art-title-frame">
    <h4>{{title}}</h4>
  </div>
</div>
```

**Данные:** `data/section-titles.json`
```json
{
  "services": { "title": "My Services" },
  "pricing": { "title": "Pricing" }
}
```

**Использование:**
```html
<div data-component="section-title" 
     data-source="section-titles" 
     data-key="services"></div>
```

## 🌐 i18n (Интернационализация)

### Добавление перевода

1. Откройте `locales/en.json` или `locales/ru.json`
2. Добавьте ключи:
```json
{
  "navigation": {
    "home": "Home"
  },
  "common": {
    "exploreNow": "Explore now"
  }
}
```

3. Используйте в HTML:
```html
<p data-i18n="navigation.home">Home</p>
<p data-i18n="common.exploreNow">Explore now</p>
```

### Переключение языка

```javascript
// Переключить на русский
window.i18n.setLanguage('ru');

// Получить текущий язык
window.i18n.getLanguage(); // 'en'
```

## 🎨 Theme Switcher

```javascript
// Установить тему
window.themeSwitcher.setTheme('color-1');

// Следующая тема
window.themeSwitcher.nextTheme();

// Получить текущую тему
window.themeSwitcher.getTheme(); // 'color-4'
```

## 📝 План миграции

### Этап 1: ✅ Готово
- [x] Создать `components-loader.js` с поддержкой данных
- [x] Создать `render.js` для рендеринга списков
- [x] Создать `i18n.js` для переводов
- [x] Создать `theme.js` для переключения тем
- [x] Создать `utils.js` с утилитами
- [x] Обновить `main.js` для интеграции
- [x] Создать шаблоны `counter.html`, `section-title.html`
- [x] Создать данные `counters.json`, `section-titles.json`
- [x] Заполнить `locales/en.json`, `locales/ru.json`

### Этап 2: Следующие шаги
- [ ] Создать шаблон `service-card.html`
- [ ] Создать данные `projects.json`
- [ ] Мигрировать секцию услуг на index.html
- [ ] Создать шаблон `portfolio-card.html`
- [ ] Мигрировать портфолио секции

### Этап 3: Завершение
- [ ] Создать layout компоненты (sidebar, navbar)
- [ ] Полная миграция index.html
- [ ] Миграция остальных страниц

## ⚠️ Важные заметки

1. **CORS**: Для работы fetch() нужен локальный сервер
2. **Кэширование**: Компоненты кэшируются в памяти
3. **Событие**: `componentsReady` срабатывает когда все компоненты загружены
4. **Порядок скриптов**: Важно подключать скрипты в правильном порядке

## 🔧 Отладка

Откройте консоль браузера (F12) для просмотра логов:
```
Found 4 components to render.
Loading component: counter
✓ Rendered: counter
All 4 components rendered.
✓ i18n initialized: en
✓ Theme initialized: color-4
```
