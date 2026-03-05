import { Card, Segmented, Slider, Space, Typography } from 'antd';
import type { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
}

export function SettingsPage({ settings, onChange }: Props) {
  return (
    <Card title="Settings">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Typography.Text>Default Icon Size: {settings.defaultSize}px</Typography.Text>
          <Slider
            min={16}
            max={64}
            value={settings.defaultSize}
            onChange={(value) => onChange({ ...settings, defaultSize: value })}
          />
        </div>
        <div>
          <Typography.Text>Theme</Typography.Text>
          <br />
          <Segmented
            value={settings.theme}
            options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]}
            onChange={(value) => onChange({ ...settings, theme: value as AppSettings['theme'] })}
          />
        </div>
        <div>
          <Typography.Text>Grid Density</Typography.Text>
          <br />
          <Segmented
            value={settings.density}
            options={[
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Compact', value: 'compact' }
            ]}
            onChange={(value) => onChange({ ...settings, density: value as AppSettings['density'] })}
          />
        </div>
      </Space>
    </Card>
  );
}
