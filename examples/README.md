# Examples

This folder contains example files to help you get started with `run-create-cli`.

## Configuration Example

### `rcc.config.example.ts`

Example configuration file. Copy this to your project root as `rcc.config.js`:

```bash
# Copy to your project
cp node_modules/run-create-cli/examples/rcc.config.example.ts rcc.config.js
```

**Configuration options:**
- `baseDir` - Base directory for generated files (default: `src`)
- `skipTests` - Skip generating test files by default (default: `false`)

## Blueprint Examples

Blueprints are JavaScript files that define custom code generation templates.

### `api-service.blueprint.js`

Generates a complete API service class with CRUD operations and tests.

**Usage:**
```bash
rcc gen node_modules/run-create-cli/examples/api-service.blueprint.js UserService
```

**Generates:**
- `src/services/user-service.ts` - Service class with API methods
- `src/services/user-service.test.ts` - Complete test suite

### `react-component.blueprint.js`

Generates a React component with TypeScript and tests.

**Usage:**
```bash
rcc gen node_modules/run-create-cli/examples/react-component.blueprint.js Button
```

**Generates:**
- `src/components/button.tsx` - React component with props
- `src/components/button.test.tsx` - Component tests

## Creating Custom Blueprints

You can create your own blueprints by following this structure:

```javascript
export default {
  files: [
    {
      path: (name) => `path/to/${name.kebab}.ts`,
      template: (name) => `
        // Your template here
        // Available name formats:
        // - name.original: "user profile"
        // - name.lower: "user profile"
        // - name.upper: "USER PROFILE"
        // - name.camel: "userProfile"
        // - name.pascal: "UserProfile"
        // - name.kebab: "user-profile"
        // - name.snake: "user_profile"
        // - name.constant: "USER_PROFILE"
      `,
    },
  ],
};
```

Save your blueprint and use it:

```bash
rcc gen ./my-blueprint.js MyEntity
```
