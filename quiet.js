import Transmitter from './transmitter.js';
import createQuietInterop from './interop.js';

export default class Quiet {
  constructor(audioContext, module) {
    this.audioContext = audioContext;
    this.interop = createQuietInterop(module);
  }

  transmit({ payload, profile, clampFrame }) {
    new Transmitter(this.audioContext, this.interop)
      .selectProfile(profile, clampFrame)
      .transmit(payload)
      .destroy();
  }
}
