// 这个文件负责导入所有音频文件

// 动物声音
import birdsSrc from '../sounds/animals/birds.mp3';
import cricketsSrc from '../sounds/animals/crickets.mp3';
import crowsSrc from '../sounds/animals/crows.mp3';
import dogBarkingSrc from '../sounds/animals/dog-barking.mp3';
import horseGaloppSrc from '../sounds/animals/horse-galopp.mp3';
import owlSrc from '../sounds/animals/owl.mp3';
import seagullsSrc from '../sounds/animals/seagulls.mp3';
import whaleSrc from '../sounds/animals/whale.mp3';

// 自然环境
import campfireSrc from '../sounds/nature/campfire.mp3';
import dropletsSrc from '../sounds/nature/droplets.mp3';
import howlingWindSrc from '../sounds/nature/howling-wind.mp3';
import riverSrc from '../sounds/nature/river.mp3';
import walkInSnowSrc from '../sounds/nature/walk-in-snow.mp3';
import walkOnLeavesSrc from '../sounds/nature/walk-on-leaves.mp3';
import waterfallSrc from '../sounds/nature/waterfall.mp3';
import wavesSrc from '../sounds/nature/waves.mp3';

// 基础噪音
import brownNoiseSrc from '../sounds/noise/brown-noise.wav';
import pinkNoiseSrc from '../sounds/noise/pink-noise.wav';
import whiteNoiseSrc from '../sounds/noise/white-noise.wav';

// 场所环境
import cafeSrc from '../sounds/places/cafe.mp3';
import churchSrc from '../sounds/places/church.mp3';
import constructionSiteSrc from '../sounds/places/construction-site.mp3';
import crowdedBarSrc from '../sounds/places/crowded-bar.mp3';
import laboratorySrc from '../sounds/places/laboratory.mp3';
import laundryRoomSrc from '../sounds/places/laundry-room.mp3';
import nightVillageSrc from '../sounds/places/night-village.mp3';
import officeSrc from '../sounds/places/office.mp3';
import subwayStationSrc from '../sounds/places/subway-station.mp3';
import supermarketSrc from '../sounds/places/supermarket.mp3';
import underwaterSrc from '../sounds/places/underwater.mp3';

// 雨声
import heavyRainSrc from '../sounds/rain/heavy-rain.mp3';
import lightRainSrc from '../sounds/rain/light-rain.mp3';
import rainOnLeavesSrc from '../sounds/rain/rain-on-leaves.mp3';
import rainOnUmbrellaSrc from '../sounds/rain/rain-on-umbrella.mp3';
import rainOnWindowSrc from '../sounds/rain/rain-on-window.mp3';

// 物品声音
import boilingWaterSrc from '../sounds/things/boiling-water.mp3';
import bubblesSrc from '../sounds/things/bubbles.mp3';
import ceilingFanSrc from '../sounds/things/ceiling-fan.mp3';
import clockSrc from '../sounds/things/clock.mp3';
import dryerSrc from '../sounds/things/dryer.mp3';
import keyboardSrc from '../sounds/things/keyboard.mp3';
import paperSrc from '../sounds/things/paper.mp3';
import typewriterSrc from '../sounds/things/typewriter.mp3';
import washingMachineSrc from '../sounds/things/washing-machine.mp3';
import windChimesSrc from '../sounds/things/wind-chimes.mp3';

// 城市声音
import crowdSrc from '../sounds/urban/crowd.mp3';
import fireworksSrc from '../sounds/urban/fireworks.mp3';
import highwaySrc from '../sounds/urban/highway.mp3';
import roadSrc from '../sounds/urban/road.mp3';
import trafficSrc from '../sounds/urban/traffic.mp3';

import alarmSrc from '../sounds/alarm.mp3';
import { Sound } from './types';

export { alarmSrc };

