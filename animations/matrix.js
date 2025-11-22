// animations/matrix.js - マトリックス風アニメーション

class MatrixEffect {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.columns = [];
    this.animationId = null;
    this.fontSize = 16;
  }

  init() {
    this.createCanvas();
    this.setupColumns();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none;';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // ウィンドウリサイズに対応
    this.resizeHandler = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.setupColumns();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  setupColumns() {
    this.columns = [];
    const columnCount = Math.floor(this.canvas.width / this.fontSize);

    for (let i = 0; i < columnCount; i++) {
      this.columns.push({
        x: i * this.fontSize,
        y: Math.random() * this.canvas.height * -1, // 画面上部から開始
        speed: Math.random() * 3 + 2, // 2-5の速度
        chars: [] // 各カラムの文字列を保持
      });
    }
  }

  animate() {
    // 半透明の黒で前フレームを覆う（軌跡効果）
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;

    this.columns.forEach(column => {
      // ランダムな文字を生成（カタカナ、数字、記号）
      let char;
      const rand = Math.random();
      if (rand > 0.5) {
        // カタカナ (0x30A0 - 0x30FF)
        char = String.fromCharCode(0x30A0 + Math.random() * 96);
      } else if (rand > 0.3) {
        // 数字
        char = String.fromCharCode(48 + Math.random() * 10);
      } else {
        // 記号
        const symbols = ['0', '1', '+', '-', '*', '/', '=', '<', '>', '|'];
        char = symbols[Math.floor(Math.random() * symbols.length)];
      }

      // 先頭の文字は明るい緑
      this.ctx.fillStyle = '#0F0';
      this.ctx.fillText(char, column.x, column.y);

      // 軌跡の文字は暗い緑
      if (column.chars.length > 0) {
        column.chars.forEach((c, index) => {
          const alpha = 1 - (index / 20); // 徐々に薄くなる
          this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
          this.ctx.fillText(c.char, column.x, c.y);
        });
      }

      // 文字列を記録
      column.chars.unshift({ char, y: column.y });
      if (column.chars.length > 20) {
        column.chars.pop(); // 古い文字を削除
      }

      // 位置を更新
      column.y += column.speed;

      // 画面下まで到達したらリセット
      if (column.y > this.canvas.height) {
        column.y = Math.random() * -100;
        column.chars = [];
        column.speed = Math.random() * 3 + 2;
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.remove();
    }
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.MatrixEffect = MatrixEffect;
}
