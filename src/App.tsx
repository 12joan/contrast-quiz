import { useState, useEffect, useCallback } from 'react';
import Tippy, { useSingleton } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { contrastRatios } from './common';
import { getCSSColor } from './getCSSColor';
import { PassLevel } from './types';
import { useQuizData } from './useQuizData';

const contrastRatioPassLevels: Record<number, {
  largeText: PassLevel;
  normalText: PassLevel;
}> = {
  1.5: { largeText: 'fail', normalText: 'fail' },
  3: { largeText: 'pass', normalText: 'fail' },
  4.5: { largeText: 'good', normalText: 'pass' },
  7: { largeText: 'good', normalText: 'good' },
};

export const App = () => {
  const {
    contrast,
    backgroundColor,
    textColor,
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
  }, [handleAnswer]);

  return (
    <main
      className="min-h-screen p-5 flex flex-col items-center gap-10 transition-colors duration-300"
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
        <div
          className="m-auto text-center max-w-screen-sm transition-colors duration-300"
          style={{ color: getCSSColor(textColor) }}
        >
          <p style={{ fontSize: '18pt' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
          <p>
            In eu posuere lectus. Quisque sollicitudin augue sit amet orci ullamcorper sagittis. Praesent facilisis vel turpis vitae sodales. Nunc et turpis arcu. Nulla malesuada nisi urna, nec tempus sem lobortis vel. Donec mollis elementum porttitor. Praesent id eros sed purus vehicula lacinia. Fusce sem lectus, varius vel lorem nec, scelerisque malesuada est. Maecenas mollis ultricies turpis, non bibendum erat condimentum non. Nam facilisis neque vitae tempus vestibulum. Mauris quam nulla, finibus a libero ut, tristique euismod sapien.
          </p>
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
                {`${contrast}:1`}
              </button>
            </Tippy>
          );
        })}
      </div>
    </main>
  );
};
