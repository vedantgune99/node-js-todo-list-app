# Node.js Todo List App

A small Node.js project demonstrating a server-side todo list app with a JSON-backed data layer, static HTML rendering, and a clean test separation.

## Project Overview

This app is built using Node.js core modules only. It exposes a few simple routes, reads and writes todos to a JSON file, and renders a template with server-side replacements.

Key features:
- HTTP routing with built-in `http`
- HTML template rendering via a lightweight placeholder replacement
- JSON data persistence in `data/data.json`
- Separate configuration profiles for runtime and tests
- Node.js built-in test runner (`node --test`)

## Architecture

```mermaid
flowchart TD
    Browser[Browser / Client]
    Router[Router<br/>(todo/router.js)]
    Service[Service Layer<br/>(todo/service.js)]
    Static[Static File Renderer<br/>(utils/serveStaticFiles.js)]
    Data[Data Layer<br/>(utils/jsonReaderWriter.js)]
    JSONFile[data/data.json]
    Templates[Templates<br/>(templates/index.html, templates/styles.css)]

    Browser -->|GET /| Router
    Browser -->|GET /styles| Router
    Browser -->|POST /add-todo| Router
    Browser -->|GET /delete/:id| Router
    Browser -->|POST /update-todo| Router
    Router -->|todo operations| Service
    Router -->|render page| Static
    Service --> Data
    Data --> JSONFile
    Static --> Templates
```

## Project Structure

- `app.js` — application entry point
- `config/config.js` — environment-aware config loader
- `config/config.runtime.js` — runtime configuration values
- `config/config.test.js` — test profile configuration values
- `todo/router.js` — HTTP request router
- `todo/service.js` — business logic for todo operations
- `utils/jsonReaderWriter.js` — JSON file read/write helpers
- `utils/reqParser.js` — HTTP form body parser
- `utils/serveStaticFiles.js` — template rendering and static file serve helper
- `templates/index.html` — page template with `{{todos}}` placeholder
- `templates/styles.css` — stylesheet
- `data/data.json` — application data store
- `tests/` — unit and integration tests

## Configuration Profiles

`config/config.js` picks one of two profiles based on `NODE_ENV`:

- `config/config.runtime.js` — default runtime settings
- `config/config.test.js` — test-specific settings with isolated test data

Example:

```bash
NODE_ENV=test node --test ./tests
```

## Running the App

Requirements:
- Node.js 22+

Start the server:

```bash
node app.js
```

Then open the URL printed by the server in your browser.

## Testing

The project uses Node.js built-in test support.

Run the full suite:

```bash
node --test ./tests
```

Run a single test file:

```bash
node --test ./tests/router.test.js
```

### Test coverage areas

- `tests/jsonReaderWriter.test.js` — data layer tests
- `tests/router.test.js` — HTTP route integration tests
- `tests/serveStaticFile.test.js` — static file/template rendering tests

## What is Tested

- Data read/write behavior for JSON storage
- HTTP routing for main app endpoints
- Static file serving and template rendering
- Validation and graceful handling of malformed todos
- Error response behavior for missing or invalid templates

## Notes and Improvements

- Runtime configuration currently loads from `config/config.runtime.js`.
- Test configuration uses `config/config.test.js` and an isolated test data file.
- Error handling is structured to return `404` for missing resources and `500` for server rendering failures.

## Helpful Commands

```bash
# Run the app
node app.js

# Run all tests
node --test ./tests

# Run one test file
node --test ./tests/serveStaticFile.test.js
```

## How It Works

The app reads `templates/index.html`, replaces the `{{todos}}` placeholder with generated rows, and sends the rendered HTML back to the browser. Todo operations modify `data/data.json` using the service layer.

The test setup is intentionally separated so HTTP, data, and business logic can be validated independently.

