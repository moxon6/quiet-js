import {
  resumeIfSuspended,
  chunkBuffer,
  allocateArrayOnStack,
  allocateStringOnStack,
  mallocArray,
} from './utils';

const sampleBufferSize = 16384;

const waitUntil = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export default class Transmitter {
  constructor(audioContext, instance) {
    this.destroyed = false;
    this.audioContext = audioContext;
    this.instance = instance;
  }

  selectProfile(profile, clampFrame) {
    const stack = this.instance.exports.stackSave();

    const cProfiles = allocateStringOnStack(this.instance, JSON.stringify({ profile }));
    const cProfile = allocateStringOnStack(this.instance, 'profile');

    const opt = this.instance.exports.quiet_encoder_profile_str(cProfiles, cProfile);

    this.encoder = this.instance.exports.quiet_encoder_create(opt, this.audioContext.sampleRate);
    this.instance.exports.free(opt);

    this.frameLength = clampFrame
      ? this.instance.exports.quiet_encoder_clamp_frame_len(this.encoder, sampleBufferSize)
      : this.instance.exports.quiet_encoder_get_frame_len(this.encoder);

    this.samples = mallocArray(sampleBufferSize, this.instance);

    this.instance.exports.stackRestore(stack);
    return this;
  }

  async transmit(buf) {
    const stack = this.instance.exports.stackSave();

    resumeIfSuspended(this.audioContext);

    const payload = chunkBuffer(buf, this.frameLength);

    let t = this.audioContext.currentTime;
    for (const frame of payload) {
      const audioBuffer = this
        .audioContext
        .createBuffer(1, sampleBufferSize, this.audioContext.sampleRate);

      const framePointer = allocateArrayOnStack(this.instance, new Uint8Array(frame));
      this.instance.exports.quiet_encoder_send(this.encoder, framePointer, frame.byteLength);
      const written = this.instance.exports.quiet_encoder_emit(
        this.encoder,
        this.samples.pointer,
        sampleBufferSize,
      );

      for (let i = written; i < sampleBufferSize; i += 1) {
        this.samples.view[i] = 0;
      }

      audioBuffer.copyToChannel(this.samples.view, 0, 0);

      const audioBufferNode = new AudioBufferSourceNode(this.audioContext);
      audioBufferNode.buffer = audioBuffer;
      audioBufferNode.connect(this.audioContext.destination);
      audioBufferNode.start(t);
      t += audioBuffer.duration;
    }

    this.instance.exports.stackRestore(stack);
    await waitUntil(t - this.audioContext.currentTime);
    return this;
  }

  destroy() {
    if (!this.destroyed) {
      this.instance.exports.free(this.samples.pointer);
      this.instance.exports.quiet_encoder_destroy(this.encoder);
      this.destroyed = true;
    }
    return this;
  }
}
