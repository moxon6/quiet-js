export const total = (arr) => arr.reduce((a, b) => a + b, 0);
export const mean = (arr) => total(arr) / arr.length;

/**
  * Convert a string to array buffer in UTF8
  * @function str2ab
  * @memberof Quiet
  * @param {string} s - string to be converted
  * @returns {ArrayBuffer} buf - converted arraybuffer
*/
export function str2ab(s) {
  const sUtf8 = unescape(encodeURIComponent(s));
  const buf = new ArrayBuffer(sUtf8.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < sUtf8.length; i += 1) {
    bufView[i] = sUtf8.charCodeAt(i);
  }
  return buf;
}

/**
 * Merge 2 ArrayBuffers
 * This is a convenience function to assist user receiver functions that
 * want to aggregate multiple payloads.
 * @function mergeab
 * @memberof Quiet
 * @param {ArrayBuffer} ab1 - beginning ArrayBuffer
 * @param {ArrayBuffer} ab2 - ending ArrayBuffer
 * @returns {ArrayBuffer} buf - ab1 merged with ab2
*/
export function mergeab(ab1, ab2) {
  const tmp = new Uint8Array(ab1.byteLength + ab2.byteLength);
  tmp.set(new Uint8Array(ab1), 0);
  tmp.set(new Uint8Array(ab2), ab1.byteLength);
  return tmp.buffer;
}

/**
 * Convert an array buffer in UTF8 to string
 * @function ab2str
 * @memberof Quiet
 * @param {ArrayBuffer} ab - array buffer to be converted
 * @returns {string} s - converted string
 */
export function ab2str(ab) {
  return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(ab))));
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
