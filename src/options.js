document.addEventListener('DOMContentLoaded', () => {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  const formatOptions = document.querySelectorAll('input[name="youtubeFormat"]');
  const clickBehaviorOptions = document.querySelectorAll('input[name="clickBehavior"]');

  browserAPI.storage.sync.get(['youtubeFormat', 'clickBehavior'], (result) => {
    if (result.youtubeFormat) {
      formatOptions.forEach(option => {
        if (option.value === result.youtubeFormat) {
          option.checked = true;
        }
      });
    }

    if (result.clickBehavior) {
      clickBehaviorOptions.forEach(option => {
        if (option.value === result.clickBehavior) {
          option.checked = true;
        }
      });
    } else {
      document.getElementById('immediateAction').checked = true;
    }
  });

  formatOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      if (e.target.checked) {
        browserAPI.storage.sync.set({ youtubeFormat: e.target.value });
      }
    });
  });

  clickBehaviorOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      if (e.target.checked) {
        browserAPI.storage.sync.set({ clickBehavior: e.target.value });
      }
    });
  });
});