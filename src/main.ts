import { Plugin, PluginSettingTab, Setting, Notice, App } from 'obsidian';
import { Sound, SoundCategory, WhiteNoiseSettings, DEFAULT_SETTINGS, IWhiteNoisePlugin } from './types';
import { audioAssets, getAudioById } from './audio-assets';
import { NoiseGenerator, NoiseType } from './noise-generator';
import { ReactRenderer } from "./lib/react-renderer";
import { StatusBar } from "./components/StatusBar";
import { createElement } from 'react';

export default class WhiteNoisePlugin extends Plugin implements IWhiteNoisePlugin {
  clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      this.timerEndTime = null;
      new Notice('已取消定时器');
      this.updateStatusBar();
    }
  }
  settings: WhiteNoiseSettings = DEFAULT_SETTINGS;
  audioElement: HTMLAudioElement | null = null;
  statusBarItem: HTMLElement | null = null;
  currentSound: Sound | null = null;
  categories: SoundCategory[] = [];
  sounds: Sound[] = [];
  isPlaying: boolean = false;
  timer: NodeJS.Timeout | null = null;
  timerEndTime: number | null = null;
  timerPaused: boolean = false;
  timerRemainingMs: number | null = null;

  // 噪音生成器
  noiseGenerator: NoiseGenerator | null = null;
  isSynthetic: boolean = false; // 标记当前播放是否为合成声音

  async onload() {
    await this.loadSettings();

    // 加载所有声音文件
    await this.loadSounds();

    // 注册命令
    this.registerCommands();

    // 添加设置选项卡
    this.addSettingTab(new WhiteNoiseSettingTab(this.app, this));

    // 创建状态栏项目
    if (this.settings.showStatusBar) {
      this.createStatusBar();
    }

    // 自动播放设置
    if (this.settings.autoPlay && this.settings.defaultSound) {
      const defaultSound = this.getSoundById(this.settings.defaultSound);
      if (defaultSound) {
        this.playSound(defaultSound);
      }
    }
  }

  onunload() {
    console.log('卸载白噪音插件');

    // 停止声音播放
    this.stopSound();

    // 清理定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // 移除状态栏
    if (this.statusBarItem) {
      ReactRenderer.unmount('white-noise-status-bar');
      this.statusBarItem.remove();
    }

    // 卸载所有 React 组件
    ReactRenderer.unmountAll();
  }

  // 加载声音文件
  async loadSounds() {
    // 定义所有类别
    this.categories = [
      { id: 'animals', name: '动物声音', icon: '🐾', sounds: [] },
      { id: 'nature', name: '自然环境', icon: '🌿', sounds: [] },
      { id: 'noise', name: '基础噪音', icon: '📻', sounds: [] },
      { id: 'places', name: '场所环境', icon: '🏙️', sounds: [] },
      { id: 'rain', name: '雨声', icon: '🌧️', sounds: [] },
      { id: 'things', name: '物品声音', icon: '🔔', sounds: [] },
      { id: 'transport', name: '交通工具', icon: '🚂', sounds: [] },
      { id: 'urban', name: '城市声音', icon: '🏙️', sounds: [] },
      { id: 'synthetic', name: '合成噪音', icon: '🔊', sounds: [] }, // 新增合成噪音分类
    ];

    // 从音频资源加载声音
    this.sounds = audioAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      src: asset.src,
      category: asset.category
    }));

    // 添加合成噪音
    this.sounds.push({
      id: 'synthetic-white',
      name: '白噪音',
      src: 'synthetic:white',
      category: 'synthetic',
      synthetic: true
    });

    this.sounds.push({
      id: 'synthetic-pink',
      name: '粉噪音',
      src: 'synthetic:pink',
      category: 'synthetic',
      synthetic: true
    });

    this.sounds.push({
      id: 'synthetic-brown',
      name: '棕噪音',
      src: 'synthetic:brown',
      category: 'synthetic',
      synthetic: true
    });

    this.sounds.push({
      id: 'synthetic-green',
      name: '绿噪音',
      src: 'synthetic:green',
      category: 'synthetic',
      synthetic: true
    });

    this.sounds.push({
      id: 'synthetic-grey',
      name: '灰噪音',
      src: 'synthetic:grey',
      category: 'synthetic',
      synthetic: true
    });

    // 将声音归类到对应分类
    this.sounds.forEach(sound => {
      const category = this.categories.find(c => c.id === sound.category);
      if (category) {
        category.sounds.push(sound);
      }
    });
    console.log(this.categories);
  }

  // 根据ID获取声音
  getSoundById(id: string): Sound | null {
    return this.sounds.find(s => s.id === id) || null;
  }

  // 修复数据URL的MIME类型
  fixDataUrlMimeType(dataUrl: string): string {
    // 检查是否是data URL
    if (!dataUrl.startsWith('data:')) return dataUrl;

    // 确定正确的MIME类型
    let mimeType = 'audio/mpeg'; // 默认为MP3

    // 替换MIME类型
    if (dataUrl.startsWith('data:application/octet-stream;')) {
      return dataUrl.replace('data:application/octet-stream;', `data:${mimeType};`);
    }

    return dataUrl;
  }

  // 播放声音
  playSound(sound: Sound) {
    // 停止当前播放的声音
    this.stopSound();

    // 检查是否是合成噪音
    if (sound.category === 'synthetic') {
      this.playSyntheticNoise(sound);
      return;
    }

    // 创建新的音频元素
    this.audioElement = new Audio();

    // 查找音频资源
    const audioAsset = getAudioById(sound.id);
    if (audioAsset) {
      // 修复MIME类型并设置音频源
      this.audioElement.src = this.fixDataUrlMimeType(audioAsset.src);
      console.log(`播放音频: ${sound.name}，源: ${this.audioElement.src.substring(0, 50)}...`);
    } else {
      console.error(`未找到音频资源: ${sound.id}`);
      new Notice(`未找到音频: ${sound.name}`);
      return;
    }

    this.audioElement.volume = this.settings.volume;
    this.audioElement.loop = true;

    // 播放音频
    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.currentSound = sound;
      this.isSynthetic = false;

      // 更新状态栏
      this.updateStatusBar();

      // 显示通知
      new Notice(`正在播放: ${sound.name}`);
    }).catch(error => {
      console.error('无法播放音频:', error);
      new Notice('无法播放音频，请检查控制台了解详情');
    });
  }

  // 播放合成噪音
  playSyntheticNoise(sound: Sound) {
    // 如果噪音生成器不存在，创建一个
    if (!this.noiseGenerator) {
      this.noiseGenerator = new NoiseGenerator();
    }

    // 从src中提取噪音类型 (格式: synthetic:type)
    const noiseType = sound.src.split(':')[1] as NoiseType;

    // 设置噪音类型
    this.noiseGenerator.setNoiseType(noiseType);

    // 设置音量
    this.noiseGenerator.setVolume(this.settings.volume);

    // 播放噪音
    this.noiseGenerator.play();

    // 更新当前播放状态
    this.currentSound = sound;
    this.isPlaying = true;
    this.isSynthetic = true;

    // 更新状态栏
    this.updateStatusBar();
  }

  // 暂停声音
  pauseSound() {
    if (this.isPlaying) {
      if (this.isSynthetic && this.noiseGenerator) {
        this.noiseGenerator.stop();
      } else if (this.audioElement) {
        this.audioElement.pause();
      }

      this.isPlaying = false;
      this.updateStatusBar();
      new Notice('白噪音已暂停');
    }
  }

  // 恢复播放
  resumeSound() {
    if (!this.isPlaying && this.currentSound) {
      if (this.isSynthetic && this.noiseGenerator) {
        this.noiseGenerator.play();
        this.isPlaying = true;
        this.updateStatusBar();
        new Notice(`恢复播放: ${this.currentSound?.name}`);
      } else if (this.audioElement) {
        this.audioElement.play().then(() => {
          this.isPlaying = true;
          this.updateStatusBar();
          new Notice(`恢复播放: ${this.currentSound?.name}`);
        }).catch(error => {
          console.error('无法恢复播放:', error);
          new Notice('无法恢复播放，请检查控制台了解详情');
        });
      }
    }
  }

  // 停止声音（完全停止，不保留当前音频）
  stopSound() {
    // 停止合成噪音
    if (this.noiseGenerator) {
      this.noiseGenerator.stop();
    }

    // 停止音频元素
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }

    this.isPlaying = false;
    this.isSynthetic = false;
    this.updateStatusBar();
  }

  // 设置音量
  setVolume(volume: number) {
    this.settings.volume = volume;

    // 更新正在播放的音频音量
    if (this.audioElement) {
      this.audioElement.volume = volume;
    }

    // 更新噪音生成器音量
    if (this.noiseGenerator) {
      this.noiseGenerator.setVolume(volume);
    }

    this.saveSettings();
  }

  // 设置定时关闭
  setTimer(minutes: number, stopSoundOnEnd: boolean = true, playAlertOnEnd: boolean = true) {
    // 清除现有定时器
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      this.timerEndTime = null;
      this.timerPaused = false;
      this.timerRemainingMs = null;
    }

    // 设置新定时器（如果分钟数 > 0）
    if (minutes > 0) {
      const ms = minutes * 60 * 1000;
      this.timerEndTime = Date.now() + ms;
      this.settings.stopSoundOnTimerEnd = stopSoundOnEnd;
      this.settings.playAlertOnTimerEnd = playAlertOnEnd;

      this.timer = setTimeout(() => {
        // 定时器结束时的提示
        new Notice(`定时器结束!`);

        // 根据设置决定是否停止声音
        if (this.settings.stopSoundOnTimerEnd) {
          this.stopSound();
        }

        // 根据设置决定是否播放提示音
        if (this.settings.playAlertOnTimerEnd) {
          // 这里可以播放提示音的逻辑
          // 暂时使用通知替代
          new Notice(`定时器结束，已${this.settings.stopSoundOnTimerEnd ? '停止' : '继续'}播放白噪音`);
        }

        this.timer = null;
        this.timerEndTime = null;
        this.timerPaused = false;
        this.timerRemainingMs = null;
        this.updateStatusBar();
      }, ms);

      new Notice(`已设置定时器: ${minutes} 分钟后${stopSoundOnEnd ? '停止' : '继续'}播放`);
      this.updateStatusBar();
    }
  }

  // 暂停/恢复定时器
  toggleTimerPause() {
    if (!this.timer) return;

    if (this.timerPaused) {
      // 恢复定时器
      if (this.timerRemainingMs) {
        this.timerEndTime = Date.now() + this.timerRemainingMs;
        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
          // 定时器结束时的提示
          new Notice(`定时器结束!`);

          // 根据设置决定是否停止声音
          if (this.settings.stopSoundOnTimerEnd) {
            this.stopSound();
          }

          // 根据设置决定是否播放提示音
          if (this.settings.playAlertOnTimerEnd) {
            new Notice(`定时器结束，已${this.settings.stopSoundOnTimerEnd ? '停止' : '继续'}播放白噪音`);
          }

          this.timer = null;
          this.timerEndTime = null;
          this.timerPaused = false;
          this.timerRemainingMs = null;
          this.updateStatusBar();
        }, this.timerRemainingMs);

        this.timerPaused = false;
        this.timerRemainingMs = null;
        new Notice('定时器已恢复');
      }
    } else {
      // 暂停定时器
      if (this.timerEndTime) {
        this.timerRemainingMs = this.timerEndTime - Date.now();
        if (this.timerRemainingMs <= 0) {
          // 定时器已结束，无需暂停
          return;
        }

        clearTimeout(this.timer);
        this.timerPaused = true;
        new Notice('定时器已暂停');
      }
    }

    this.updateStatusBar();
  }

  // 创建状态栏
  createStatusBar() {
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClasses(['white-noise-status-bar', 'mod-clickable']);

    // 渲染 React 组件到状态栏
    this.updateStatusBar();

    // 由于 React 组件内部已经处理了点击事件，不需要在这里添加监听器
  }

  // 更新状态栏
  updateStatusBar() {
    if (!this.statusBarItem) return;

    // 使用 React 渲染状态栏
    ReactRenderer.render(
      'white-noise-status-bar',
      createElement(StatusBar, {
        plugin: this,
        soundOptions: this.categories.reduce((acc, category) => {
          acc[category.id] = category.sounds.map(sound => sound.id);
          return acc;
        }, {} as Record<string, string[]>),
        currentSound: this.currentSound?.id || '',
        isPlaying: this.isPlaying,
        volume: this.settings.volume * 100, // 转换为百分比
        timer: this.getTimerRemainingMinutes(),
        isTimerOn: !!this.timer,
        isPaused: this.timerPaused,
        timerEndAction: this.settings.stopSoundOnTimerEnd ? 'stop' : 'continue',
        notifyEndOfTimer: this.settings.playAlertOnTimerEnd,
        onPlayPause: () => {
          if (this.isPlaying) {
            this.pauseSound();
          } else if (this.currentSound) {
            this.resumeSound();
          } else {
            // 如果没有当前音频，选择默认音频或随机一个
            const sound = this.getSoundById(this.settings.defaultSound) || this.sounds[0];
            this.playSound(sound);
          }
        },
        onSoundChange: (soundId: string) => {
          const sound = this.getSoundById(soundId);
          if (sound) this.playSound(sound);
        },
        onRandomSound: () => {
          const randomIndex = Math.floor(Math.random() * this.sounds.length);
          const randomSound = this.sounds[randomIndex];
          this.playSound(randomSound);
        },
        onVolumeChange: (volume: number) => this.setVolume(volume / 100), // 从百分比转回小数
        onTimerChange: (minutes: number) => {
          this.setTimer(minutes,
            this.settings.stopSoundOnTimerEnd,
            this.settings.playAlertOnTimerEnd);
        },
        onTimerToggle: () => {
          if (this.timer) {
            this.clearTimer();
          } else {
            this.setTimer(
              this.settings.defaultTimer || 25,
              this.settings.stopSoundOnTimerEnd,
              this.settings.playAlertOnTimerEnd
            );
          }
        },
        onTimerPause: () => {
          this.toggleTimerPause();
        },
        onTimerReset: () => {
          if (this.timer) {
            // 重置定时器
            const currentTimerDuration = this.settings.defaultTimer || 25;
            this.setTimer(
              currentTimerDuration,
              this.settings.stopSoundOnTimerEnd,
              this.settings.playAlertOnTimerEnd
            );
          }
        },
        onTimerEndActionChange: (action: 'continue' | 'stop') => {
          this.settings.stopSoundOnTimerEnd = action === 'stop';
          this.saveSettings();
          this.updateStatusBar();
        },
        onNotifyToggle: () => {
          this.settings.playAlertOnTimerEnd = !this.settings.playAlertOnTimerEnd;
          this.saveSettings();
          this.updateStatusBar();
        }
      }),
      this.statusBarItem
    );
  }

  // 获取定时器剩余分钟数
  getTimerRemainingMinutes(): number {
    if (!this.timerEndTime) return 0;

    if (this.timerPaused && this.timerRemainingMs) {
      return this.timerRemainingMs / 60000; // 转换为分钟
    }

    const remainingMs = Math.max(0, this.timerEndTime - Date.now());
    return remainingMs / 60000; // 转换为分钟
  }

  // 获取状态文本
  getStatusText(): string {
    if (!this.currentSound) {
      return '未播放';
    }

    let statusText = this.currentSound.name;

    // 如果有定时器，添加剩余时间
    if (this.timerEndTime) {
      const remainingMs = this.timerEndTime - Date.now();
      if (remainingMs > 0) {
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        statusText += ` (${remainingMinutes} 分钟)`;
      }
    }

    return statusText;
  }

  // 注册命令
  registerCommands() {
    // 停止命令
    this.addCommand({
      id: 'stop',
      name: '停止白噪音',
      callback: () => {
        this.stopSound();
      }
    });

    // 随机播放命令
    this.addCommand({
      id: 'play-random',
      name: '随机播放白噪音',
      callback: () => {
        const randomIndex = Math.floor(Math.random() * this.sounds.length);
        const randomSound = this.sounds[randomIndex];
        this.playSound(randomSound);
      }
    });

    // 音量增加命令
    this.addCommand({
      id: 'volume-up',
      name: '增加音量',
      callback: () => {
        const newVolume = Math.min(1, this.settings.volume + 0.1);
        this.setVolume(newVolume);
        new Notice(`音量: ${Math.round(newVolume * 100)}%`);
      }
    });

    // 音量减少命令
    this.addCommand({
      id: 'volume-down',
      name: '减少音量',
      callback: () => {
        const newVolume = Math.max(0, this.settings.volume - 0.1);
        this.setVolume(newVolume);
        new Notice(`音量: ${Math.round(newVolume * 100)}%`);
      }
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

// 设置选项卡
class WhiteNoiseSettingTab extends PluginSettingTab {
  plugin: WhiteNoisePlugin;

  constructor(app: App, plugin: WhiteNoisePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: '白噪音设置' });

    new Setting(containerEl)
      .setName('默认音量')
      .setDesc('设置默认音量级别')
      .addSlider(slider => slider
        .setLimits(0, 1, 0.01)
        .setValue(this.plugin.settings.volume)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.volume = value;
          if (this.plugin.audioElement) {
            this.plugin.audioElement.volume = value;
          }
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('启动时自动播放')
      .setDesc('启动插件时自动播放默认声音')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoPlay)
        .onChange(async (value) => {
          this.plugin.settings.autoPlay = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('显示状态栏')
      .setDesc('在状态栏中显示白噪音控制')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showStatusBar)
        .onChange(async (value) => {
          this.plugin.settings.showStatusBar = value;

          if (value && !this.plugin.statusBarItem) {
            this.plugin.createStatusBar();
          } else if (!value && this.plugin.statusBarItem) {
            this.plugin.statusBarItem.remove();
            this.plugin.statusBarItem = null;
          }

          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('默认声音')
      .setDesc('选择启动时自动播放的默认声音')
      .addDropdown(dropdown => {
        // 添加所有声音选项，按类别分组
        this.plugin.categories.forEach(category => {
          // 添加类别分隔符
          dropdown.addOption(`category:${category.id}`, `-- ${category.name} --`);

          // 添加该类别下的所有声音
          category.sounds.forEach(sound => {
            dropdown.addOption(sound.id, sound.name);
          });
        });

        // 设置当前默认值
        dropdown.setValue(this.plugin.settings.defaultSound);

        // 更改事件
        dropdown.onChange(async (value) => {
          // 忽略分类选项
          if (value.startsWith('category:')) {
            return;
          }

          this.plugin.settings.defaultSound = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName('默认定时器')
      .setDesc('设置默认的定时关闭时间（分钟，0 表示不启用）')
      .addText(text => text
        .setPlaceholder('0')
        .setValue(String(this.plugin.settings.defaultTimer))
        .onChange(async (value) => {
          const minutes = parseInt(value);
          if (!isNaN(minutes) && minutes >= 0) {
            this.plugin.settings.defaultTimer = minutes;
            await this.plugin.saveSettings();
          }
        }));

    containerEl.createEl('h3', { text: '快捷命令' });

    containerEl.createEl('p', {
      text: '此插件提供以下命令，您可以在 Obsidian 的快捷键设置中为它们分配键盘快捷键：',
      cls: 'setting-item-description'
    });

    const commands = [
      { id: 'toggle-play-pause', name: '播放/暂停白噪音' },
      { id: 'stop', name: '停止白噪音' },
      { id: 'play-random', name: '随机播放白噪音' },
      { id: 'volume-up', name: '增加音量' },
      { id: 'volume-down', name: '减少音量' }
    ];

    const commandsListEl = containerEl.createEl('ul');
    commands.forEach(cmd => {
      commandsListEl.createEl('li', { text: cmd.name });
    });
  }
}
