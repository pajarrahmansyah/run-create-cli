# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-10

### Added
- Initial release
- `feat` command for scaffolding features with templates
  - Generates index, implementation, types, and test files
  - Support for `--no-test` flag to skip test file generation
  - Support for `--dir` option to specify target directory
  - Support for `--force` option to overwrite existing files
- `gen` command for generating code from custom blueprints
  - Accepts blueprint file path and entity name
  - Support for `--force` option to overwrite existing files
- Two CLI aliases: `run-create-cli` and `rcc`
- Comprehensive test suite with Vitest
- TypeScript support with full type definitions
- Path aliases (`@/`) for clean imports

### Dependencies
- commander@^12.1.0 for CLI framework

[0.1.0]: https://github.com/pajarrahmansyah/run-create-cli/releases/tag/v0.1.0
