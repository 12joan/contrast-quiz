import { useState, useCallback } from 'react';
import getLuminance from 'relative-luminance';
import { contrastRatios } from './common';
import { getComplementaryLuminances } from './getComplementaryLuminances';
import { getGrayscaleColor } from './getGrayscaleColor';
import { sample } from './sample';
import { Color, QuizData } from './types';

const maxAttempts = 10000;

const generateQuizData = (): QuizData => {
  const contrast = sample(contrastRatios);

  for (let i = 0; i < maxAttempts; i++) {
    const colorA: Color = [255 * Math.random(), 255 * Math.random(), 255 * Math.random()];
    const luminanceA = getLuminance(colorA);
    const luminancesB = getComplementaryLuminances(luminanceA, contrast);
    if (luminancesB.length === 0) continue;
    const luminanceB = sample(luminancesB);
    const colorB = getGrayscaleColor(luminanceB);
    const [backgroundColor, textColor] = Math.random() < 0.5 ? [colorA, colorB] : [colorB, colorA];
    return { contrast, backgroundColor, textColor };
  }

  throw new Error('Failed to generate quiz data');
};

export const useQuizData = (): QuizData & { showNext: () => void } => {
  const [quizData, setQuizData] = useState<QuizData>(generateQuizData);

  const showNext = useCallback(() => {
    setQuizData(generateQuizData());
  }, []);

  return {
    ...quizData,
    showNext,
  };
};
