document.addEventListener('DOMContentLoaded', () => {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  const formatOptions = document.querySelectorAll('input[name="youtubeFormat"]');
  const clickBehaviorOptions = document.querySelectorAll('input[name="clickBehavior"]');

  // Load saved preferences
  browserAPI.storage.sync.get(['youtubeFormat', 'clickBehavior'], (result) => {
    // Set YouTube format preference
    if (result.youtubeFormat) {
      formatOptions.forEach(option => {
        if (option.value === result.youtubeFormat) {
          option.checked = true;
        }
      });
    }

    // Set click behavior preference
    if (result.clickBehavior) {
      clickBehaviorOptions.forEach(option => {
        if (option.value === result.clickBehavior) {
          option.checked = true;
        }
      });
    } else {
      // Default to immediate action if not set
      document.getElementById('immediateAction').checked = true;
    }
  });

  // Save YouTube format preference when changed
  formatOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      if (e.target.checked) {
        browserAPI.storage.sync.set({ youtubeFormat: e.target.value });
      }
    });
  });

  // Save click behavior preference when changed
  clickBehaviorOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      if (e.target.checked) {
        browserAPI.storage.sync.set({ clickBehavior: e.target.value });
      }
    });
  });
}); 