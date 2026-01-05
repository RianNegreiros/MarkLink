const browserAPI = typeof browser !== "undefined" ? browser : chrome;

class MarkLinkBackground {
  constructor() {
    this.initializeExtension();
  }

  logError(context, error) {
    console.error(`${context}: ${error?.message || error}`);
  }

  isRestrictedUrl(url) {
    return ["chrome://", "edge://", "about:", "moz-extension://"].some(
      (prefix) => url.startsWith(prefix),
    );
  }

  initializeExtension() {
    browserAPI.runtime.onInstalled.addListener(() => this.onInstalled());
    browserAPI.action.onClicked.addListener((tab) => this.onActionClicked(tab));
    browserAPI.contextMenus.onClicked.addListener((info, tab) =>
      this.onContextMenu(info, tab),
    );
  }

  onInstalled() {
    browserAPI.contextMenus.create({
      id: "copyAsMarkdownLink",
      title: "Copy as Markdown Link",
      contexts: ["page", "link"],
    });
  }

  onActionClicked(tab) {
    if (this.isRestrictedUrl(tab.url)) return;
    this.generateMarkdownLink(tab);
  }

  onContextMenu(info, tab) {
    if (info.menuItemId === "copyAsMarkdownLink") {
      if (info.linkUrl) {
        this.copyToClipboard(`[${info.linkUrl}](${info.linkUrl})`);
      } else {
        this.generateMarkdownLink(tab);
      }
    }
  }

  async generateMarkdownLink(tab) {
    try {
      const response = await this.sendMessage(tab.id, { action: "getMetadata" });
      if (response?.markdownLink) {
        await this.copyToClipboard(response.markdownLink);
        this.showNotification(tab.id, "Markdown link copied to clipboard!");
      } else {
        this.copyFallbackLink(tab);
      }
    } catch (error) {
      this.copyFallbackLink(tab);
    }
  }

  copyFallbackLink(tab) {
    const fallbackLink = `[${tab.title || "Link"}](${tab.url})`;
    this.copyToClipboard(fallbackLink);
  }

  sendMessage(tabId, message) {
    return new Promise((resolve, reject) => {
      try {
        browserAPI.tabs.sendMessage(tabId, message, (response) => {
          if (browserAPI.runtime.lastError) {
            reject(new Error(browserAPI.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  showNotification(tabId, message) {
    this.sendMessage(tabId, { action: "showNotification", message }).catch(
      () => {},
    );
  }

  async copyToClipboard(text) {
    try {
      const tabs = await this.queryActiveTab();
      if (!tabs[0]) return;

      await this.sendMessage(tabs[0].id, { 
        action: "copyToClipboard", 
        text: text 
      });
    } catch (error) {
      this.logError("copyToClipboard", error);
    }
  }

  queryActiveTab() {
    return new Promise((resolve) => {
      browserAPI.tabs.query({ active: true, currentWindow: true }, resolve);
    });
  }
}

new MarkLinkBackground();
