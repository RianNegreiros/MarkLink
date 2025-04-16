// Function to extract metadata from websites based on URL type
function extractMetadata() {
  const url = window.location.href;
  const title = document.title.replace(' - YouTube', ''); // Remove " - YouTube" from the title
  let creator = "";

  // YouTube-specific extraction
  if (url.includes("youtube.com/watch")) {
    // YouTube channel extraction - try multiple selectors for different YouTube layouts
    const channelElement = document.querySelector('a.yt-simple-endpoint.style-scope.ytd-channel-name') ||
      document.querySelector('ytd-video-owner-renderer #channel-name a') ||
      document.querySelector('#owner-name a') ||
      document.querySelector('ytd-channel-name yt-formatted-string a') ||
      document.querySelector('span.ytd-channel-name a');

    if (channelElement) {
      creator = channelElement.textContent.trim();
    }
  }
  // General website extraction - try to find author metadata
  else {
    // Try common author meta tags
    const metaAuthor = document.querySelector('meta[name="author"]') ||
      document.querySelector('meta[property="article:author"]') ||
      document.querySelector('meta[name="twitter:creator"]');

    if (metaAuthor) {
      creator = metaAuthor.getAttribute('content');
    }
  }

  return {
    title: title,
    url: url,
    creator: creator
  };
}

// Format metadata into Obsidian-compatible Markdown link
function formatMarkdownLink(metadata) {
  let formattedTitle = metadata.title;

  // If creator exists and isn't already in the title, add it to the title
  if (metadata.creator && metadata.creator.trim() !== "" && !formattedTitle.includes(metadata.creator)) {
    formattedTitle = `${formattedTitle} - ${metadata.creator}`;
  }

  return `[${formattedTitle}](${metadata.url})`;
}

// Show a notification to the user
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '9999';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.transition = 'opacity 0.3s';

  // Add to DOM
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getMetadata") {
    const metadata = extractMetadata();
    const markdownLink = formatMarkdownLink(metadata);
    sendResponse({ metadata: metadata, markdownLink: markdownLink });
  } else if (request.action === "showNotification") {
    showNotification(request.message);
  }
  return true; // Keep the message channel open for async response
}); 