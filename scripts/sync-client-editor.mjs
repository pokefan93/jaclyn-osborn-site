import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Keep the standalone login on the same reviewed web editor implementation.
// Run after changing the TTS portal: node scripts/sync-client-editor.mjs [portal.html]
const root = fileURLToPath(new URL('../', import.meta.url));
const source = process.argv[2] || path.resolve(root, '../taylorstechsolutions/portal.html');
let html = fs.readFileSync(source, 'utf8');
function replace(from, to) {
  if (!html.includes(from)) throw new Error('Editor source changed: ' + from);
  html = html.replace(from, to);
}
replace('<html lang="en">', '<html lang="en" data-site-editor="jaclyn">');
replace('<title>Client Portal | Taylor\'s Tech Solutions</title>', '<title>Site editor | Jaclyn Osborn</title>');
replace('Taylor&apos;s Tech Solutions</a>', 'Jaclyn Osborn</a>');
replace('<span class="pill">Client Portal</span>', '<span class="pill">Site editor</span>');
replace('Sign in to your Taylor&apos;s Tech Solutions client account.', 'Sign in to update your books and website. Use your existing client account.');
replace('Client login for Taylor\'s Tech Solutions.', 'Private website editor for Jaclyn Osborn.');
html = html.replaceAll('href="images/logo-icon.png"', 'href="/favicon.svg"');
fs.mkdirSync(path.join(root, 'src/editor'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/editor/portal.html'), html.trimEnd() + (html.includes('\r\n') ? '\r\n' : '\n'));
console.log('Shared client editor synced.');
