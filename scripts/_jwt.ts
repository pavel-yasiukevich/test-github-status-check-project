import { createSign } from 'node:crypto';

import { fromBase64, toBase64 } from './_base64.ts';

export const signJWT = (payload: unknown, privateKey: string) => {
  const jwtAlg = toBase64(JSON.stringify({
    alg: 'RS256',
    typ: 'JWT',
  }));

  const jwtPayload = toBase64(JSON.stringify(payload));

  const jwtSignature = createSign('SHA256')
    .update(`${jwtAlg}.${jwtPayload}`)
    .sign(fromBase64(privateKey), 'base64')

  return `${jwtAlg}.${jwtPayload}.${jwtSignature}`;
}