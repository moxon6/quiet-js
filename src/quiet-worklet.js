/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { allocateStringOnStack, mallocArray, decode } from './utils.js';
import RingBuffer from './RingBuffer.js';

const sampleBufferSize = 16384;

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
    const { bytes, profile, sampleRate } = options.processorOptions;
    this.sampleRate = sampleRate;
    this.hasLoaded = WebAssembly.instantiate(bytes, importObject)
      .then(({ instance }) => {
        this.instance = instance;
        this.selectProfile(instance, profile);
      });
    this.inputRingBuffer = new RingBuffer(sampleBufferSize, 1);
  }

  async selectProfile(instance, profile) {
    const stack = instance.exports.stackSave();

    const cProfiles = allocateStringOnStack(instance, JSON.stringify({ profile }));
    const cProfile = allocateStringOnStack(instance, 'profile');

    const opt = instance.exports.quiet_decoder_profile_str(cProfiles, cProfile);
    this.decoder = instance.exports.quiet_decoder_create(opt, this.sampleRate);
    instance.exports.free(opt);

    instance.exports.stackRestore(stack);
    this.samples = mallocArray(sampleBufferSize, this.instance);
    this.frame = instance.exports.malloc(sampleBufferSize);

    return this;
  }

  process(inputs, outputs) {
    if (!inputs[0].length) {
      return false;
    }
    const input = inputs[0];
    const output = outputs[0][0];

    this.inputRingBuffer.push([...input]);

    if (this.inputRingBuffer.framesAvailable >= sampleBufferSize) {
      this.inputRingBuffer.pull([this.samples.view]);

      this.bufferIndex = 0;
      this.instance.exports.quiet_decoder_consume(
        this.decoder, this.samples.pointer, sampleBufferSize,
      );

      const read = this.instance.exports.quiet_decoder_recv(
        this.decoder, this.frame, sampleBufferSize,
      );

      if (read !== -1) {
        const HEAPU8 = new Int8Array(this.instance.exports.memory.buffer);

        const slice = HEAPU8.slice(this.frame, this.frame + read);
        const value = decode(slice.buffer);
        this.port.postMessage({
          type: 'payload',
          value,
        });
      }
    }

    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] = 1;
      }
    });

    return true;
  }
}

registerProcessor('quiet-processor-node', WhiteNoiseProcessor);
