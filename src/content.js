// Modular extraction for different sites
function extractYouTubeMetadata() {
  let creator = '';
  const channelElement = document.querySelector('a.yt-simple-endpoint.style-scope.ytd-channel-name') ||
    document.querySelector('ytd-video-owner-renderer #channel-name a') ||
    document.querySelector('#owner-name a') ||
    document.querySelector('ytd-channel-name yt-formatted-string a') ||
    document.querySelector('span.ytd-channel-name a');
  if (channelElement) {
    creator = channelElement.textContent.trim();
  }
  return {
    title: document.title.replace(' - YouTube', ''),
    url: window.location.href,
    creator
  };
}

function extractMediumMetadata() {
  let title = document.title;
  let creator = '';
  const mediumTitle = document.querySelector('h1');
  if (mediumTitle) title = mediumTitle.textContent.trim();
  const metaAuthor = document.querySelector('meta[name="author"]');
  if (metaAuthor) {
    creator = metaAuthor.getAttribute('content');
  } else {
    const byline = document.querySelector('header div[role="presentation"] a, header a.ds-link, header span a');
    if (byline) creator = byline.textContent.trim();
  }
  return {
    title,
    url: window.location.href,
    creator
  };
}

function extractGenericMetadata() {
  let creator = '';
  const metaAuthor = document.querySelector('meta[name="author"]') ||
    document.querySelector('meta[property="article:author"]') ||
    document.querySelector('meta[name="twitter:creator"]');
  if (metaAuthor) creator = metaAuthor.getAttribute('content');
  return {
    title: document.title,
    url: window.location.href,
    creator
  };
}

// Main extraction dispatcher
function extractMetadata() {
  const url = window.location.href;
  if (url.includes('youtube.com/watch')) {
    return extractYouTubeMetadata();
  } else if (url.includes('medium.com/')) {
    return extractMediumMetadata();
  } else {
    return extractGenericMetadata();
  }
}

// Format metadata into Obsidian-compatible Markdown link
function formatMarkdownLink(metadata) {
  let formattedTitle = metadata.title;
  if (metadata.creator && metadata.creator.trim() !== '' && !formattedTitle.includes(metadata.creator)) {
    formattedTitle = `${formattedTitle} - ${metadata.creator}`;
  }
  return `[${formattedTitle}](${metadata.url})`;
}

// Show a notification to the user (dark mode aware)
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '9999';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.transition = 'opacity 0.3s';
  // Dark mode support
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    notification.style.backgroundColor = '#23272a';
    notification.style.color = '#f1f1f1';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.7)';
  } else {
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
  }
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Copy text to clipboard
function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('Markdown link copied to clipboard!');
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
      showNotification('Failed to copy to clipboard: ' + err);
    });
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getMetadata') {
    const metadata = extractMetadata();
    const markdownLink = formatMarkdownLink(metadata);
    sendResponse({ metadata: metadata, markdownLink: markdownLink });
  } else if (request.action === 'showNotification') {
    showNotification(request.message);
    sendResponse({ success: true });
  } else if (request.action === 'copyToClipboard') {
    copyTextToClipboard(request.text);
    sendResponse({ success: true });
  }
  return false;
}); 