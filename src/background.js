const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(() => {
  browserAPI.contextMenus.create({
    id: "copyAsMarkdownLink",
    title: "Copy as Markdown Link",
    contexts: ["page", "link"]
  });

  browserAPI.storage.sync.get(['clickBehavior'], (result) => {
    if (!result.clickBehavior) {
      browserAPI.storage.sync.set({ clickBehavior: 'immediate' });
    }
  });
});

browserAPI.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('chrome://') ||
    tab.url.startsWith('edge://') ||
    tab.url.startsWith('about:') ||
    tab.url.startsWith('moz-extension://')) {
    return;
  }

  browserAPI.storage.sync.get(['clickBehavior'], (result) => {
    if (result.clickBehavior === 'popup') {
      browserAPI.action.setPopup({ popup: 'popup.html' });
      browserAPI.action.openPopup();
      // Reset popup to null after opening to maintain immediate action capability
      setTimeout(() => {
        browserAPI.action.setPopup({ popup: '' });
      }, 100);
    } else {
      generateMarkdownLinkFromTab(tab);
    }
  });
});

browserAPI.commands.onCommand.addListener((command) => {
  if (command === "copy-as-markdown") {
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        generateMarkdownLinkFromTab(tabs[0]);
      }
    });
  }
});

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

function generateMarkdownLinkFromTab(tab) {
  browserAPI.tabs.sendMessage(tab.id, { action: "getMetadata" }, (response) => {
    if (browserAPI.runtime.lastError) {
      console.error('Error:', browserAPI.runtime.lastError);
      return;
    }

    if (response && response.markdownLink) {
      copyToClipboard(response.markdownLink);
      browserAPI.tabs.sendMessage(tab.id, {
        action: "showNotification",
        message: "Markdown link copied to clipboard!"
      });
    }
  });
}

// Simple implementation - using URL as the title
// A more sophisticated approach would fetch the page and extract its title
function fetchTitleAndCreateLink(url) {
  const markdownLink = `[${url}](${url})`;
  copyToClipboard(markdownLink);
}

function copyToClipboard(text) {
  // Use navigator.clipboard API through a content script since background scripts
  // don't have access to the clipboard API directly
  browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      browserAPI.tabs.sendMessage(tabs[0].id, {
        action: "copyToClipboard",
        text: text
      }, () => {
        if (browserAPI.runtime.lastError) {
          console.error('Error sending message:', browserAPI.runtime.lastError);
        }
      });
    }
  });
}