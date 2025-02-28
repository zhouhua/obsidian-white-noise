import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { WhiteNoiseSettings } from 'src/types';
import { categories, getSoundById, playAlert, playSound, sounds, stopSound, setVolume } from 'src/lib/sound';
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
import L from 'src/L';

const timerOptions = [
  { value: 0.1, label: 'test' },
  { value: 5, label: L.timerOptions['5']() },
  { value: 10, label: L.timerOptions['10']() },
  { value: 15, label: L.timerOptions['15']() },
  { value: 20, label: L.timerOptions['20']() },
  { value: 25, label: L.timerOptions['25']() },
  { value: 30, label: L.timerOptions['30']() },
  { value: 45, label: L.timerOptions['45']() },
  { value: 60, label: L.timerOptions['60']() },
  { value: 90, label: L.timerOptions['90']() },
  { value: 120, label: L.timerOptions['120']() },
];
export interface StatusBarProps {
  defaultSettings: WhiteNoiseSettings;
  onSaveSettings: (settings: WhiteNoiseSettings) => void;
}

export const StatusBar = ({ defaultSettings, onSaveSettings }: StatusBarProps) => {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(defaultSettings);
  const [volumeIconIndex, setVolumeIconIndex] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(defaultSettings.defaultTimer);

  const timerIntervalRef = useRef<number | null>(null);
  const timerEndTimeRef = useRef<number | null>(null);
  const pausedRemainingMsRef = useRef<number | null>(null);
  const currentSettingsRef = useRef<WhiteNoiseSettings>(defaultSettings);

  const play = useCallback((soundId?: string) => {
    const sound = getSoundById(soundId || currentSettings.defaultSound);
    if (sound) {
      stopSound();
      playSound(sound, currentSettings.volume);
    }
  }, [currentSettings.defaultSound, currentSettings.volume]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSound();
    } else {
      setIsPlaying(true);
      play();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const volumeValue = newVolume / 100;
    setCurrentSettings(prev => ({ ...prev, volume: volumeValue }));
    setVolume(volumeValue);
  };

  const startTimer = (minutes: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTimer(minutes);
    setIsTimerOn(true);
    setIsPaused(false);

    const ms = minutes * 60 * 1000;
    const endTime = Date.now() + ms;
    timerEndTimeRef.current = endTime;
    pausedRemainingMsRef.current = null;

    timerIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);

      const remainingMinutes = remaining / 60000;
      setTimer(remainingMinutes);

      if (remaining <= 0) {
        if (currentSettingsRef.current.stopSoundOnTimerEnd) {
          stopSound();
          setIsPlaying(false);
        }
        if (currentSettingsRef.current.playAlertOnTimerEnd) {
          playAlert();
        }

        clearInterval(timerIntervalRef.current!);
        timerIntervalRef.current = null;
        timerEndTimeRef.current = null;
        setIsPaused(true);
      }
    }, 50);
  };

  useEffect(() => {
    if (isTimerOn && !isPaused) {
      if (timerIntervalRef.current) {
        return;
      }
      startTimer(currentSettings.defaultTimer);
    } else if (!isTimerOn) {
      if (timerIntervalRef.current && !isPaused) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        timerEndTimeRef.current = null;
        pausedRemainingMsRef.current = null;
      }
    }
  }, [isTimerOn, isPaused, startTimer, currentSettings.defaultTimer]);

  const resetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsPaused(false);
    setTimer(currentSettings.defaultTimer);
    pausedRemainingMsRef.current = null;
    timerEndTimeRef.current = null;
  };

  const toggleTimerPause = () => {
    if (!isTimerOn && !isPaused) return;

    if (isPaused) {
      if (pausedRemainingMsRef.current === null || pausedRemainingMsRef.current <= 0) {
        return;
      }

      const nowTime = Date.now();
      const endTime = nowTime + pausedRemainingMsRef.current;
      timerEndTimeRef.current = endTime;

      timerIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);

        const remainingMinutes = remaining / 60000;
        setTimer(remainingMinutes);

        if (remaining <= 0) {
          if (currentSettings.stopSoundOnTimerEnd) {
            stopSound();
            setIsPlaying(false);
          }

          clearInterval(timerIntervalRef.current!);
          timerIntervalRef.current = null;
          timerEndTimeRef.current = null;
          setIsPaused(true);
        }
      }, 50);

      setIsTimerOn(true);
      setIsPaused(false);
    } else {
      if (timerEndTimeRef.current) {
        pausedRemainingMsRef.current = Math.max(0, timerEndTimeRef.current - Date.now());
      } else {
        pausedRemainingMsRef.current = timer * 60000;
      }

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      setIsPaused(true);
    }
  };

  useEffect(() => {
    currentSettingsRef.current = currentSettings;
    onSaveSettings(currentSettings);
  }, [currentSettings, onSaveSettings]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);

  const statusBarRef = useRef<HTMLDivElement>(null);
  const soundChangeTimeoutRef = useRef<number | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);
  const volumeIconIntervalRef = useRef<number | null>(null);

  const getTimerStyle = () => {
    return timer === 0 ? 'wn-text-red-500' : '';
  };

  const handleRandomSound = useCallback(() => {
    const sound = sample(sounds);
    if (sound) {
      setCurrentSettings(prev => ({ ...prev, defaultSound: sound.id }));
      play(sound.id);
    }
  }, [play]);


  useEffect(() => {
    if (isPlaying) {
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
      }

      volumeIconIntervalRef.current = window.setInterval(() => {
        setVolumeIconIndex(prev => {
          const newIndex = (prev + 1) % 3;
          return newIndex;
        });
      }, 500);
    } else {
      if (volumeIconIntervalRef.current) {
        clearInterval(volumeIconIntervalRef.current);
        volumeIconIntervalRef.current = null;
      }
      setVolumeIconIndex(prev => prev === 0 ? prev : 0);
    }

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
    function handleConfig() {
      setOpen(true);
    }
    document.addEventListener('white-noise-play', handlePlay);
    document.addEventListener('white-noise-play-random', handlePlayRandom);
    document.addEventListener('white-noise-stop', handleStop);
    document.addEventListener('white-noise-config', handleConfig);
    return () => {
      document.removeEventListener('white-noise-play', handlePlay);
      document.removeEventListener('white-noise-play-random', handlePlayRandom);
      document.removeEventListener('white-noise-stop', handleStop);
      document.removeEventListener('white-noise-config', handleConfig);
    };
  }, [setIsPlaying, play, handleRandomSound, stopSound, setOpen]);

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

  useEffect(() => {
    setTimeout(() => {
      const selectedSound = document.querySelector('[data-selected="true"]');
      if (selectedSound) {
        selectedSound.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }, 100);
  }, [listOpen]);

  const currentSound = useMemo(() => {
    return getSoundById(currentSettings.defaultSound);
  }, [currentSettings.defaultSound]);

  const PlaybackControls = (
    <div className="playback-controls wn-mb-4">
      <div className="wn-flex wn-flex-row wn-items-center wn-justify-between wn-mb-2 wn-gap-4">
        <div className='wn-flex wn-flex-col wn-gap-2'>
          <div className='wn-flex wn-flex-row wn-items-center wn-gap-2 wn-justify-between'>
            <div className={`wn-text-sm wn-font-medium ${isPlaying ? 'wn-text-primary' : ''}`}>
              {currentSound?.name || ''}
            </div>
            <div className='wn-flex wn-flex-row wn-items-center wn-gap-1'>
              <Popover open={listOpen} onOpenChange={setListOpen}>
                <PopoverTrigger asChild>
                  <div className={cn("wn-h-6 wn-w-6 wn-flex wn-items-center wn-justify-center hover:wn-bg-border wn-rounded-md wn-cursor-pointer", listOpen && "wn-bg-border")} aria-label={L.list()}>
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
                              data-selected={currentSound === sound}
                              className={`wn-cursor-pointer wn-text-xs wn-py-1 wn-pl-4 ${currentSound === sound ? 'wn-text-primary wn-font-bold' : ''}`}
                              onClick={() => {
                                setCurrentSettings(prev => ({ ...prev, defaultSound: sound.id }));
                                play(sound.id);
                                setListOpen(false);
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
                title={L.playRandom()}
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
          <div
            className={cn(
              "white-noise-play-button",
              "wn-w-[60px] wn-h-[60px] wn-rounded-full !wn-flex wn-items-center wn-justify-center wn-cursor-pointer",
              isPlaying ? "wn-bg-muted-foreground wn-text-card" : "wn-bg-primary wn-text-card"
            )}
            onClick={handlePlayPause}
            title={isPlaying ? L.pause() : L.play()}
          >
            <Icon size={36} name={isPlaying ? "pause" : "play"} className="icon" />
          </div>
        </div>
      </div>
    </div>
  );


  const handleTimerToggle = (value: boolean) => {
    setIsTimerOn(value);
  };

  const handleTimerEndActionChange = (value: boolean) => {
    setCurrentSettings(prev => ({ ...prev, stopSoundOnTimerEnd: value }));
  };

  const handleNotifyToggle = (value: boolean) => {
    setCurrentSettings(prev => ({ ...prev, playAlertOnTimerEnd: value }));
  };

  const TimerSection = (
    <div className="timer-section">
      <div className="wn-flex wn-items-center wn-gap-2 wn-mb-4">
        <Toggle
          checked={isTimerOn}
          onChange={handleTimerToggle}
          id="timer-toggle"
          className="obsidian-toggle wn-flex"
        />
        <label htmlFor="timer-toggle" className="wn-text-sm wn-cursor-pointer">{L.enableTimer()}</label>
        <span className="wn-text-xs wn-text-muted-foreground wn-opacity-60">{L.enableTimerDescription()}</span>
      </div>


      {isTimerOn && (
        <div className="wn-bg-muted/30 wn-rounded-md wn-p-2 wn-border wn-border-border">
          <div className='wn-flex wn-flex-row wn-items-center wn-justify-between wn-gap-4'>
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
                  aria-label={isPaused ? L.resumeTimer() : L.pauseTimer()}
                >
                  <div className="icon">
                    <Icon name={isPaused ? "play" : "pause"} />
                  </div>
                </button>
                }
                {timer === 0 && <button
                  className="clickable-icon icon-btn"
                  aria-label={L.timerEnd()}
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
                  aria-label={L.resetTimer()}
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
                {L.selectTimer()}
                <Select
                  value={String(currentSettings.defaultTimer)}
                  onValueChange={(value) => {
                    setCurrentSettings(prev => ({ ...prev, defaultTimer: Number(value) }));
                    setTimer(Number(value));
                    if (isTimerOn) {
                      startTimer(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="!wn-w-24">
                    <SelectValue placeholder={L.selectTimer()} />
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
                    {L.timerEndAction()}
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
                    {L.timerNotify()}
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
          aria-label={L.config()}
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
              <span>{L.notPlaying()}</span>
            </>
          )}
          {isTimerOn && (
            <span className={`wn-ml-2 ${getTimerStyle()}`}>
              {isPaused ? timer <= 0 ? L.stopped() : L.paused() : ''}
              <span className="wn-font-mono">{formatTime(timer)}</span>
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="white-noise-pane wn-w-[450px]" align="end">
        <h3 className="wn-text-sm wn-font-medium wn-mb-4 wn-mt-0 wn-flex wn-items-center wn-gap-2">
          <Icon name="activity" className="icon"></Icon>
          {L.config()}
        </h3>
        {PlaybackControls}
        {TimerSection}
      </PopoverContent>
    </Popover>
  );
};
