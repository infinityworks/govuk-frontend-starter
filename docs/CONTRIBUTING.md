# Contributing to GOV.UK Frontend starter

Thank you for contributing to this project. Your help makes government services
better for everyone.

## How to contribute

You can contribute by:

- reporting bugs
- suggesting new features
- improving documentation
- submitting code changes

### Before you start

If you're new to the project:

1. Read the [README](../README.md) to understand what this starter does
2. Check our [architecture decision records](./decisions/) to understand our
   technical choices
3. Look at
   [existing issues](https://github.com/infinityworks/govuk-frontend-starter/issues)
   to see what we're working on

## Making changes

### Set up your development environment

1. Fork and clone the repository
2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the project:
   - `npm start` - run normally
   - `npm run dev` - run with automatic restart on file changes

### Use the recommended tools

If you use VS Code:

- install the recommended extensions when prompted
- use the workspace settings in `.vscode/`

This will:

- format your code automatically when you save
- show linting errors in your editor
- help you follow our code style

### Write tests

Add tests for any new functionality. Run tests before submitting your changes:

```sh
npm test
```

### Follow conventional commits

Your pull request title must use
[conventional commit syntax](https://www.conventionalcommits.org/en/v1.0.0/).

Good examples:

- `feat: add cookie preferences page`
- `fix: correct form validation for postcode`
- `docs: update installation instructions`

Don't worry about individual commit messages - we'll squash them when merging.

### Document significant changes

For architecturally significant changes:

1. Write an
   [architecture decision record](https://gds-way.digital.cabinet-office.gov.uk/standards/architecture-decisions.html)
   (ADR)
2. Put it in `docs/decisions/`
3. Use [`adr-tools`](https://github.com/npryce/adr-tools) if it helps

Examples of significant changes:

- adding new dependencies
- changing the build process
- modifying security controls

## Submit your changes

1. Create a new branch for your changes
2. Make your changes and commit them
3. Push to your fork
4. [Create a pull request](https://github.com/infinityworks/govuk-frontend-starter/pulls)
   to our `main` branch

Your pull request:

- needs a clear description of what it does
- must pass all automated tests and checks
- needs approval from someone in @infinityworks/govuk-frontend-starter

## Who can merge changes

### Write access

Everyone in @infinityworks/next-gen-accounts can:

- create branches
- submit pull requests
- review code

### Approval and merging

Only maintainers in @infinityworks/govuk-frontend-starter can:

- approve pull requests
- merge changes

### Become a maintainer

If you're part of the Next Gen Engineering GitHub organisation and want to
become a maintainer, contact someone in the maintainers group.

## Questions?

- [Create an issue](https://github.com/infinityworks/govuk-frontend-starter/issues)
  for bugs or feature requests
- [Start a discussion](https://github.com/infinityworks/govuk-frontend-starter/discussions)
  for everything else
