/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { allocateStringOnStack, mallocArray, decode } from './utils.js';
import RingBuffer from './RingBuffer.js';
import importObject from './importObject.js';

const sampleBufferSize = 16384;

class ReceiverWorklet extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const { quietModule, profile, sampleRate } = options.processorOptions;
    this.quietModule = quietModule;
    this.profile = profile;
    this.sampleRate = sampleRate;
    this.inputRingBuffer = new RingBuffer(sampleBufferSize, 1);
    this.init();
  }

  async init() {
    this.instance = await WebAssembly.instantiate(this.quietModule, importObject);
    await this.selectProfile(this.instance, this.profile);
    return this;
  }

  async selectProfile(instance, profile) {
    const stack = instance.exports.stackSave();

    const cProfiles = allocateStringOnStack(instance, JSON.stringify({ profile }));
    const cProfile = allocateStringOnStack(instance, 'profile');

    const opt = instance.exports.quiet_decoder_profile_str(cProfiles, cProfile);
    this.decoder = instance.exports.quiet_decoder_create(opt, this.sampleRate);
    instance.exports.free(opt);

    this.samples = mallocArray(sampleBufferSize, this.instance);
    this.frame = instance.exports.malloc(sampleBufferSize);

    instance.exports.stackRestore(stack);
    return this;
  }

  process(inputs, outputs) {
    if (!inputs[0].length) {
      return true;
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

registerProcessor('quiet-receiver-worklet', ReceiverWorklet);
