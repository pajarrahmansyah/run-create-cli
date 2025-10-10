# run-create-cli

A useful CLI tool for scaffolding features and generating code blueprints.

## Installation

```bash
# Global installation (recommended)
npm install -g run-create-cli

# Or use directly with npx (no installation needed)
npx run-create-cli feat my-feature
```

> **Note:** This is a CLI tool meant to be installed globally. Global installation allows you to use `rcc` command anywhere in your terminal.

## CLI Commands

This package provides two CLI commands:
- `run-create-cli` - Full command name
- `rcc` - Short alias for convenience

Both commands work identically:

```bash
# Using full command name
run-create-cli feat user-profile
run-create-cli gen ./blueprints/user.js UserModel

# Using short alias (recommended)
rcc feat user-profile
rcc gen ./blueprints/user.js UserModel
```

## Usage

### Feature Scaffolding

Generate a complete feature with all necessary files:

```bash
# Create feature with tests (default in src/ folder)
rcc feat user-profile

# Create feature without tests
rcc feat user-profile --no-test

# Create in specific directory
rcc feat user-profile --dir features
rcc feat user-profile -d components

# Force overwrite existing files
rcc feat user-profile --force -d src/modules
```

### Blueprint Generation

Generate code from custom blueprint files:

```bash
# Generate from blueprint file
rcc gen ./blueprints/user.js UserModel

# Generate with force overwrite
rcc gen ./blueprints/api.js AuthService --force
```

## Commands

### `rcc feat <name> [options]` (or `run-create-cli feat`)

Scaffolds a complete feature with:
- Main implementation file
- Type definitions
- Index file for exports
- Test file (unless `--no-test` is specified)

**Options:**
- `-d, --dir <directory>` - Target directory (default: `src`)
- `--no-test` - Skip generating test files
- `-f, --force` - Overwrite existing files

### `rcc gen <blueprint> <name> [options]` (or `run-create-cli gen`)

Generates code from a blueprint file (JS/JSON module).

**Arguments:**
- `<blueprint>` - Path to blueprint file (e.g., `./blueprints/user.js`)
- `<name>` - Entity name for generation

**Options:**
- `-f, --force` - Overwrite existing files

## Features

- 🚀 **Fast scaffolding** - Generate complete features in seconds
- 📁 **Smart file organization** - Follows best practices for file structure
- 🧪 **Test-ready** - Includes test files by default
- 🎯 **Type-safe** - Full TypeScript support
- ⚡ **Lightweight** - Minimal dependencies

## Development

```bash
# Clone the repository
git clone https://github.com/pajarrahmansyah/run-create-cli.git
cd run-create-cli

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run in development mode
npm run dev
```

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.

## License

MIT License - see [LICENSE](LICENSE) file for details.