Analyze the repository for duplicate rendering architectures and conflicting component systems.

Find:

* direct fetch() template rendering
* duplicate ComponentLoader initialization
* multiple DOMContentLoaded handlers
* parallel rendering pipelines
* legacy template injection
* direct innerHTML rendering bypassing ComponentLoader
* duplicate lifecycle handlers

Focus on:

* js/main.js
* js/components-loader.js
* js/utils.js
* js/i18n.js

Return:

1. exact conflicting code locations
2. runtime impact
3. minimal removal plan
4. which system should remain as the single rendering pipeline

Do not rewrite architecture.
Do not generate new systems.

