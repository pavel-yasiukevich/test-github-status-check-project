import { spawnSync } from 'node:child_process';

const { GITHUB_BASE_REF = 'main' } = process.env;

const proc = spawnSync(`git`, [
  'log',
  GITHUB_BASE_REF + '..HEAD',
  '--oneline',
  '--pretty=format:%s',
]);

const commits = proc.stdout.toString().split('\n');

const reported: unknown[] = [];

for (const caption of commits) {
  const errors = [];
  const warnings = [];

  reported.push({ caption, errors, warnings });
}

process.stdout.write(JSON.stringify(reported, null, 2));
