// background.js - バックグラウンドスクリプト
// 拡張機能アイコンのクリックイベントを処理

chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 保護されたページかチェック
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      console.warn('Protected page - cannot inject scripts');
      return;
    }

    // CSSを注入
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['animations/styles.css']
    });

    // アニメーションスクリプトを順番に注入
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['utils/storage.js']
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['animations/matrix.js']
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['animations/glitch.js']
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['animations/terminal.js']
    });

    // メインのcontent.jsを注入（統合コントローラー）
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

  } catch (error) {
    console.error('Failed to inject scripts:', error);
  }
});
