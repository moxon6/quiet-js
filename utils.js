
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
