// Prevent multiple injections
if (window.markLinkContentLoaded) {
  // Script already loaded, exit silently
} else {
  window.markLinkContentLoaded = true;

  const browserAPI = typeof browser !== "undefined" ? browser : chrome;

class MarkLinkContent {
  constructor() {
    this.initializeMessageListener();
  }

  logError(context, error) {
    console.error(`${context}: ${error?.message || error}`);
  }

  extractYouTubeMetadata() {
    const channelSelectors = [
      "ytd-video-owner-renderer #channel-name a",
      "ytd-channel-name yt-formatted-string a",
      "ytd-playlist-header-renderer #channel-name a",
      "#owner-name a",
      "span.ytd-channel-name a",
    ];

    const channelElement = channelSelectors
      .map((selector) => document.querySelector(selector))
      .find((el) => el);

    return {
      title: document.title.replace(" - YouTube", ""),
      url: this.cleanYouTubeUrl(window.location.href),
      creator: channelElement?.textContent.trim() || "",
    };
  }

  cleanYouTubeUrl(url) {
    try {
      const urlObj = new URL(url);
      ["t", "time_continue", "start", "end"].forEach((param) =>
        urlObj.searchParams.delete(param),
      );
      if (urlObj.hash.includes("t=")) urlObj.hash = "";
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  extractMediumMetadata() {
    const title =
      document.querySelector("h1")?.textContent.trim() || document.title;
    const creatorSelectors = [
      'meta[name="author"]',
      'header div[role="presentation"] a',
      "header a.ds-link",
      "header span a",
    ];

    const creator =
      creatorSelectors
        .map((selector) => document.querySelector(selector))
        .find((el) => el)
        ?.textContent?.trim() || "";

    return { title, url: window.location.href, creator };
  }

  extractGenericMetadata() {
    const creatorMeta = document.querySelector(
      'meta[name="author"], meta[property="article:author"], meta[name="twitter:creator"]',
    );

    return {
      title: document.title,
      url: window.location.href,
      creator: creatorMeta?.getAttribute("content") || "",
    };
  }

  extractMetadata() {
    const url = window.location.href;
    if (url.includes("youtube.com/")) return this.extractYouTubeMetadata();
    if (url.includes("medium.com/")) return this.extractMediumMetadata();
    return this.extractGenericMetadata();
  }

  formatMarkdownLink(metadata) {
    const { title, creator, url } = metadata;
    const formattedTitle =
      creator && !title.includes(creator) ? `${title} - ${creator}` : title;

    return `[${formattedTitle}](${url})`;
  }

  showNotification(message) {
    const notification = document.createElement("div");
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      borderRadius: "8px",
      zIndex: "9999",
      fontSize: "14px",
      fontWeight: "500",
      backgroundColor: isDark ? "#23272a" : "#4CAF50",
      color: isDark ? "#f1f1f1" : "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      transition: "all 0.3s ease",
      opacity: "0",
      transform: "translateY(-10px)",
    });

    notification.innerHTML = `<span style="margin-right: 8px;">✓</span>${message}`;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification("Markdown link copied to clipboard!");
    } catch (error) {
      this.legacyClipboardCopy(text);
    }
  }

  legacyClipboardCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;top:-9999px;opacity:0;";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showNotification("Markdown link copied to clipboard!");
      } else {
        this.showNotification("Failed to copy to clipboard");
      }
    } catch (error) {
      this.logError("clipboard fallback", error);
      this.showNotification("Failed to copy to clipboard");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  initializeMessageListener() {
    browserAPI.runtime.onMessage.addListener(
      async (request, sender, sendResponse) => {
        try {
          switch (request.action) {
            case "getMetadata":
              const metadata = this.extractMetadata();
              const markdownLink = this.formatMarkdownLink(metadata);
              sendResponse({ metadata, markdownLink });
              break;

            case "showNotification":
              this.showNotification(request.message);
              sendResponse({ success: true });
              break;

            case "copyToClipboard":
              await this.copyToClipboard(request.text);
              sendResponse({ success: true });
              break;
          }
        } catch (error) {
          this.logError("message handler", error);
          sendResponse({ error: error.message });
        }
        return true;
      },
    );
  }
}

  // Only create instance if not already created
  if (!window.markLinkInstance) {
    window.markLinkInstance = new MarkLinkContent();
  }
}
