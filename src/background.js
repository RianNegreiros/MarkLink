// Background script to handle tab information and context menu

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('MarkLink extension installed');

  // Create context menu
  chrome.contextMenus.create({
    id: "copyAsMarkdownLink",
    title: "Copy as Markdown Link",
    contexts: ["page", "link"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
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
  chrome.tabs.sendMessage(tab.id, { action: "getMetadata" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }

    if (response && response.markdownLink) {
      copyToClipboard(response.markdownLink);
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

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  // Create a temporary textarea element to use for copying
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  // Show notification
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "showNotification",
        message: "Markdown link copied to clipboard!"
      });
    }
  });
} 