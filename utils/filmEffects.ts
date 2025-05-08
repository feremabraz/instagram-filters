import { createNoise2D } from 'simplex-noise';

export interface EffectSettings {
  grain: number;
  vignette: number;
  lightLeak: number;
  brightness: number;
  contrast: number;
  temperature: number;
  vibrance: number;
}

export const applyFilmEffects = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: EffectSettings
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const noise2D = createNoise2D();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;

      // Apply grain
      const noise = noise2D(x / 2, y / 2) * 0.5 + 0.5;
      const grainValue = noise * settings.grain * 255;

      // Apply vignette
      const distX = x / width - 0.5;
      const distY = y / height - 0.5;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const vignette = 1 - dist * settings.vignette * 2;

      // Apply light leak (simple implementation)
      const leakIntensity = Math.max(0, 1 - y / height - 0.2) * settings.lightLeak;

      // Apply effects
      for (let c = 0; c < 3; c++) {
        let value = data[i + c];

        // Grain
        value += grainValue;

        // Vignette
        value *= vignette;

        // Light leak
        value += (255 - value) * leakIntensity;

        // Brightness
        value += settings.brightness * 255;

        // Contrast
        value = ((value / 255 - 0.5) * (settings.contrast + 1) + 0.5) * 255;

        // Temperature (simple implementation)
        if (c === 0) value += (settings.temperature - 6500) / 100;
        if (c === 2) value -= (settings.temperature - 6500) / 100;

        // Vibrance (simple implementation)
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        value += (value - avg) * settings.vibrance;

        data[i + c] = Math.max(0, Math.min(255, value));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};
