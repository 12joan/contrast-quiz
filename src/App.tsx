import { useState, useEffect, useCallback } from 'react';
import getLuminance from 'relative-luminance';
import { loremIpsum } from 'lorem-ipsum';
import Tippy, { useSingleton } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

type PassLevel = 'fail' | 'pass' | 'good';

const contrastRatios = [1.5, 3, 4.5, 7];

const contrastRatioPassLevels: Record<number, { largeText: PassLevel, normalText: PassLevel }> = {
  1.5: { largeText: 'fail', normalText: 'fail' },
  3: { largeText: 'pass', normalText: 'fail' },
  4.5: { largeText: 'good', normalText: 'pass' },
  7: { largeText: 'good', normalText: 'good' },
};

const sample = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const getContrastText = (contrast: number): string => `${contrast}:1`;

type Color = [number, number, number];

const getCSSColor = (color: Color): string => `rgb(${color.join(',')})`;

const getComplementaryLuminances = (luminanceA: number, contrast: number): number[] => {
  const luminanceAPlus = luminanceA + 0.05;

  const luminanceBPlus1 = luminanceAPlus / contrast;
  const luminanceBPlus2 = luminanceAPlus * contrast;

  const luminanceB1 = luminanceBPlus1 - 0.05;
  const luminanceB2 = luminanceBPlus2 - 0.05;

  return [luminanceB1, luminanceB2].filter((luminance) => luminance >= 0 && luminance <= 1);
};

const luminanceThreshold = 0.03928 / 12.92;

const getGrayscaleColor = (luminance: number): Color => {
  const gray = luminance <= luminanceThreshold
    ? luminance * 12.92
    : Math.pow(luminance, 1 / 2.4) * 1.055 - 0.055;

  return [gray * 255, gray * 255, gray * 255];
};

type QuizData = {
  contrast: number;
  backgroundColor: Color;
  textColor: Color;
  largeText: string;
  normalText: string;
};

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
    const largeText = loremIpsum({ count: 1, units: 'sentences' });
    const normalText = loremIpsum({ count: 1, units: 'paragraphs' });
    return { contrast, backgroundColor, textColor, largeText, normalText };
  }

  throw new Error('Failed to generate quiz data');
};

const useQuizData = (): QuizData & { showNext: () => void } => {
  const [quizData, setQuizData] = useState<QuizData>(generateQuizData);

  const showNext = useCallback(() => {
    setQuizData(generateQuizData());
  }, []);

  return {
    ...quizData,
    showNext,
  };
};

export const App = () => {
  const {
    contrast,
    backgroundColor,
    textColor,
    largeText,
    normalText,
    showNext,
  } = useQuizData();

  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const [tippySource, tippyTarget] = useSingleton();

  const handleAnswer = useCallback((answer: number) => {
    if (answer === contrast) {
      showNext();
      setWrongAnswers([]);
    } else {
      setWrongAnswers((wrongAnswers) => [...wrongAnswers, answer]);
    }
  }, [contrast, showNext]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const parsedKey = parseInt(event.key, 10);
      if (parsedKey >= 1 && parsedKey <= contrastRatios.length) {
        handleAnswer(contrastRatios[parsedKey - 1]);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [contrastRatios, handleAnswer]);

  return (
    <main
      className="min-h-screen p-5 flex flex-col items-center gap-10"
      style={{
        backgroundColor: getCSSColor(backgroundColor),
      }}
    >
      <div className="text-center bg-white px-10 py-4 rounded-lg space-y-2 shadow-lg">
        <h1 className="text-2xl font-semibold">
          Color Contrast Quiz
        </h1>

        <p className="text-lg">Guess the contrast ratio between the text and the background</p>
      </div>

      <div className="grow flex">
        <div className="m-auto text-center max-w-screen-sm" style={{ color: getCSSColor(textColor) }}>
          <p style={{ fontSize: '18pt' }}>{largeText}</p>
          <p>{normalText}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-3 text-center">
        <Tippy singleton={tippySource} theme="light" placement="top" />

        {contrastRatios.map((contrast) => {
          const {
            largeText: largeTextPassLevel,
            normalText: normalTextPassLevel,
          } = contrastRatioPassLevels[contrast];

          const isWrongAnswer = wrongAnswers.includes(contrast);

          return (
            <Tippy
              key={contrast}
              content={
                <div className="text-center">
                  <p>Large text: {largeTextPassLevel}</p>
                  <p>Normal text: {normalTextPassLevel}</p>
                </div>
              }
              singleton={tippyTarget}
            >
              <button
                type="button"
                className="bg-white px-10 py-3 rounded-lg enabled:hover:bg-gray-200 outline-none focus-visible:ring-2 ring-offset-2 ring-white ring-offset-black disabled:opacity-50 transition-all duration-300 shadow-lg"
                style={{
                  cursor: isWrongAnswer ? 'not-allowed' : undefined,
                }}
                disabled={isWrongAnswer}
                onClick={() => handleAnswer(contrast)}
              >
                {getContrastText(contrast)}
              </button>
            </Tippy>
          );
        })}
      </div>
    </main>
  );
};
