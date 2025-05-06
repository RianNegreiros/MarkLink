# MarkLink

A browser extension that generates formatted Markdown links for Obsidian notes with just one click.

## Features

- One-click operation: Generate and copy Markdown links instantly
- Format preservation: Links follow the standard `[Page Title - Creator name](https://example.com)` format
- Automatic metadata extraction: Pulls page title and attempts to identify creator/author

## Metadata Extraction

MarkLink extracts metadata from web pages in the following ways:

### Generic Websites

For most websites, MarkLink extracts:

- Page title from the document title
- Author information from common meta tags:
  - `<meta name="author">`
  - `<meta property="article:author">`
  - `<meta name="twitter:creator">`

### YouTube

For YouTube videos, MarkLink extracts:

- Video title (removing "- YouTube" suffix)
- Channel name from the video page DOM

### Medium

For Medium articles, MarkLink extracts:

- Article title from the main heading
- Author name from meta tags or byline elements

The resulting Markdown link follows the format: `[Title - Author](URL)`

If no author is found, the link will simply be: `[Title](URL)`

## Installation

### Chrome Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the `src` directory from your downloaded/cloned repository

### Firefox Installation

#### Temporary Installation

1. Open Firefox and type `about:debugging` in the URL bar
2. Click on "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the extension's directory and select the `manifest.json` file

Note: Temporary installations will be removed when Firefox is restarted. Unlike Chrome, Firefox requires all extensions to be signed by Mozilla for permanent installation in regular Firefox releases.

## How to Use

1. Navigate to a webpage or video you want to save to Obsidian
2. Click the MarkLink icon in your browser toolbar
3. In the popup that appears, click the "Copy as Markdown Link" button
4. The formatted Markdown link is copied to your clipboard
5. Paste the link into your Obsidian document

## Troubleshooting

- **Link not generated**: Refresh the page and try again. Some dynamic websites may need to fully load before the extension can extract metadata.
- **No author/creator detected**: The extension attempts to find author information from meta tags and DOM elements, but not all websites provide this information in an accessible way.

## Contributing

Feel free to submit issues or pull requests to improve the extension.
