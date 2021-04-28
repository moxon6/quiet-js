import Transmitter from './transmitter.js';
import createQuietInterop from './interop.js';

export default class Quiet {
  constructor(profiles, audioContext, module) {
    this.profiles = profiles;
    this.audioContext = audioContext;
    this.interop = createQuietInterop(module);
  }

  transmit({ payload, ...opts }) {
    const profile = this.profiles[opts.profile];
    new Transmitter(this.audioContext, this.interop)
      .selectProfile(profile, opts.clampFrame)
      .transmit(payload)
      .destroy();
  }
}
