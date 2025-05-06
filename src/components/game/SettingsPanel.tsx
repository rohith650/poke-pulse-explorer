
import React from 'react';
import { GameSettings, Difficulty } from '@/pages/NumberGuessGame';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

interface SettingsPanelProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  difficulty: Difficulty;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  setSettings,
  difficulty
}) => {
  const handleSwitchChange = (key: keyof GameSettings) => {
    return () => {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };
  };

  const handleNumberChange = (key: keyof GameSettings) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      if (!isNaN(value)) {
        setSettings(prev => ({
          ...prev,
          [key]: value
        }));
      }
    };
  };

  return (
    <Card className="bg-muted/40">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {difficulty === 'custom' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minNumber">Minimum Number</Label>
                  <Input
                    id="minNumber"
                    type="number"
                    value={settings.minNumber}
                    onChange={handleNumberChange('minNumber')}
                    min={1}
                    max={settings.maxNumber - 1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxNumber">Maximum Number</Label>
                  <Input
                    id="maxNumber"
                    type="number"
                    value={settings.maxNumber}
                    onChange={handleNumberChange('maxNumber')}
                    min={settings.minNumber + 1}
                    max={1000}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxAttempts}
                  onChange={handleNumberChange('maxAttempts')}
                  min={1}
                  max={20}
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="timer-toggle">Enable Timer</Label>
            <Switch
              id="timer-toggle"
              checked={settings.timerEnabled}
              onCheckedChange={handleSwitchChange('timerEnabled')}
            />
          </div>

          {settings.timerEnabled && (
            <div className="space-y-2">
              <Label htmlFor="timerSeconds">Time Limit (seconds)</Label>
              <Input
                id="timerSeconds"
                type="number"
                value={settings.timerSeconds}
                onChange={handleNumberChange('timerSeconds')}
                min={10}
                max={300}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle">Enable Sound Effects</Label>
            <Switch
              id="sound-toggle"
              checked={settings.soundEnabled}
              onCheckedChange={handleSwitchChange('soundEnabled')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
