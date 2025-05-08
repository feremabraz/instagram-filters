'use client';

import React, { useRef, useEffect, useState } from 'react';
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

const defaultSettings: EffectSettings = {
  grain: 0,
  vignette: 0,
  lightLeak: 0,
  brightness: 0,
  contrast: 0,
  temperature: 6500,
  vibrance: 0,
};

const presets: Record<string, EffectSettings> = {
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

export default function EnhancedFilmEmulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState<EffectSettings>(defaultSettings);
  const [selectedPreset, setSelectedPreset] = useState('None');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?q=80&w=600';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      applyEffects();
    };
  }, []);

  const applyEffects = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.unsplash.com/photo-1512813498716-3e640fed3f39?q=80&w=600';

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      applyFilmEffects(ctx, canvas.width, canvas.height, settings);
    };
  }, [settings]);

  useEffect(() => {
    applyEffects();
  }, [applyEffects]);

  const handleSettingChange = (setting: keyof EffectSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
    setSelectedPreset('Custom');
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    setSettings(presets[preset]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <canvas ref={canvasRef} className="w-full h-auto rounded-lg shadow-lg mb-4" />
        </motion.div>
        <div className="mb-4">
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
              {selectedPreset === 'Custom' && <SelectItem value="Custom">Custom</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="mb-4">
            <Label htmlFor={key} className="mb-2 block">
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value.toFixed(2)}
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
  );
}
