import { useMemo, useState } from 'react';
import { Badge, ConfigProvider, Input, Layout, List, Pagination, Segmented, Space, Switch, Tabs, Typography, theme } from 'antd';
import { useIconCatalog } from './hooks/useIconCatalog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMeasure } from './hooks/useMeasure';
import type { AppSettings, IconMeta, IconPackKey } from './types';
import { IconGrid } from './components/IconGrid';
import { IconPreviewModal } from './components/IconPreviewModal';
import { SettingsPage } from './pages/SettingsPage';

const { Header, Sider, Content } = Layout;

const defaultSettings: AppSettings = {
  defaultSize: 28,
  density: 'comfortable',
  theme: 'light'
};

const PAGE_SIZE = 240;

export default function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('rib.settings', defaultSettings);
  const [favorites, setFavorites] = useLocalStorage<string[]>('rib.favorites', []);
  const [query, setQuery] = useState('');
  const [pack, setPack] = useState<IconPackKey | 'all'>('all');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIcon, setSelectedIcon] = useState<IconMeta | null>(null);

  const { icons, packStats, totalCount } = useIconCatalog(query, pack);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const sourceIcons = activeTab === 'favorites' ? icons.filter((icon) => favoriteSet.has(icon.id)) : icons;
  const pageIcons = sourceIcons.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const { ref, size } = useMeasure<HTMLDivElement>();

  const toggleFavorite = (icon: IconMeta) => {
    setFavorites((prev) =>
      prev.includes(icon.id) ? prev.filter((id) => id !== icon.id) : [...prev, icon.id]
    );
  };

  return (
    <ConfigProvider theme={{ algorithm: settings.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout style={{ height: '100vh' }}>
        <Sider width={260} theme={settings.theme}>
          <div style={{ padding: 16 }}>
            <Typography.Title level={4} style={{ marginTop: 0, color: '#fff' }}>
              React Icons Browser
            </Typography.Title>
            <Typography.Text style={{ color: '#bbb' }}>Total: {totalCount}</Typography.Text>
          </div>
          <List
            size="small"
            dataSource={[{ key: 'all', name: 'All Packs', count: totalCount }, ...packStats.map((p) => ({ key: p.key, name: p.name, count: p.count }))]}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  setPack(item.key as IconPackKey | 'all');
                  setPage(1);
                }}
                style={{
                  cursor: 'pointer',
                  padding: '10px 16px',
                  background: pack === item.key ? 'rgba(255,255,255,0.18)' : 'transparent',
                  color: '#fff'
                }}
              >
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <span>{item.name}</span>
                  <Badge count={item.count} />
                </Space>
              </List.Item>
            )}
          />
        </Sider>
        <Layout>
          <Header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="Search icon name or pack"
              allowClear
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              style={{ maxWidth: 420 }}
            />
            <Segmented
              value={settings.defaultSize}
              options={[20, 24, 28, 32, 36].map((n) => ({ label: `${n}px`, value: n }))}
              onChange={(v) => setSettings({ ...settings, defaultSize: Number(v) })}
            />
            <Space>
              <Typography.Text style={{ color: '#fff' }}>Dark</Typography.Text>
              <Switch
                checked={settings.theme === 'dark'}
                onChange={(checked) => setSettings({ ...settings, theme: checked ? 'dark' : 'light' })}
              />
            </Space>
          </Header>
          <Content style={{ padding: 16 }}>
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key);
                setPage(1);
              }}
              items={[
                { key: 'all', label: 'Icons' },
                { key: 'favorites', label: `Favorites (${favorites.length})` },
                { key: 'settings', label: 'Settings' }
              ]}
            />
            {activeTab === 'settings' ? (
              <SettingsPage settings={settings} onChange={setSettings} />
            ) : (
              <>
                <div ref={ref} style={{ height: 'calc(100vh - 230px)' }}>
                  {size.width > 0 && (
                    <IconGrid
                      icons={pageIcons}
                      width={size.width}
                      height={size.height}
                      iconSize={settings.defaultSize}
                      density={settings.density}
                      favorites={favoriteSet}
                      onFavoriteToggle={toggleFavorite}
                      onOpen={setSelectedIcon}
                    />
                  )}
                </div>
                <Pagination
                  style={{ marginTop: 12, textAlign: 'center' }}
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={sourceIcons.length}
                  onChange={setPage}
                  showSizeChanger={false}
                />
              </>
            )}
          </Content>
        </Layout>
      </Layout>
      <IconPreviewModal icon={selectedIcon} open={Boolean(selectedIcon)} onClose={() => setSelectedIcon(null)} />
    </ConfigProvider>
  );
}
