#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const version = manifest.version;
const outputDir = path.join(__dirname, '..', 'dist');
const outputFile = path.join(outputDir, `chrome-hack-screen-v${version}.zip`);

// Create dist directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create archive
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`✅ Package created: ${outputFile}`);
  console.log(`📦 Total bytes: ${archive.pointer()}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Files and directories to include
const filesToInclude = [
  'manifest.json',
  'background.js',
  'content.js',
  'animations/**/*',
  'assets/**/*',
  'options/**/*',
  'utils/**/*'
];

// Files to exclude
const filesToExclude = [
  '**/*.md',
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/.github/**',
  '**/scripts/**',
  '**/package.json',
  '**/package-lock.json',
  '**/.eslintrc.json',
  '**/.gitignore',
  '**/create_icons.py',
  '**/IMPLEMENTATION_PLAN.md',
  '**/SPECIFICATION.md',
  '**/Claude.md',
  '**/Agents.md'
];

console.log('📦 Creating package...');

// Add files
filesToInclude.forEach(pattern => {
  if (pattern.includes('**')) {
    // Glob pattern
    const baseDir = pattern.split('/**')[0];
    if (fs.existsSync(baseDir)) {
      archive.directory(baseDir, baseDir);
    }
  } else {
    // Single file
    if (fs.existsSync(pattern)) {
      archive.file(pattern, { name: pattern });
    }
  }
});

archive.finalize();
