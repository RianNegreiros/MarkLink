document.addEventListener('DOMContentLoaded', function () {
  const copyButton = document.getElementById('copyButton');
  const statusDiv = document.getElementById('status');
  const previewDiv = document.getElementById('preview');

  // Get current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    // Don't attempt to interact with chrome:// or edge:// URLs
    if (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('edge://')) {
      statusDiv.textContent = 'Cannot access this page due to browser restrictions';
      statusDiv.style.display = 'block';
      statusDiv.style.backgroundColor = '#ffebee';
      statusDiv.style.color = '#c62828';
      copyButton.disabled = true;
      return;
    }

    // Set up the copy button click handler
    copyButton.addEventListener('click', function () {
      // Send message to content script to get metadata
      chrome.tabs.sendMessage(activeTab.id, { action: "getMetadata" }, function (response) {
        if (chrome.runtime.lastError) {
          // Handle error - likely content script not loaded
          statusDiv.textContent = 'Error: Could not communicate with page. Try refreshing.';
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#ffebee';
          statusDiv.style.color = '#c62828';
          console.error('Error:', chrome.runtime.lastError);
          return;
        }

        if (response && response.markdownLink) {
          // Use the Clipboard API to copy the formatted Markdown link
          navigator.clipboard.writeText(response.markdownLink)
            .then(() => {
              // Show success message
              statusDiv.textContent = 'Markdown link copied to clipboard!';
              statusDiv.className = 'success';
              statusDiv.style.display = 'block';

              // Show preview of the copied link
              previewDiv.textContent = response.markdownLink;
              previewDiv.style.display = 'block';

              // Log metadata for debugging
              console.log('Metadata:', response.metadata);
            })
            .catch(err => {
              // Show error if copying failed
              statusDiv.textContent = 'Failed to copy: ' + err;
              statusDiv.style.display = 'block';
              statusDiv.style.backgroundColor = '#ffebee';
              statusDiv.style.color = '#c62828';
              console.error('Clipboard error:', err);
            });
        } else {
          // Show error if no response or markdown link
          statusDiv.textContent = 'Could not generate Markdown link.';
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#ffebee';
          statusDiv.style.color = '#c62828';
          console.error('Invalid response:', response);
        }
      });
    });

    // Auto-trigger the copy when popup opens (optional - uncomment if desired)
    // copyButton.click();
  });
}); 