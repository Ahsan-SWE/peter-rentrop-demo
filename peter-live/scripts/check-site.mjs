import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = (await readdir(root)).filter((name) => name.endsWith('.html'));
const errors = [];
for (const file of htmlFiles) {
  const text = await readFile(path.join(root, file), 'utf8');
  for (const required of ['<!doctype html>', '<html lang="en">', '<head>', '<body', 'site-header-shell', 'site-footer-shell', 'id="main-content"']) {
    if (!text.toLowerCase().includes(required.toLowerCase())) errors.push(`${file}: missing ${required}`);
  }
  const linkPattern = /(?:href|src)="([^"]+)"/g;
  for (const match of text.matchAll(linkPattern)) {
    const ref = match[1];
    if (/^(?:https?:|data:|mailto:|tel:|#)/.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    try { await stat(path.join(root, clean)); } catch { errors.push(`${file}: broken local reference ${ref}`); }
  }
  for (const match of text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${file}: invalid JSON-LD (${error.message})`); }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Checked ${htmlFiles.length} HTML files: all local links and JSON-LD are valid.`);
