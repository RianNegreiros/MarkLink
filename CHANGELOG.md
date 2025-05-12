# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2025-05-12

### Added

- New click behavior option to choose between immediate action and popup UI
- Enhanced notification system with animations and better visibility
- Added click behavior preference in options page

### Changed

- Default behavior now copies link immediately when clicking the extension icon
- Improved options page UI with new click behavior settings
- Updated background script to handle both immediate and popup behaviors

## [1.3.2] - 2025-05-07

### Added

- New option to format YouTube links with video thumbnails
- Added settings page with YouTube link format preference
- Added storage permission for saving user preferences

### Changed

- Updated YouTube link formatting to support thumbnail previews
- Improved options page UI with new format selection controls

## [1.2.1] - 2025-05-06

### Changed

- Updated Firefox installation instructions with clearer guidance on installation options
- Simplified explanation of Firefox extension signing requirements

### Fixed

- Consolidated temporary and permanent installation options in documentation

## [1.2.0] - 2025-04-24

### Changed

- Refactored codebase for clarity and maintainability
- Modularized content script extraction logic
- Improved popup and notification dark mode support
- Cleaned up and simplified popup UI and code

### Added

- Dark mode support (follows system preference)

## [1.1.0] - 2025-04-17

### Added

- Keyboard shortcut (Alt+M) to quickly copy Markdown links
- Right-click context menu option to copy Markdown links
- Special handling for YouTube videos to include channel name in Markdown link

### Improved

- Copy to clipboard now handled in content script for better compatibility

## [1.0.0] - 2024-04-16

### Added

- Initial release: Generate Markdown links for any website
- Basic extraction of page title and author meta tags
- Documentation and product design
