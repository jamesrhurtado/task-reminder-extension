# FocusTask - Chrome Extension Project

## Repository Structure

This is a monorepo with two independent applications:

- **`/extension`** - Chrome Extension (TypeScript + Vite + @crxjs/vite-plugin)
- **`/landing`** - Marketing landing page (React + Vite + shadcn/ui + Tailwind)

**Important**: Always specify which directory you're working in. Commands must be run from the appropriate subdirectory.

## Build & Development Commands

### Extension (`/extension`)

```bash
cd extension
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload
npm run build        # Build for production (outputs to dist/)
```

Load in Chrome: `chrome://extensions/` → Enable Developer Mode → "Load unpacked" → Select `extension/dist/`

### Landing Page (`/landing`)

```bash
cd landing
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```

No tests exist in this repository.

## Chrome Extension Architecture

### Extension Structure

The extension uses **Manifest V3** with three main components that communicate via Chrome's message passing:

- **Background Service Worker** (`src/background/`) - Central coordinator, manages task state
- **Content Scripts** (`src/content/`) - Injected into web pages, shows UI elements
- **Popup** (`src/popup/`) - Extension icon popup for manual task creation

### Message Passing Pattern

All components communicate through a centralized message router in `background/messageRouter.ts`.

**Type-safe messages**: All messages use the `ExtensionMessage` union type defined in `shared/types.ts`.

**How to add a new message type**:
1. Add message type to `ExtensionMessage` union in `shared/types.ts`
2. Add handler case in `background/messageRouter.ts`
3. Send from content script or popup using `chrome.runtime.sendMessage()`

**Example**:
```typescript
// Send message
chrome.runtime.sendMessage({ type: "GET_ACTIVE_TASK", site: "example.com" })

// Background processes it in messageRouter.ts and sends response
// Content script or popup receives the response
```

### State Management

- **Storage**: All state stored in `chrome.storage.local` via `shared/storage.ts` wrapper
- **Active Tasks**: Stored as object keyed by site hostname (`activeTasks`)
- **Auto-prompt Domains**: Stored as array in `autoPromptConfig.domains`

### Key Files

- `public/manifest.json` - Extension manifest (defines permissions, content scripts, background worker)
- `shared/types.ts` - All TypeScript types (tasks, messages, configs)
- `background/taskManager.ts` - Task CRUD operations
- `background/messageRouter.ts` - Message handler (routes all extension communication)

## Landing Page Architecture

Standard React + Vite setup with shadcn/ui components:
- **Routing**: React Router (`react-router-dom`)
- **Components**: shadcn/ui components in `src/components/ui/`
- **Styling**: Tailwind CSS with custom theme in `tailwind.config.ts`

## Key Conventions

### TypeScript Configuration

Both projects use strict TypeScript with:
- `noUncheckedIndexedAccess: true` - Array/object access returns `T | undefined`
- `exactOptionalPropertyTypes: true` - Optional properties can't be explicitly set to `undefined`
- `strict: true` - All strict mode flags enabled

### Chrome Extension Specifics

- **Module System**: ESNext modules with `type: "module"` in manifest
- **Content Script Injection**: Runs on `<all_urls>` - be mindful of performance
- **Async Message Handling**: Always return `true` from `chrome.runtime.onMessage` listener when using async/await
- **Build Artifact**: `dist/` folder is what gets loaded as extension (git-ignored)

### Vite + CRXJS

The extension uses `@crxjs/vite-plugin` which:
- Auto-reloads extension during development
- Processes manifest.json and injects built files
- Handles TypeScript compilation
- Generates source maps

## Release Process

Releases are automated via GitHub Actions:
1. Push a tag matching `v*` (e.g., `v1.0.0`)
2. Workflow builds extension and creates GitHub release with zip file
3. Workflow runs from `/extension` directory, uses Node 20, runs `npm ci && npm run build`

## Common Gotchas

- Content scripts load on all URLs - be careful with global selectors or DOM manipulation
- Message passing between contexts is asynchronous - always use callbacks or promises
- Chrome storage is async - never assume synchronous access
- The landing page is a separate project - changes there don't affect extension functionality
