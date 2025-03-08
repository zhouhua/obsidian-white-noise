/**
 * 噪音生成器
 * 用于生成各种类型的噪音（白噪音、粉噪音、棕噪音等）
 */

// 定义噪音类型
export type NoiseType = 'white' | 'pink' | 'brown' | 'green' | 'grey';

// 噪音生成器类
export class NoiseGenerator {
  private audioContext: AudioContext;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private noiseType: NoiseType = 'white';

  constructor() {
    // 创建音频上下文
    this.audioContext = new AudioContext();
  }

  // 更改噪音类型
  setNoiseType(type: NoiseType): void {
    this.noiseType = type;
    // 如果正在播放，重新创建噪音节点
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  // 设置音量 (0.0 - 1.0)
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  // 开始播放噪音
  play(): void {
    if (this.isPlaying) return;

    // 创建增益节点（用于控制音量）
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.5; // 默认音量
    this.gainNode.connect(this.audioContext.destination);

    // 根据类型创建噪音节点
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
      case 'grey':
        this.noiseNode = this.createGreyNoise();
        break;
      default:
        this.noiseNode = this.createWhiteNoise();
    }

    // 连接节点并开始播放
    if (this.noiseNode) {
      this.noiseNode.connect(this.gainNode);
      this.isPlaying = true;
    }
  }

  // 停止播放噪音
  stop(): void {
    if (!this.isPlaying) return;

    // 断开所有节点
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

  // 创建白噪音
  private createWhiteNoise(): AudioNode {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(
      1, // 单声道
      bufferSize,
      this.audioContext.sampleRate
    );
    const output = noiseBuffer.getChannelData(0);

    // 填充随机值生成白噪音
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);

    return whiteNoise;
  }

  // 创建粉噪音 (使用滤波器近似实现)
  private createPinkNoise(): AudioNode {
    // 首先创建白噪音
    const whiteNoise = this.createWhiteNoise();

    // 创建滤波器链
    // 粉噪音的特点是随着频率的增加能量下降 3dB/倍频程
    const filterCount = 5;
    let filters: BiquadFilterNode[] = [];

    for (let i = 0; i < filterCount; i++) {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowshelf';
      filter.frequency.value = 100 * Math.pow(2, i);
      filter.gain.value = -3.0; // 每倍频程衰减 3dB
      filters.push(filter);
    }

    // 连接滤波器链
    whiteNoise.connect(filters[0]);
    for (let i = 0; i < filterCount - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }

    // 返回链的最后一个节点
    return filters[filterCount - 1];
  }

  // 创建棕噪音 (使用积分器近似实现)
  private createBrownNoise(): AudioNode {
    const bufferSize = 4096;
    const brownNoise = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    let lastOut = 0.0;
    // 当 scriptProcessor 需要更多数据时，此函数会被调用
    brownNoise.onaudioprocess = function (e) {
      const output = e.outputBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // 生成白噪音
        const white = Math.random() * 2 - 1;

        // 积分白噪音得到棕噪音 (简单的低通滤波)
        // 棕噪音的特点是随着频率的增加能量下降 6dB/倍频程
        lastOut = (lastOut + (0.02 * white)) / 1.02;

        // 规范化输出，防止爆音
        output[i] = lastOut * 3.5;
      }
    };

    // 将此噪音标记为需要在适当时手动销毁
    // 因为 ScriptProcessorNode 在未来会被弃用，但目前它仍然是一个简单的实现方法
    return brownNoise;
  }

  // 创建绿噪音（中频带加强的噪音）
  private createGreenNoise(): AudioNode {
    // 首先创建白噪音
    const whiteNoise = this.createWhiteNoise();

    // 创建带通滤波器，突出中频段（300Hz-2.5kHz）
    const bandpassFilter = this.audioContext.createBiquadFilter();
    bandpassFilter.type = 'bandpass';
    bandpassFilter.frequency.value = 1000; // 中心频率 1kHz
    bandpassFilter.Q.value = 0.5; // 较宽的 Q 值使频带更宽

    // 创建前置增益节点以补偿滤波器导致的音量损失
    const preGain = this.audioContext.createGain();
    preGain.gain.value = 1.5;

    // 连接节点
    whiteNoise.connect(preGain);
    preGain.connect(bandpassFilter);

    // 添加一些形状，使声音更自然
    const lowShelf = this.audioContext.createBiquadFilter();
    lowShelf.type = 'lowshelf';
    lowShelf.frequency.value = 300;
    lowShelf.gain.value = -3;

    const highShelf = this.audioContext.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 2500;
    highShelf.gain.value = -3;

    // 连接形状滤波器
    bandpassFilter.connect(lowShelf);
    lowShelf.connect(highShelf);

    return highShelf;
  }

  // 创建灰噪音（心理声学调整，对人耳听起来所有频率等响度）
  private createGreyNoise(): AudioNode {
    // 创建白噪音作为基础
    const whiteNoise = this.createWhiteNoise();

    // 创建多级滤波器来模拟人耳等响度曲线的逆响应
    // 这是对等响度曲线的简化近似

    // 低频补偿（人耳对低频不敏感）
    const lowBoost = this.audioContext.createBiquadFilter();
    lowBoost.type = 'lowshelf';
    lowBoost.frequency.value = 400;
    lowBoost.gain.value = 10;

    // 中低频轻微衰减
    const midLowCut = this.audioContext.createBiquadFilter();
    midLowCut.type = 'peaking';
    midLowCut.frequency.value = 800;
    midLowCut.Q.value = 1.0;
    midLowCut.gain.value = -2;

    // 中频略微提升（最敏感区域）
    const midBoost = this.audioContext.createBiquadFilter();
    midBoost.type = 'peaking';
    midBoost.frequency.value = 2000;
    midBoost.Q.value = 1.0;
    midBoost.gain.value = 1;

    // 中高频衰减
    const midHighCut = this.audioContext.createBiquadFilter();
    midHighCut.type = 'peaking';
    midHighCut.frequency.value = 4000;
    midHighCut.Q.value = 1.0;
    midHighCut.gain.value = -2;

    // 高频提升（人耳对高频不敏感）
    const highBoost = this.audioContext.createBiquadFilter();
    highBoost.type = 'highshelf';
    highBoost.frequency.value = 8000;
    highBoost.gain.value = 4;

    // 连接滤波器链
    whiteNoise.connect(lowBoost);
    lowBoost.connect(midLowCut);
    midLowCut.connect(midBoost);
    midBoost.connect(midHighCut);
    midHighCut.connect(highBoost);

    return highBoost;
  }

  // 关闭并清理资源
  dispose(): void {
    this.stop();
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
} 