import Transmitter from './transmitter.js';
import { encode } from './utils.js';
import importObject from './importObject.js';

const getUserAudio = async () => navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
  },
});

export default class Quiet {
  constructor(audioContext, instance, profile, workletPath, quietWasmPath) {
    this.audioContext = audioContext;
    this.instance = instance;
    this.workletPath = workletPath;
    this.quietWasmPath = quietWasmPath;

    this.quietWasmBinary = fetch(quietWasmPath);
    this.importObject = importObject;
    this.profile = profile;
  }

  async transmit({ payload, clampFrame }) {
    (
      await new Transmitter(this.audioContext, this.instance)
        .selectProfile(this.profile, clampFrame)
        .transmit(encode(payload))
    )
      .destroy();
  }

  async receive(onReceive) {
    const quietWasmResponse = await this.quietWasmBinary;
    const bytes = await quietWasmResponse.arrayBuffer();

    await this.audioContext.audioWorklet.addModule(this.workletPath);
    const quietProcessorNode = new AudioWorkletNode(this.audioContext, 'quiet-processor-node', {
      processorOptions: {
        bytes,
        profile: this.profile,
        sampleRate: this.audioContext.sampleRate,

      },
    });

    this.audioStream = await getUserAudio();
    const audioInput = this.audioContext.createMediaStreamSource(this.audioStream);
    audioInput
      .connect(quietProcessorNode);
    quietProcessorNode.port.onmessage = (e) => onReceive(e.data);
  }
}
