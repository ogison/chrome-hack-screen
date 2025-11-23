#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'manifest.json');

try {
  // Read and parse manifest
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);

  // Validation checks
  const errors = [];
  const warnings = [];

  // Required fields
  if (!manifest.manifest_version) {
    errors.push('manifest_version is required');
  } else if (manifest.manifest_version !== 3) {
    warnings.push('manifest_version 3 is recommended');
  }

  if (!manifest.name) {
    errors.push('name is required');
  }

  if (!manifest.version) {
    errors.push('version is required');
  } else if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    warnings.push('version should follow semver format (e.g., 1.0.0)');
  }

  // Check icon files exist
  if (manifest.action && manifest.action.default_icon) {
    const icons = manifest.action.default_icon;
    for (const [size, iconPath] of Object.entries(icons)) {
      const fullPath = path.join(__dirname, '..', iconPath);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Icon file not found: ${iconPath}`);
      }
    }
  }

  // Check background service worker exists
  if (manifest.background && manifest.background.service_worker) {
    const swPath = path.join(__dirname, '..', manifest.background.service_worker);
    if (!fs.existsSync(swPath)) {
      errors.push(`Service worker not found: ${manifest.background.service_worker}`);
    }
  }

  // Check options page exists
  if (manifest.options_page) {
    const optionsPath = path.join(__dirname, '..', manifest.options_page);
    if (!fs.existsSync(optionsPath)) {
      errors.push(`Options page not found: ${manifest.options_page}`);
    }
  }

  // Output results
  console.log('Manifest Validation Results:');
  console.log('============================\n');

  if (errors.length > 0) {
    console.error('❌ Errors:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Warnings:');
    warnings.forEach(warn => console.warn(`  - ${warn}`));
  }

  console.log('✅ Manifest is valid!');
  process.exit(0);

} catch (error) {
  console.error('❌ Failed to validate manifest:');
  console.error(error.message);
  process.exit(1);
}
