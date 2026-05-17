# DEBUGGING.md — Known Issues & Resolutions

> Updated: 2026-05-18

## 🔄 Lifecycle & Race Conditions
**Issue:** `Object.querySelectorAll is not a function` or translation strings not applying on initial load.
**Root Cause:** The `i18n.applyTranslations()` method was running before `ComponentLoader.renderAllComponents()` finished fetching and injecting HTML templates.
**Resolution:** Implemented `componentsReady` CustomEvent. `i18n.js` now strictly waits for `window.dispatchEvent(new Event('componentsReady'))` before executing DOM manipulations.

## 🌐 Translation (I18N) Rendering Issues
**Issue:** Variables from `data/*.json` (like `navigation.json`) not translating.
**Root Cause:** Text was injected as raw strings (e.g., `{{label}}`) without the `data-i18n` attribute in the template.
**Resolution:** Wrapped variables in templates: `<span data-i18n="{{label}}">{{label}}</span>` and updated the JSON data to store the i18n keys (e.g., `"navigation.home"`) instead of raw text.

## 🧩 Rendering Parity Fixes
**Issue:** Swup page transitions causing layout breakage or missing UI elements.
**Root Cause:** Component HTML was loaded asynchronously and randomly, breaking DOM order.
**Resolution:** Refactored `ComponentLoader.renderAllComponents()` to render components *sequentially* (using a `for` loop with `await`) to preserve strict HTML layout order.