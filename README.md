# Locked In 🔒

Stay focused by defining your goal before visiting distracting sites.

## What It Does

Locked In helps you stay intentional while browsing. Before diving into potentially distracting websites, you define what you're locked in for. A floating widget reminds you of your goal, and the browser warns you before leaving if you haven't marked it complete.

## Features

- **Auto-Prompt Sites** - Configure domains (like `linkedin.com`, `facebook.com`) that automatically ask "What are you locked in for?" when you visit
- **Manual Goals** - Set your goal on any site by clicking the extension icon
- **Time Limits** - Set optional time limits (5, 15, 30 min or custom) with countdown timer
- **80% Warning** - Get a motivational nudge when 80% of your time has elapsed
- **Floating Widget** - Non-intrusive bottom-right reminder showing your current goal and timer
- **Leave Protection** - Browser warns you before closing/navigating away with an active goal
- **Goal Completion** - Mark goals complete manually or automatically when time expires

## Installation

### From GitHub Releases (Recommended)

1. Go to [Releases](../../releases) and download the latest `locked-in-vX.X.X.zip`
2. Extract the zip file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top-right toggle)
5. Click "Load unpacked" and select the extracted folder
6. The extension icon appears in your toolbar

### From Source

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
4. Now when you visit these sites, a modal asks what you're locked in for

### Setting a Goal

1. Visit any website
2. Click the extension icon
3. Enter your goal
4. Optionally set a time limit (5, 15, 30 min or custom)
5. Click "Lock In"
6. The floating widget appears in the bottom-right with your goal and timer

### Completing Goals

- Click "✓ Complete" on the floating widget
- Time expires automatically (if you set a time limit)
- Close/navigate away from the page

### Time Limit Features

- **Live Countdown** - See your remaining time in the widget
- **Progress Bar** - Visual indicator of time remaining (green → orange → red)
- **80% Warning** - Get a motivational notification when you hit 80% of your time
- **Auto-Complete** - Goal completes automatically when time runs out

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
