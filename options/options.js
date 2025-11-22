// options/options.js - オプション画面のロジック

document.addEventListener('DOMContentLoaded', async () => {
  // DOM要素の取得
  const durationInput = document.getElementById('duration');
  const durationValue = document.getElementById('duration-value');
  const styleSelect = document.getElementById('style');
  const colorSchemeSelect = document.getElementById('colorScheme');
  const soundEnabledCheckbox = document.getElementById('soundEnabled');
  const saveButton = document.getElementById('save');
  const resetButton = document.getElementById('reset');
  const statusDiv = document.getElementById('status');

  // 設定を読み込み
  await loadSettings();

  // イベントリスナーの設定
  durationInput.addEventListener('input', () => {
    durationValue.textContent = durationInput.value;
  });

  saveButton.addEventListener('click', saveSettings);
  resetButton.addEventListener('click', resetSettings);

  // 設定を読み込む関数
  async function loadSettings() {
    try {
      const settings = await SettingsManager.getSettings();

      durationInput.value = settings.duration;
      durationValue.textContent = settings.duration;
      styleSelect.value = settings.style;
      colorSchemeSelect.value = settings.colorScheme;
      soundEnabledCheckbox.checked = settings.soundEnabled;
    } catch (error) {
      console.error('Failed to load settings:', error);
      showStatus('設定の読み込みに失敗しました', 'error');
    }
  }

  // 設定を保存する関数
  async function saveSettings() {
    try {
      const settings = {
        duration: parseInt(durationInput.value, 10),
        style: styleSelect.value,
        colorScheme: colorSchemeSelect.value,
        soundEnabled: soundEnabledCheckbox.checked
      };

      const success = await SettingsManager.saveSettings(settings);

      if (success) {
        showStatus('設定を保存しました', 'success');
      } else {
        showStatus('設定の保存に失敗しました', 'error');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showStatus('設定の保存に失敗しました', 'error');
    }
  }

  // 設定をリセットする関数
  async function resetSettings() {
    if (!confirm('設定をデフォルトに戻しますか？')) {
      return;
    }

    try {
      const success = await SettingsManager.resetSettings();

      if (success) {
        await loadSettings();
        showStatus('設定をデフォルトに戻しました', 'success');
      } else {
        showStatus('設定のリセットに失敗しました', 'error');
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showStatus('設定のリセットに失敗しました', 'error');
    }
  }

  // ステータスメッセージを表示する関数
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status show ${type}`;

    setTimeout(() => {
      statusDiv.className = 'status';
    }, 3000);
  }
});
