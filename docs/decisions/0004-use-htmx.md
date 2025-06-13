# 4. Use HTMX

Date: 2025-06-12

## Status

Accepted

## Context

We need to choose an approach for progressively enhancing our Node.js website
with client-side interactivity. The site will be built with the GOV.UK Frontend,
which follows the
[GOV.UK Design System patterns](https://design-system.service.gov.uk/patterns/)
and requires only minimal client-side JavaScript for
[progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement).

Our developers already write JavaScript on the server side with Node.js and
Express.js. We want to keep client-side JavaScript simple and minimal.

## Decision

We will use [HTMX](https://htmx.org/docs/) to add progressive enhancement to key
parts of our site like forms and navigation.

HTMX will let us:

- create a better user experience by improving forms and page transitions
- keep the interface working without JavaScript
- make changes to content by returning HTML directly from our Express endpoints
- avoid writing complex client-side JavaScript
- add interactive features with minimal impact on page load times (only 10KB
  compressed)

## Consequences

- simpler development as we only need to write HTML responses
- natural progressive enhancement
- small impact on page load times
- works well with server-side templating like Nunjucks
- more maintainable than custom JavaScript

### Drawbacks

- adds complexity to server-side templates
- need to handle both HTMX and full page requests
- need to reinitialise GOV.UK Frontend JavaScript components after HTMX updates
- team needs to learn HTMX-specific patterns and attributes
