import { Color } from './types';

const luminanceThreshold = 0.03928 / 12.92;

export const getGrayscaleColor = (luminance: number): Color => {
  const gray = luminance <= luminanceThreshold
    ? luminance * 12.92
    : Math.pow(luminance, 1 / 2.4) * 1.055 - 0.055;

  return [gray * 255, gray * 255, gray * 255];
};
