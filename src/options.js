document.addEventListener('DOMContentLoaded', () => {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  const formatOptions = document.querySelectorAll('input[name="youtubeFormat"]');

  // Load saved format preference
  browserAPI.storage.sync.get(['youtubeFormat'], (result) => {
    if (result.youtubeFormat) {
      const savedFormat = result.youtubeFormat;
      formatOptions.forEach(option => {
        if (option.value === savedFormat) {
          option.checked = true;
        }
      });
    }
  });

  // Save format preference when changed
  formatOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      if (e.target.checked) {
        browserAPI.storage.sync.set({ youtubeFormat: e.target.value });
      }
    });
  });
}); 