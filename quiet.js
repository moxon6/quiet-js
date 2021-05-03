import Transmitter from './transmitter.js';

export default class Quiet {
  constructor(audioContext, module) {
    this.audioContext = audioContext;
    this.module = module;
  }

  async transmit({ payload, profile, clampFrame }) {
    (
      await new Transmitter(this.audioContext, this.module)
        .selectProfile(profile, clampFrame)
        .transmit(payload)
    )
      .destroy();
  }
}
