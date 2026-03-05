import type { IconType } from 'react-icons';

export type IconPackKey =
  | 'fa'
  | 'md'
  | 'ai'
  | 'bi'
  | 'bs'
  | 'fi'
  | 'gi'
  | 'hi'
  | 'hi2'
  | 'io'
  | 'io5'
  | 'lu'
  | 'ri'
  | 'si'
  | 'tb';

export interface IconMeta {
  id: string;
  name: string;
  packKey: IconPackKey;
  packName: string;
  importPath: string;
  component: IconType;
}

export interface AppSettings {
  defaultSize: number;
  density: 'comfortable' | 'compact';
  theme: 'light' | 'dark';
}
