Stabilize application lifecycle and initialization order.

Target lifecycle:

DOM Ready
→ ComponentLoader init
→ Template rendering
→ i18n translations
→ Theme initialization
→ Plugin initialization
→ Final UI initialization

Tasks:

* detect race conditions
* detect async timing issues
* detect duplicate event listeners
* normalize initialization order
* ensure components are fully rendered before i18n/theme/plugins

Return:

1. current lifecycle order
2. problematic async flows
3. exact code changes required
4. minimal fixes only

Avoid rewriting architecture.
Preserve existing structure whenever possible.
