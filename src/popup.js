document.addEventListener('DOMContentLoaded', () => {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  const copyButton = document.getElementById('copyButton');
  const statusDiv = document.getElementById('status');
  const previewDiv = document.getElementById('preview');
  const optionsLink = document.getElementById('optionsLink');

  optionsLink?.addEventListener('click', e => {
    e.preventDefault();
    browserAPI.runtime.openOptionsPage();
  });

  browserAPI.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    if (!activeTab ||
      activeTab.url.startsWith('chrome://') ||
      activeTab.url.startsWith('edge://') ||
      activeTab.url.startsWith('about:') ||
      activeTab.url.startsWith('moz-extension://')) {
      statusDiv.textContent = 'Cannot access this page due to browser restrictions';
      statusDiv.style.display = 'block';
      statusDiv.style.backgroundColor = '#ffebee';
      statusDiv.style.color = '#c62828';
      copyButton.disabled = true;
      return;
    }
    copyButton.addEventListener('click', () => {
      browserAPI.tabs.sendMessage(activeTab.id, { action: 'getMetadata' }, response => {
        if (browserAPI.runtime.lastError) {
          statusDiv.textContent = 'Error: Could not communicate with page. Try refreshing.';
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#ffebee';
          statusDiv.style.color = '#c62828';
          return;
        }
        if (response && response.markdownLink) {
          navigator.clipboard.writeText(response.markdownLink)
            .then(() => {
              statusDiv.textContent = 'Markdown link copied to clipboard!';
              statusDiv.className = 'success';
              statusDiv.style.display = 'block';
              previewDiv.textContent = response.markdownLink;
              previewDiv.style.display = 'block';
            })
            .catch(err => {
              statusDiv.textContent = 'Failed to copy: ' + err;
              statusDiv.style.display = 'block';
              statusDiv.style.backgroundColor = '#ffebee';
              statusDiv.style.color = '#c62828';
            });
        } else {
          statusDiv.textContent = 'Could not generate Markdown link.';
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#ffebee';
          statusDiv.style.color = '#c62828';
        }
      });
    });
  });
}); 