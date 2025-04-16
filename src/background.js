// Simple background script to handle tab information
// Most functionality is now in popup.js and content.js

chrome.runtime.onInstalled.addListener(() => {
  console.log('MarkLink extension installed');
}); 