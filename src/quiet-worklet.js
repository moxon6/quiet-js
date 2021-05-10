/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

const importObject = {
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

class WhiteNoiseProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.port.onmessage = (...args) => this.onMessage(...args);
    const { bytes } = options.processorOptions;
    const { instance } = WebAssembly.instantiate(bytes, importObject);
    this.instance = instance;
  }

  async onMessage(e) {
    if (e.data.loadWasm) {
      console.log(`Received from ${e.data.loadWasm}`);
    }
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] = 1;
      }
    });
    return true;
  }
}

registerProcessor('white-noise-processor', WhiteNoiseProcessor);
