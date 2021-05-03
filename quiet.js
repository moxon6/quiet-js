import Transmitter from './transmitter.js';
import { encode } from './utils.js';

export default class Quiet {
  constructor(audioContext, instance) {
    this.audioContext = audioContext;
    this.instance = instance;
  }

  async transmit({ payload, profile, clampFrame }) {
    (
      await new Transmitter(this.audioContext, this.instance)
        .selectProfile(profile, clampFrame)
        .transmit(encode(payload))
    )
      .destroy();
  }
}
