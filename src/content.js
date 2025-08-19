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

// Core selectors for YouTube channel names, ordered from most specific to most general
const YOUTUBE_CHANNEL_SELECTORS = [
  'ytd-video-owner-renderer #channel-name a',
  'ytd-channel-name yt-formatted-string a',
  'ytd-playlist-header-renderer #channel-name a',
  '#owner-name a',
  'span.ytd-channel-name a'
];

function findYouTubeChannelName() {
  for (const selector of YOUTUBE_CHANNEL_SELECTORS) {
    const element = document.querySelector(selector);
    if (element) {
      return element.textContent.trim();
    }
  }
  return '';
}

function extractYouTubeMetadata() {
  return {
    title: document.title.replace(' - YouTube', ''),
    url: window.location.href,
    creator: findYouTubeChannelName()
  };
}

function extractMediumMetadata() {
  const title = document.querySelector('h1')?.textContent.trim() || document.title;
  const creator = document.querySelector('meta[name="author"]')?.getAttribute('content') ||
    document.querySelector('header div[role="presentation"] a, header a.ds-link, header span a')?.textContent.trim() || '';

  return { title, url: window.location.href, creator };
}

function extractGenericMetadata() {
  const creator = document.querySelector('meta[name="author"], meta[property="article:author"], meta[name="twitter:creator"]')
    ?.getAttribute('content') || '';

  return {
    title: document.title,
    url: window.location.href,
    creator
  };
}

function extractMetadata() {
  const url = window.location.href;
  if (url.includes('youtube.com/')) {
    return extractYouTubeMetadata();
  }
  if (url.includes('medium.com/')) {
    return extractMediumMetadata();
  }
  return extractGenericMetadata();
}

function formatMarkdownLink(metadata) {
  const formattedTitle = metadata.creator && metadata.creator.trim() && !metadata.title.includes(metadata.creator)
    ? `${metadata.title} - ${metadata.creator}`
    : metadata.title;

  if (window.location.href.includes('youtube.com/')) {
    return browserAPI.storage.sync.get(['youtubeFormat'], (result) => {
      if (browserAPI.runtime.lastError) {
        logError('storage.get(youtubeFormat)', browserAPI.runtime.lastError);
        return `[${formattedTitle}](${metadata.url})`;
      }
      const format = result.youtubeFormat || 'link';
      return format === 'thumbnail'
        ? `![${formattedTitle}](${metadata.url})`
        : `[${formattedTitle}](${metadata.url})`;
    });
  }

  return `[${formattedTitle}](${metadata.url})`;
}

function showNotification(message) {
  const notification = document.createElement('div');
  const isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    zIndex: '9999',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: isDarkMode ? '#23272a' : '#4CAF50',
    color: isDarkMode ? '#f1f1f1' : 'white',
    boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.15)'
  });

  const checkmark = document.createElement('span');
  checkmark.innerHTML = '✓';
  checkmark.style.fontSize = '16px';
  notification.insertBefore(checkmark, notification.firstChild);

  notification.appendChild(document.createTextNode(message));
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showNotification('Markdown link copied to clipboard!'))
      .catch((e) => {
        logError('navigator.clipboard.writeText', e);
        legacyClipboardFallback(text);
      });
  } else {
    legacyClipboardFallback(text);
  }
}

function legacyClipboardFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('Markdown link copied to clipboard!');
    } else {
      showNotification('Failed to copy to clipboard');
    }
  } catch (err) {
    logError('document.execCommand(copy)', err);
    showNotification('Failed to copy to clipboard: ' + errorMessage(err));
  } finally {
    document.body.removeChild(textarea);
  }
}

// Message listener for popup and background script communication
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'getMetadata') {
      const metadata = extractMetadata();
      if (window.location.href.includes('youtube.com/')) {
        browserAPI.storage.sync.get(['youtubeFormat'], (result) => {
          if (browserAPI.runtime.lastError) {
            logError('storage.get(youtubeFormat)', browserAPI.runtime.lastError);
            const markdownLink = `[${metadata.title} - ${metadata.creator}](${metadata.url})`;
            sendResponse({ metadata, markdownLink });
            return;
          }
          const format = result.youtubeFormat || 'link';
          const markdownLink = format === 'thumbnail'
            ? `![${metadata.title} - ${metadata.creator}](${metadata.url})`
            : `[${metadata.title} - ${metadata.creator}](${metadata.url})`;
          sendResponse({ metadata, markdownLink });
        });
      } else {
        const markdownLink = formatMarkdownLink(metadata);
        sendResponse({ metadata, markdownLink });
      }
      return true; // Keep the message channel open for asynchronous responses
    }

    if (request.action === 'showNotification') {
      showNotification(request.message);
      sendResponse({ success: true });
      return true;
    }

    if (request.action === 'copyToClipboard') {
      copyTextToClipboard(request.text);
      sendResponse({ success: true });
      return true;
    }
  } catch (e) {
    logError('runtime.onMessage handler', e);
  }

  return true; // Keep the message channel open for asynchronous responses
}); 