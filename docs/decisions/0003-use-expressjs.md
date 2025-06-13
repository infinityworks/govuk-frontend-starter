# 3. Use Express.js

Date: 2025-06-12

## Status

Accepted

## Context

We need a web framework for our Node.js website that supports:

- Nunjucks templating integration for GOV.UK Frontend
- Simple routing and middleware patterns suitable for a thin client-facing layer
- Proven success within GDS
- Good documentation and community support

## Decision

We will use [Express.js](https://expressjs.com/) as our Node.js web framework.

It provides:

- Great integration with Nunjucks templating
- Simple middleware and routing patterns suited to our rendering needs
- Maturity, stability and extensive documentation
- Proven success in GDS production environments
- Straightforward deployment and operations
- Strong community support

## Consequences

### Advantages

- Simple integration with required templating
- Familiar patterns for GDS development teams
- Fit for purpose as a thin rendering layer
- Large ecosystem of well-documented middleware

### Drawbacks

- Basic framework with minimal included features - we may need additional
  middleware
- Must ensure proper error handling and fail-safe patterns
