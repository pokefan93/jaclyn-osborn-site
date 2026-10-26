import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const productionOrigin = 'https://authorjaclynosborn.com';
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this deployment with npm run deploy.');

function run(script, args, env = process.env) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: root, stdio: 'inherit', env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(npmCli, ['run', 'build'], { ...process.env, SITE_URL: productionOrigin });
const configPath = path.join(root, 'dist/_worker.js/wrangler.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
assert.equal(config.name, 'jaclyn-osborn-site', 'Unexpected production Worker.');
const entry = fs.readFileSync(path.resolve(path.dirname(configPath), config.main), 'utf8');
const builtSites = [...entry.matchAll(/(?:["']site["']|\bsite)\s*:\s*["']([^"']+)["']/g)].map(match => match[1]);
assert.deepEqual(builtSites, [productionOrigin], 'Refusing to deploy a build with the wrong canonical hostname.');
console.log('Verified production hostname and generated Worker configuration.');
run(path.join(root, 'node_modules/wrangler/bin/wrangler.js'), ['deploy', '--config', configPath]);
