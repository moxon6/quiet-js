export const total = (arr) => arr.reduce((a, b) => a + b, 0);

export const mean = (arr) => total(arr) / arr.length;

export function str2ab(s) {
  const sUtf8 = unescape(encodeURIComponent(s));
  const buf = new ArrayBuffer(sUtf8.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < sUtf8.length; i += 1) {
    bufView[i] = sUtf8.charCodeAt(i);
  }
  return buf;
}

export function resumeIfSuspended(audioCtx) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function chunkBuffer(buffer, chunkSize) {
  const res = [];
  for (let i = 0; i < buffer.byteLength; i += chunkSize) {
    const frame = buffer.slice(i, i + chunkSize);
    res.push(frame);
  }
  return res;
}