// 音频资源列表
// 定义所有音频的路径和元数据
export const audioAssets: Sound[] = [
  // 动物声音
  { id: 'animals/birds', name: '鸟叫', src: birdsSrc, category: 'animals' },
  { id: 'animals/crickets', name: '蟋蟀', src: cricketsSrc, category: 'animals' },
  { id: 'animals/crows', name: '乌鸦', src: crowsSrc, category: 'animals' },
  { id: 'animals/dog-barking', name: '狗吠', src: dogBarkingSrc, category: 'animals' },
  { id: 'animals/horse-galopp', name: '马蹄声', src: horseGaloppSrc, category: 'animals' },
  { id: 'animals/owl', name: '猫头鹰', src: owlSrc, category: 'animals' },
  { id: 'animals/seagulls', name: '海鸥', src: seagullsSrc, category: 'animals' },
  { id: 'animals/whale', name: '鲸鱼', src: whaleSrc, category: 'animals' },

  // 自然环境
  { id: 'nature/campfire', name: '篝火', src: campfireSrc, category: 'nature' },
  { id: 'nature/droplets', name: '水滴', src: dropletsSrc, category: 'nature' },
  { id: 'nature/howling-wind', name: '呼啸的风', src: howlingWindSrc, category: 'nature' },
  { id: 'nature/river', name: '河流', src: riverSrc, category: 'nature' },
  { id: 'nature/walk-in-snow', name: '雪地行走', src: walkInSnowSrc, category: 'nature' },
  { id: 'nature/walk-on-leaves', name: '落叶行走', src: walkOnLeavesSrc, category: 'nature' },
  { id: 'nature/waterfall', name: '瀑布', src: waterfallSrc, category: 'nature' },
  { id: 'nature/waves', name: '海浪', src: wavesSrc, category: 'nature' },

  // 基础噪音
  { id: 'noise/brown-noise', name: '棕噪音', src: brownNoiseSrc, category: 'noise' },
  { id: 'noise/pink-noise', name: '粉噪音', src: pinkNoiseSrc, category: 'noise' },
  { id: 'noise/white-noise', name: '白噪音', src: whiteNoiseSrc, category: 'noise' },

  // 场所环境
  { id: 'places/cafe', name: '咖啡馆', src: cafeSrc, category: 'places' },
  { id: 'places/church', name: '教堂', src: churchSrc, category: 'places' },
  { id: 'places/construction-site', name: '建筑工地', src: constructionSiteSrc, category: 'places' },
  { id: 'places/crowded-bar', name: '拥挤的酒吧', src: crowdedBarSrc, category: 'places' },
  { id: 'places/laboratory', name: '实验室', src: laboratorySrc, category: 'places' },
  { id: 'places/laundry-room', name: '洗衣房', src: laundryRoomSrc, category: 'places' },
  { id: 'places/night-village', name: '夜晚的村庄', src: nightVillageSrc, category: 'places' },
  { id: 'places/office', name: '办公室', src: officeSrc, category: 'places' },
  { id: 'places/subway-station', name: '地铁站', src: subwayStationSrc, category: 'places' },
  { id: 'places/supermarket', name: '超市', src: supermarketSrc, category: 'places' },
  { id: 'places/underwater', name: '水下', src: underwaterSrc, category: 'places' },

  // 雨声
  { id: 'rain/heavy-rain', name: '大雨', src: heavyRainSrc, category: 'rain' },
  { id: 'rain/light-rain', name: '小雨', src: lightRainSrc, category: 'rain' },
  { id: 'rain/rain-on-leaves', name: '雨打叶', src: rainOnLeavesSrc, category: 'rain' },
  { id: 'rain/rain-on-umbrella', name: '雨打伞', src: rainOnUmbrellaSrc, category: 'rain' },
  { id: 'rain/rain-on-window', name: '雨打窗', src: rainOnWindowSrc, category: 'rain' },

  // 物品声音
  { id: 'things/boiling-water', name: '沸水', src: boilingWaterSrc, category: 'things' },
  { id: 'things/bubbles', name: '气泡', src: bubblesSrc, category: 'things' },
  { id: 'things/ceiling-fan', name: '吊扇', src: ceilingFanSrc, category: 'things' },
  { id: 'things/clock', name: '时钟', src: clockSrc, category: 'things' },
  { id: 'things/dryer', name: '烘干机', src: dryerSrc, category: 'things' },
  { id: 'things/keyboard', name: '键盘', src: keyboardSrc, category: 'things' },
  { id: 'things/paper', name: '纸张', src: paperSrc, category: 'things' },
  { id: 'things/typewriter', name: '打字机', src: typewriterSrc, category: 'things' },
  { id: 'things/washing-machine', name: '洗衣机', src: washingMachineSrc, category: 'things' },
  { id: 'things/wind-chimes', name: '风铃', src: windChimesSrc, category: 'things' },


  // 城市声音
  { id: 'urban/crowd', name: '人群', src: crowdSrc, category: 'urban' },
  { id: 'urban/fireworks', name: '烟花', src: fireworksSrc, category: 'urban' },
  { id: 'urban/highway', name: '高速公路', src: highwaySrc, category: 'urban' },
  { id: 'urban/road', name: '道路', src: roadSrc, category: 'urban' },
  { id: 'urban/traffic', name: '交通', src: trafficSrc, category: 'urban' },
];