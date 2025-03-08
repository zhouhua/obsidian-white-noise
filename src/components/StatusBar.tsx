import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { WhiteNoiseSettings } from 'src/types';
import { categories, getSoundById, playSound, sounds, stopSound } from 'src/lib/sound';
import { sample } from 'lodash-es';
import { formatTime } from 'src/lib/time';
import { Toggle } from "./ui/toggle";
import { Slider } from "./ui/slider";
import { Icon } from "./ui/icon";
import { cn } from 'src/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// 预定义定时器选项
const timerOptions = [
  { value: 5, label: '5分钟' },
  { value: 10, label: '10分钟' },
  { value: 15, label: '15分钟' },
  { value: 20, label: '20分钟' },
  { value: 25, label: '25分钟' },
  { value: 30, label: '30分钟' },
  { value: 45, label: '45分钟' },
  { value: 60, label: '1小时' },
  { value: 90, label: '1.5小时' },
  { value: 120, label: '2小时' },
];

// 简化的props接口，只保留必要的属性和方法
export interface StatusBarProps {
  defaultSettings: WhiteNoiseSettings;
  onSaveSettings: (settings: WhiteNoiseSettings) => void;
}

export const StatusBar = ({ defaultSettings, onSaveSettings }: StatusBarProps) => {
  // 组件内部状态
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(defaultSettings);
  const [volumeIconIndex, setVolumeIconIndex] = useState(0);

  const [listOpen, setListOpen] = useState(false);

  // 定时器相关状态
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(currentSettings.defaultTimer);

  // 定时器引用和时间引用
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerEndTimeRef = useRef<number | null>(null);
  const pausedRemainingMsRef = useRef<number | null>(null);

  const play = useCallback((soundId?: string) => {
    const sound = getSoundById(soundId || currentSettings.defaultSound);
    if (sound) {
      playSound(sound, currentSettings.volume);
    }
  }, [currentSettings.defaultSound, currentSettings.volume]);

  // 处理播放/暂停
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSound();
    } else {
      setIsPlaying(true);
      play();
    }
  };

  // 处理音量变化
  const handleVolumeChange = (newVolume: number) => {
    const newSettings = { ...currentSettings, volume: newVolume / 100 };
    setCurrentSettings(newSettings);
  };

  // 处理定时器
  const startTimer = (minutes: number) => {
    // 清除可能存在的计时器
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // 设置状态
    setTimer(minutes);
    setIsTimerOn(true);
    setIsPaused(false);

    // 计算结束时间
    const ms = minutes * 60 * 1000;
    const endTime = Date.now() + ms;
    timerEndTimeRef.current = endTime;
    pausedRemainingMsRef.current = null;

    // 创建定时检查器
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      // 更新剩余时间
      const remainingMinutes = remaining / 60000;
      setTimer(remainingMinutes);

      // 检查是否结束
      if (remaining <= 0) {
        // 计时结束
        if (currentSettings.stopSoundOnTimerEnd) {
          stopSound();
          setIsPlaying(false);
        }

        // 清除计时器
        clearInterval(timerIntervalRef.current!);
        timerIntervalRef.current = null;
        timerEndTimeRef.current = null;
        // 计时结束后重置定时器状态
        setIsTimerOn(false);
        setIsPaused(false);
      }
    }, 50);
  };

  useEffect(() => {
    // 只有在isTimerOn状态改变且不是暂停状态时，才处理
    if (isTimerOn && !isPaused) {
      // 如果已经有计时器在运行，不要重新启动
      if (timerIntervalRef.current) {
        return;
      }
      // 启动定时器
      startTimer(currentSettings.defaultTimer);
    } else if (!isTimerOn) {
      // 关闭定时器（仅在非暂停状态下）
      if (timerIntervalRef.current && !isPaused) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        timerEndTimeRef.current = null;
        pausedRemainingMsRef.current = null;
      }
    }
  }, [isTimerOn, isPaused, startTimer, currentSettings.defaultTimer]);

  const resetTimer = () => {
    // 清除当前计时器
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // 重置状态
    setIsPaused(false);
    setTimer(currentSettings.defaultTimer);
    pausedRemainingMsRef.current = null;
    timerEndTimeRef.current = null;
  };

  const toggleTimerPause = () => {
    if (!isTimerOn && !isPaused) return;

    if (isPaused) {
      // 恢复计时
      if (pausedRemainingMsRef.current === null || pausedRemainingMsRef.current <= 0) {
        // 如果没有有效的暂停时间，不执行任何操作
        return;
      }

      // 计算新的结束时间
      const nowTime = Date.now();
      const endTime = nowTime + pausedRemainingMsRef.current;
      timerEndTimeRef.current = endTime;

      // 创建新的计时器
      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);

        // 更新剩余时间
        const remainingMinutes = remaining / 60000;
        setTimer(remainingMinutes);

        // 检查是否结束
        if (remaining <= 0) {
          // 计时结束
          if (currentSettings.stopSoundOnTimerEnd) {
            stopSound();
            setIsPlaying(false);
          }

          // 清除计时器
          clearInterval(timerIntervalRef.current!);
          timerIntervalRef.current = null;
          timerEndTimeRef.current = null;
          setIsTimerOn(false);
        }
      }, 50);

      // 更新状态
      setIsTimerOn(true);
      setIsPaused(false);
    } else {
      // 暂停计时
      // 保存剩余时间
      if (timerEndTimeRef.current) {
        pausedRemainingMsRef.current = Math.max(0, timerEndTimeRef.current - Date.now());
      } else {
        // 如果没有结束时间，使用当前设置的时间
        pausedRemainingMsRef.current = timer * 60000;
      }

      // 停止计时器但不重置isTimerOn
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // 更新状态
      setIsPaused(true);
    }
  };

  // 保存设置到插件
  useEffect(() => {
    onSaveSettings(currentSettings);
  }, [currentSettings, onSaveSettings]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);

  const statusBarRef = useRef<HTMLDivElement>(null);
  const soundChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIconIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 计算定时器剩余时间样式
  const getTimerStyle = () => {
    return timer === 0 ? 'wn-text-red-500' : '';
  };

  // 随机选择声音
  const handleRandomSound = useCallback(() => {
    const sound = sample(sounds);
    if (sound) {
      setCurrentSettings({ ...currentSettings, defaultSound: sound.id });
      play(sound.id);
    }
  }, [currentSettings, play]);


  // 控制音量图标循环显示
  useEffect(() => {
    // 如果播放中，开始循环切换图标
    if (isPlaying) {
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
      }

      volumeIconIntervalRef.current = setInterval(() => {
        setVolumeIconIndex(prev => {
          const newIndex = (prev + 1) % 3;
          return newIndex;
        });
      }, 500);
    } else {
      // 如果不在播放，清除定时器
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
        volumeIconIntervalRef.current = null;
      }
      // 只有在当前值不是0时才更新，避免不必要的渲染
      setVolumeIconIndex(prev => prev === 0 ? prev : 0);
    }

    // 组件卸载时清理定时器
    return () => {
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
        volumeIconIntervalRef.current = null;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    function handlePlay() {
      setIsPlaying(true);
      play();
    }
    function handlePlayRandom() {
      handleRandomSound();
    }
    function handleStop() {
      setIsPlaying(false);
      stopSound();
    }
    document.addEventListener('white-noise-play', handlePlay);
    document.addEventListener('white-noise-play-random', handlePlayRandom);
    document.addEventListener('white-noise-stop', handleStop);
    return () => {
      document.removeEventListener('white-noise-play', handlePlay);
      document.removeEventListener('white-noise-play-random', handlePlayRandom);
      document.removeEventListener('white-noise-stop', handleStop);
    };
  }, [setIsPlaying, play, handleRandomSound, stopSound]);

  // 清理函数：确保所有超时都被清除
  useEffect(() => {
    return () => {
      if (soundChangeTimeoutRef.current) {
        clearTimeout(soundChangeTimeoutRef.current);
        soundChangeTimeoutRef.current = null;
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
        volumeIconIntervalRef.current = null;
      }
    };
  }, []);

  const currentSound = useMemo(() => {
    return getSoundById(currentSettings.defaultSound);
  }, [currentSettings.defaultSound]);

  // 渲染播放控制区域（当前播放中内容）
  const PlaybackControls = (
    <div className="playback-controls wn-mb-4">
      <div className="wn-flex wn-flex-row wn-items-center wn-justify-between wn-mb-2">
        <div className='wn-flex wn-flex-col wn-gap-2'>
          <div className='wn-flex wn-flex-row wn-items-center wn-gap-2 wn-justify-between'>
            <div className={`wn-text-sm wn-font-medium ${isPlaying ? 'wn-text-primary' : ''}`}>
              {currentSound?.name || '未选择声音'}
            </div>
            <div className='wn-flex wn-flex-row wn-items-center wn-gap-1'>
              <Popover open={listOpen} onOpenChange={setListOpen}>
                <PopoverTrigger asChild>
                  <div className={cn("wn-h-6 wn-w-6 wn-flex wn-items-center wn-justify-center hover:wn-bg-border wn-rounded-md wn-cursor-pointer", listOpen && "wn-bg-border")} aria-label="声音列表">
                    <div className="icon">
                      <Icon name="list" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="!wn-w-36 wn-max-h-64 wn-overflow-y-auto">
                  <div className="wn-flex wn-flex-col wn-gap-2">
                    {categories.map((category) => (
                      <div key={category.id} className="wn-flex wn-flex-col wn-gap-1">
                        <div className="wn-text-xs wn-opacity-60">{category.icon} {category.name}</div>
                        <div className="wn-flex wn-flex-col wn-gap-1 wn-text-sm">
                          {category.sounds.map((sound) => (
                            <div
                              key={sound.id}
                              className={`wn-cursor-pointer wn-text-xs wn-py-1 wn-pl-4 ${currentSound === sound ? 'wn-text-primary' : ''}`}
                              onClick={() => {
                                setCurrentSettings({ ...currentSettings, defaultSound: sound.id });
                                play(sound.id);
                              }}
                            >
                              {sound.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <div
                className="wn-h-6 wn-w-6 wn-flex wn-items-center wn-justify-center wn-cursor-pointer hover:wn-bg-border wn-rounded-md"
                onClick={handleRandomSound}
              >
                <div className="icon">
                  <Icon name="shuffle" />
                </div>
              </div>
            </div>
          </div>
          <div className="wn-flex wn-flex-row wn-gap-2 wn-items-center wn-h-6 wn-leading-6">
            <div className="icon !wn-flex wn-h-6 wn-w-6 wn-items-center wn-justify-center wn-cursor-pointer hover:wn-bg-border wn-rounded-md">
              <Icon name="volume-2" />
            </div>
            <Slider
              value={currentSettings.volume * 100}
              onChange={(value) => handleVolumeChange(value)}
              min={0}
              max={100}
              step={1}
              className="obsidian-slider wn-flex"
            />
            <div className="wn-text-xs wn-w-[35px] wn-text-right">{(currentSettings.volume * 100).toFixed(0)}%</div>
          </div>
        </div>
        <div className="wn-flex wn-items-center wn-justify-center wn-flex-1">
          <div className={cn(
            "white-noise-play-button",
            "wn-w-[60px] wn-h-[60px] wn-rounded-full !wn-flex wn-items-center wn-justify-center wn-cursor-pointer",
            isPlaying ? "wn-bg-muted-foreground wn-text-card" : "wn-bg-primary wn-text-card"
          )} onClick={handlePlayPause}>
            <Icon size={36} name={isPlaying ? "pause" : "play"} className="icon" />
          </div>
        </div>
      </div>
    </div>
  );


  // 使用本地状态处理，先更新本地再通知外部
  const handleTimerToggle = (value: boolean) => {
    setIsTimerOn(value);
  };

  const handleTimerEndActionChange = (value: boolean) => {
    setCurrentSettings({ ...currentSettings, stopSoundOnTimerEnd: value });
  };

  const handleNotifyToggle = (value: boolean) => {
    setCurrentSettings({ ...currentSettings, playAlertOnTimerEnd: value });
  };

  // 渲染定时器区域
  const TimerSection = (
    <div className="timer-section">
      <div className="wn-flex wn-items-center wn-gap-2 wn-mb-4">
        <Toggle
          checked={isTimerOn}
          onChange={handleTimerToggle}
          id="timer-toggle"
          className="obsidian-toggle wn-flex"
        />
        <label htmlFor="timer-toggle" className="wn-text-sm wn-cursor-pointer">启用定时器</label>
      </div>

      {isTimerOn && (
        <div className="wn-flex wn-flex-col wn-gap-4 wn-bg-muted/30 wn-rounded-md wn-animate-in wn-fade-in-0 wn-zoom-in-95">
          <div className='wn-flex wn-flex-row wn-justify-between wn-items-start wn-gap-4'>
            <div className='wn-flex wn-flex-col wn-gap-2 wn-justify-center'>
              <div className="wn-flex wn-items-center wn-justify-center wn-w-24">
                <span className={`wn-text-2xl wn-font-bold wn-font-mono ${getTimerStyle()}`}>
                  {formatTime(timer)}
                </span>
              </div>
              <div className="wn-flex wn-flex-row wn-gap-2 wn-justify-center">
                {timer > 0 && <button
                  className="clickable-icon icon-btn"
                  onClick={toggleTimerPause}
                  aria-label={isPaused ? "继续" : "暂停"}
                >
                  <div className="icon">
                    <Icon name={isPaused ? "play" : "pause"} />
                  </div>
                </button>
                }
                {timer === 0 && <button
                  className="clickable-icon icon-btn"
                  aria-label="计时结束"
                  disabled={true}
                >
                  <div className="icon">
                    <Icon name="circle-check-big" />
                  </div>
                </button>
                }
                <button
                  className="clickable-icon icon-btn"
                  onClick={resetTimer}
                  aria-label="重置定时器"
                >
                  <div className="icon">
                    <Icon name="timer-reset" />
                  </div>
                </button>
              </div>
            </div>
            <div className='wn-flex wn-flex-col wn-gap-2 wn-flex-1'>
              <div className="wn-flex wn-items-center wn-gap-2">
                <Icon name="timer" className="icon" />
                设定时间
                <Select
                  value={String(currentSettings.defaultTimer)}
                  onValueChange={(value) => {
                    setCurrentSettings({ ...currentSettings, defaultTimer: Number(value) });
                    setTimer(Number(value));
                    // 如果计时器正在运行，使用新时间重启计时器
                    if (isTimerOn) {
                      startTimer(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="!wn-w-24">
                    <SelectValue placeholder="选择时间" />
                  </SelectTrigger>
                  <SelectContent>
                    {timerOptions.map(option => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="wn-flex wn-flex-col wn-gap-1">
                <div className="wn-flex wn-items-center wn-gap-2">
                  <Toggle
                    checked={currentSettings.stopSoundOnTimerEnd}
                    onChange={handleTimerEndActionChange}
                    id="timer-end-action"
                    className="obsidian-toggle wn-flex"
                  />
                  <label htmlFor="timer-end-action" className="wn-text-xs wn-cursor-pointer">
                    计时结束时停止白噪音
                  </label>
                </div>
                <div className="wn-flex wn-items-center wn-gap-2">
                  <Toggle
                    checked={currentSettings.playAlertOnTimerEnd}
                    onChange={handleNotifyToggle}
                    id="timer-notify"
                    className="obsidian-toggle wn-flex"
                  />
                  <label htmlFor="timer-notify" className="wn-text-xs wn-cursor-pointer">
                    计时结束时播放提示音
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={statusBarRef}
          className="status-bar-item"
          aria-label="白噪音控制"
        >
          {isPlaying ? (
            <>
              <div className="icon">
                {volumeIconIndex === 0 && <Icon name="volume" />}
                {volumeIconIndex === 1 && <Icon name="volume-1" />}
                {volumeIconIndex === 2 && <Icon name="volume-2" />}
              </div>
              <span>{currentSound?.name || ''}</span>
            </>
          ) : (
            <>
              <div className="icon">
                <Icon name="volume-x" />
              </div>
              <span>白噪音未播放</span>
            </>
          )}
          {isTimerOn && (
            <span className={`wn-ml-2 ${getTimerStyle()}`}>
              {isPaused ? '[暂停] ' : ''}{formatTime(timer)}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="white-noise-pane wn-w-[400px]" align="end">
        <h3 className="wn-text-sm wn-font-medium wn-mb-4 wn-mt-0 wn-flex wn-items-center wn-gap-2">
          <Icon name="activity" className="icon"></Icon>
          白噪音设置
        </h3>
        {PlaybackControls}
        {TimerSection}
      </PopoverContent>
    </Popover>
  );
};
