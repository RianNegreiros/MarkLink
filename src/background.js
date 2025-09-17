const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

function errorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error && typeof error.message === 'string') return error.message;
  try {
    return JSON.stringify(error);
  } catch (_e) {
    return String(error);
  }
}

function logError(context, error) {
  const message = errorMessage(error);
  console.error(`${context}: ${message}`);
}

browserAPI.runtime.onInstalled.addListener(() => {
  browserAPI.contextMenus.create({
    id: "copyAsMarkdownLink",
    title: "Copy as Markdown Link",
    contexts: ["page", "link"]
  });

  browserAPI.storage.sync.get(['clickBehavior'], (result) => {
    if (browserAPI.runtime.lastError) {
      logError('storage.get(clickBehavior)', browserAPI.runtime.lastError);
      return;
    }
    if (!result || !result.clickBehavior) {
      browserAPI.storage.sync.set({ clickBehavior: 'immediate' }, () => {
        if (browserAPI.runtime.lastError) {
          logError('storage.set(clickBehavior)', browserAPI.runtime.lastError);
        }
      });
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
    if (browserAPI.runtime.lastError) {
      logError('storage.get(clickBehavior) onClick', browserAPI.runtime.lastError);
      generateMarkdownLinkFromTab(tab);
      return;
    }
    if (result.clickBehavior === 'popup') {
      browserAPI.action.setPopup({ popup: 'popup.html' });
      try {
        browserAPI.action.openPopup();
      } catch (e) {
        logError('action.openPopup', e);
      }
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
      if (browserAPI.runtime.lastError) {
        logError('tabs.query(active currentWindow)', browserAPI.runtime.lastError);
        return;
      }
      if (tabs[0]) {
        generateMarkdownLinkFromTab(tabs[0]);
      }
    });
  }
});

browserAPI.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyAsMarkdownLink") {
    if (info.linkUrl) {
      fetchTitleAndCreateLink(info.linkUrl);
    } else {
      generateMarkdownLinkFromTab(tab);
    }
  }
});

function generateMarkdownLinkFromTab(tab) {
  browserAPI.tabs.sendMessage(tab.id, { action: "getMetadata" }, (response) => {
    if (browserAPI.runtime.lastError) {
      const fallbackTitle = tab.title || tab.url || 'Link';
      const fallbackUrl = tab.url || '';
      const markdownLink = `[${fallbackTitle}](${fallbackUrl})`;
      copyToClipboard(markdownLink);
      return;
    }

    if (response && response.markdownLink) {
      copyToClipboard(response.markdownLink);
      browserAPI.tabs.sendMessage(tab.id, {
        action: "showNotification",
        message: "Markdown link copied to clipboard!"
      }, () => {
        if (browserAPI.runtime.lastError) {
          logError('tabs.sendMessage(showNotification)', browserAPI.runtime.lastError);
        }
      });
    }
  });
}

function fetchTitleAndCreateLink(url) {
  const markdownLink = `[${url}](${url})`;
  copyToClipboard(markdownLink);
}

function copyToClipboard(text) {
  browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs && tabs[0];
    if (!activeTab) {
      return;
    }

    const runClipboard = () => {
      try {
        if (browserAPI.scripting && browserAPI.scripting.executeScript) {
          browserAPI.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: (t) => {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(t);
              }
              const textarea = document.createElement('textarea');
              textarea.value = t;
              textarea.style.position = 'fixed';
              textarea.style.top = '-9999px';
              document.body.appendChild(textarea);
              textarea.focus();
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
              return Promise.resolve();
            },
            args: [text]
          }, () => {
            if (browserAPI.runtime.lastError) {
              logError('Clipboard executeScript', browserAPI.runtime.lastError);
            } else {
              browserAPI.tabs.sendMessage(activeTab.id, { action: "showNotification", message: "Markdown link copied to clipboard!" }, () => {
                if (browserAPI.runtime.lastError) {
                  logError('tabs.sendMessage(showNotification)', browserAPI.runtime.lastError);
                }
              });
            }
          });
        } else {
          browserAPI.tabs.sendMessage(activeTab.id, { action: "copyToClipboard", text }, () => {
            if (browserAPI.runtime.lastError) {
              logError('Clipboard message to content script', browserAPI.runtime.lastError);
            }
          });
        }
      } catch (e) {
        logError('Clipboard exception', e);
      }
    };

    runClipboard();
  });
}