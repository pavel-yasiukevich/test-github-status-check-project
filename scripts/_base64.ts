export const fromBase64 = (text: string) => {
  return Buffer.from(text, 'base64').toString();
}

export const toBase64 = (text: string) => {
  return Buffer.from(text).toString('base64')
}