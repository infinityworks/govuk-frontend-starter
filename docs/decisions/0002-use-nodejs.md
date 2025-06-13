# 2. Use Node.js

Date: 2025-06-12

## Status

Accepted

## Context

We need to select a server-side programming language for our website. The
application will primarily handle rendering GOV.UK Frontend templates using
Nunjucks and integrate with APIs.

Key considerations:

- Good support for [Nunjucks](https://mozilla.github.io/nunjucks/) templating as
  required by [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/)
- Team knowledge and hosting capabilities
- Primarily a thin, client-facing rendering layer

## Decision

We will use [Node.js](https://nodejs.org/docs/latest/api/) as our server-side
programming language.

This lets us render GOV.UK Frontend templates effectively using Nunjucks and
handle API integration, while building on GDS' existing experience hosting and
operating Node.js applications.

## Consequences

### Advantages

- Excellent Nunjucks templating integration for GOV.UK Frontend
- Proven operational model at GDS
- Well-suited for thin rendering and API integration layers
- Large ecosystem of packages via npm

### Drawbacks

- Not ideal for complex database interactions
- Need to carefully manage asynchronous code patterns
- Single-threaded model requires proper error handling
