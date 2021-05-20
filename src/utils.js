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

const NullTerminator = '\0';

// export const encode = (str) => new TextEncoder().encode(str);

// TODO: Consolidate these

export const encodeForTransmit = (str) => new TextEncoder().encode(str);

export const encode = (str) => str.split('').map((x) => x.charCodeAt(0));

export const decode = (buf) => [...new Uint8Array(buf)].map((x) => String.fromCharCode(x)).join('');

export function allocateArrayOnStack(instance, arr) {
  const ret = instance.exports.stackAlloc(arr.length);
  const HEAP8 = new Int8Array(instance.exports.memory.buffer);
  HEAP8.set(arr, ret);
  return ret;
}

export function allocateStringOnStack(instance, string) {
  return allocateArrayOnStack(instance, encode(string + NullTerminator));
}

export function mallocArray(bufferSize, instance) {
  const pointer = instance.exports.malloc(4 * bufferSize);
  const HEAPF32 = new Float32Array(instance.exports.memory.buffer);
  const view = HEAPF32.subarray(
    (pointer / 4), (pointer / 4) + bufferSize,
  );

  return {
    pointer,
    view,
  };
}
