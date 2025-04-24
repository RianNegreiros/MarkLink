# MarkLink

A Chrome extension that generates formatted Markdown links for Obsidian notes with just one click.

## Features

- One-click operation: Generate and copy Markdown links instantly
- Format preservation: Links follow the standard `[Page Title - Creator name](https://example.com)` format
- Automatic metadata extraction: Pulls page title and attempts to identify creator/author
- Special handling for YouTube videos

## Installation

### Developer Mode Installation (Chrome)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the `src` directory from your downloaded/cloned repository

## How to Use

1. Navigate to a webpage or video you want to save to Obsidian
2. Click the Obsidian Clipper icon in your browser toolbar
3. In the popup that appears, click the "Copy as Markdown Link" button
4. The formatted Markdown link is copied to your clipboard
5. Paste the link into your Obsidian document

## Troubleshooting

- **Link not generated**: Refresh the page and try again. Some dynamic websites may need to fully load before the extension can extract metadata.
- **No author/creator detected**: The extension attempts to find author information from meta tags and DOM elements, but not all websites provide this information in an accessible way.

## Contributing

Feel free to submit issues or pull requests to improve the extension.
