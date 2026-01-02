# FocusTask

Stay focused by defining your task before visiting distracting sites.

## What It Does

FocusTask helps you stay intentional while browsing. Before diving into potentially distracting websites, you define what you're there to do. A floating widget reminds you of your task, and the browser warns you before leaving if you haven't marked it complete.

## Features

- **Auto-Prompt Sites** - Configure domains (like `linkedin.com`, `facebook.com`) that automatically ask "What's your task?" when you visit
- **Manual Tasks** - Create tasks on any site by clicking the extension icon
- **Floating Widget** - Non-intrusive bottom-right reminder showing your current task
- **Leave Protection** - Browser warns you before closing/navigating away with an active task
- **Task Completion** - Mark tasks done manually or automatically when leaving

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" (top-right toggle)
6. Click "Load unpacked" and select the `dist` folder
7. The extension icon appears in your toolbar

## Usage

### Setting Up Auto-Prompt Sites

1. Click the extension icon
2. Go to "Auto-Prompt Sites" tab
3. Add domains like `linkedin.com`, `twitter.com`, `facebook.com`
4. Now when you visit these sites, a modal asks for your task

### Creating a Manual Task

1. Visit any website
2. Click the extension icon
3. Enter your task and click "Save"
4. The floating widget appears in the bottom-right

### Completing Tasks

- Click "Complete" on the floating widget, or
- Close/navigate away from the page (task auto-completes)

## Tech Stack

- TypeScript
- Vite + @crxjs/vite-plugin
- Chrome Extension Manifest V3

## Development

```bash
npm install     # Install dependencies
npm run dev     # Start dev server with hot reload
npm run build   # Build for production
```
