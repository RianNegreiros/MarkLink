# MarkLink

A browser extension that generates formatted Markdown links for Obsidian notes with one click.

## Features

- Instant Markdown link generation with `[Title - Creator](URL)` format
- Automatic metadata extraction (page title, author/creator)
- Two operation modes: Direct copy or popup UI
- Smart metadata handling for YouTube and Medium content
- Beautiful copy notifications

## Installation

### Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `src` directory

### Firefox

Temporary install via `about:debugging` > "This Firefox" > "Load Temporary Add-on" > select `manifest.json`

Note: Requires Mozilla signing for permanent installation.

## Usage

1. Visit a webpage
2. Click the MarkLink icon
3. Paste the generated link in Obsidian

## Settings

Access the options page to customize:

- Click behavior (instant copy/popup UI)
- YouTube link format (regular/thumbnail preview)
- Link format preferences

## Metadata Handling

- **General websites**: Extracts from meta tags
- **YouTube**: Video title and channel name
- **Medium**: Article title and author
