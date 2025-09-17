# Changelog

## [1.4.5] - 2025-09-17

### Changed

- Clean YouTube URLs by removing resume-time parameters (`t`, `time_continue`, `start`, `end`) and `#t=` fragments when generating links.

## [1.4.4] - 2025-08-19

### Added

- Added `"scripting"` permission for MV3 clipboard execution in Chrome.

### Changed

- Clipboard flow now uses `chrome.scripting.executeScript` on MV3 with a Firefox-friendly fallback to content script messaging.
- Consistent error handling with structured logging in `src/background.js` and `src/content.js`.

### Fixed

- Resolved Chrome MV3 error by migrating `background.scripts` to `background.service_worker` in `src/manifest.json`, preserving Firefox compatibility.
- Graceful fallback when content scripts cannot run on restricted/internal pages.
- Avoided `[object Object]` console errors by logging explicit messages.

## [1.4.3] - 2025-07-10

### Added

- Updated documentation and options page to reflect cross-browser support
- MarkLink can now be installed permanently in Firefox via the .xpi from GitHub releases or from the Firefox Add-ons Store ([link](https://addons.mozilla.org/en-US/firefox/addon/marklink/))

### Changed

- Keyboard shortcut instructions now include both Chrome and Firefox
- README and UI text updated to clarify multi-browser compatibility

## [1.4.2] - 2025-05-19

### Added

- Privacy policy
- Privacy policy link in options page
- Privacy section in README

### Changed

- Added footer to options page with privacy and GitHub links

## [1.4.1] - 2025-05-12

### Added

- YouTube playlist channel name support
- New YouTube playlist selectors

### Changed

- Refactored YouTube metadata extraction
- Centralized YouTube selectors

## [1.4.0] - 2025-05-12

### Added

- Option to choose between immediate copy and popup UI
- Click behavior preference in options

### Changed

- Default to immediate copy on icon click
- Updated background script for both behaviors

## [1.3.2] - 2025-05-07

### Added

- YouTube thumbnail link format option
- Settings page for YouTube format preference
- Storage permission for preferences

### Changed

- Updated YouTube link formatting

## [1.2.1] - 2025-05-06

### Changed

- Updated Firefox installation instructions

### Fixed

- Documentation for Firefox installation options

## [1.2.0] - 2025-04-24

### Added

- Dark mode support

### Changed

- Refactored codebase
- Modularized content script
- Updated popup UI

## [1.1.0] - 2025-04-17

### Added

- Alt+M keyboard shortcut
- Context menu option
- YouTube channel name in links

### Changed

- Moved clipboard handling to content script

## [1.0.0] - 2025-04-16

### Added

- Basic Markdown link generation
- Page title and author extraction
- Initial documentation
