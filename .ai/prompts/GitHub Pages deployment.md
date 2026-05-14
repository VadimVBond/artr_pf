You are a senior frontend deployment engineer.

Task:
Analyze and automatically fix a large multi-file HTML/CSS/JS portfolio project for GitHub Pages deployment.

Deployment type:
Project Pages:
https://username.github.io/repository-name/

Critical goal:
Make the project fully compatible with GitHub Pages subfolder deployment.

The project works locally but fails after deployment.

---

REPOSITORY ANALYSIS

Recursively scan ALL project files:

* HTML
* CSS
* JS
* JSON
* assets references

Detect deployment-breaking patterns.

---

FIX THESE ISSUES

1. ABSOLUTE PATHS
   Find and fix:

* href="/..."
* src="/..."
* fetch("/...")
* import "/..."
* url('/...')
* url("/...")

Convert them into SAFE RELATIVE PATHS.

Examples:

BAD:
href="/css/style.css"

GOOD:
href="./css/style.css"

OR:
href="../css/style.css"

depending on current file location.

---

2. CSS URL ISSUES

Fix:
url('/img/bg.jpg')

Convert to proper relative paths.

---

3. JAVASCRIPT MODULES

Fix:

* type="module" imports
* dynamic imports
* fetch() asset loading

Ensure compatibility inside repository subfolder deployment.

---

4. CASE-SENSITIVE FILE ISSUES

Detect mismatches:

* IMG/logo.png vs img/logo.png
* Assets/ vs assets/

GitHub Pages is Linux-based and case-sensitive.

---

5. NESTED PAGE PATHS

Correct relative paths for:

* /pages/about.html
* /projects/item/index.html
* deeply nested routes

Use correct ../ traversal.

---

6. COMPONENT-BASED STRUCTURE

If project contains:

* components/
* includes/
* partials/

verify:

* include paths
* fetch paths
* component references

---

7. VERIFY RUNTIME INTEGRITY

After fixes:

* no broken asset references
* no broken JS imports
* no 404 references
* no invalid relative traversal

---

OUTPUT FORMAT

[CRITICAL ISSUES]

* exact files
* exact broken paths

[FIXED FILES]

* list modified files

[PATCHES]

* show only changed code snippets

[REMAINING RISKS]

* unresolved edge cases

[FINAL STATUS]
PASS / FAIL

---

RULES

* DO NOT redesign project
* DO NOT rewrite whole files
* DO NOT introduce frameworks
* Apply minimal safe fixes only
* Preserve current structure and design
* Prioritize GitHub Pages compatibility
* Work recursively across the entire project
