#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname);
const sourceCandidates = [
  path.join(packageRoot, 'theme', 'root.tsx'),
  path.join(packageRoot, 'theme', 'Root.tsx'),
];

const consumerRoot = process.cwd();
const destDir = path.join(consumerRoot, 'src', 'theme');
const destPath = path.join(destDir, 'Root.tsx');

const sourcePath = sourceCandidates.find((candidate) => fs.existsSync(candidate));

if (!sourcePath) {
  console.error('No theme/root.tsx or theme/Root.tsx found in this package.');
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy to keep the original file intact across platforms.
fs.copyFileSync(sourcePath, destPath);

console.log(`Copied ${path.relative(consumerRoot, sourcePath)} -> ${path.relative(consumerRoot, destPath)}`);
