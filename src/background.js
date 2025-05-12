// Background script to handle tab information and context menu
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Create context menu when extension is installed
browserAPI.runtime.onInstalled.addListener(() => {
  console.log('MarkLink extension installed');

  // Create context menu
  browserAPI.contextMenus.create({
    id: "copyAsMarkdownLink",
    title: "Copy as Markdown Link",
    contexts: ["page", "link"]
  });

  // Set default click behavior to immediate
  browserAPI.storage.sync.get(['clickBehavior'], (result) => {
    if (!result.clickBehavior) {
      browserAPI.storage.sync.set({ clickBehavior: 'immediate' });
    }
  });
});

// Handle extension icon click
browserAPI.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('chrome://') ||
    tab.url.startsWith('edge://') ||
    tab.url.startsWith('about:') ||
    tab.url.startsWith('moz-extension://')) {
    return;
  }

  // Check user's preferred click behavior
  browserAPI.storage.sync.get(['clickBehavior'], (result) => {
    if (result.clickBehavior === 'popup') {
      // Open popup UI
      browserAPI.action.setPopup({ popup: 'popup.html' });
      browserAPI.action.openPopup();
      // Reset popup to null after opening to maintain immediate action capability
      setTimeout(() => {
        browserAPI.action.setPopup({ popup: '' });
      }, 100);
    } else {
      // Default to immediate action
      generateMarkdownLinkFromTab(tab);
    }
  });
});

// Handle keyboard shortcuts
browserAPI.commands.onCommand.addListener((command) => {
  if (command === "copy-as-markdown") {
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        generateMarkdownLinkFromTab(tabs[0]);
      }
    });
  }
});

// Handle context menu clicks
browserAPI.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyAsMarkdownLink") {
    if (info.linkUrl) {
      // If user right-clicked on a link
      fetchTitleAndCreateLink(info.linkUrl);
    } else {
      // If user right-clicked anywhere else on the page
      generateMarkdownLinkFromTab(tab);
    }
  }
});

// Generate markdown link from active tab
function generateMarkdownLinkFromTab(tab) {
  browserAPI.tabs.sendMessage(tab.id, { action: "getMetadata" }, (response) => {
    if (browserAPI.runtime.lastError) {
      console.error('Error:', browserAPI.runtime.lastError);
      return;
    }

    if (response && response.markdownLink) {
      copyToClipboard(response.markdownLink);
      // Show notification in the content script
      browserAPI.tabs.sendMessage(tab.id, {
        action: "showNotification",
        message: "Markdown link copied to clipboard!"
      });
    }
  });
}

// Fetch title for external links and create markdown link
function fetchTitleAndCreateLink(url) {
  // For external links, we need to get the title separately
  // This is a simple implementation - we're just using the URL as the title
  // A more sophisticated approach would be to fetch the page and extract its title
  const markdownLink = `[${url}](${url})`;
  copyToClipboard(markdownLink);
}

// Helper function to copy text to clipboard using Navigator API
function copyToClipboard(text) {
  // Use navigator.clipboard API through a content script since background scripts
  // don't have access to the clipboard API directly
  browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      browserAPI.tabs.sendMessage(tabs[0].id, {
        action: "copyToClipboard",
        text: text
      }, () => {
        // Empty callback function to handle the response, even if we don't need it
        // This prevents the "message channel closed" warning
        if (browserAPI.runtime.lastError) {
          console.error('Error sending message:', browserAPI.runtime.lastError);
        }
      });
    }
  });
} 