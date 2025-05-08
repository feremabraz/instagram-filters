'use client';

import React, { useRef, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { motion } from 'motion/react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applyFilmEffects, type EffectSettings } from '../utils/filmEffects';
import {
  settingsAtom,
  selectedPresetAtom,
  imageUrlAtom,
  presets,
  applyPresetAtom,
  updateSettingAtom,
  isCustomPresetAtom,
} from '../atoms/filterAtoms';

export default function EnhancedFilmEmulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings] = useAtom(settingsAtom);
  const [selectedPreset] = useAtom(selectedPresetAtom);
  const imageUrl = useAtomValue(imageUrlAtom);
  const isCustomPreset = useAtomValue(isCustomPresetAtom);
  const [, applyPreset] = useAtom(applyPresetAtom);
  const [, updateSetting] = useAtom(updateSettingAtom);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyEffects();
    };
  }, [imageUrl]);

  const applyEffects = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      applyFilmEffects(ctx, canvas.width, canvas.height, settings);
    };
  }, [settings, imageUrl]);

  useEffect(() => {
    applyEffects();
  }, [applyEffects]);

  const handleSettingChange = (setting: keyof EffectSettings, value: number) => {
    updateSetting({ setting, value });
  };

  const handlePresetChange = (preset: string) => {
    applyPreset(preset);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto">
      <motion.div
        className="w-full md:w-3/5 border-2 border-border rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <canvas ref={canvasRef} className="w-full h-auto" />
      </motion.div>
      <Card className="w-full md:w-2/5">
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="preset-select" className="mb-2 block">
              Preset
            </Label>
            <Select onValueChange={handlePresetChange} value={selectedPreset}>
              <SelectTrigger id="preset-select">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(presets).map((preset) => (
                  <SelectItem key={preset} value={preset}>
                    {preset}
                  </SelectItem>
                ))}
                {isCustomPreset && <SelectItem value="Custom">Custom</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key} className="mb-2 block">
                {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                {key === 'temperature' ? value.toFixed(0) : value.toFixed(2)}
              </Label>
              <Slider
                id={key}
                min={key === 'temperature' ? 2000 : 0}
                max={key === 'temperature' ? 15000 : 1}
                step={key === 'temperature' ? 100 : 0.01}
                value={[value]}
                onValueChange={([newValue]) =>
                  handleSettingChange(key as keyof EffectSettings, newValue)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
