# 6. Avoid `hx-boost` and use standard links and forms

Date: 2025-06-12

## Status

Accepted

## Context

HTMX provides an attribute called `hx-boost` that converts regular HTML links
and forms into AJAX requests. This creates a single-page application (SPA)
experience where page transitions happen without a full page reload.

While this can make transitions feel smoother, it introduces several problems:

- Back button behaviour can be unreliable
- Browser refresh can sometimes result in blank pages
- Other JavaScript libraries may not work properly
- The JavaScript environment stays active and can become unstable
- Standard browser lifecycle events like `DOMContentLoaded` don't fire properly

The
[GOV.UK service manual](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)
emphasises progressive enhancement - making sure the HTML layer provides core
functionality before enhancing with CSS and JavaScript.

## Decision

We will not use `hx-boost` in our application. Instead, we will:

- Use standard HTML links and forms for page navigation
- Use HTMX selectively for specific interactive features like form validations
  and targeted content updates
- Set proper cache headers to make browser caching effective
- Take advantage of browser optimisations for same-origin navigations

When we need to update a page section without a full reload, we'll use targeted
HTMX attributes (`hx-get`, `hx-post`, etc.) on specific elements rather than
boosting all links and forms.

## Consequences

### Advantages

- More reliable browser navigation (back/forward buttons work as expected)
- Consistent browser behaviour across all parts of the service
- Better accessibility for users with assistive technologies
- Each page load gives a fresh JavaScript environment, preventing memory issues
- Browser-optimised performance for standard navigation
- Simpler debugging and maintenance
- Aligns with GOV.UK guidance on progressive enhancement

### Drawbacks

- Page transitions will include a full page load
- Need to be more selective about where to apply HTMX
- May need to implement state persistence between page loads if needed (using
  localStorage, sessionStorage, etc.)
- Requires proper configuration of cache headers to optimise performance
