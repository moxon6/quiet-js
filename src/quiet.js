import Transmitter from './transmitter.js';
import { encodeForTransmit, resumeIfSuspended } from './utils.js';
import importObject from './importObject.js';

const getUserAudio = async () => navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
  },
});

export default class Quiet {
  constructor(audioContext, quietWasmBytes, profile, workletPath) {
    this.audioContext = audioContext;
    this.quietWasmBytes = quietWasmBytes;
    this.profile = profile;
    this.workletPath = workletPath;
  }

  async init() {
    this.instance = (await WebAssembly.instantiate(this.quietWasmBytes, importObject)).instance;

    await this.audioContext.audioWorklet.addModule(this.workletPath);
    this.quietProcessorNode = new AudioWorkletNode(this.audioContext, 'quiet-processor-node', {
      processorOptions: {
        quietWasmBytes: this.quietWasmBytes,
        profile: this.profile,
        sampleRate: this.audioContext.sampleRate,
      },
    });

    return this;
  }

  async transmit({ payload, clampFrame }) {
    (
      await new Transmitter(this.audioContext, this.instance)
        .selectProfile(this.profile, clampFrame)
        .transmit(encodeForTransmit(payload))
    )
      .destroy();
  }

  async receive(onReceive) {
    this.audioStream = await getUserAudio();
    const audioInput = this.audioContext.createMediaStreamSource(this.audioStream);
    audioInput
      .connect(this.quietProcessorNode)
      .port
      .onmessage = (e) => onReceive(e.data);
    resumeIfSuspended(this.audioContext)
  }
}
