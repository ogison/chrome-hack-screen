// utils/storage.js - 設定管理

const DEFAULT_SETTINGS = {
  duration: 10, // 秒
  style: 'mix', // matrix, terminal, glitch, mix
  colorScheme: 'green',
  soundEnabled: false
};

class SettingsManager {
  static async getSettings() {
    try {
      // chrome.storage APIが利用可能かチェック
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        const result = await chrome.storage.sync.get('settings');
        return result.settings || DEFAULT_SETTINGS;
      } else {
        // chrome.storage APIが利用できない場合はデフォルト設定を返す
        return DEFAULT_SETTINGS;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.set({ settings });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  static async resetSettings() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      return false;
    }
  }
}

// グローバルに公開（他のスクリプトから利用可能にする）
if (typeof window !== 'undefined') {
  window.SettingsManager = SettingsManager;
}
