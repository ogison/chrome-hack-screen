// animations/glitch.js - グリッチエフェクト

class GlitchEffect {
  constructor(container) {
    this.container = container;
    this.glitchLayer = null;
    this.scanlineLayer = null;
    this.intervals = [];
  }

  init() {
    this.createGlitchLayer();
    this.createScanlineLayer();
    this.startGlitching();
  }

  createGlitchLayer() {
    this.glitchLayer = document.createElement('div');
    this.glitchLayer.className = 'glitch-layer';
    this.glitchLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    this.container.appendChild(this.glitchLayer);
  }

  createScanlineLayer() {
    this.scanlineLayer = document.createElement('div');
    this.scanlineLayer.className = 'scanline';
    this.scanlineLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
      animation: scanline-move 8s linear infinite;
    `;
    this.container.appendChild(this.scanlineLayer);
  }

  startGlitching() {
    // グリッチエフェクト1: RGB分離
    const glitchInterval1 = setInterval(() => {
      this.applyGlitch('glitch-1');
    }, 2000 + Math.random() * 3000); // 2-5秒ごと

    // グリッチエフェクト2: 点滅
    const glitchInterval2 = setInterval(() => {
      this.applyGlitch('glitch-2');
    }, 1000 + Math.random() * 2000); // 1-3秒ごと

    // グリッチエフェクト3: スキャンライン強調
    const glitchInterval3 = setInterval(() => {
      this.applyGlitch('glitch-3');
    }, 3000 + Math.random() * 4000); // 3-7秒ごと

    // RGB色ずれエフェクト
    const rgbInterval = setInterval(() => {
      this.applyRGBShift();
    }, 1500 + Math.random() * 2500);

    this.intervals.push(glitchInterval1, glitchInterval2, glitchInterval3, rgbInterval);
  }

  applyGlitch(effectClass) {
    this.glitchLayer.className = `glitch-layer ${effectClass}`;

    setTimeout(() => {
      this.glitchLayer.className = 'glitch-layer';
    }, 50 + Math.random() * 100); // 50-150ms
  }

  applyRGBShift() {
    const shift = Math.random() * 5;
    this.glitchLayer.style.textShadow = `
      ${shift}px 0 0 rgba(255, 0, 0, 0.5),
      ${-shift}px 0 0 rgba(0, 255, 0, 0.5),
      0 ${shift}px 0 rgba(0, 0, 255, 0.5)
    `;

    setTimeout(() => {
      this.glitchLayer.style.textShadow = '';
    }, 100);
  }

  destroy() {
    // すべてのインターバルをクリア
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];

    // レイヤーを削除
    if (this.glitchLayer && this.glitchLayer.parentNode) {
      this.glitchLayer.remove();
    }
    if (this.scanlineLayer && this.scanlineLayer.parentNode) {
      this.scanlineLayer.remove();
    }
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.GlitchEffect = GlitchEffect;
}
