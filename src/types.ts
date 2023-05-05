export type Color = [number, number, number];
export type PassLevel = 'fail' | 'pass' | 'good';

export type QuizData = {
  contrast: number;
  backgroundColor: Color;
  textColor: Color;
};
