import { Plugin } from 'obsidian';
import { WhiteNoiseSettings, DEFAULT_SETTINGS, IWhiteNoisePlugin } from './types';
import { NoiseGenerator } from './lib/noise-generator';
import { ReactRenderer } from "./lib/react-renderer";
import { StatusBar } from "./components/StatusBar";
import { createElement } from 'react';

export default class WhiteNoisePlugin extends Plugin implements IWhiteNoisePlugin {
  settings: WhiteNoiseSettings = DEFAULT_SETTINGS;
  statusBarItem: HTMLElement | null = null;

  // 噪音生成器
  noiseGenerator: NoiseGenerator | null = null;
  isSynthetic: boolean = false; // 标记当前播放是否为合成声音

  async onload() {
    await this.loadSettings();

    // 注册命令
    this.registerCommands();

    // 创建状态栏项目
    this.createStatusBar();
  }

  onunload() {
    // 移除状态栏
    if (this.statusBarItem) {
      ReactRenderer.unmount('white-noise-status-bar');
      this.statusBarItem.remove();
    }

    // 卸载所有 React 组件
    ReactRenderer.unmountAll();
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
        // 传递默认设置
        defaultSettings: this.settings,
        // 保存设置的方法
        onSaveSettings: (settings: WhiteNoiseSettings) => {
          this.settings = settings;
          this.saveSettings();
        }
      }),
      this.statusBarItem
    );
  }

  // 注册命令
  registerCommands() {
    // 播放命令
    this.addCommand({
      id: 'play',
      name: '播放白噪音',
      callback: () => {
        const event = new CustomEvent('white-noise-play');
        document.dispatchEvent(event);
      }
    });

    // 停止命令
    this.addCommand({
      id: 'stop',
      name: '停止白噪音',
      callback: () => {
        const event = new CustomEvent('white-noise-stop');
        document.dispatchEvent(event);
      }
    });

    // 随机播放命令
    this.addCommand({
      id: 'play-random',
      name: '随机播放白噪音',
      callback: () => {
        const event = new CustomEvent('white-noise-play-random');
        document.dispatchEvent(event);
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