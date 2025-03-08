// 时间格式化，将分钟转换为 mm:ss 格式
export const formatTime = (minutes: number): string => {
  const mins = Math.floor(minutes);
  const secs = Math.floor((minutes % 1) * 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
