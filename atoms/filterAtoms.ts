import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import type { EffectSettings } from '../utils/filmEffects';

// Default settings
export const defaultSettings: EffectSettings = {
  grain: 0,
  vignette: 0,
  lightLeak: 0,
  brightness: 0,
  contrast: 0,
  temperature: 6500,
  vibrance: 0,
};

// Presets
export const presets: Record<string, EffectSettings> = {
  None: defaultSettings,
  '31337 Color 200': {
    grain: 0.1,
    vignette: 0.1,
    lightLeak: 0.05,
    brightness: 0.05,
    contrast: 0.1,
    temperature: 6700,
    vibrance: 0.2,
  },
  'Superior X-tra 800': {
    grain: 0.1,
    vignette: 0.2,
    lightLeak: 0.1,
    brightness: -0.05,
    contrast: 0.2,
    temperature: 6300,
    vibrance: 0.3,
  },
};

// Primary atoms
export const settingsAtom = atomWithReset<EffectSettings>(defaultSettings);
export const selectedPresetAtom = atom<string>('None');
export const imageUrlAtom = atom<string>(
  'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?q=80&w=600'
);

// Derived atoms
export const isCustomPresetAtom = atom((get) => {
  const selectedPreset = get(selectedPresetAtom);
  return selectedPreset === 'Custom';
});

// Actions
export const applyPresetAtom = atom(null, (_, set, presetName: string) => {
  set(selectedPresetAtom, presetName);
  if (presetName !== 'Custom') {
    set(settingsAtom, presets[presetName]);
  }
});

export const updateSettingAtom = atom(
  null,
  (_, set, payload: { setting: keyof EffectSettings; value: number }) => {
    const { setting, value } = payload;

    // Update the setting
    set(settingsAtom, (currentSettings) => ({
      ...currentSettings,
      [setting]: value,
    }));

    // If we're modifying a preset, we change to Custom
    set(selectedPresetAtom, 'Custom');
  }
);

// Helper to reset all settings
export const resetSettingsAtom = atom(null, (_, set) => {
  set(settingsAtom, defaultSettings);
  set(selectedPresetAtom, 'None');
});
