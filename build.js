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

export default async function wasmGlue(wasmPath) {
  const response = await fetch(wasmPath);
  const { instance } = await WebAssembly.instantiateStreaming(response, importObj);
  return instance;
}
