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

const NullTerminator = "\0";

const encode = str => new TextEncoder().encode(str + NullTerminator)

export function str2ab(s) {
  const sUtf8 = unescape(encodeURIComponent(s));
  const buf = new ArrayBuffer(sUtf8.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < sUtf8.length; i += 1) {
    bufView[i] = sUtf8.charCodeAt(i);
  }
  return buf;
}

export function allocateArrayOnStack(module, arr) {
  var ret = module.exports.stackAlloc(arr.length);
  const HEAP8 = new Int8Array(module.exports.memory.buffer)
  HEAP8.set(arr, ret);
  return ret;
}

export function allocateStringOnStack(module, string) {
  return allocateArrayOnStack(module, encode(string))
}

export function mallocArray(bufferSize, module) {
  const pointer = module.exports.malloc(4 * bufferSize);
  const HEAPF32 = new Float32Array(module.exports.memory.buffer)
  const view = HEAPF32.subarray(
    (pointer / 4), (pointer / 4) + bufferSize,
  );

  return {
    pointer,
    view,
  };
};