import { writeFile } from 'node:fs/promises';

const packs = [
  ['fa', 'react-icons/fa'],
  ['md', 'react-icons/md'],
  ['ai', 'react-icons/ai'],
  ['bi', 'react-icons/bi'],
  ['bs', 'react-icons/bs'],
  ['fi', 'react-icons/fi'],
  ['gi', 'react-icons/gi'],
  ['hi', 'react-icons/hi'],
  ['hi2', 'react-icons/hi2'],
  ['io', 'react-icons/io'],
  ['io5', 'react-icons/io5'],
  ['lu', 'react-icons/lu'],
  ['ri', 'react-icons/ri'],
  ['si', 'react-icons/si'],
  ['tb', 'react-icons/tb']
];

const metadata = [];
for (const [pack, moduleName] of packs) {
  const mod = await import(moduleName);
  const names = Object.keys(mod).filter((k) => typeof mod[k] === 'function');
  metadata.push({ pack, moduleName, count: names.length, icons: names });
}

await writeFile('icons/metadata.json', JSON.stringify({ generatedAt: new Date().toISOString(), packs: metadata }, null, 2));
console.log('icons/metadata.json generated');
