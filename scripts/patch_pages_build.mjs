import fs from 'node:fs';
import path from 'node:path';

const workerConfigPath = path.join(process.cwd(), 'dist', '_worker.js', 'wrangler.json');

if (!fs.existsSync(workerConfigPath)) {
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(workerConfigPath, 'utf8'));

delete config.assets;
delete config.kv_namespaces;

fs.writeFileSync(workerConfigPath, `${JSON.stringify(config)}\n`, 'utf8');
console.log(workerConfigPath);
