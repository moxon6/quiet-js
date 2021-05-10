export default {
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
