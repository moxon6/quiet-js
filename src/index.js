import Quiet from './quiet.js';

const importObj = {
  env: {
    __sys_getpid: () => null,
  },
  wasi_snapshot_preview1: {
    proc_exit: () => null,
    clock_time_get: () => null,
    fd_close: () => null,
    fd_write: () => null,
    fd_seek: () => null,
    fd_read: () => null,
  },
};

export default async function createQuiet(audioContext, quietWasm) {
  const instantiate = quietWasm instanceof Promise
    ? WebAssembly.instantiateStreaming
    : WebAssembly.instantiate;

  const { instance } = await instantiate(quietWasm, importObj);
  return new Quiet(audioContext, instance);
}
