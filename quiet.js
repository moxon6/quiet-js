import Transmitter from './transmitter.js';
import { encode } from './utils';

export default class Quiet {
  constructor(audioContext, module) {
    this.audioContext = audioContext;
    this.module = module;
  }

  async transmit({ payload, profile, clampFrame }) {
    (
      await new Transmitter(this.audioContext, this.module)
        .selectProfile(profile, clampFrame)
        .transmit(encode(payload))
    )
      .destroy();
  }
}
