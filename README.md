# GOV.UK Frontend starter

A template for building government services using the
[GOV.UK Design System](https://design-system.service.gov.uk/).

## What this starter does

This starter creates a frontend for a fictional 'Apply for a juggling licence'
service. It shows you how to:

- ask users questions
- help them recover from errors
- check their answers
- show a confirmation page

## Features

The starter includes common patterns you'll need:

### User journeys

- Form validation and error messages
- Check your answers page
- Confirmation page

### Cookie management

- Cookie banner
- Cookie settings page
- Analytics opt-in

### Content management

- Markdown pages for static content
- Separation of content and presentation

### Error handling

- 400, 500 and 503 error pages
- Content Security Policy (CSP)
- Cross-Site Request Forgery (CSRF) protection

### Development tools

- Automated testing with Playwright
- Accessibility testing
- GitHub Actions for continuous integration
- Dependabot for dependency updates
- Docker support
- ESLint and Prettier

## Technical information

### What we use

The starter uses:

- JavaScript with Node.js
- Express.js for the web server
- Nunjucks for templates
- GOV.UK Frontend for components

### Before you start

You need to:

1. Install dependencies
2. Set up environment variables
3. Install test browsers

#### 1. Install dependencies

```sh
npm install
```

#### 2. Set up environment variables

Copy the example environment file:

```sh
cp .env.example .env
```

#### 3. Install test browsers

```sh
npx playwright install
```

### Run the tests

Run all tests:

```sh
npm run test
```

## Architecture decisions

Read our architecture decision records in [docs/decisions](./docs/decisions/).

## Design principles

We follow these principles:

- [Building a robust frontend using progressive enhancement - GOV.UK Service Manual](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)
- [Using Node.js - GDS Way](https://gds-way.digital.cabinet-office.gov.uk/manuals/programming-languages/nodejs/)
- [Hypermedia Systems](https://hypermedia.systems/)
- [Writing JavaScript without a build system](https://jvns.ca/blog/2023/02/16/writing-javascript-without-a-build-system/)

### New to server-side development?

If you usually work with React or similar client-side libraries, you might find
this resource helpful:

- [Server-side website programming - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side)

## Licence

Released under the [MIT Licence](./LICENSE) unless otherwise stated.

The code is
[open and reusable](https://www.gov.uk/service-manual/technology/making-source-code-open-and-reusable).

Based on
[ministryofjustice/govuk-frontend-express](https://github.com/ministryofjustice/govuk-frontend-express).
