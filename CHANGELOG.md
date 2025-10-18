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
