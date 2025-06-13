# 5. No build step

Date: 2025-06-12

## Status

Accepted

## Context

We need to decide whether to use a build step in our Node.js GOV.UK Frontend
website project.

Most frontend projects use a build step to:

- transpile CSS and JavaScript for older browsers
- minify code to improve load times
- bundle code into fewer files
- enable developers to use TypeScript and CSS preprocessors
- add development tooling like hot reloading

## Decision

We will not use a build step. Instead we will:

- serve GOV.UK Frontend and HTMX's precompiled CSS and JavaScript files directly
  from `node_modules`
- write vanilla JavaScript and CSS, with no transpiling or bundling
- use JSDoc comments and a linter like JavaScript Standard Style, rather than
  TypeScript
- use `nodemon` to restart the app when files change during development

## Consequences

### Advantages

- simpler development process with fewer dependencies
- reduced complexity makes the service easier to maintain long-term
- improved security from fewer third-party dependencies
- easier for developers to understand what the code does
- works well with HTMX's HTML-focused approach

### Drawbacks

- cannot override GOV.UK Frontend Sass settings
- cannot import individual GOV.UK Frontend components
- no type checking through TypeScript
- custom CSS and JavaScript will not be minified
- simpler developer tooling without hot reloading
