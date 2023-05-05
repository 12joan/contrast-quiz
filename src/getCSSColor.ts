import { Color } from './types';

export const getCSSColor = (color: Color): string => `rgb(${color.join(',')})`;
