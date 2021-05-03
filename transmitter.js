import { resumeIfSuspended, chunkBuffer } from './utils';
import { sampleBufferSize } from './constants';

const NullTerminator = "\0";

const createF32Array = (bufferSize, quietInterop) => {
  const pointer = quietInterop.malloc(4 * bufferSize);
  const view = quietInterop.subArray(
    (pointer / 4), (pointer / 4) + bufferSize,
  );

  return {
    pointer,
    view,
  };
};

const encode = str => new TextEncoder().encode(str + NullTerminator)

function allocateArrayOnStack(module, arr) {
  var ret = module.stackAlloc(arr.length);
  module.HEAP8.set(arr, ret);
  return ret;
}

function allocateStringOnStack(module, string) {
  return allocateArrayOnStack(module, encode(string))
}

export default class Transmitter {
  constructor(audioContext, quietInterop) {
    this.destroyed = false;
    this.audioContext = audioContext;
    this.quietInterop = quietInterop;
  }

  selectProfile(profile, clampFrame) {
    const module = this.quietInterop.module;
    const stack = module.stackSave()

    const cProfiles = allocateStringOnStack(module, JSON.stringify({ profile }));
    const cProfile = allocateStringOnStack(module, 'profile');

    const opt = this.quietInterop.quietEncoderProfileStr(cProfiles, cProfile);

    this.encoder = this.quietInterop.quietEncoderCreate(opt, this.audioContext.sampleRate);
    this.quietInterop.free(opt);

    this.frameLength = clampFrame 
      ? this.quietInterop.quietEncoderClampFrameLen(this.encoder, sampleBufferSize)
      : this.quietInterop.quietEncoderGetFrameLen(this.encoder);

    this.samples = createF32Array(sampleBufferSize, this.quietInterop);
    
    module.stackRestore(stack);
    return this;
  }

  async transmit(buf) {
    const module = this.quietInterop.module;
    resumeIfSuspended(this.audioContext);

    const payload = chunkBuffer(buf, this.frameLength);

    let t = this.audioContext.currentTime;
    for (const frame of payload) {
      const audioBuffer = this
        .audioContext
        .createBuffer(1, sampleBufferSize, this.audioContext.sampleRate);
      
      const frameOnStack = allocateArrayOnStack(module, new Uint8Array(frame));
      this.quietInterop.quietEncoderSend(this.encoder, frameOnStack, frame.byteLength);
      const written = this.quietInterop.quietEncoderEmit(this.encoder, this.samples.pointer, sampleBufferSize);

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

    return this;
  }

  destroy() {
    if (!this.destroyed) {
      this.quietInterop.free(this.samples.pointer);
      this.quietInterop.quietEncoderDestroy(this.encoder);
      this.destroyed = true;
    }
    return this;
  }
}
