const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceCandidates = [
  path.join(__dirname, 'theme', 'root.tsx'),
  path.join(__dirname, 'theme', 'Root.tsx'),
];
const destDir = path.join(repoRoot, 'src', 'theme');
const destPath = path.join(destDir, 'Root.tsx');

const sourcePath = sourceCandidates.find((candidate) => fs.existsSync(candidate));

if (!sourcePath) {
  console.error('No theme/root.tsx or theme/Root.tsx found in sidebarEmoticon.');
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy to keep the original file intact across platforms.
fs.copyFileSync(sourcePath, destPath);

console.log(`Copied ${path.relative(repoRoot, sourcePath)} -> ${path.relative(repoRoot, destPath)}`);
