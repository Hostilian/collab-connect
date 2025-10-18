# [1.1.0](https://github.com/Hostilian/collab-connect/compare/v1.0.0...v1.1.0) (2025-10-18)


### Features

* Add Vercel setup helper scripts for easy deployment configuration ([d80add9](https://github.com/Hostilian/collab-connect/commit/d80add90bbf72fb89669bba5da4cebe58a36f39e))

# 1.0.0 (2025-10-18)


### Bug Fixes

* **lint:** resolve all 37 linting errors and reduce to 2 warnings ([8e7e80b](https://github.com/Hostilian/collab-connect/commit/8e7e80bdfe01e689cc0df5f2a5e453ee5799586f))
* Remove nested repository submodules causing CI/CD failures ([7cbbd93](https://github.com/Hostilian/collab-connect/commit/7cbbd93bd47170371c0d21ed1607933ac0230869))


### Features

* add health check endpoints, semantic-release config, and integration tests ([f77a6d0](https://github.com/Hostilian/collab-connect/commit/f77a6d0c93078febe476a2c68e04cd1d3389bd90))
* add Sentry integration, performance testing, and accessibility testing ([08dc49a](https://github.com/Hostilian/collab-connect/commit/08dc49a9d433daa51aad954b841a72b4f8be0918))
* Build profile edit page UI and skip DB setup ([5287601](https://github.com/Hostilian/collab-connect/commit/528760149217e861b0ca3adb06793d420a6deb51))
* **ci:** add comprehensive CI/CD improvements, E2E tests, Docker, docs and tooling ([b524983](https://github.com/Hostilian/collab-connect/commit/b52498358ab836876f92517621142dbc76aff33a))
* Complete Notifications and GDPR systems ([cc0144c](https://github.com/Hostilian/collab-connect/commit/cc0144c45b5f7e1bcb617816dfb7a7ef9ac331b3))
* Complete Phase 3 infrastructure - API docs, rate limiting, multi-env, caching ([9bb08a0](https://github.com/Hostilian/collab-connect/commit/9bb08a0b0c249769f8f17b17ee2c2418b148bff6))
* Massive feature expansion - Security, PWA, Dark Mode, Monitoring, Audit Logging ([fa4640f](https://github.com/Hostilian/collab-connect/commit/fa4640fd4573c77868f9541ade235a8da55864ed))
* Two-Factor Authentication complete + Phase 4 summary ([d5ffbb4](https://github.com/Hostilian/collab-connect/commit/d5ffbb45cfc1aa5f6d95cf758623abe679bf1834))
* Webhooks and Notifications systems ([af9df39](https://github.com/Hostilian/collab-connect/commit/af9df397b13a448d0b4f0c11b4446b262a40ae7d))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI/CD with matrix builds (Node 18, 20, 22)
- Playwright E2E testing framework
- Docker support (Dockerfile + docker-compose.yml)
- Comprehensive documentation (DEVELOPMENT.md, CONTRIBUTING.md, SECRETS.md)
- Dependabot and CodeQL security scanning
- Pre-commit hooks with husky and lint-staged
- Codecov integration with 80% coverage thresholds
- Vercel deployment automation
- GitHub issue and PR templates
- Semantic versioning and automated releases

### Fixed
- Resolved 37 linting errors
- Fixed TypeScript `any` types with proper type definitions
- Removed unused variables

### Changed
- Disabled `react/no-unescaped-entities` ESLint rule
- Updated README with CI badges and better structure
