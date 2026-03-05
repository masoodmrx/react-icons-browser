import { execSync } from 'node:child_process';

execSync('npm update react-icons', { stdio: 'inherit' });
execSync('node scripts/generate-icons-metadata.mjs', { stdio: 'inherit' });
console.log('react-icons updated and metadata rebuilt.');
