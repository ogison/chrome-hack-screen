// animations/terminal.js - ターミナル風アニメーション

class TerminalEffect {
  constructor(container) {
    this.container = container;
    this.terminal = null;
    this.messages = [
      'INITIALIZING HACK SEQUENCE...',
      'SCANNING NETWORK... [OK]',
      'BYPASSING FIREWALL...',
      'FIREWALL DISABLED [OK]',
      'ACCESSING DATABASE...',
      'DECRYPTING DATA... █████████░ 47%',
      'DECRYPTING DATA... ██████████ 89%',
      'DECRYPTION COMPLETE [OK]',
      'ACCESS GRANTED',
      'DOWNLOADING FILES...',
      'FILE_001.dat [2.4 MB] ... COMPLETE',
      'FILE_002.dat [5.1 MB] ... COMPLETE',
      'FILE_003.dat [1.8 MB] ... COMPLETE',
      'COVERING TRACKS...',
      'CLEARING LOGS... [OK]',
      'DISCONNECTING...',
      '> HACK COMPLETE'
    ];
    this.currentIndex = 0;
    this.isRunning = false;
  }

  init() {
    this.createTerminal();
    this.isRunning = true;
    this.typeMessages();
  }

  createTerminal() {
    this.terminal = document.createElement('div');
    this.terminal.className = 'hack-terminal';
    this.terminal.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 800px;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #0F0;
      padding: 20px;
      color: #0F0;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      overflow-y: auto;
      max-height: 80vh;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.5),
                  inset 0 0 20px rgba(0, 255, 0, 0.1);
      z-index: 1000;
    `;

    // ターミナルヘッダー
    const header = document.createElement('div');
    header.style.cssText = `
      border-bottom: 1px solid #0F0;
      margin-bottom: 10px;
      padding-bottom: 10px;
      font-weight: bold;
    `;
    header.textContent = '=== UNAUTHORIZED ACCESS DETECTED ===';
    this.terminal.appendChild(header);

    this.container.appendChild(this.terminal);
  }

  async typeMessages() {
    for (let i = 0; i < this.messages.length && this.isRunning; i++) {
      const message = this.messages[i];
      await this.typeMessage(message);
      await this.delay(300 + Math.random() * 500); // 300-800ms の遅延
    }
  }

  async typeMessage(message) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.style.cssText = `
      margin: 5px 0;
      white-space: pre-wrap;
    `;
    line.textContent = '> ';
    this.terminal.appendChild(line);

    // カーソル要素
    const cursor = document.createElement('span');
    cursor.textContent = '█';
    cursor.style.cssText = 'animation: blink 1s step-start infinite;';
    line.appendChild(cursor);

    // 1文字ずつタイピング
    for (let i = 0; i < message.length && this.isRunning; i++) {
      const char = message[i];
      line.insertBefore(document.createTextNode(char), cursor);

      // タイピング速度をランダムに
      const delay = 20 + Math.random() * 40; // 20-60ms
      await this.delay(delay);

      // 自動スクロール
      this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    // カーソルを削除
    cursor.remove();

    // 特定のメッセージの後にプログレスバーやエフェクトを追加
    if (message.includes('BYPASSING')) {
      await this.showProgress();
    } else if (message.includes('ACCESS GRANTED')) {
      line.style.color = '#0F0';
      line.style.fontWeight = 'bold';
      line.style.textShadow = '0 0 10px #0F0';
    } else if (message.includes('HACK COMPLETE')) {
      line.style.color = '#0F0';
      line.style.fontSize = '18px';
      line.style.fontWeight = 'bold';
      line.style.textShadow = '0 0 15px #0F0';
    }
  }

  async showProgress() {
    const progressLine = document.createElement('div');
    progressLine.className = 'terminal-line';
    progressLine.style.cssText = `
      margin: 5px 0;
      white-space: pre-wrap;
    `;
    this.terminal.appendChild(progressLine);

    for (let i = 0; i <= 100 && this.isRunning; i += 5) {
      const bars = Math.floor(i / 5);
      const empty = 20 - bars;
      const progress = '█'.repeat(bars) + '░'.repeat(empty);
      progressLine.textContent = `> [${progress}] ${i}%`;
      await this.delay(50);
      this.terminal.scrollTop = this.terminal.scrollHeight;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  destroy() {
    this.isRunning = false;
    if (this.terminal && this.terminal.parentNode) {
      this.terminal.remove();
    }
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.TerminalEffect = TerminalEffect;
}
