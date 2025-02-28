import { Plugin, setIcon } from 'obsidian';
import { useEffect, useState, useRef } from 'react';
import { Root, createRoot } from 'react-dom/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

export interface StatusBarProps {
  plugin: Plugin;
  soundOptions: Record<string, string[]>;
  currentSound: string;
  isPlaying: boolean;
  volume: number;
  timer: number;
  isTimerOn: boolean;
  isPaused: boolean;
  timerEndAction: 'continue' | 'stop';
  notifyEndOfTimer: boolean;
  onPlayPause: () => void;
  onSoundChange: (sound: string) => void;
  onRandomSound: () => void;
  onVolumeChange: (volume: number) => void;
  onTimerChange: (minutes: number) => void;
  onTimerToggle: () => void;
  onTimerPause: () => void;
  onTimerReset: () => void;
  onTimerEndActionChange: (action: 'continue' | 'stop') => void;
  onNotifyToggle: () => void;
}

export const StatusBar = (props: StatusBarProps) => {
  const [open, setOpen] = useState(false);
  const [_, setVolumeIconIndex] = useState(0);
  const [volumePopoverOpen, setVolumePopoverOpen] = useState(false);
  const [timerOptionOpen, setTimerOptionOpen] = useState(false);

  // 添加本地状态跟踪外部属性
  const [localTimerOn, setLocalTimerOn] = useState(props.isTimerOn);
  const [localTimerEndAction, setLocalTimerEndAction] = useState(props.timerEndAction);
  const [localNotifyEndOfTimer, setLocalNotifyEndOfTimer] = useState(props.notifyEndOfTimer);

  // 同步来自props的状态到本地状态
  useEffect(() => {
    setLocalTimerOn(props.isTimerOn);
  }, [props.isTimerOn]);

  useEffect(() => {
    setLocalTimerEndAction(props.timerEndAction);
  }, [props.timerEndAction]);

  useEffect(() => {
    setLocalNotifyEndOfTimer(props.notifyEndOfTimer);
  }, [props.notifyEndOfTimer]);

  const statusBarRef = useRef<HTMLDivElement>(null);
  const soundChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIconIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const volumeIconRef = useRef<HTMLDivElement>(null);

  // 引用所有图标元素
  const listIconRef = useRef<HTMLDivElement>(null);
  const shuffleIconRef = useRef<HTMLDivElement>(null);
  const volumeControlIconRef = useRef<HTMLDivElement>(null);
  const playPauseIconRef = useRef<HTMLDivElement>(null);
  const volumeMinIconRef = useRef<HTMLDivElement>(null);
  const volumeMaxIconRef = useRef<HTMLDivElement>(null);
  const timerPlayPauseIconRef = useRef<HTMLDivElement>(null);
  const resetIconRef = useRef<HTMLDivElement>(null);
  const clockIconRef = useRef<HTMLDivElement>(null);

  // 时间格式化，将分钟转换为 mm:ss 格式
  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes % 1) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算定时器剩余时间样式
  const getTimerStyle = () => {
    return props.timer === 0 ? 'wn-text-red-500' : '';
  };

  // 随机选择声音
  const handleRandomSound = () => {
    props.onRandomSound();
    if (!props.isPlaying) {
      props.onPlayPause();
    }
  };

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

  // 设置所有静态图标
  useEffect(() => {
    if (listIconRef.current) setIcon(listIconRef.current, 'list');
    if (shuffleIconRef.current) setIcon(shuffleIconRef.current, 'shuffle');
    if (volumeControlIconRef.current) setIcon(volumeControlIconRef.current, 'volume');
    if (volumeMinIconRef.current) setIcon(volumeMinIconRef.current, 'volume-x');
    if (volumeMaxIconRef.current) setIcon(volumeMaxIconRef.current, 'volume-2');
    if (clockIconRef.current) setIcon(clockIconRef.current, 'clock');
    if (resetIconRef.current) setIcon(resetIconRef.current, 'reset');
  }, []);

  // 更新播放/暂停图标
  useEffect(() => {
    if (playPauseIconRef.current) {
      setIcon(playPauseIconRef.current, props.isPlaying ? 'pause' : 'play');
    }
    if (timerPlayPauseIconRef.current) {
      setIcon(timerPlayPauseIconRef.current, props.isPaused ? 'play' : 'pause');
    }
  }, [props.isPlaying, props.isPaused]);

  // 控制音量图标循环显示
  useEffect(() => {
    // 如果播放中，开始循环切换图标
    if (props.isPlaying && volumeIconRef.current) {
      // 清除可能存在的旧定时器
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
      }

      // 创建新的定时器，每800毫秒切换一次图标
      volumeIconIntervalRef.current = setInterval(() => {
        setVolumeIconIndex(prev => {
          const newIndex = (prev + 1) % 3;
          if (volumeIconRef.current) {
            if (newIndex === 0) {
              setIcon(volumeIconRef.current, 'volume');
            } else if (newIndex === 1) {
              setIcon(volumeIconRef.current, 'volume-1');
            } else {
              setIcon(volumeIconRef.current, 'volume-2');
            }
          }
          return newIndex;
        });
      }, 500);
    } else {
      // 如果不在播放，清除定时器
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
        volumeIconIntervalRef.current = null;
      }
      setVolumeIconIndex(0);
      if (volumeIconRef.current) {
        setIcon(volumeIconRef.current, 'volume-x');
      }
    }

    // 组件卸载时清理定时器
    return () => {
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
        volumeIconIntervalRef.current = null;
      }
    };
  }, [props.isPlaying]);

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

  // 渲染播放控制区域（当前播放中内容）
  const renderPlaybackControls = () => {
    return (
      <div className="playback-controls wn-mb-4">
        <div className="wn-flex wn-flex-row wn-items-center wn-justify-between wn-mb-2">
          <div className='wn-flex wn-flex-col wn-gap-2 wn-w-4/5'>
            <div className={`wn-text-sm wn-font-medium ${props.isPlaying ? 'wn-text-primary' : ''}`}>
              {props.currentSound || '未选择声音'}
            </div>
            <div className="wn-flex wn-flex-row wn-gap-2 wn-items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="clickable-icon icon-btn" aria-label="声音列表">
                    <div className="icon">
                      <div ref={listIconRef}></div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="wn-w-48">
                  <div className="wn-flex wn-flex-col wn-gap-2">
                    {Object.keys(props.soundOptions).map((category) => (
                      <div key={category} className="wn-flex wn-flex-col wn-gap-1">
                        <div className="wn-text-xs wn-opacity-80">{category}</div>
                        <div className="wn-flex wn-flex-col wn-gap-1">
                          {props.soundOptions[category].map((sound) => (
                            <button
                              key={sound}
                              className={`clickable-icon ${props.currentSound === sound ? 'mod-active' : ''}`}
                              onClick={() => {
                                props.onSoundChange(sound);
                                if (!props.isPlaying) {
                                  props.onPlayPause();
                                }
                              }}
                            >
                              {sound}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <button
                className="clickable-icon icon-btn"
                onClick={handleRandomSound}
                aria-label="随机播放"
              >
                <div className="icon">
                  <div ref={shuffleIconRef}></div>
                </div>
              </button>

              <Popover open={volumePopoverOpen} onOpenChange={setVolumePopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="clickable-icon icon-btn" aria-label="音量调节">
                    <div className="icon">
                      <div ref={volumeControlIconRef}></div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="wn-w-64">
                  <div className="wn-flex wn-flex-col wn-gap-2">
                    <div className="wn-text-sm wn-font-medium">调节音量</div>
                    <div className="wn-flex wn-items-center wn-gap-2">
                      <div className="icon">
                        <div ref={volumeMinIconRef}></div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={props.volume}
                        onChange={(e) => props.onVolumeChange(Number(e.target.value))}
                        className="slider"
                      />
                      <div className="icon">
                        <div ref={volumeMaxIconRef}></div>
                      </div>
                    </div>
                    <div className="wn-text-xs wn-text-center">{props.volume}%</div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <button
              className="clickable-icon play-btn"
              onClick={props.onPlayPause}
              aria-label={props.isPlaying ? "暂停" : "播放"}
            >
              <div className="icon large-icon">
                <div ref={playPauseIconRef}></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  };

  // 渲染定时器区域
  const renderTimerSection = () => {
    // 使用本地状态处理，先更新本地再通知外部
    const handleTimerToggle = () => {
      const newValue = !localTimerOn;
      setLocalTimerOn(newValue);
      props.onTimerToggle(); // 通知外部
    };

    const handleTimerEndActionChange = () => {
      const newValue = localTimerEndAction === 'stop' ? 'continue' : 'stop';
      setLocalTimerEndAction(newValue);
      props.onTimerEndActionChange(newValue); // 通知外部
    };

    const handleNotifyToggle = () => {
      const newValue = !localNotifyEndOfTimer;
      setLocalNotifyEndOfTimer(newValue);
      props.onNotifyToggle(); // 通知外部
    };

    return (
      <div className="timer-section">
        <div className="wn-flex wn-items-center wn-gap-2 wn-mb-4">
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={localTimerOn}
              onChange={handleTimerToggle}
              id="timer-toggle"
            />
          </div>
          <label htmlFor="timer-toggle" className="wn-text-sm wn-cursor-pointer">启用定时器</label>
        </div>

        {localTimerOn && (
          <div className="wn-flex wn-flex-col wn-gap-4 wn-bg-muted/30 wn-p-3 wn-rounded-md wn-animate-in wn-fade-in-0 wn-zoom-in-95">
            <div className='wn-flex wn-flex-row wn-justify-between wn-items-start wn-gap-4'>
              <div className='wn-flex wn-flex-col wn-gap-2'>
                <div className="wn-flex wn-items-center wn-justify-center">
                  <span className={`wn-text-2xl wn-font-bold ${getTimerStyle()}`}>
                    {formatTime(props.timer)}
                  </span>
                </div>
                <div className="wn-flex wn-flex-row wn-gap-2 wn-justify-center">
                  <button
                    className="clickable-icon icon-btn"
                    onClick={props.onTimerPause}
                    disabled={props.timer === 0}
                    aria-label={props.isPaused ? "继续" : "暂停"}
                  >
                    <div className="icon">
                      <div ref={timerPlayPauseIconRef}></div>
                    </div>
                  </button>
                  <button
                    className="clickable-icon icon-btn"
                    onClick={props.onTimerReset}
                    aria-label="重置定时器"
                  >
                    <div className="icon">
                      <div ref={resetIconRef}></div>
                    </div>
                  </button>
                </div>
              </div>
              <div className='wn-flex wn-flex-col wn-gap-2'>
                <div>
                  <Popover open={timerOptionOpen} onOpenChange={setTimerOptionOpen}>
                    <PopoverTrigger asChild>
                      <button className="clickable-icon icon-btn" aria-label="设置时间">
                        <div className="icon">
                          <div ref={clockIconRef}></div>
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="wn-w-48">
                      <div className="wn-flex wn-flex-col wn-gap-2">
                        {timerOptions.map((option) => (
                          <button
                            key={option.value}
                            className={`clickable-icon ${props.timer === option.value ? 'mod-active' : ''}`}
                            onClick={() => {
                              props.onTimerChange(option.value);
                              setTimerOptionOpen(false);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="wn-flex wn-flex-col wn-gap-1">
                  <div className="wn-flex wn-items-center wn-gap-2">
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={localTimerEndAction === 'stop'}
                        onChange={handleTimerEndActionChange}
                        id="timer-end-action"
                      />
                    </div>
                    <label htmlFor="timer-end-action" className="wn-text-xs wn-cursor-pointer">
                      计时结束时停止白噪音
                    </label>
                  </div>
                  <div className="wn-flex wn-items-center wn-gap-2">
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={localNotifyEndOfTimer}
                        onChange={handleNotifyToggle}
                        id="timer-notify"
                      />
                    </div>
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
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={statusBarRef}
          className="status-bar-item"
          aria-label="白噪音控制"
        >
          {props.isPlaying ? (
            <>
              <div ref={volumeIconRef} className="icon"></div>
              <span>白噪音播放中</span>
              {localTimerOn && (
                <span className={`wn-ml-2 ${getTimerStyle()}`}>
                  {props.isPaused ? '[暂停] ' : ''}{formatTime(props.timer)}
                </span>
              )}
            </>
          ) : (
            <>
              <div ref={volumeIconRef} className="icon"></div>
              <span>白噪音未播放</span>
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="white-noise-panel" align="end">
        <h3 className="wn-text-lg wn-font-medium wn-mb-4">白噪音设置</h3>
        {renderPlaybackControls()}
        <hr className="wn-my-4" />
        {renderTimerSection()}
      </PopoverContent>
    </Popover>
  );
};

export function createStatusBar(
  statusBarEl: HTMLElement,
  props: StatusBarProps
): Root {
  const rootEl = createRoot(statusBarEl);
  rootEl.render(<StatusBar {...props} />);
  return rootEl;
} 