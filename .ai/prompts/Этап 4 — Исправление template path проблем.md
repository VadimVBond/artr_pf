Fix component template resolution and eliminate template loading errors.

Focus on:

* service-card 404
* template path normalization
* missing .html extensions
* duplicate template requests
* cache inconsistencies
* invalid fetch paths

Analyze:

* js/components-loader.js
* template folder structure
* all fetch() calls related to templates

Goals:

* zero 404 errors
* one template request per component
* normalized template resolution
* consistent cache behavior

Show exact file modifications required.
