import { useMemo } from 'react';
import Fuse from 'fuse.js';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as HiIcons from 'react-icons/hi';
import * as Hi2Icons from 'react-icons/hi2';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as LuIcons from 'react-icons/lu';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import type { IconMeta, IconPackKey } from '../types';

const PACKS: Array<{
  key: IconPackKey;
  name: string;
  importPath: string;
  prefix: string;
  mod: Record<string, unknown>;
}> = [
  { key: 'fa', name: 'FontAwesome', importPath: 'react-icons/fa', prefix: 'Fa', mod: FaIcons },
  { key: 'md', name: 'Material Design', importPath: 'react-icons/md', prefix: 'Md', mod: MdIcons },
  { key: 'ai', name: 'Ant Design Icons', importPath: 'react-icons/ai', prefix: 'Ai', mod: AiIcons },
  { key: 'bi', name: 'Bootstrap Icons', importPath: 'react-icons/bi', prefix: 'Bi', mod: BiIcons },
  { key: 'bs', name: 'Bootstrap', importPath: 'react-icons/bs', prefix: 'Bs', mod: BsIcons },
  { key: 'fi', name: 'Feather', importPath: 'react-icons/fi', prefix: 'Fi', mod: FiIcons },
  { key: 'gi', name: 'Game Icons', importPath: 'react-icons/gi', prefix: 'Gi', mod: GiIcons },
  { key: 'hi', name: 'Heroicons v1', importPath: 'react-icons/hi', prefix: 'Hi', mod: HiIcons },
  { key: 'hi2', name: 'Heroicons v2', importPath: 'react-icons/hi2', prefix: 'Hi', mod: Hi2Icons },
  { key: 'io', name: 'Ionicons v4', importPath: 'react-icons/io', prefix: 'Io', mod: IoIcons },
  { key: 'io5', name: 'Ionicons v5', importPath: 'react-icons/io5', prefix: 'Io', mod: Io5Icons },
  { key: 'lu', name: 'Lucide', importPath: 'react-icons/lu', prefix: 'Lu', mod: LuIcons },
  { key: 'ri', name: 'Remix Icon', importPath: 'react-icons/ri', prefix: 'Ri', mod: RiIcons },
  { key: 'si', name: 'Simple Icons', importPath: 'react-icons/si', prefix: 'Si', mod: SiIcons },
  { key: 'tb', name: 'Tabler Icons', importPath: 'react-icons/tb', prefix: 'Tb', mod: TbIcons }
];

const allIcons: IconMeta[] = PACKS.flatMap((pack) =>
  Object.entries(pack.mod)
    .filter(([name, value]) => name.startsWith(pack.prefix) && typeof value === 'function')
    .map(([name, component]) => ({
      id: `${pack.key}:${name}`,
      name,
      packKey: pack.key,
      packName: pack.name,
      importPath: pack.importPath,
      component: component as IconMeta['component']
    }))
);

export function useIconCatalog(query: string, selectedPack: IconPackKey | 'all') {
  const fuse = useMemo(
    () =>
      new Fuse(allIcons, {
        keys: ['name', 'packName'],
        threshold: 0.25,
        ignoreLocation: true
      }),
    []
  );

  const icons = useMemo(() => {
    let base = allIcons;
    if (selectedPack !== 'all') {
      base = allIcons.filter((icon) => icon.packKey === selectedPack);
    }

    if (!query.trim()) return base;

    if (selectedPack === 'all') {
      return fuse.search(query).map((item) => item.item);
    }

    const scopedFuse = new Fuse(base, { keys: ['name', 'packName'], threshold: 0.25, ignoreLocation: true });
    return scopedFuse.search(query).map((item) => item.item);
  }, [fuse, query, selectedPack]);

  const packStats = useMemo(
    () =>
      PACKS.map((pack) => ({
        ...pack,
        count: allIcons.filter((icon) => icon.packKey === pack.key).length
      })),
    []
  );

  return { icons, packStats, totalCount: allIcons.length };
}
