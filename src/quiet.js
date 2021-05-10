import Transmitter from './transmitter.js';
import { encode } from './utils.js';
import importObject from './importObject.js';

export default class Quiet {
  constructor(audioContext, instance, workletPath, quietWasmPath) {
    this.audioContext = audioContext;
    this.instance = instance;
    this.workletPath = workletPath;
    this.quietWasmPath = quietWasmPath;

    this.quietWasmBinary = fetch(quietWasmPath);
    this.importObject = importObject;
  }

  async transmit({ payload, profile, clampFrame }) {
    (
      await new Transmitter(this.audioContext, this.instance)
        .selectProfile(profile, clampFrame)
        .transmit(encode(payload))
    )
      .destroy();
  }

  async receive() {
    await window.receive.apply(this);
  }
}
