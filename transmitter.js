import { resumeIfSuspended, chunkBuffer } from './utils';
import { sampleBufferSize } from './constants';

const NullTerminator = "\0";

const createF32Array = (bufferSize, module) => {
  const pointer = module.exports. malloc(4 * bufferSize);
  const view = module.HEAPF32.subarray(
    (pointer / 4), (pointer / 4) + bufferSize,
  );

  return {
    pointer,
    view,
  };
};

const encode = str => new TextEncoder().encode(str + NullTerminator)

function allocateArrayOnStack(module, arr) {
  var ret = module.exports.stackAlloc(arr.length);
  module.HEAP8.set(arr, ret);
  return ret;
}

function allocateStringOnStack(module, string) {
  return allocateArrayOnStack(module, encode(string))
}

export default class Transmitter {
  constructor(audioContext, module) {
    this.destroyed = false;
    this.audioContext = audioContext;
    this.module = module;
  }

  selectProfile(profile, clampFrame) {
    const stack = this.module.exports.stackSave()

    const cProfiles = allocateStringOnStack(this.module, JSON.stringify({ profile }));
    const cProfile = allocateStringOnStack(this.module, 'profile');

    const opt = this.module.exports.quiet_encoder_profile_str(cProfiles, cProfile);

    this.encoder = this.module.exports.quiet_encoder_create(opt, this.audioContext.sampleRate);
    this.module.exports.free(opt);

    this.frameLength = clampFrame 
      ? this.module.exports.quiet_encoder_clamp_frame_len(this.encoder, sampleBufferSize)
      : this.module.exports.quiet_encoder_get_frame_len(this.encoder);

    this.samples = createF32Array(sampleBufferSize, this.module);
    
    this.module.exports.stackRestore(stack);
    return this;
  }

  async transmit(buf) {
    const stack = this.module.exports.stackSave()

    resumeIfSuspended(this.audioContext);

    const payload = chunkBuffer(buf, this.frameLength);

    let t = this.audioContext.currentTime;
    for (const frame of payload) {
      const audioBuffer = this
        .audioContext
        .createBuffer(1, sampleBufferSize, this.audioContext.sampleRate);
      
      const frameOnStack = allocateArrayOnStack(this.module, new Uint8Array(frame));
      this.module.exports.quiet_encoder_send(this.encoder, frameOnStack, frame.byteLength);
      const written = this.module.exports.quiet_encoder_emit(this.encoder, this.samples.pointer, sampleBufferSize);

      for (let i = written; i < sampleBufferSize; i ++) {
        this.samples.view[i] = 0;
      } 

      audioBuffer.copyToChannel(this.samples.view, 0, 0);
  
      const audioBufferNode = new AudioBufferSourceNode(this.audioContext);
      audioBufferNode.buffer = audioBuffer;
      audioBufferNode.connect(this.audioContext.destination);
      audioBufferNode.start(t);
      t += audioBuffer.duration;
    }
    
    this.module.exports.stackRestore(stack);
    return this;
  }

  destroy() {
    if (!this.destroyed) {
      this.module.exports.free(this.samples.pointer);
      this.module.exports.quiet_encoder_destroy(this.encoder);
      this.destroyed = true;
    }
    return this;
  }
}
