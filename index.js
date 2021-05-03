import Quiet from './quiet';

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

export default async function(audioContext, quietWasm) {
    const response = await fetch(quietWasm);
    const { instance } = await WebAssembly.instantiateStreaming(response, importObj);
    return new Quiet(audioContext, instance);
}
