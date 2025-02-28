// 白噪音分类定义
export interface SoundCategory {
  id: string;
  name: string;
  icon: string;
  sounds: Sound[];
}

// 声音定义
export interface Sound {
  id: string;
  name: string;
  src: string;
  category: string;
  synthetic?: boolean; // 添加synthetic可选属性，标识是否为合成声音
}

// 插件设置接口
export interface WhiteNoiseSettings {
  volume: number;
  defaultSound: string;
  autoPlay: boolean;
  defaultTimer: number; // 分钟
  showStatusBar: boolean;
  stopSoundOnTimerEnd: boolean; // 定时器结束时是否停止声音
  playAlertOnTimerEnd: boolean; // 定时器结束时是否播放提示音
}

// 默认设置
export const DEFAULT_SETTINGS: WhiteNoiseSettings = {
  volume: 0.5,
  defaultSound: 'nature/waves',
  autoPlay: false,
  defaultTimer: 0, // 0 表示无定时器
  showStatusBar: true,
  stopSoundOnTimerEnd: true, // 默认定时器结束时停止声音
  playAlertOnTimerEnd: false, // 默认定时器结束时不播放提示音
};

export interface IWhiteNoisePlugin {
  isPlaying: boolean;
  currentSound: Sound | null;
  settings: WhiteNoiseSettings;
  timerEndTime: number | null;
  categories: SoundCategory[];
  audioElement: HTMLAudioElement | null;

  getSoundById(id: string): Sound | null;
  playSound(sound: Sound): void;
  pauseSound(): void;
  resumeSound(): void;
  stopSound(): void;
  setVolume(volume: number): void;
  setTimer(minutes: number, stopSoundOnEnd: boolean, playAlertOnEnd: boolean): void;
  clearTimer(): void;
  updateStatusBar(): void;
}