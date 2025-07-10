# MarkLink

A browser extension for Chrome and Firefox that generates formatted Markdown links with one click.

## Features

- Instant Markdown link generation with `[Title - Creator](URL)` format
- Automatic metadata extraction (page title, author/creator)
- YouTube playlist support
- Keyboard shortcut (Alt+M)
- **Works on both Chrome and Firefox**

## Installation

### Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `src` directory

### Firefox

You can install MarkLink in Firefox in two ways:

**Option 1: Install from the Firefox Add-ons Store**

- Visit the [Firefox Add-ons Store page](https://addons.mozilla.org/en-US/firefox/addon/marklink/) and click "Add to Firefox".

**Option 2: Install manually from GitHub**

- Download the latest `.xpi` file from the [GitHub Releases page](https://github.com/riannegreiros/marklink/releases).
- Open `about:addons` in Firefox, click the gear icon, and choose "Install Add-on From File..."
- Select the downloaded `.xpi` file to install MarkLink permanently.

## Usage

1. Visit a webpage
2. Use any of these methods:
   - Click the MarkLink icon
   - Press Alt+M
   - Right-click and select "Copy as Markdown Link"
3. Paste the generated link in Obsidian (or any Markdown editor)

## Settings

Access the options page to customize:

- Click behavior (instant copy/popup UI)
- YouTube link format (regular/thumbnail preview)
- Link format preferences

You can also access the Privacy Policy and GitHub repository links from the options page footer.

## Privacy

MarkLink is designed with privacy in mind:

- No data collection or tracking
- All settings stored locally
- No third-party services or analytics
- Minimal permissions required

For detailed information, please read our [Privacy Policy](src/privacy.html).

## Metadata Handling

- **General websites**: Extracts from meta tags
- **YouTube**: Video title and channel name (including playlists)
- **Medium**: Article title and author
