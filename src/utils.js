const browserAPI = typeof browser !== "undefined" ? browser : chrome;

const Utils = {
  logError(context, error) {
    const message = error?.message || error || "Unknown error";
    console.error(`${context}: ${message}`);
  },

  async getStorageValue(key, defaultValue = null) {
    try {
      const result = await browserAPI.storage.sync.get([key]);
      return result[key] ?? defaultValue;
    } catch (error) {
      this.logError(`storage.get(${key})`, error);
      return defaultValue;
    }
  },

  async setStorageValue(key, value) {
    try {
      await browserAPI.storage.sync.set({ [key]: value });
    } catch (error) {
      this.logError(`storage.set(${key})`, error);
    }
  },

  isRestrictedUrl(url) {
    return (
      url.startsWith("chrome://") ||
      url.startsWith("edge://") ||
      url.startsWith("about:") ||
      url.startsWith("moz-extension://")
    );
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = Utils;
} else {
  window.Utils = Utils;
}
