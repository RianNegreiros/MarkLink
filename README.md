# MarkLink

A browser extension that generates formatted Markdown links for Obsidian notes with just one click.

## Features

- One-click operation: Generate and copy Markdown links instantly
- Format preservation: Links follow the standard `[Page Title - Creator name](https://example.com)` format
- Automatic metadata extraction: Pulls page title and attempts to identify creator/author
- Flexible click behavior: Choose between immediate action or popup UI
- Enhanced notifications: Beautiful animated notifications when links are copied

## Click Behavior Options

MarkLink offers two ways to interact with the extension:

1. **Immediate Action (Default)**
   - Click the extension icon to instantly copy the Markdown link
   - Shows a notification when the link is copied
   - Perfect for quick, one-handed operation

2. **Popup UI**
   - Click the extension icon to open a popup
   - Preview the link before copying
   - Access additional options and settings

You can change this behavior in the extension options.

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

You can choose between two formats for YouTube links:

- Regular link: `[Title - Channel](URL)`
- Thumbnail preview: `![Title - Channel](URL)` (shows video thumbnail in your markdown)

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
   - By default, this will immediately copy the link
   - If you prefer the popup UI, you can change this in the options
3. The formatted Markdown link is copied to your clipboard
4. Paste the link into your Obsidian document

## Customization

MarkLink can be customized through the options page:

- **Click Behavior**: Choose between immediate action or popup UI
- **YouTube Format**: Select between regular links or thumbnail previews
- **Keyboard Shortcut**: Customize the default Alt+M shortcut

## Troubleshooting

- **Link not generated**: Refresh the page and try again. Some dynamic websites may need to fully load before the extension can extract metadata.
- **No author/creator detected**: The extension attempts to find author information from meta tags and DOM elements, but not all websites provide this information in an accessible way.

## Contributing

Feel free to submit issues or pull requests to improve the extension.
