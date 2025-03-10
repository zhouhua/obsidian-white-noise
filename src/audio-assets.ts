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
import L from './L';

export { alarmSrc };

// 音频资源列表
// 定义所有音频的路径和元数据
export const audioAssets: Sound[] = [
  // 动物声音
  { id: 'animals/birds', name: L.sounds.birds(), src: birdsSrc, category: 'animals' },
  { id: 'animals/crickets', name: L.sounds.crickets(), src: cricketsSrc, category: 'animals' },
  { id: 'animals/crows', name: L.sounds.crows(), src: crowsSrc, category: 'animals' },
  { id: 'animals/dog-barking', name: L.sounds.dogBarking(), src: dogBarkingSrc, category: 'animals' },
  { id: 'animals/horse-galopp', name: L.sounds.horseGalopp(), src: horseGaloppSrc, category: 'animals' },
  { id: 'animals/owl', name: L.sounds.owl(), src: owlSrc, category: 'animals' },
  { id: 'animals/seagulls', name: L.sounds.seagulls(), src: seagullsSrc, category: 'animals' },
  { id: 'animals/whale', name: L.sounds.whale(), src: whaleSrc, category: 'animals' },

  // 自然环境
  { id: 'nature/campfire', name: L.sounds.campfire(), src: campfireSrc, category: 'nature' },
  { id: 'nature/droplets', name: L.sounds.droplets(), src: dropletsSrc, category: 'nature' },
  { id: 'nature/howling-wind', name: L.sounds.howlingWind(), src: howlingWindSrc, category: 'nature' },
  { id: 'nature/river', name: L.sounds.river(), src: riverSrc, category: 'nature' },
  { id: 'nature/walk-in-snow', name: L.sounds.walkInSnow(), src: walkInSnowSrc, category: 'nature' },
  { id: 'nature/walk-on-leaves', name: L.sounds.walkOnLeaves(), src: walkOnLeavesSrc, category: 'nature' },
  { id: 'nature/waterfall', name: L.sounds.waterfall(), src: waterfallSrc, category: 'nature' },
  { id: 'nature/waves', name: L.sounds.waves(), src: wavesSrc, category: 'nature' },

  // 场所环境
  { id: 'places/cafe', name: L.sounds.cafe(), src: cafeSrc, category: 'places' },
  { id: 'places/church', name: L.sounds.church(), src: churchSrc, category: 'places' },
  { id: 'places/construction-site', name: L.sounds.constructionSite(), src: constructionSiteSrc, category: 'places' },
  { id: 'places/crowded-bar', name: L.sounds.crowdedBar(), src: crowdedBarSrc, category: 'places' },
  { id: 'places/laboratory', name: L.sounds.laboratory(), src: laboratorySrc, category: 'places' },
  { id: 'places/laundry-room', name: L.sounds.laundryRoom(), src: laundryRoomSrc, category: 'places' },
  { id: 'places/night-village', name: L.sounds.nightVillage(), src: nightVillageSrc, category: 'places' },
  { id: 'places/office', name: L.sounds.office(), src: officeSrc, category: 'places' },
  { id: 'places/subway-station', name: L.sounds.subwayStation(), src: subwayStationSrc, category: 'places' },
  { id: 'places/supermarket', name: L.sounds.supermarket(), src: supermarketSrc, category: 'places' },
  { id: 'places/underwater', name: L.sounds.underwater(), src: underwaterSrc, category: 'places' },

  // 雨声
  { id: 'rain/heavy-rain', name: L.sounds.heavyRain(), src: heavyRainSrc, category: 'rain' },
  { id: 'rain/light-rain', name: L.sounds.lightRain(), src: lightRainSrc, category: 'rain' },
  { id: 'rain/rain-on-leaves', name: L.sounds.rainOnLeaves(), src: rainOnLeavesSrc, category: 'rain' },
  { id: 'rain/rain-on-umbrella', name: L.sounds.rainOnUmbrella(), src: rainOnUmbrellaSrc, category: 'rain' },
  { id: 'rain/rain-on-window', name: L.sounds.rainOnWindow(), src: rainOnWindowSrc, category: 'rain' },

  // 物品声音
  { id: 'things/boiling-water', name: L.sounds.boilingWater(), src: boilingWaterSrc, category: 'things' },
  { id: 'things/bubbles', name: L.sounds.bubbles(), src: bubblesSrc, category: 'things' },
  { id: 'things/ceiling-fan', name: L.sounds.ceilingFan(), src: ceilingFanSrc, category: 'things' },
  { id: 'things/clock', name: L.sounds.clock(), src: clockSrc, category: 'things' },
  { id: 'things/dryer', name: L.sounds.dryer(), src: dryerSrc, category: 'things' },
  { id: 'things/keyboard', name: L.sounds.keyboard(), src: keyboardSrc, category: 'things' },
  { id: 'things/paper', name: L.sounds.paper(), src: paperSrc, category: 'things' },
  { id: 'things/typewriter', name: L.sounds.typewriter(), src: typewriterSrc, category: 'things' },
  { id: 'things/washing-machine', name: L.sounds.washingMachine(), src: washingMachineSrc, category: 'things' },
  { id: 'things/wind-chimes', name: L.sounds.windChimes(), src: windChimesSrc, category: 'things' },


  // 城市声音
  { id: 'urban/crowd', name: L.sounds.crowd(), src: crowdSrc, category: 'urban' },
  { id: 'urban/fireworks', name: L.sounds.fireworks(), src: fireworksSrc, category: 'urban' },
  { id: 'urban/highway', name: L.sounds.highway(), src: highwaySrc, category: 'urban' },
  { id: 'urban/road', name: L.sounds.road(), src: roadSrc, category: 'urban' },
  { id: 'urban/traffic', name: L.sounds.traffic(), src: trafficSrc, category: 'urban' },
];