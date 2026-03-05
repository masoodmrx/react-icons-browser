import { memo } from 'react';
import { Button, Card, Space, Tooltip, Typography } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { FixedSizeGrid as Grid, type GridChildComponentProps } from 'react-window';
import type { IconMeta } from '../types';

interface Props {
  icons: IconMeta[];
  width: number;
  height: number;
  iconSize: number;
  density: 'comfortable' | 'compact';
  favorites: Set<string>;
  onFavoriteToggle: (icon: IconMeta) => void;
  onOpen: (icon: IconMeta) => void;
}

interface ItemData {
  icons: IconMeta[];
  columnCount: number;
  iconSize: number;
  rowHeight: number;
  favorites: Set<string>;
  onFavoriteToggle: (icon: IconMeta) => void;
  onOpen: (icon: IconMeta) => void;
}

const IconCell = memo(({ columnIndex, rowIndex, style, data }: GridChildComponentProps<ItemData>) => {
  const idx = rowIndex * data.columnCount + columnIndex;
  const icon = data.icons[idx];

  if (!icon) return null;

  const Icon = icon.component;
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div style={{ ...style, padding: 8 }}>
      <Card
        hoverable
        size="small"
        styles={{ body: { padding: 10 } }}
        onClick={() => data.onOpen(icon)}
        actions={[
          <Tooltip title="Copy import" key="import">
            <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); copy(`import { ${icon.name} } from \"${icon.importPath}\";`); }}>JSX</Button>
          </Tooltip>,
          <Tooltip title="Copy usage" key="usage">
            <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); copy(`<${icon.name} />`); }}>Use</Button>
          </Tooltip>,
          <Tooltip title="Copy icon name" key="name">
            <Button type="link" size="small" onClick={(e) => { e.stopPropagation(); copy(icon.name); }}>Name</Button>
          </Tooltip>
        ]}
      >
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Icon size={data.iconSize} />
          <Typography.Text ellipsis style={{ maxWidth: 150 }}>
            {icon.name}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {icon.packName}
          </Typography.Text>
          <Button
            icon={data.favorites.has(icon.id) ? <StarFilled /> : <StarOutlined />}
            size="small"
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              data.onFavoriteToggle(icon);
            }}
          >
            Favorite
          </Button>
        </Space>
      </Card>
    </div>
  );
});

export function IconGrid({ icons, width, height, iconSize, density, favorites, onFavoriteToggle, onOpen }: Props) {
  const minCardWidth = density === 'compact' ? 170 : 210;
  const columnCount = Math.max(1, Math.floor(width / minCardWidth));
  const rowHeight = density === 'compact' ? 200 : 240;
  const rowCount = Math.ceil(icons.length / columnCount);

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={Math.floor(width / columnCount)}
      height={height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width={width}
      itemData={{ icons, columnCount, iconSize, rowHeight, favorites, onFavoriteToggle, onOpen }}
    >
      {IconCell}
    </Grid>
  );
}
