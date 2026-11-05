# MyTools

A browser-based toolbox. Tool processing happens locally; no user input is sent to a backend.

## Stack
- Vite + native JavaScript ES modules
- Bootstrap 5 grid/utilities
- CSS custom properties for light/dark themes
- Vitest + jsdom unit tests
- GitHub Actions for test, build and GitHub Pages deployment

## Development
Requires Node.js 22+.

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run build
```

## Deployment
The workflow tests, builds and deploys `dist/` after pushes to `main`. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the source.

## Structure
- `src/css/`: styles and design tokens
- `src/js/app.js`: application composition and UI events
- `src/js/i18n.js`: German and English strings
- `src/js/theme.js`, `search.js`, `storage.js`: shared features
- `src/js/tools/`: independent tool modules and tests

## Adding a tool
Create a module in `src/js/tools/`, register it in `registry.js`, add translations in `i18n.js`, and test non-trivial logic.