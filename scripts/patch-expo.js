#!/usr/bin/env node
/**
 * postinstall patch: Fix Expo SDK 57 + Node 22 compatibility
 *
 * expo-modules-core v57 ships .ts source files as its package entry point.
 * Node 22's experimental type stripping refuses to process node_modules.
 * This script patches the exports field to use the compiled JS entry instead.
 *
 * Run automatically after `npm install`.
 */
const fs = require('fs');
const path = require('path');

const PATCHES = [
  {
    file: 'node_modules/expo-modules-core/package.json',
    fix(pkg) {
      // Override the exports field to point to compiled JS
      pkg.main = 'index.js';
      pkg.exports = {
        './package.json': './package.json',
        '.': {
          types: './build/index.d.ts',
          default: './index.js',
        },
        './types': './types.d.ts',
      };
      return pkg;
    },
  },
];

let patched = 0;
for (const { file, fix } of PATCHES) {
  const fp = path.join(process.cwd(), file);
  if (!fs.existsSync(fp)) continue;
  const pkg = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const fixed = fix(pkg);
  fs.writeFileSync(fp, JSON.stringify(fixed, null, 2) + '\n');
  patched++;
}

if (patched > 0) {
  console.log(`✅ Patched ${patched} package(s) for Node 22 compatibility`);
}
