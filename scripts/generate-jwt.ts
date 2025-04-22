import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { sign } from 'jsonwebtoken';

const clientId = ['Iv23liv5r','Zjg3yTacx8x'].join('');

const replaceHome = (path: string) => {
  return path.replace('~', homedir());
}

const run = async () => {
  const keyPath = replaceHome('~/Documents/test-github-status-check-project.2025-04-22.private-key.pem');
  const key = await readFile(keyPath, 'utf8');

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 900;

  const token = sign({
    exp,
    iat,
    iss: clientId,
  }, key, { algorithm: 'RS256' });

  process.stdout.write(token);
};

void run();