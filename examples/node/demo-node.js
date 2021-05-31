import Quiet, { quietProfiles } from '@moxon6/quiet-js';
import Speaker from 'speaker';
import '@moxon6/quiet-js/dist/node-polyfill.js';

async function configureQuiet() {
  const audioContext = new AudioContext();
  audioContext.outStream = new Speaker({
    channels: audioContext.format.numberOfChannels,
    bitDepth: audioContext.format.bitDepth,
    sampleRate: audioContext.sampleRate,
  });

  return new Quiet(
    audioContext,
    quietProfiles.audible,
  ).init();
}

async function main() {
  const quiet = await configureQuiet();

  setTimeout(() => {
    quiet.transmit({
      profile: quietProfiles.audible,
      clampFrame: false,
      payload: 'This is an example \n',
    });
  }, 2000);
}

main();
