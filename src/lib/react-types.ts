import { IWhiteNoisePlugin, Sound } from "../types";
import { ReactNode } from "react";

export interface StatusBarProps {
  plugin: IWhiteNoisePlugin;
  onOpenPopover: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface PopoverProps {
  plugin: IWhiteNoisePlugin;
  onClose: () => void;
  position?: { x: number; y: number };
}

export interface TabsContainerProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

export interface SoundListProps {
  sounds: Sound[];
  currentSound: Sound | null;
  onSoundSelect: (sound: Sound) => void;
}

export interface PlaybackControlsProps {
  plugin: IWhiteNoisePlugin;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface TimerControlProps {
  timerEndTime: number | null;
  onTimerChange: (minutes: number) => void;
} 