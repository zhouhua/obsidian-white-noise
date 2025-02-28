/**
 * 噪音生成器
 * 用于生成各种类型的噪音（白噪音、粉噪音、棕噪音等）
 */

export type NoiseType = 'white' | 'pink' | 'brown' | 'green';

export class NoiseGenerator {
  private audioContext: AudioContext;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private noiseType: NoiseType = 'white';

  constructor() {
    this.audioContext = new AudioContext();
  }

  setNoiseType(type: NoiseType): void {
    this.noiseType = type;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  play(): void {
    if (this.isPlaying) return;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5; // 默认音量
    this.gainNode.connect(this.audioContext.destination);

    switch (this.noiseType) {
      case 'white':
        this.noiseNode = this.createWhiteNoise();
        break;
      case 'pink':
        this.noiseNode = this.createPinkNoise();
        break;
      case 'brown':
        this.noiseNode = this.createBrownNoise();
        break;
      case 'green':
        this.noiseNode = this.createGreenNoise();
        break;
      default:
        this.noiseNode = this.createWhiteNoise();
    }

    if (this.noiseNode) {
      this.noiseNode.connect(this.gainNode);
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (!this.isPlaying) return;

    if (this.noiseNode) {
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    this.isPlaying = false;
  }

  private createWhiteNoise(): AudioNode {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(
      1, // 单声道
      bufferSize,
      this.audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);

    const highShelf = this.audioContext.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 4000;
    highShelf.gain.value = 6;  // 增强高频

    const lowShelf = this.audioContext.createBiquadFilter();
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.value = 300;
    lowShelf.gain.value = -3;  // 轻微降低低频

    whiteNoise.connect(highShelf);
    highShelf.connect(lowShelf);

    return lowShelf;
  }

  private createPinkNoise(): AudioNode {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(
      1, // 单声道
      bufferSize,
      this.audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.start(0);

    const filterCount = 6;
    let filters: BiquadFilterNode[] = [];

    for (let i = 0; i < filterCount; i++) {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowshelf';
      filter.frequency.value = 100 * Math.pow(2, i);
      filter.gain.value = -3.0; // 保持经典的粉噪音特性
      filters.push(filter);
    }

    const lowBoost = this.audioContext.createBiquadFilter();
    lowBoost.type = 'lowshelf';
    lowBoost.frequency.value = 160;
    lowBoost.gain.value = 3; // 适度增强低频

    const midBoost = this.audioContext.createBiquadFilter();
    midBoost.type = 'peaking';
    midBoost.frequency.value = 1200;
    midBoost.Q.value = 1.0;
    midBoost.gain.value = 1.5;

    noise.connect(filters[0]);
    for (let i = 0; i < filterCount - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }

    filters[filterCount - 1].connect(lowBoost);
    lowBoost.connect(midBoost);

    return midBoost;
  }

  private createBrownNoise(): AudioNode {
    const bufferSize = 4096;
    const brownNoise = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    let lastOut = 0.0;
    brownNoise.onaudioprocess = function (e) {
      const output = e.outputBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;

        lastOut = (lastOut + (0.02 * white)) / 1.02;

        output[i] = lastOut * 3.5;
      }
    };

    return brownNoise;
  }

  private createGreenNoise(): AudioNode {
    const whiteNoise = this.createWhiteNoise();

    const bandpassFilter = this.audioContext.createBiquadFilter();
    bandpassFilter.type = 'bandpass';
    bandpassFilter.frequency.value = 1000; // 中心频率 1kHz
    bandpassFilter.Q.value = 0.5; // 较宽的 Q 值使频带更宽

    const preGain = this.audioContext.createGain();
    preGain.gain.value = 1.5;

    whiteNoise.connect(preGain);
    preGain.connect(bandpassFilter);

    const lowShelf = this.audioContext.createBiquadFilter();
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.value = 300;
    lowShelf.gain.value = -3;

    const highShelf = this.audioContext.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 2500;
    highShelf.gain.value = -3;

    bandpassFilter.connect(lowShelf);
    lowShelf.connect(highShelf);

    return highShelf;
  }

  dispose(): void {
    this.stop();
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
} 