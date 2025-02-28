import { audioAssets, alarmSrc } from "src/audio-assets";
import { Sound, SoundCategory } from "src/types";
import { NoiseGenerator, NoiseType } from "./noise-generator";
import L from "src/L";

// 定义所有类别
export const categories: SoundCategory[] = [
  { id: 'animals', name: L.categories.animals(), icon: '🐾', sounds: [] },
  { id: 'nature', name: L.categories.nature(), icon: '🌿', sounds: [] },
  { id: 'noise', name: L.categories.noise(), icon: '📻', sounds: [] },
  { id: 'places', name: L.categories.places(), icon: '🏙️', sounds: [] },
  { id: 'rain', name: L.categories.rain(), icon: '🌧️', sounds: [] },
  { id: 'things', name: L.categories.things(), icon: '🔔', sounds: [] },
  { id: 'urban', name: L.categories.urban(), icon: '🏙️', sounds: [] },
  { id: 'synthetic', name: L.categories.synthetic(), icon: '🔊', sounds: [] }, // 新增合成噪音分类
];

// 从音频资源加载声音
export const sounds = audioAssets;

// 添加合成噪音
sounds.push({
  id: 'synthetic-white',
  name: '白噪音',
  src: 'synthetic:white',
  category: 'synthetic',
  synthetic: true
});

sounds.push({
  id: 'synthetic-pink',
  name: '粉噪音',
  src: 'synthetic:pink',
  category: 'synthetic',
  synthetic: true
});

sounds.push({
  id: 'synthetic-brown',
  name: '棕噪音',
  src: 'synthetic:brown',
  category: 'synthetic',
  synthetic: true
});

sounds.push({
  id: 'synthetic-green',
  name: '绿噪音',
  src: 'synthetic:green',
  category: 'synthetic',
  synthetic: true
});

// 将声音归类到对应分类
sounds.forEach(sound => {
  const category = categories.find(c => c.id === sound.category);
  if (category) {
    category.sounds.push(sound);
  }
});

export function getSoundById(id: string): Sound | undefined {
  return sounds.find(sound => sound.id === id);
}

// 修复数据URL的MIME类型
export function fixDataUrlMimeType(dataUrl: string): string {
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

let noiseGenerator: NoiseGenerator | null = null;
const audioElement = new Audio();
let isSyntheticNoise = false;

// 播放合成噪音
export function playSyntheticNoise(sound: Sound, volume: number) {
  // 如果噪音生成器不存在，创建一个
  if (!noiseGenerator) {
    noiseGenerator = new NoiseGenerator();
  }

  // 从src中提取噪音类型 (格式: synthetic:type)
  const noiseType = sound.src.split(':')[1] as NoiseType;

  // 设置噪音类型
  noiseGenerator.setNoiseType(noiseType);

  // 设置音量
  noiseGenerator.setVolume(volume);

  // 播放噪音
  noiseGenerator.play();

  // 设置合成噪音标志
  isSyntheticNoise = true;
}

export function stopSound() {
  if (isSyntheticNoise) {
    noiseGenerator?.stop();
  } else {
    audioElement.pause();
  }

  // 重置合成噪音标志
  isSyntheticNoise = false;
}

export function playSound(sound: Sound, volume: number) {
  stopSound();
  if (sound.synthetic) {
    playSyntheticNoise(sound, volume);
  } else {
    audioElement.src = fixDataUrlMimeType(sound.src);
    audioElement.volume = volume;
    audioElement.play();
    audioElement.loop = true;
    isSyntheticNoise = false;
  }
}

// 设置音量
export function setVolume(volume: number) {
  if (isSyntheticNoise && noiseGenerator) {
    noiseGenerator.setVolume(volume);
  } else {
    audioElement.volume = volume;
  }
}

export function playAlert() {
  const audioElement = new Audio();
  audioElement.src = alarmSrc;
  audioElement.volume = 1;
  audioElement.play();
  audioElement.addEventListener('ended', () => {
    audioElement.remove();
  });
}
