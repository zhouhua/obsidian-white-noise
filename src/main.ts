import { Plugin } from 'obsidian';
import { WhiteNoiseSettings, DEFAULT_SETTINGS, IWhiteNoisePlugin } from './types';
import { ReactRenderer } from "./lib/react-renderer";
import { StatusBar } from "./components/StatusBar";
import { createElement } from 'react';
import L from './L';

export default class WhiteNoisePlugin extends Plugin implements IWhiteNoisePlugin {
  settings: WhiteNoiseSettings = DEFAULT_SETTINGS;
  statusBarItem: HTMLElement | null = null;

  async onload() {
    await this.loadSettings();
    this.registerCommands();
    this.createStatusBar();
  }

  onunload() {
    ReactRenderer.unmountAll();
  }

  createStatusBar() {
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClasses(['white-noise-status-bar', 'mod-clickable']);

    this.updateStatusBar();
  }
  
  updateStatusBar() {
    if (!this.statusBarItem) return;
    ReactRenderer.render(
      'white-noise-status-bar',
      createElement(StatusBar, {
        defaultSettings: this.settings,
        onSaveSettings: (settings: WhiteNoiseSettings) => {
          this.settings = settings;
          this.saveSettings();
        }
      }),
      this.statusBarItem
    );
  }

  registerCommands() {
    this.addCommand({
      id: 'play',
      name: L.play(),
      callback: () => {
        const event = new CustomEvent('white-noise-play');
        document.dispatchEvent(event);
      }
    });

    this.addCommand({
      id: 'stop',
      name: L.stop(),
      callback: () => {
        const event = new CustomEvent('white-noise-stop');
        document.dispatchEvent(event);
      }
    });

    this.addCommand({
      id: 'play-random',
      name: L.playRandom(),
      callback: () => {
        const event = new CustomEvent('white-noise-play-random');
        document.dispatchEvent(event);
      }
    });

    this.addCommand({
      id: 'config',
      name: L.openConfig(),
      callback: () => {
        const event = new CustomEvent('white-noise-config');
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