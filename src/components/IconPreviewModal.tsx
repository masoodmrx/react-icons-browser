import { useMemo, useState } from 'react';
import { Button, ColorPicker, Modal, Slider, Space, Typography } from 'antd';
import type { IconMeta } from '../types';

interface Props {
  icon: IconMeta | null;
  open: boolean;
  onClose: () => void;
}

export function IconPreviewModal({ icon, open, onClose }: Props) {
  const [size, setSize] = useState(96);
  const [color, setColor] = useState('#1677ff');

  const svgMarkup = useMemo(() => {
    if (!icon) return '';
    return `<${icon.name} size={${size}} color=\"${color}\" />`;
  }, [color, icon, size]);

  if (!icon) return null;

  const Icon = icon.component;

  return (
    <Modal title={icon.name} open={open} onCancel={onClose} footer={null} width={700}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', padding: 24, border: '1px solid #f0f0f0', borderRadius: 8 }}>
          <Icon size={size} color={color} />
        </div>
        <Space>
          <Typography.Text>Color:</Typography.Text>
          <ColorPicker value={color} onChange={(c) => setColor(c.toHexString())} />
          <Typography.Text>Size:</Typography.Text>
          <Slider value={size} min={16} max={220} style={{ width: 220 }} onChange={setSize} />
        </Space>
        <Typography.Paragraph copyable>{`import { ${icon.name} } from "${icon.importPath}";`}</Typography.Paragraph>
        <Typography.Paragraph copyable>{`<${icon.name} size={${size}} color="${color}" />`}</Typography.Paragraph>
        <Typography.Paragraph copyable>{svgMarkup}</Typography.Paragraph>
        <Button onClick={() => navigator.clipboard.writeText(svgMarkup)}>Copy SVG-like snippet</Button>
      </Space>
    </Modal>
  );
}
