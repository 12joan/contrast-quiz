export const getComplementaryLuminances = (
  luminanceA: number,
  contrast: number
): number[] => {
  const luminanceAPlus = luminanceA + 0.05;

  const luminanceBPlus1 = luminanceAPlus / contrast;
  const luminanceBPlus2 = luminanceAPlus * contrast;

  const luminanceB1 = luminanceBPlus1 - 0.05;
  const luminanceB2 = luminanceBPlus2 - 0.05;

  return [luminanceB1, luminanceB2].filter(
    (luminance) => luminance >= 0 && luminance <= 1
  );
};
