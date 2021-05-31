import Quiet from '@moxon6/quiet-js/node.js';
import quietProfiles from '@moxon6/quiet-js/profiles.js';

import Speaker from 'speaker';

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

  await quiet.transmit({
    profile: quietProfiles.audible,
    clampFrame: false,
    payload: 'This is an example \n',
  });

  process.exit();
}

main();
