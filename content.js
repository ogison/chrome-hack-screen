// content.js - アニメーションコントローラー
// すべてのアニメーション効果を統合し、管理する

class HackingAnimation {
  constructor() {
    this.container = null;
    this.effects = [];
    this.settings = null;
    this.isRunning = false;
  }

  async init() {
    // 設定を読み込み
    this.settings = await SettingsManager.getSettings();

    // オーバーレイコンテナの作成
    this.createContainer();

    // アニメーション開始
    this.startEffects();

    // イベントリスナーの設定
    this.setupEventListeners();

    // 自動停止タイマー
    this.autoStop();

    this.isRunning = true;
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'hack-animation-overlay';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 2147483647;
      pointer-events: auto;
      background: rgba(0, 0, 0, 0.9);
      font-family: 'Courier New', monospace;
    `;
    document.body.appendChild(this.container);
  }

  startEffects() {
    const { style } = this.settings;

    // マトリックスエフェクト
    if (style === 'matrix' || style === 'mix') {
      const matrix = new MatrixEffect(this.container);
      matrix.init();
      this.effects.push(matrix);
    }

    // ターミナルエフェクト
    if (style === 'terminal' || style === 'mix') {
      const terminal = new TerminalEffect(this.container);
      terminal.init();
      this.effects.push(terminal);
    }

    // グリッチエフェクト
    if (style === 'glitch' || style === 'mix') {
      const glitch = new GlitchEffect(this.container);
      glitch.init();
      this.effects.push(glitch);
    }
  }

  setupEventListeners() {
    // ESCキーで終了
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.stop();
      }
    };
    document.addEventListener('keydown', escapeHandler);
    this.escapeHandler = escapeHandler;

    // クリックで終了
    const clickHandler = () => {
      this.stop();
    };
    this.container.addEventListener('click', clickHandler);
    this.clickHandler = clickHandler;

    // スペースキーで一時停止/再開（オプション機能）
    const spaceHandler = (e) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        this.togglePause();
      }
    };
    document.addEventListener('keydown', spaceHandler);
    this.spaceHandler = spaceHandler;
  }

  togglePause() {
    // 一時停止/再開機能（将来の実装用）
    console.log('Pause/Resume feature - to be implemented');
  }

  autoStop() {
    const duration = this.settings.duration * 1000;
    this.autoStopTimer = setTimeout(() => {
      this.stop();
    }, duration);
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;

    // タイマーのクリア
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
    }

    // すべてのエフェクトを破棄
    this.effects.forEach(effect => {
      if (effect && typeof effect.destroy === 'function') {
        effect.destroy();
      }
    });
    this.effects = [];

    // イベントリスナーの削除
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
    }
    if (this.spaceHandler) {
      document.removeEventListener('keydown', this.spaceHandler);
    }

    // コンテナの削除
    if (this.container && this.container.parentNode) {
      this.container.remove();
    }

    // グローバルインスタンスの削除
    delete window.hackingAnimationInstance;
  }
}

// 既に実行中でなければ開始
if (!window.hackingAnimationInstance) {
  window.hackingAnimationInstance = new HackingAnimation();
  window.hackingAnimationInstance.init();
} else {
  console.log('Hacking animation is already running');
}
