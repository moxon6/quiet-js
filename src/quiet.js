import Transmitter from './transmitter.js';
import { encodeForTransmit, resumeIfSuspended } from './utils.js';
import importObject from './importObject.js';

const getUserAudio = () => navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
  },
});

export default class Quiet {
  constructor(audioContext, profile) {
    this.audioContext = audioContext;
    this.profile = profile;
  }

  async init() {
    this.quietWasmBytes = await fetch(new URL('../quiet.wasm', import.meta.url))
      .then((res) => res.arrayBuffer());

    this.instance = (await WebAssembly.instantiate(this.quietWasmBytes, importObject)).instance;

    if (typeof window !== 'undefined') {
      const { audioWorklet } = this.audioContext;
      await audioWorklet.addModule(new URL('./quiet.worklet.js', import.meta.url));

      this.quietProcessorNode = new AudioWorkletNode(this.audioContext, 'quiet-receiver-worklet', {
        processorOptions: {
          quietWasmBytes: this.quietWasmBytes,
          profile: this.profile,
          sampleRate: this.audioContext.sampleRate,
        },
      });
    }

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
    resumeIfSuspended(this.audioContext);
  }
}
